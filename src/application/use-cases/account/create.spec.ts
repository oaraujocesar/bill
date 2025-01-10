import { TestBed } from '@automock/jest'
import { faker } from '@faker-js/faker'
import { HttpStatus } from '@nestjs/common'
import { Account } from 'src/application/entities/account.entity'
import { AccountRepository } from 'src/application/repositories/account.repository'
import { CreateAccountDto } from 'src/infra/http/dtos/account/create-account.dto'
import { ACCOUNT_REPOSITORY } from 'src/shared/tokens'
import { CreateAccountUseCase } from './create'

jest.mock('@nestjs/common/services/logger.service')

describe('Create Account use case', () => {
	let useCase: CreateAccountUseCase
	let accountRepository: jest.Mocked<AccountRepository>

	beforeEach(() => {
		const { unit, unitRef } = TestBed.create(CreateAccountUseCase).compile()

		useCase = unit
		accountRepository = unitRef.get<AccountRepository>(ACCOUNT_REPOSITORY)
	})

	it('should create account', async () => {
		const dto: CreateAccountDto = {
			name: faker.company.name(),
		}

		const userId = faker.string.uuid()
		accountRepository.saveAccount.mockResolvedValue(
			Account.create({
				name: dto.name,
				userId,
				balance: 0,
			}),
		)

		const { data, statusCode, message } = await useCase.execute(dto, userId)

		expect(data).toBeInstanceOf(Account)
		expect(statusCode).toBe(HttpStatus.CREATED)
		expect(message).toBe('Account created successfully!')
	})
})
