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

export const messagesTable = sqliteTable("messages", {
	id: int("id").primaryKey({ autoIncrement: true }),
	userId: int("user_id")
		.notNull()
		.references(() => usersTable.id, { onDelete: "cascade" }),
	roomId: text("room_id").notNull(),
	text: text("text").notNull(),
	timestamp: text().default(sql`(CURRENT_TIMESTAMP)`),
});

export const roomsTable = sqliteTable("rooms", {
	id: int("id").primaryKey({ autoIncrement: true }),
	name: text("name").notNull().unique(),
	displayName: text("display_name").notNull().unique(),
	createdAt: text().default(sql`(CURRENT_TIMESTAMP)`),
});
