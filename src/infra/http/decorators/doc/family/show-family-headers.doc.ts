import { applyDecorators } from '@nestjs/common'
import { ApiOkResponse, ApiOperation, ApiParam, ApiProperty } from '@nestjs/swagger'
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

export function ShowFamilyDoc() {
	return applyDecorators(
		ApiOperation({
			summary: 'show family details',
			description: 'Show details for a non deleted family',
		}),
		ApiParam({
			name: 'serial',
			description: 'Serial of the family',
			type: String,
		}),
		ApiOkResponse({
			description: 'Family found.',
			type: OkResponse,
		}),
		BadRequestResponse({ errorMessage: 'Family not found.' }),
	)
}
