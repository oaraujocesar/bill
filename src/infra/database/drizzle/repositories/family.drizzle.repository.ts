import { Inject, Injectable, InternalServerErrorException, Logger } from '@nestjs/common'
import { eq, sql } from 'drizzle-orm'
import { NodePgDatabase } from 'drizzle-orm/node-postgres'
import { Family } from 'src/application/entities/family.entity'
import { FamilyRepository } from 'src/application/repositories/family.repository'
import { ULID } from 'ulidx'
import { DRIZZLE } from '../drizzle.module'
import { FamilyMapper } from '../mapper/family-mapper'
import * as schema from '../schema'
import { familyMembers } from '../schema'
import families from '../schema/family.schema'

@Injectable()
export class FamilyDrizzleRepository implements FamilyRepository {
	private readonly logger = new Logger(FamilyDrizzleRepository.name)

	constructor(@Inject(DRIZZLE) private readonly database: NodePgDatabase<typeof schema>) {}
	async create(userId: string, family: Family): Promise<Family> {
		try {
			return await this.database.transaction(async (trx) => {
				const [savedFamily] = await trx.insert(families).values(FamilyMapper.toDrizzle(family)).returning().execute()

				//@ts-expect-error - For some reason the types are not working properly
				await trx.insert(familyMembers).values({ familyId: savedFamily.id, userId, isOwner: true }).execute()

				return FamilyMapper.toDomain(savedFamily)
			})
		} catch (error) {
			this.logger.error(error)
			throw new InternalServerErrorException()
		}
	}

	async findBySerial(serial: string): Promise<Family | null> {
		try {
			const result = await this.database.query.families.findFirst({
				where: eq(families.serial, serial),
			})

			return result ? FamilyMapper.toDomain(result) : null
		} catch (error) {
			this.logger.error(error)
			throw new InternalServerErrorException()
		}
	}

	async delete(serial: ULID): Promise<void> {
		try {
			// @ts-expect-error - For some reason the types are not working properly
			await this.database.update(families).set({ deletedAt: sql`NOW()` }).where(eq(families.serial, serial)).execute()
		} catch (error) {
			this.logger.error(error)
			throw new InternalServerErrorException()
		}
	}

	async save(family: Family): Promise<Family> {
		const drizzleFamily = FamilyMapper.toDrizzle(family)

		try {
			const [savedFamily] = await this.database.insert(families).values(drizzleFamily).returning().execute()

			return FamilyMapper.toDomain(savedFamily)
		} catch (error) {
			this.logger.error(error)
			throw new InternalServerErrorException()
		}
	}
}
