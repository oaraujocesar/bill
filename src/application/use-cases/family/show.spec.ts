import { TestBed } from '@automock/jest'
import { faker } from '@faker-js/faker'
import { HttpStatus } from '@nestjs/common'
import { UserAuthenticated } from 'src/infra/http/types/authenticated-request'
import { FAMILY_REPOSITORY } from 'src/shared/tokens'
import { ShowFamilyUseCase } from './show'
import { FamilyRepository } from 'src/application/repositories/family.repository'
import { Family } from 'src/application/entities/family.entity'

jest.mock('@nestjs/common/services/logger.service')

describe('show non deleted family use case', () => {
	let useCase: ShowFamilyUseCase
	let familyRepository: jest.Mocked<FamilyRepository>

	beforeEach(() => {
		const { unit, unitRef } = TestBed.create(ShowFamilyUseCase).compile()

		useCase = unit
		familyRepository = unitRef.get<FamilyRepository>(FAMILY_REPOSITORY)
	})

	it('should show family', async () => {
		const userId = faker.string.uuid()
		const user: UserAuthenticated = {
			id: userId,
		}

		const family: Family = Family.create({
			name: faker.company.name(),
			userId,
			serial: faker.string.ulid(),
		});


		familyRepository.findBySerial.mockResolvedValue(family)

		const { statusCode, message, data } = await useCase.execute(family.serial)

		expect(statusCode).toBe(HttpStatus.OK)
		expect(message).toBe('Family found.')
		expect(data).toEqual(family)
		expect(familyRepository.findBySerial).toHaveBeenCalledTimes(1)
		expect(familyRepository.findBySerial).toHaveBeenCalledWith(family.serial)
	})

	it('should return error if family is not found', async () => {
		const familySerial = faker.string.ulid()

		familyRepository.findBySerial.mockResolvedValue(null)

		const { statusCode, message, data } = await useCase.execute(familySerial)

		expect(statusCode).toBe(HttpStatus.NO_CONTENT)
		expect(message).toBe('Family not found.')
		expect(data).toBeUndefined()
		expect(familyRepository.findBySerial).toHaveBeenCalledTimes(1)
		expect(familyRepository.findBySerial).toHaveBeenCalledWith(familySerial)
	})
})
