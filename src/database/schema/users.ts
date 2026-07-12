import { pgTable, varchar, uuid, timestamp, text } from 'drizzle-orm/pg-core';
import { statusEnum, roleEnum } from './enums';

export const usersTable = pgTable('users', {
  id: uuid().primaryKey().defaultRandom(),
  email: varchar({ length: 255 }).notNull().unique(),
  emailVerified: timestamp(),
  passwordHash: text().notNull(),
  firstName: text(),
  lastName: text(),
  phone: text(),
  phoneVerified: timestamp(),
  role: roleEnum().default('customer').notNull(),
  status: statusEnum().default('active').notNull(),
  createdAt: timestamp().defaultNow().notNull(),
  updatedAt: timestamp().defaultNow().notNull(),
  lastLoginAt: timestamp().defaultNow(),
});
