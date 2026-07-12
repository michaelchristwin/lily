// relations.ts
import { defineRelations } from 'drizzle-orm';
import * as schema from './index';

export const relations = defineRelations(schema, () => ({
  usersTable: {
    // define relations here, e.g. r.usersTable.posts...
  },
}));
