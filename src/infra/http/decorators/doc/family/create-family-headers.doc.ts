import { applyDecorators } from '@nestjs/common'
import { ApiOkResponse, ApiOperation, ApiProperty } from '@nestjs/swagger'
import { Family } from 'src/application/entities/family.entity'
import { BadRequestResponse } from '../shared/bad-request-response.decorator'

class OkResponse {
	@ApiProperty({ type: Family })
	data: Family

	@ApiProperty()
	statusCode: number

	@ApiProperty()
	message: string
}

export function CreateFamilyDoc() {
	return applyDecorators(
		ApiOperation({
			summary: 'creates a family',
		}),
		ApiOkResponse({
			description: 'Family created successfully!',
			type: OkResponse,
		}),
		BadRequestResponse({ errorMessage: 'Bad request.' }),
	)
}
