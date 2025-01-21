import { TestBed } from '@automock/jest'
import { faker } from '@faker-js/faker'
import { HttpStatus } from '@nestjs/common'
import { Family } from 'src/application/entities/family.entity'
import { FamilyRepository } from 'src/application/repositories/family.repository'
import { CreateFamilyDto } from 'src/infra/http/dtos/family/create-family.dto'
import { FAMILY_REPOSITORY } from 'src/shared/tokens'
import { CreateFamilyUseCase } from './create'

jest.mock('@nestjs/common/services/logger.service')

describe('Create Family use case', () => {
	let useCase: CreateFamilyUseCase
	let familyRepository: jest.Mocked<FamilyRepository>

	beforeEach(() => {
		const { unit, unitRef } = TestBed.create(CreateFamilyUseCase).compile()

		useCase = unit
		familyRepository = unitRef.get<FamilyRepository>(FAMILY_REPOSITORY)
	})

	it('should create family', async () => {
		const dto: CreateFamilyDto = {
			name: faker.company.name(),
		}

		const userId = faker.string.uuid()
		familyRepository.create.mockResolvedValue(
			Family.create({
				name: dto.name,
			}),
		)

		const { data, statusCode, message } = await useCase.execute(dto, userId)

		expect(data).toBeInstanceOf(Family)
		expect(statusCode).toBe(HttpStatus.CREATED)
		expect(message).toBe('Family created successfully!')
	})
})
