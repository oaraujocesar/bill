import { TestBed } from '@automock/jest'
import { faker } from '@faker-js/faker'
import { HttpStatus } from '@nestjs/common'
import { Account } from 'src/application/entities/account.entity'
import { AccountRepository } from 'src/application/repositories/account.repository'
import { CreateAccountDto } from 'src/infra/http/dtos/account/create-account.dto'
import { ACCOUNT_REPOSITORY } from 'src/shared/tokens'
import { DeleteAccountUseCase } from './delete'

jest.mock('@nestjs/common/services/logger.service')

describe('Soft delete Account use case', () => {
	let useCase: DeleteAccountUseCase
	let accountRepository: jest.Mocked<AccountRepository>

	beforeEach(() => {
		const { unit, unitRef } = TestBed.create(DeleteAccountUseCase).compile()

		useCase = unit
		accountRepository = unitRef.get<AccountRepository>(ACCOUNT_REPOSITORY)
	})

	it('should delete account', async () => {
		const dto: CreateAccountDto = {
			name: faker.company.name(),
		}
		const userId = faker.string.uuid()
		const serial = faker.string.ulid()

		accountRepository.saveAccount.mockResolvedValue(
			Account.create({
				name: dto.name,
				userId,
				balance: 0,
				serial,
			}),
		)

		accountRepository.findBySerial.mockResolvedValue(
			Account.create({
				name: dto.name,
				userId,
				balance: 0,
				serial,
			}),
		)

		const { statusCode, message } = await useCase.execute(serial)

		expect(statusCode).toBe(HttpStatus.NO_CONTENT)
		expect(message).toBe('Account deleted successfully!')
	})

	it('should throw an error if account is not found when deleting', async () => {
		const serial = faker.string.ulid()

		const { message, statusCode, errors } = await useCase.execute(serial)

		expect(statusCode).toBe(HttpStatus.NOT_FOUND)
		expect(message).toBe('It was not possible to delete the account!')
		expect(errors).toEqual([{ code: 'BILL-204' }])
	})
})
