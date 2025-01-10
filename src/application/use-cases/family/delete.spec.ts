import { TestBed } from '@automock/jest'
import { faker } from '@faker-js/faker'
import { HttpStatus } from '@nestjs/common'
import { FAMILY_REPOSITORY } from 'src/shared/tokens'
import { DeleteFamilyUseCase } from './delete'
import { FamilyRepository } from 'src/application/repositories/family.repository'
import { Family } from 'src/application/entities/family.entity'
import { CreateFamilyDto } from 'src/infra/http/dtos/family/create-family.dto'

jest.mock('@nestjs/common/services/logger.service')

describe('Soft delete Family use case', () => {
	let useCase: DeleteFamilyUseCase
	let familyRepository: jest.Mocked<FamilyRepository>

	beforeEach(() => {
		const { unit, unitRef } = TestBed.create(DeleteFamilyUseCase).compile()

		useCase = unit
		familyRepository = unitRef.get<FamilyRepository>(FAMILY_REPOSITORY)
	})

	it('should delete family', async () => {
		const dto: CreateFamilyDto = {
			name: faker.company.name(),
		}
		const userId = faker.string.uuid()
		const serial = faker.string.ulid()

		familyRepository.save.mockResolvedValue(
			Family.create({
				name: dto.name,
				userId,
				serial,
			}),
		)

		familyRepository.findBySerial.mockResolvedValue(
			Family.create({
				name: dto.name,
				userId,
				serial,
			}),
		)

		const { statusCode, message } = await useCase.execute(serial)

		expect(statusCode).toBe(HttpStatus.NO_CONTENT)
		expect(message).toBe('Family deleted successfully!')
	})

	it('should throw an error if family is not found when deleting', async () => {
		const serial = faker.string.ulid()

		const { message, statusCode, errors } = await useCase.execute(serial)

		expect(statusCode).toBe(HttpStatus.NOT_FOUND)
		expect(message).toBe('It was not possible to delete the family!')
		expect(errors).toEqual([{ code: 'BILL-204' }])
	})
})
