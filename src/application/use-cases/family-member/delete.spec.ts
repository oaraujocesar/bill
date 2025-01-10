import { TestBed } from '@automock/jest'
import { faker } from '@faker-js/faker'
import { HttpStatus } from '@nestjs/common'
import { FAMILY_MEMBER_REPOSITORY } from 'src/shared/tokens'
import { DeleteFamilyMemberUseCase } from './delete'
import { FamilyMemberRepository } from 'src/application/repositories/family-member.repository'
import { FamilyMember } from 'src/application/entities/family-member.entity'
import { CreateFamilyMemberDto } from 'src/infra/http/dtos/family-member/create-family.dto'

jest.mock('@nestjs/common/services/logger.service')

describe('Soft delete Family Member use case', () => {
	let useCase: DeleteFamilyMemberUseCase
	let familyMemberRepository: jest.Mocked<FamilyMemberRepository>

	beforeEach(() => {
		const { unit, unitRef } = TestBed.create(DeleteFamilyMemberUseCase).compile()

		useCase = unit
		familyMemberRepository = unitRef.get<FamilyMemberRepository>(FAMILY_MEMBER_REPOSITORY)
	})

	it('should delete family', async () => {
		const dto: CreateFamilyMemberDto = {
			familyId: faker.number.int(),
			userId: faker.string.uuid(),
		}
		const serial = faker.string.uuid()

		familyMemberRepository.save.mockResolvedValue(
			FamilyMember.create({
				...dto,
				serial
			}),
		)

		familyMemberRepository.findBySerial.mockResolvedValue(
			FamilyMember.create({
				...dto,
				serial
			}),
		)

		const { statusCode, message } = await useCase.execute(serial)

		expect(statusCode).toBe(HttpStatus.NO_CONTENT)
		expect(message).toBe('Family member deleted successfully!')
	})

	it('should throw an error if family member is not found when deleting', async () => {
		const serial = faker.string.ulid()

		const { message, statusCode, errors } = await useCase.execute(serial)

		expect(statusCode).toBe(HttpStatus.NOT_FOUND)
		expect(message).toBe('It was not possible to delete the family member!')
		expect(errors).toEqual([{ code: 'BILL-204' }])
	})
})
