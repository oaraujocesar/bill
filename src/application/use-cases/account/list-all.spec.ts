import { TestBed } from '@automock/jest'
import { faker } from '@faker-js/faker'
import { HttpStatus } from '@nestjs/common'
import { Account } from 'src/application/entities/account.entity'
import { AccountRepository } from 'src/application/repositories/account.repository'
import { UserAuthenticated } from 'src/infra/http/types/authenticated-request'
import { ACCOUNT_REPOSITORY } from 'src/shared/tokens'
import { ListAccountsUseCase } from './list-all'

jest.mock('@nestjs/common/services/logger.service')

describe('List all non deleted accounts use case', () => {
	let useCase: ListAccountsUseCase
	let accountRepository: jest.Mocked<AccountRepository>

	beforeEach(() => {
		const { unit, unitRef } = TestBed.create(ListAccountsUseCase).compile()

		useCase = unit
		accountRepository = unitRef.get<AccountRepository>(ACCOUNT_REPOSITORY)
	})

	it('should list all accounts', async () => {
		const userId = faker.string.uuid()
		const user: UserAuthenticated = {
			id: userId,
		}

		const accounts: Account[] = [
			Account.create({
				name: faker.company.name(),
				userId,
				balance: 0,
				serial: faker.string.ulid(),
			}),
			Account.create({
				name: faker.company.name(),
				userId,
				balance: 0,
				serial: faker.string.ulid(),
			}),
		]

		accountRepository.listAllByUserId.mockResolvedValue(accounts)

		const { statusCode, message, data } = await useCase.execute(user)

		expect(statusCode).toBe(HttpStatus.OK)
		expect(message).toBe('User accounts!')
		expect(data).toEqual(accounts)
		expect(accountRepository.listAllByUserId).toHaveBeenCalledTimes(1)
		expect(accountRepository.listAllByUserId).toHaveBeenCalledWith(user.id)
	})

	it('should show an empty array', async () => {
		const userId = faker.string.uuid()
		const user: UserAuthenticated = {
			id: userId,
		}

		accountRepository.listAllByUserId.mockResolvedValue([])

		const { statusCode, message, data } = await useCase.execute(user)

		expect(statusCode).toBe(HttpStatus.NO_CONTENT)
		expect(message).toBe('No accounts found!')
		expect(data).toBeUndefined()
		expect(accountRepository.listAllByUserId).toHaveBeenCalledTimes(1)
		expect(accountRepository.listAllByUserId).toHaveBeenCalledWith(user.id)
	})
})
