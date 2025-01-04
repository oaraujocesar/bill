import { HttpStatus, Inject, Injectable, Logger } from '@nestjs/common'
import { } from 'src/application/entities/account'
import { Family } from 'src/application/entities/family.entity'
import { } from 'src/application/repositories/account.repository'
import { FamilyRepository } from 'src/application/repositories/family.repository'
import { FAMILY_REPOSITORY } from 'src/shared/tokens'
import { ResponseBody, buildResponse } from 'src/shared/utils/build-response'

type CreateFamilyRequest = {
	name: string
}

@Injectable()
export class CreateFamilyUseCase {
	private readonly logger = new Logger(CreateFamilyUseCase.name)

	constructor(@Inject(FAMILY_REPOSITORY) private readonly familyRepository: FamilyRepository) { }

	async execute({ name }: CreateFamilyRequest, userId: string): Promise<ResponseBody<Family>> {
		this.logger.debug('execution started')

		let family = Family.create({ name, userId })

		family = await this.familyRepository.save(family)

		family.id = undefined

		this.logger.debug(`family created ${JSON.stringify(family)}`)

		return buildResponse({
			data: family,
			statusCode: HttpStatus.CREATED,
			message: 'Family created successfully!',
		})
	}
}
