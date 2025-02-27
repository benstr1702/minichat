import { int, sqliteTable, text } from "drizzle-orm/sqlite-core";
import { sql } from "drizzle-orm";
export const usersTable = sqliteTable("users", {
	id: int("id").primaryKey({ autoIncrement: true }),
	name: text("name"), // Optional, since some users may not have a name
	chatName: text("chat_name"), // Optional
	email: text("email").notNull().unique(), // Required
	image: text("image"), // Store the user's avatar URL
	provider: text("provider").notNull(), // "github", "google", etc.
	providerId: text("provider_id").notNull().unique(), // GitHub user ID
	role: text("role").notNull().default("USER"),
	timestamp: text().default(sql`(CURRENT_TIMESTAMP)`),
});
