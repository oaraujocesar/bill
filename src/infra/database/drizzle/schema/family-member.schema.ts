import { relations } from 'drizzle-orm'
import { boolean, index, pgTable, serial, timestamp, uuid } from 'drizzle-orm/pg-core'
import family from './family.schema'
import user from './users.schema'

const familyMembers = pgTable(
	'family_members',
	{
		id: serial('id').primaryKey(),
		familyId: serial('family_id')
			.references(() => family.id)
			.notNull(),
		isOwner: boolean('is_owner'),
		userId: uuid('user_id')
			.references(() => user.id)
			.notNull(),
		createdAt: timestamp('created_at').defaultNow().notNull(),
	},
	(table) => [
		index('family_member_user_id_index').on(table.userId),
		index('family_member_family_id_index').on(table.familyId),
	],
)

export const familyMembersRelations = relations(familyMembers, ({ one }) => ({
	user: one(user, { fields: [familyMembers.userId], references: [user.id] }),
	family: one(family, { fields: [familyMembers.familyId], references: [family.id] }),
}))

export default familyMembers
