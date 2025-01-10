import { HttpStatus, Inject, Injectable } from '@nestjs/common'
import { Family } from 'src/application/entities/family.entity'
import { FamilyRepository } from 'src/application/repositories/family.repository'
import { FAMILY_REPOSITORY } from 'src/shared/tokens'
import { ResponseBody, buildResponse } from 'src/shared/utils/build-response'
import { ULID } from 'ulidx'

@Injectable()
export class ShowFamilyUseCase {
	constructor(@Inject(FAMILY_REPOSITORY) private readonly familyRepository: FamilyRepository) {}

	async execute(serial: ULID): Promise<ResponseBody<Family>> {
		const family = await this.familyRepository.findBySerial(serial)

		if (!family) {
			return buildResponse({
				statusCode: HttpStatus.NO_CONTENT,
				message: 'Family not found.',
				errors: [{ code: 'BILL-204' }],
			})
		}

		return buildResponse({
			data: family,
			statusCode: HttpStatus.OK,
			message: 'Family found.',
		})
	}
}
