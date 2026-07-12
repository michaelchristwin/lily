import { Injectable, Inject } from '@nestjs/common';
//import { eq } from 'drizzle-orm';
import { DRIZZLE } from '../database/database.provider';
import type { PostgresJsDatabase } from 'drizzle-orm/postgres-js';
import { relations } from '../database/schema/relations';

@Injectable()
export class UsersService {
  constructor(
    @Inject(DRIZZLE) private readonly db: PostgresJsDatabase<typeof relations>,
  ) {}
}
