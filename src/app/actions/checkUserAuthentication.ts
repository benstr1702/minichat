"use server";

import { auth } from "@/auth"; // Import NextAuth session helper
import { db } from "@/db/";
import { usersTable } from "@/db/schema";
import { eq } from "drizzle-orm";

export async function checkUserAuthentication() {
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

	return {
		id: user?.id,
		chatName: user?.chatName || user?.name || "User",
		role: user?.role,
	};
}
