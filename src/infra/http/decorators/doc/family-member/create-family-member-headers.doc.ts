import { applyDecorators } from '@nestjs/common'
import { ApiOkResponse, ApiOperation, ApiProperty } from '@nestjs/swagger'
import { FamilyMember } from 'src/application/entities/family-member.entity'
import { BadRequestResponse } from '../shared/bad-request-response.decorator'

class OkResponse {
	@ApiProperty({ type: FamilyMember })
	data: FamilyMember

	@ApiProperty()
	statusCode: number

	@ApiProperty()
	message: string
}

export function CreateFamilyMemberDoc() {
	return applyDecorators(
		ApiOperation({
			summary: 'creates a family member',
		}),
		ApiOkResponse({
			description: 'Family member created successfully!',
			type: OkResponse,
		}),
		BadRequestResponse({ errorMessage: 'bad request.' }),
	)
}
