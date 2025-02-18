"use server";

import { db } from "@/db";
import { eq } from "drizzle-orm";
import { usersTable } from "@/db/schema";

export async function updateUserName(email: string, newUserName: string) {
	if (!email) return { success: false, error: "Email is required. soz" };
	try {
		await db
			.update(usersTable)
			.set({
				chatName: newUserName,
			})
			.where(eq(usersTable.email, email));
		return { success: true };
	} catch (error) {
		console.error("Error updating username:", error);
		return { success: false, error: "Failed to update username" };
	}
}
