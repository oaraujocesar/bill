import { Inject, Injectable, InternalServerErrorException, Logger } from '@nestjs/common'
import { NodePgDatabase } from 'drizzle-orm/node-postgres'
import { ULID } from 'ulidx'
import { DRIZZLE } from '../drizzle.module'
import * as schema from '../schema'
import { eq } from 'drizzle-orm'
import { FamilyMemberRepository } from 'src/application/repositories/family-member.repository'
import { FamilyMember } from 'src/application/entities/family-member.entity'
import familyMembers from '../schema/family-member.schema'
import { FamilyMemberMapper } from '../mapper/family-member-mapper'

@Injectable()
export class FamilyMemberDrizzleRepository implements FamilyMemberRepository {
  private readonly logger = new Logger(FamilyMemberDrizzleRepository.name)

  constructor(@Inject(DRIZZLE) private readonly database: NodePgDatabase<typeof schema>) { }

  async delete(serial: ULID): Promise<void> {
    try {
      // @ts-expect-error - For some reason the types are not working properly
      await this.database.update(familyMembers).set({ deletedAt: sql`NOW()` }).where(eq(familyMembers.serial, serial)).execute()
    } catch (error) {
      this.logger.error(error)
      throw new InternalServerErrorException()
    }
  }

  async save(familyMember: FamilyMember): Promise<FamilyMember> {
    const drizzleFamilyMember = FamilyMemberMapper.toDrizzle(familyMember)

    try {
      const [savedFamilyMember] = await this.database.insert(familyMembers).values(drizzleFamilyMember).returning().execute()

      return FamilyMemberMapper.toDomain(savedFamilyMember)
    } catch (error) {
      this.logger.error(error)
      throw new InternalServerErrorException()
    }
  }

  async listByFamilyId(familyId: number): Promise<FamilyMember[]> {
    try {
      const result = await this.database.query.familyMembers.findMany({
        where: eq(familyMembers.familyId, familyId),
      })

      return result.map(FamilyMemberMapper.toDomain)
    } catch (error) {
      this.logger.error(error)
      throw new InternalServerErrorException()
    }
  }
}
