import { ULID } from 'ulidx'
import { Account } from '../entities/account.entity'

export interface AccountRepository {
	saveAccount(account: Account): Promise<Account>
	findBySerial(serial: string): Promise<Account | null>
	deleteAccount(serial: ULID): Promise<void>
	listAllByUserId(userId: string): Promise<Account[]>
}
