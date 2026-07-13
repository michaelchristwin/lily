import {
  ConflictException,
  Injectable,
  Inject,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { SignUpDto } from './dto/sign-up.dto';
import { usersTable } from '../database/schema';
import { eq } from 'drizzle-orm';
import argon2 from 'argon2';
import { SignInDto } from './dto/sign-in.dto';
import { type DrizzleDB, DRIZZLE } from '../database/database.provider';
import { JwtService } from '@nestjs/jwt';
import { JwtPayload } from './types/jwt-payload';
import { UpdateUserDto } from '../users/dto/update-user.dto';
import { UsersService } from '../users/users.service';

@Injectable()
export class AuthService {
  constructor(
    @Inject(DRIZZLE)
    private readonly db: DrizzleDB,
    private readonly jwtService: JwtService,
    private readonly usersService: UsersService,
  ) {}

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
    const payload: JwtPayload = {
      sub: user.id,
      email: user.email,
      role: user.role,
    };
    const accessToken = await this.jwtService.signAsync(payload);
    return { accessToken, user };
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
    const payload: JwtPayload = {
      sub: user.id,
      email: user.email,
      role: user.role,
    };
    const accessToken = await this.jwtService.signAsync(payload);
    return { accessToken, user };
  }

  async findById(id: string) {
    const user = await this.usersService.findById(id);

    if (!user) {
      throw new NotFoundException('User not found');
    }

    return user;
  }

  async updateUser(id: string, dto: UpdateUserDto) {
    const user = await this.usersService.update(id, dto);

    if (!user) {
      throw new NotFoundException('User not found');
    }

    return user;
  }

  async deleteUser(id: string) {
    await this.usersService.remove(id);
    return {
      message: 'User deleted',
    };
  }
}
