"use server";

import { auth } from "@/auth"; // Import NextAuth session helper
import { db } from "@/db/";
import { usersTable } from "@/db/schema";
import { eq } from "drizzle-orm";

export async function checkUserRole(requiredRole: string) {
	const session = await auth(); // Get logged-in user

	if (!session?.user?.id) {
		throw new Error("Unauthorized");
	}

	const user = await db
		.select()
		.from(usersTable)
		.where(eq(usersTable.id, parseInt(session.user.id)))
		.get();
	console.log(user?.role);

	return user?.role === requiredRole;
}

export async function getAllUsers() {
	const users = await db.select().from(usersTable).all();
	return users;
}
