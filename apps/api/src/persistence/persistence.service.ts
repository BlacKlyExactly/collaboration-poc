import { Injectable, OnModuleDestroy } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { initPrisma, type Prisma } from '@notes-app/prisma';

@Injectable()
export class PersistenceService implements OnModuleDestroy {
  private readonly prisma: Prisma;

  constructor(config: ConfigService) {
    this.prisma = initPrisma(config.getOrThrow('DATABASE_URL'));
  }

  get db(): Prisma['db'] {
    return this.prisma.db;
  }

  get contract() {
    return this.prisma.contract;
  }

  async onModuleDestroy() {
    await this.db.close();
  }
}
