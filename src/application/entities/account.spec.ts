import { faker } from '@faker-js/faker/.'
import { isValid } from 'ulidx'
import { Account } from './account.entity'

describe('Account entity', () => {
	it('should create account', () => {
		const input = {
			id: faker.number.int(),
			serial: faker.string.uuid(),
			name: faker.person.firstName(),
			balance: faker.number.int(),
			userId: faker.string.uuid(),
		}

		const account = Account.create(input)

		expect(account).toEqual(expect.objectContaining(input))
	})

	it('should generate serial and timestamps', () => {
		const input = {
			name: faker.person.firstName(),
			balance: faker.number.int(),
			userId: faker.string.uuid(),
		}

		const account = Account.create(input)

		expect(account).toEqual(
			expect.objectContaining({
				...input,
				serial: expect.any(String),
				createdAt: expect.any(Date),
				updatedAt: expect.any(Date),
			}),
		)

		expect(isValid(account.serial)).toBe(true)
	})
})
