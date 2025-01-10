import { ApiProperty } from '@nestjs/swagger'
import { IsNumber, IsUUID } from 'class-validator'

export class CreateFamilyMemberDto {
	@IsUUID()
	@ApiProperty()
	userId: string

	@IsNumber()
	@ApiProperty()
	familyId: number
}
