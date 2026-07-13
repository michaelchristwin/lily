import { Injectable, Inject, NotFoundException } from '@nestjs/common';
import { eq } from 'drizzle-orm';
import { DRIZZLE, type DrizzleDB } from '../database/database.provider';
import { usersTable } from '../database/schema';
import { UpdateUserDto } from './dto/update-user.dto';

@Injectable()
export class UsersService {
  constructor(@Inject(DRIZZLE) private readonly db: DrizzleDB) {}
  async findById(id: string) {
    const user = await this.db.query.usersTable.findFirst({
      where: { id: id },
    });

    if (!user) {
      throw new NotFoundException('User not found');
    }

    return this.toUserResponse(user);
  }

  async update(id: string, dto: UpdateUserDto) {
    const [user] = await this.db
      .update(usersTable)
      .set({
        ...dto,
        updatedAt: new Date(),
      })
      .where(eq(usersTable.id, id))
      .returning();

    if (!user) {
      throw new NotFoundException('User not found');
    }

    return this.toUserResponse(user);
  }

  async remove(id: string) {
    const [user] = await this.db
      .delete(usersTable)
      .where(eq(usersTable.id, id))
      .returning();

    if (!user) {
      throw new NotFoundException('User not found');
    }

    return;
  }

  private toUserResponse(user: typeof usersTable.$inferSelect) {
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { passwordHash, ...safeUser } = user;

    return safeUser;
  }
}
