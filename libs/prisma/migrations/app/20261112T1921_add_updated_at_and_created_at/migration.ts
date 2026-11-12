#!/usr/bin/env -S node
import type { Contract as Start } from '../../snapshots/50b462c49d8a1dffb37035d84c1eaaf956343fa63de6db78a0cfea7ef6698d68/contract';
import startContract from '../../snapshots/50b462c49d8a1dffb37035d84c1eaaf956343fa63de6db78a0cfea7ef6698d68/contract.json' with { type: 'json' };
import type { Contract as End } from '../../snapshots/fcd3062fd8f07e5d7e468a924745167679cb4d599006d8f45f201e3dea5966d0/contract';
import endContract from '../../snapshots/fcd3062fd8f07e5d7e468a924745167679cb4d599006d8f45f201e3dea5966d0/contract.json' with { type: 'json' };
import { Migration, MigrationCLI, col, fn, sql } from '@prisma/orm-postgres/migration';

export default class M extends Migration<Start, End> {
  override readonly startContractJson = startContract;
  override readonly endContractJson = endContract;

  override get operations() {
    return [
      this.addColumn({
        schema: 'public',
        table: 'Document',
        column: col('createdAt', 'timestamptz(3)', {
          notNull: true,
          default: fn(sql`now()`),
          codecRef: { codecId: 'pg/timestamptz-date@1', typeParams: { precision: 3 } },
        }),
      }),
      this.addColumn({
        schema: 'public',
        table: 'Document',
        column: col('updatedAt', 'timestamptz(3)', {
          notNull: true,
          default: fn(sql`now()`),
          codecRef: { codecId: 'pg/timestamptz-date@1', typeParams: { precision: 3 } },
        }),
      }),
    ];
  }
}

MigrationCLI.run(import.meta.url, M);
