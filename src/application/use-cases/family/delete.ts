import { HttpStatus, Inject, Injectable, Logger } from '@nestjs/common'
import { ULID } from 'ulidx'
import { FAMILY_REPOSITORY } from 'src/shared/tokens'
import { ResponseBody, buildResponse } from 'src/shared/utils/build-response'
import { FamilyRepository } from 'src/application/repositories/family.repository'

@Injectable()
export class DeleteFamilyUseCase {
	private readonly logger = new Logger(DeleteFamilyUseCase.name)

	constructor(@Inject(FAMILY_REPOSITORY) private readonly familyRepository: FamilyRepository) { }

	async execute(serial: ULID): Promise<ResponseBody<undefined>> {
		this.logger.debug('execution started')
		const family = await this.familyRepository.findBySerial(serial)

		if (!family) {
			this.logger.debug(`family with serial ${serial} not found`)

			return buildResponse({
				message: 'It was not possible to delete the family!',
				statusCode: HttpStatus.NOT_FOUND,
				errors: [{ code: 'BILL-204' }],
			})
		}

		await this.familyRepository.delete(serial)
		this.logger.debug('family deleted successfully')

		return buildResponse({
			statusCode: HttpStatus.NO_CONTENT,
			message: 'Family deleted successfully!',
		})
	}
}
