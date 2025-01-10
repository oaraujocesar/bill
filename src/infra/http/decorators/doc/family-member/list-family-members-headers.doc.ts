import { applyDecorators } from '@nestjs/common'
import { ApiOkResponse, ApiOperation, ApiParam, ApiProperty } from '@nestjs/swagger'
import { BadRequestResponse } from '../shared/bad-request-response.decorator'

class OkResponse {
	@ApiProperty()
	statusCode: number

	@ApiProperty()
	message: string
}

export function ListFamilyMembersDoc() {
	return applyDecorators(
		ApiOperation({
			summary: 'list all family members',
			description: 'List all family members',
		}),
		ApiParam({
			name: 'familySerial',
			description: 'Serial of the family',
			type: String,
		}),
		ApiOkResponse({
			description: 'Family members found.',
			type: OkResponse,
			schema: {
				type: 'object',
				properties: {
					data: {
						type: 'array',
						items: {
							type: 'object',
							properties: {
								id: {
									type: 'number',
									example: 1,
								},
								userId: {
									type: 'string',
									example: 'string',
								},

								familyId: {
									type: 'number',
									example: 1,
								},
								isOwner: {
									type: 'boolean',
									example: true,
								},
								createdAt: { type: 'string', example: '2022-01-01T00:00:00.000Z' },
							},
						},
					},
				},
			},
		}),
		BadRequestResponse({ errorMessage: 'Family members not found.' }),
	)
}
