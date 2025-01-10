import { HttpStatus, Inject, Injectable, Logger } from '@nestjs/common'
import { ULID } from 'ulidx'
import { FAMILY_MEMBER_REPOSITORY } from 'src/shared/tokens'
import { ResponseBody, buildResponse } from 'src/shared/utils/build-response'
import { FamilyMemberRepository } from 'src/application/repositories/family-member.repository'

@Injectable()
export class DeleteFamilyMemberUseCase {
	private readonly logger = new Logger(DeleteFamilyMemberUseCase.name)

	constructor(@Inject(FAMILY_MEMBER_REPOSITORY) private readonly familyMemberRepository: FamilyMemberRepository) { }

	async execute(serial: ULID): Promise<ResponseBody<undefined>> {
		this.logger.debug('[Delete Family Member]: execution started.')
		const familyMember = await this.familyMemberRepository.findBySerial(serial)

		if (!familyMember) {
			this.logger.debug(`family member with serial ${serial} not found`)

			return buildResponse({
				message: 'It was not possible to delete the family member!',
				statusCode: HttpStatus.NOT_FOUND,
				errors: [{ code: 'BILL-204' }],
			})
		}

		await this.familyMemberRepository.delete(serial)
		this.logger.debug('family member deleted successfully')

		return buildResponse({
			statusCode: HttpStatus.NO_CONTENT,
			message: 'Family member deleted successfully!',
		})
	}
}
