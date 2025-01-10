import { faker } from '@faker-js/faker/.'
import { isValid } from 'ulidx'
import { Family } from './family.entity'

describe('Family entity', () => {
	it('should create a family', () => {
		const input = {
			id: faker.number.int(),
			serial: faker.string.ulid(),
			name: faker.string.alpha({ length: 10 }),
			createdAt: faker.date.anytime(),
			updatedAt: faker.date.anytime(),
			deletedAt: null,
		}

		const family = Family.create(input)

		expect(family).toEqual(
			expect.objectContaining({
				...input,
				user: undefined,
			}),
		)
	})

	it('should generate serial and timestamps', () => {
		const input = {
			name: faker.person.firstName(),
		}

		const family = Family.create(input)

		expect(family).toEqual(
			expect.objectContaining({
				...input,
				serial: expect.any(String),
				createdAt: expect.any(Date),
				updatedAt: expect.any(Date),
			}),
		)

		expect(isValid(family.serial)).toBe(true)
	})
})
