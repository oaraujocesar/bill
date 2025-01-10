import { Family } from 'src/application/entities/family.entity'

export type DrizzleResultType = {
	id: number
	name: string
	serial: string
	createdAt: Date
	updatedAt: Date
	deletedAt: Date
}

export class FamilyMapper {
	static toDrizzle(family: Family) {
		return {
			id: family.id,
			name: family.name,
			serial: family.serial,
			createdAt: family.createdAt,
			updatedAt: family.updatedAt,
			deletedAt: family.deletedAt,
		}
	}

	static toDomain(family: DrizzleResultType) {
		return Family.create({
			name: family.name,
			id: family.id,
			serial: family.serial,
			createdAt: family.createdAt,
			updatedAt: family.updatedAt,
			deletedAt: family.deletedAt,
		})
	}
}
