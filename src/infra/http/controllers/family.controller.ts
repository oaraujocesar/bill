import { Body, Controller, Delete, Get, Logger, Param, Post, Req, Res } from '@nestjs/common'
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger'
import { Response } from 'express'
import { CreateFamilyUseCase } from 'src/application/use-cases/family/create'
import { DeleteFamilyUseCase } from 'src/application/use-cases/family/delete'
import { ShowFamilyUseCase } from 'src/application/use-cases/family/show'
import { ULID } from 'ulidx'
import { CreateFamilyDoc } from '../decorators/doc/family/create-family-headers.doc'
import { DeleteFamilyDoc } from '../decorators/doc/family/delete-family-headers.doc'
import { ShowFamilyDoc } from '../decorators/doc/family/show-family-headers.doc'
import { CreateFamilyDto } from '../dtos/family/create-family.dto'
import { RequestWithUser } from '../types/authenticated-request'

@ApiTags('Family')
@ApiBearerAuth()
@Controller('families')
export class FamilyController {
	private readonly logger = new Logger(FamilyController.name)

	constructor(
		private readonly createFamilyUseCase: CreateFamilyUseCase,
		private readonly deleteFamilyUseCase: DeleteFamilyUseCase,
		private readonly showFamilyUseCase: ShowFamilyUseCase,
	) {}

	@Get(':serial')
	@ShowFamilyDoc()
	async showFamily(@Param('serial') serial: ULID, @Res() response: Response) {
		this.logger.debug('[Show Family]: called')

		const { data, statusCode, message } = await this.showFamilyUseCase.execute(serial)

		return response.status(statusCode).json({ data, message })
	}

	@Post()
	@CreateFamilyDoc()
	@ApiOperation({ summary: 'Creates a family' })
	async createFamily(@Body() body: CreateFamilyDto, @Res() response: Response, @Req() request: RequestWithUser) {
		this.logger.debug(`[Create Family]: called with body ${JSON.stringify(body)}`)

		const { data, statusCode, message } = await this.createFamilyUseCase.execute(body, request.user.id)

		return response.status(statusCode).json({ data, message })
	}

	@Delete(':serial')
	@DeleteFamilyDoc()
	async deleteFamily(@Param('serial') serial: string, @Res() response: Response) {
		this.logger.debug(`[Delete Family]: called for serial: ${serial}`)

		const { data, statusCode, message } = await this.deleteFamilyUseCase.execute(serial)

		return response.status(statusCode).json({ data, message })
	}
}
