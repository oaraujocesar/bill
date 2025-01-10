import { ApiProperty } from '@nestjs/swagger'
import { IsNotEmpty, IsNumber, IsPositive, IsString, Max, Min } from 'class-validator'

export class CreateCardDto {
	@ApiProperty()
	@IsString()
	@IsNotEmpty()
	name: string

	@ApiProperty()
	@IsNumber({ maxDecimalPlaces: 2 })
	@IsPositive()
	@Min(1)
	limit: number

	@ApiProperty()
	@IsNumber()
	@IsPositive()
	@Min(1)
	@Max(30)
	dueDate: number
}
