import { ApiProperty } from '@nestjs/swagger'
import { ULID } from 'ulidx'

type FamilyMemberProps = {
	id?: number
	serial?: ULID
	familyId: number
	isOwner?: boolean
	userId: string
	createdAt?: Date
	updatedAt?: Date
	deletedAt?: Date
}

export class FamilyMember {
	@ApiProperty()
	id: number

	@ApiProperty()
	userId: string

	@ApiProperty()
	familyId: number

	@ApiProperty()
	isOwner: boolean

	@ApiProperty()
	createdAt: Date

	constructor(props: FamilyMemberProps) {
		this.id = props.id
		this.familyId = props.familyId
		this.userId = props.userId
		this.isOwner = props.isOwner
		this.createdAt = props.createdAt ?? new Date()
	}

	static create(props: FamilyMemberProps) {
		return new FamilyMember(props)
	}
}
