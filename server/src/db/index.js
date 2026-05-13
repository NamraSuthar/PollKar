import pg from "pg"
import { drizzle } from "drizzle-orm/pg"

import { env } from "../common/config/env.js"
import * as schems from "./schema/index.js"



const { Pool } = pg
const client = new Pool({
    connectionString: env.databaseUrl,
})

const db = drizzle(client, { schema: schems })

export default { db, pool };