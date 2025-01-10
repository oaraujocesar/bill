import { faker } from '@faker-js/faker/.'
import { FamilyMember } from './family-member.entity'

describe('Family Member entity', () => {
	it('should create a family member', () => {
		const input = {
			id: faker.number.int(),
			familyId: faker.number.int(),
			userId: faker.string.ulid(),
			isOwner: faker.datatype.boolean(),
			createdAt: faker.date.anytime(),
		}

		const familyMember = FamilyMember.create(input)

		expect(familyMember).toEqual(expect.objectContaining(input))
	})

	it('should generate serial and timestamps', () => {
		const input = {
			userId: faker.string.uuid(),
			isOwner: faker.datatype.boolean(),
			familyId: faker.number.int(),
		}

		const familyMember = FamilyMember.create(input)

		expect(familyMember).toEqual(
			expect.objectContaining({
				...input,
				createdAt: expect.any(Date),
			}),
		)
	})
})
