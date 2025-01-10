import { FamilyMember } from 'src/application/entities/family-member.entity'

export type DrizzleResultType = {
	id: number
	familyId: number
	userId: string
	isOwner: boolean
	createdAt: Date
}

export class FamilyMemberMapper {
	static toDrizzle(familyMember: FamilyMember) {
		return {
			id: familyMember.id,
			familyId: familyMember.familyId,
			userId: familyMember.userId,
			isOwner: familyMember.isOwner,
			createdAt: familyMember.createdAt,
		}
	}

	static toDomain(family: DrizzleResultType) {
		return FamilyMember.create({
			id: family.id,
			familyId: family.familyId,
			userId: family.userId,
			createdAt: family.createdAt,
			isOwner: family.isOwner,
		})
	}
}
