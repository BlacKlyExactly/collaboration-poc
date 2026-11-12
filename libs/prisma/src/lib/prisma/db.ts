import postgres, { PostgresClient } from '@prisma/orm-postgres/runtime';
import { contractFromJson } from '@prisma/orm-postgres/static';
import type { Contract } from './contract.d';
import contractJson from './contract.json' with { type: 'json' };

export type Prisma = {
  db: PostgresClient<Contract>;
  contract: Contract;
};

export function initPrisma(url: string): Prisma {
  const contract = contractFromJson<Contract>(contractJson);
  const db = postgres({ contract, url });

  //Tutaj dziala
  db.orm.public.Document.include('user');

  const typed: PostgresClient<Contract> = db;
  //Tutaj tez dziala
  typed.orm.public.Document.include('user');

  return { contract, db };
}
