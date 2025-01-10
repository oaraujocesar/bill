import { ApiProperty } from '@nestjs/swagger'
import { ulid } from 'ulidx'
import { User } from './user'

export type AccountProps = {
	id?: number
	serial?: string
	name: string
	balance: number
	userId: string
	createdAt?: Date
	updatedAt?: Date
	deletedAt?: Date
	user?: User
}

export class Account {
	@ApiProperty()
	id: number

	@ApiProperty()
	serial: string

	@ApiProperty()
	name: string

	@ApiProperty()
	balance: number

	@ApiProperty()
	userId: string

	@ApiProperty()
	createdAt: Date

	@ApiProperty()
	updatedAt: Date

	@ApiProperty()
	deletedAt?: Date

	@ApiProperty()
	user?: User

	constructor(props: AccountProps) {
		this.id = props.id
		this.serial = props.serial ?? ulid()
		this.name = props.name
		this.balance = props.balance
		this.userId = props.userId
		this.createdAt = props.createdAt ?? new Date()
		this.updatedAt = props.updatedAt ?? new Date()
		this.deletedAt = props.deletedAt
		this.user = props.user
	}

	static create(props: AccountProps): Account {
		return new Account(props)
	}
}
