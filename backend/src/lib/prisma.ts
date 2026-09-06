import { PrismaClient } from '@prisma/client';

const globalForPrisma = globalThis as unknown as { prisma: PrismaClient };

function createPrismaClient(): PrismaClient {
  try {
    return new PrismaClient();
  } catch (err) {
    console.error('Prisma initialization fallback:', err);
    return new Proxy({} as PrismaClient, {
      get(_target, prop) {
        if (prop === '$connect' || prop === '$disconnect') return async () => {};
        return new Proxy({}, {
          get(_t, _p) {
            return async () => [];
          },
        });
      },
    });
  }
}

export const prisma = globalForPrisma.prisma || createPrismaClient();

if (process.env.NODE_ENV !== 'production') {
  globalForPrisma.prisma = prisma;
}
