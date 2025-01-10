import { TestBed } from '@automock/jest'
import { faker } from '@faker-js/faker'
import { HttpStatus } from '@nestjs/common'
import { FAMILY_MEMBER_REPOSITORY } from 'src/shared/tokens'
import { ListFamilyMembersUseCase } from './list'
import { FamilyMemberRepository } from 'src/application/repositories/family-member.repository'
import { FamilyMember } from 'src/application/entities/family-member.entity'

jest.mock('@nestjs/common/services/logger.service')

describe('List all non deleted accounts use case', () => {
	let useCase: ListFamilyMembersUseCase
	let familyMemberRepository: jest.Mocked<FamilyMemberRepository>

	beforeEach(() => {
		const { unit, unitRef } = TestBed.create(ListFamilyMembersUseCase).compile()

		useCase = unit
		familyMemberRepository = unitRef.get<FamilyMemberRepository>(FAMILY_MEMBER_REPOSITORY)
	})

	it('should list all family members', async () => {
		const familyId = faker.number.int()
		const familyMembers: FamilyMember[] = [
			FamilyMember.create({
				familyId,
				serial: faker.string.ulid(),
				userId: faker.string.uuid(),
			}),
			FamilyMember.create({
				familyId,
				serial: faker.string.ulid(),
				userId: faker.string.uuid(),
			}),
		]

		familyMemberRepository.listByFamilyId.mockResolvedValue(familyMembers)

		const { statusCode, message, data } = await useCase.execute(familyId)

		expect(statusCode).toBe(HttpStatus.OK)
		expect(message).toBe('Family Members found.')
		expect(data).toEqual(familyMembers)
		expect(familyMemberRepository.listByFamilyId).toHaveBeenCalledTimes(1)
		expect(familyMemberRepository.listByFamilyId).toHaveBeenCalledWith(familyId)
	})

	it('should show an empty array', async () => {
		const familyId = faker.number.int()

		familyMemberRepository.listByFamilyId.mockResolvedValue([])

		const { statusCode, message, data } = await useCase.execute(familyId)

		expect(statusCode).toBe(HttpStatus.NO_CONTENT)
		expect(message).toBe('No Family Members found.')
		expect(data).toBeUndefined()
		expect(familyMemberRepository.listByFamilyId).toHaveBeenCalledTimes(1)
		expect(familyMemberRepository.listByFamilyId).toHaveBeenCalledWith(familyId)
	})
})
