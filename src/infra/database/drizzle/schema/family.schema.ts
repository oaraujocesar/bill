import { relations } from 'drizzle-orm'
import { pgTable, serial, timestamp, varchar } from 'drizzle-orm/pg-core'
import familyMember from './family-member.schema'

const families = pgTable('families', {
	id: serial('id').primaryKey(),
	serial: varchar('serial', { length: 26 }).notNull(),
	name: varchar('name').notNull(),
	createdAt: timestamp('created_at').defaultNow().notNull(),
	updatedAt: timestamp('updated_at').defaultNow().notNull(),
	deletedAt: timestamp('deleted_at'),
})

export const familiesRelations = relations(families, ({ many }) => ({
	familyMember: many(familyMember),
}))

export default families
