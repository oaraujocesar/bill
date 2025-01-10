import { applyDecorators } from '@nestjs/common'
import { ApiOperation, ApiParam, ApiProperty } from '@nestjs/swagger'
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

export function DeleteFamilyDoc() {
	return applyDecorators(
		ApiOperation({
			summary: 'deletes family details',
		}),
		ApiParam({
			name: 'serial',
			description: 'Serial of the family',
			type: String,
		}),
		BadRequestResponse({ errorMessage: 'Family not found.' }),
	)
}
