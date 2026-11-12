export * from './lib/prisma/contract';
export * from './lib/prisma/db';

import contractJson from './lib/prisma/contract.json' with { type: 'json' };
export { contractJson };
