import { ULID } from 'ulidx'
import { Family } from '../entities/family.entity'

export interface FamilyRepository {
	create(userId: string, family: Family): Promise<Family>
	save(family: Family): Promise<Family>
	findBySerial(serial: string): Promise<Family | null>
	delete(serial: ULID): Promise<void>
}
