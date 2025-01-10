import { TestBed } from '@automock/jest'
import { faker } from '@faker-js/faker'
import { HttpStatus } from '@nestjs/common'
import { FAMILY_MEMBER_REPOSITORY } from 'src/shared/tokens';
import { CreateFamilyMemberUseCase } from './create'
import { CreateFamilyMemberDto } from 'src/infra/http/dtos/family-member/create-family.dto';
import { FamilyMemberRepository } from 'src/application/repositories/family-member.repository';
import { FamilyMember } from 'src/application/entities/family-member.entity';

jest.mock('@nestjs/common/services/logger.service')

describe('Create Family Member use case', () => {
	let useCase: CreateFamilyMemberUseCase
	let familyMemberRepository: jest.Mocked<FamilyMemberRepository>

	beforeEach(() => {
		const { unit, unitRef } = TestBed.create(CreateFamilyMemberUseCase).compile()

		useCase = unit
		familyMemberRepository = unitRef.get<FamilyMemberRepository>(FAMILY_MEMBER_REPOSITORY)
	})

	it('should create family member', async () => {
		const dto: CreateFamilyMemberDto = {
			familyId: faker.number.int(),
			userId: faker.string.uuid(),
		}

		familyMemberRepository.save.mockResolvedValue(
			FamilyMember.create(dto),
		)

		const { data, statusCode, message } = await useCase.execute(dto)

		expect(data).toBeInstanceOf(FamilyMember)
		expect(statusCode).toBe(HttpStatus.CREATED)
		expect(message).toBe('Family Member created successfully!')
	})
})
