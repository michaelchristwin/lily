import { drizzle } from 'drizzle-orm/node-postgres';
import postgres from 'postgres';

export const DRIZZLE = Symbol('DRIZZLE');

export const drizzleProvider = {
  provide: DRIZZLE,
  useFactory: () => {
    const client = postgres(process.env.DATABASE_URL!);
    return drizzle({ client });
  },
};
