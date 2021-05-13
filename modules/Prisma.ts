import { PrismaClient } from "@prisma/client";

declare global {
  var prismaClient: PrismaClient;
}

export let localPrisma: PrismaClient;

// check to use this workaround only in development and not in production
if (process.env.NODE_ENV === "production") {
  localPrisma = new PrismaClient();
} else {
  if (!global.prismaClient) global.prismaClient = new PrismaClient();

  localPrisma = global.prismaClient;
}
