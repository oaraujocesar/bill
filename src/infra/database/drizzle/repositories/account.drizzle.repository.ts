import { UUID } from 'node:crypto'
import { Inject, Injectable, InternalServerErrorException, Logger } from '@nestjs/common'
import { and, eq, isNull, sql } from 'drizzle-orm'
import { NodePgDatabase } from 'drizzle-orm/node-postgres'
import { Account } from 'src/application/entities/account.entity'
import { AccountRepository } from 'src/application/repositories/account.repository'
import { ULID } from 'ulidx'
import { DRIZZLE } from '../drizzle.module'
import { AccountMapper } from '../mapper/account-mapper'
import * as schema from '../schema'
import { accounts } from '../schema'

@Injectable()
export class AccountDrizzleRepository implements AccountRepository {
	private readonly logger = new Logger(AccountDrizzleRepository.name)

	constructor(@Inject(DRIZZLE) private readonly database: NodePgDatabase<typeof schema>) {}

	async listAllByUserId(userId: UUID): Promise<Account[]> {
		try {
			const result = await this.database.query.accounts.findMany({
				where: and(eq(accounts.userId, userId), isNull(accounts.deletedAt)),
			})

			return result.map(AccountMapper.toDomain)
		} catch (error) {
			this.logger.error(error)
			throw new InternalServerErrorException()
		}
	}

	async findBySerial(serial: string): Promise<Account | null> {
		try {
			const result = await this.database.query.accounts.findFirst({
				where: eq(accounts.serial, serial),
			})

			return result ? AccountMapper.toDomain(result) : null
		} catch (error) {
			this.logger.error(error)
			throw new InternalServerErrorException()
		}
	}

	async deleteAccount(serial: ULID): Promise<void> {
		try {
			// @ts-expect-error - For some reason the types are not working properly
			await this.database.update(accounts).set({ deletedAt: sql`NOW()` }).where(eq(accounts.serial, serial))
		} catch (error) {
			this.logger.error(error)
			throw new InternalServerErrorException()
		}
	}

	async saveAccount(account: Account): Promise<Account> {
		const drizzleAccount = AccountMapper.toDrizzle(account)

		try {
			const [savedAccount] = await this.database.insert(accounts).values(drizzleAccount).returning().execute()

			return AccountMapper.toDomain(savedAccount)
		} catch (error) {
			this.logger.error(error)
			throw new InternalServerErrorException()
		}
	}
}
