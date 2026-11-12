import { Injectable } from '@nestjs/common';
import { PersistenceService } from '../../../persistence/persistence.service';
import { UserRepository } from '../application/ports/user.repository';
import { User } from '../application/user.types';

@Injectable()
export class PrismaUserRepository implements UserRepository {
  constructor(private readonly prisma: PersistenceService) {}

  async upsertUser({
    sub,
    email,
    name,
  }: {
    sub: string;
    email: string;
    name: string;
  }): Promise<void> {
    await this.prisma.db.orm.public.User.upsert({
      create: {
        sub,
        email,
        name,
      },
      update: {
        name,
      },
      conflictOn: { sub },
    });
  }

  async getUser(sub: string): Promise<User | null> {
    return this.prisma.db.orm.public.User.where((user) =>
      user.sub.eq(sub),
    ).first();
  }
}
