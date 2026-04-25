import { PrismaClient } from '@prisma/client';
import 'dotenv/config';

class Database {
  private static instance: PrismaClient;

  private constructor() {}

  public static getInstance(): PrismaClient {
    if (!Database.instance) {
      Database.instance = new PrismaClient();
    }
    return Database.instance;
  }
}

export const prisma = Database.getInstance();
