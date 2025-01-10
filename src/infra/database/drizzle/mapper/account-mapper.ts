import { Account } from 'src/application/entities/account.entity'

export type DrizzleResultType = {
	name: string
	id: number
	serial: string
	userId: string
	createdAt: Date
	updatedAt: Date
	balance: string
	deletedAt: Date
}

export class AccountMapper {
	static toDrizzle(account: Account) {
		return {
			name: account.name,
			id: account.id,
			serial: account.serial,
			userId: account.userId,
			createdAt: account.createdAt,
			updatedAt: account.updatedAt,
			balance: account.balance.toString(),
			deletedAt: account.deletedAt,
		}
	}

	static toDomain(account: DrizzleResultType) {
		return Account.create({
			name: account.name,
			id: account.id,
			serial: account.serial,
			userId: account.userId,
			createdAt: account.createdAt,
			updatedAt: account.updatedAt,
			balance: Number(account.balance),
			deletedAt: account.deletedAt,
		})
	}
}
