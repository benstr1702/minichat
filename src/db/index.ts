import { createClient } from "@libsql/client";
// import { createClient } from "../../node_modules/@libsql/client";
import { drizzle } from "drizzle-orm/libsql";

export const client = createClient({
	url: process.env.DATABASE_URL!,
	authToken: process.env.DATABASE_AUTH_TOKEN!,
});

export const db = drizzle(client);
