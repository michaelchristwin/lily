import { pgEnum } from 'drizzle-orm/pg-core';

export const roleEnum = pgEnum('role', ['customer', 'admin']);
export const statusEnum = pgEnum('status', ['active', 'suspended', 'deleted']);
