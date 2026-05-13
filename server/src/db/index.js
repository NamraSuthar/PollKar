import pg from "pg"
import { drizzle } from "drizzle-orm/node-postgres"

import { env } from "../common/config/env.js"
import * as schemas from "./schema/index.js"

const { Pool } = pg
const client = new Pool({
    connectionString: env.databaseUrl,
})

const db = drizzle(client, { schema: schemas })

export default db;