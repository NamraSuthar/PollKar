import { eq } from "drizzle-orm";

import  db  from "../../db/index.js";
import { users } from "../../db/schema/index.js";

export class AuthRepository {
  async findUserByEmail(email) {
    const [user] = await db.select().from(users).where(eq(users.email, email));
    return user || null;
  }

  async findUserById(id) {
    const [user] = await db.select().from(users).where(eq(users.id, id));
    return user || null;
  }

  async createUser(data) {
    const [user] = await db.insert(users).values(data).returning();
    return user;
  }
}

export const authRepository = new AuthRepository();
