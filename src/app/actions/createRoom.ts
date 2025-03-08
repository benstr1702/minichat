"use server";

import { db } from "@/db";
import { roomsTable } from "@/db/schema";
import { randomUUID } from "crypto";

export async function createRoom(displayName: string) {
	const roomId = randomUUID();

	const result = await db
		.insert(roomsTable)
		.values({
			name: roomId,
			displayName: displayName,
		})
		.returning();

	return result[0];
}
