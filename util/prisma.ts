// import { PrismaClient } from "@prisma/client";

// const globalForPrisma = global as unknown as {
//   prisma: PrismaClient | undefined;
// };

// export const prisma =
//   globalForPrisma.prisma ??
//   new PrismaClient();
//   //   {
//   //   log: ["query"],
//   // }

// if (process.env.NODE_ENV !== "production") globalForPrisma.prisma = prisma;

import { PrismaClient } from '@prisma/client';

/* 
Check if `globalThis.prisma` exists; if not, initialize it.
Prevents initializing a new Prisma instance on reloads during development
*/
export const prisma: PrismaClient =
  process.env.NODE_ENV === 'production'
    ? new PrismaClient()
    : (globalThis as any).prisma ||
      ((globalThis as any).prisma = new PrismaClient());
