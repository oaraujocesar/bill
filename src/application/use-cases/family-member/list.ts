import { HttpStatus, Inject, Injectable } from '@nestjs/common'
import { FamilyMember } from 'src/application/entities/family-member.entity'
import { } from 'src/application/repositories/account.repository'
import { FamilyMemberRepository } from 'src/application/repositories/family-member.repository'
import { } from 'src/infra/http/types/authenticated-request'
import { FAMILY_MEMBER_REPOSITORY } from 'src/shared/tokens'
import { ResponseBody, buildResponse } from 'src/shared/utils/build-response'

@Injectable()
export class ListFamilyMembersUseCase {
	constructor(@Inject(FAMILY_MEMBER_REPOSITORY) private readonly familyMemberRepository: FamilyMemberRepository) { }

	async execute(familyId: number): Promise<ResponseBody<FamilyMember[]>> {
		const familyMembers = await this.familyMemberRepository.listByFamilyId(familyId)

		if (!familyMembers.length) {
			return buildResponse({
				statusCode: HttpStatus.NO_CONTENT,
				message: 'No Family Members found.',
			})
		}

		return buildResponse({
			data: familyMembers,
			statusCode: HttpStatus.OK,
			message: 'Family Members found.',
		})
	}
}
