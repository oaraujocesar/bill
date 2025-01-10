import { Body, Controller, Logger, Post, Res } from '@nestjs/common'
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger'
import { Response } from 'express'
import { CreateCardUseCase } from 'src/application/use-cases/card/create.use-case'
import { CreateCardDoc } from '../decorators/doc/cards/create.doc'
import { User } from '../decorators/user.decorator'
import { CreateCardDto } from '../dtos/card/create.dto'
import { UserAuthenticated } from '../types/authenticated-request'

@Controller('cards')
@ApiTags('Cards')
@ApiBearerAuth()
export class CardsController {
	constructor(private readonly createCardUseCase: CreateCardUseCase) { }

	private readonly logger = new Logger(CardsController.name)

	@Post()
	@CreateCardDoc()
	async createCard(@User() user: UserAuthenticated, @Body() body: CreateCardDto, @Res() response: Response) {
		this.logger.debug('Create card controller executed')
		const { data, message, statusCode } = await this.createCardUseCase.execute({
			user,
			...body,
		})

		return response.status(statusCode).json({ data, message })
	}
}
