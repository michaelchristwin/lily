import postgres from 'postgres';
import { drizzle } from 'drizzle-orm/postgres-js';
import { relations } from './schema/relations';

export const DRIZZLE = Symbol('DRIZZLE');

const client = postgres(process.env.DATABASE_URL!);
const db = drizzle({ client, relations });

export type DrizzleDB = typeof db;

export const drizzleProvider = {
  provide: DRIZZLE,
  useValue: db,
};
