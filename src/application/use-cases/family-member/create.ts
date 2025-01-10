import { HttpStatus, Inject, Injectable, Logger } from '@nestjs/common'
import { FamilyMember } from 'src/application/entities/family-member.entity'
import { FamilyMemberRepository } from 'src/application/repositories/family-member.repository'
import { FAMILY_MEMBER_REPOSITORY } from 'src/shared/tokens'
import { ResponseBody, buildResponse } from 'src/shared/utils/build-response'

type CreateFamilyMemberRequest = {
	familyId: number
	userId: string
}

@Injectable()
export class CreateFamilyMemberUseCase {
	private readonly logger = new Logger(CreateFamilyMemberUseCase.name)

	constructor(@Inject(FAMILY_MEMBER_REPOSITORY) private readonly familyMemberRepository: FamilyMemberRepository) { }

	async execute({ familyId, userId }: CreateFamilyMemberRequest): Promise<ResponseBody<FamilyMember>> {
		this.logger.debug('[Create Family Member]: execution started')

		let familyMember = FamilyMember.create({ familyId, userId })

		familyMember = await this.familyMemberRepository.save(familyMember)
		familyMember.id = undefined

		this.logger.debug(`family member created ${JSON.stringify(familyMember)}`)

		return buildResponse({
			data: familyMember,
			statusCode: HttpStatus.CREATED,
			message: 'Family Member created successfully!',
		})
	}
}
