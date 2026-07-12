import {
  ConflictException,
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import type { PostgresJsDatabase } from 'drizzle-orm/postgres-js';
import { relations } from '../database/schema/relations';
import { SignUpDto } from './dto/sign-up.dto';
import { usersTable } from '../database/schema';
import { eq } from 'drizzle-orm';
import argon2 from 'argon2';
import { SignInDto } from './dto/sign-in.dto';
import { UpdateUserDto } from './dto/update-use.dto';

@Injectable()
export class AuthService {
  constructor(private readonly db: PostgresJsDatabase<typeof relations>) {}

  async signUp(dto: SignUpDto) {
    const existing = await this.db
      .select()
      .from(usersTable)
      .where(eq(usersTable.email, dto.email))
      .limit(1);

    if (existing[0]) {
      throw new ConflictException('Email already exists');
    }

    const password = await argon2.hash(dto.password);

    const [user] = await this.db
      .insert(usersTable)
      .values({
        ...dto,
        passwordHash: password,
      })
      .returning();

    // TODO: Generate JWT

    return user;
  }

  async signIn(dto: SignInDto) {
    const user = await this.db.query.usersTable.findFirst({
      where: {
        email: dto.email,
      },
    });

    if (!user) {
      throw new UnauthorizedException('Invalid credentials');
    }

    const valid = await argon2.verify(user.passwordHash, dto.password);

    if (!valid) {
      throw new UnauthorizedException('Invalid credentials');
    }

    // TODO: Generate JWT

    return user;
  }

  async findById(id: string) {
    const user = await this.db.query.usersTable.findFirst({
      where: { id: id },
    });

    if (!user) {
      throw new NotFoundException('User not found');
    }

    return user;
  }

  async updateUser(id: string, dto: UpdateUserDto) {
    const [user] = await this.db
      .update(usersTable)
      .set(dto)
      .where(eq(usersTable.id, id))
      .returning();

    if (!user) {
      throw new NotFoundException('User not found');
    }

    return user;
  }

  async deleteUser(id: string) {
    const [user] = await this.db
      .delete(usersTable)
      .where(eq(usersTable.id, id))
      .returning();

    if (!user) {
      throw new NotFoundException('User not found');
    }

    return {
      message: 'User deleted',
    };
  }
}
