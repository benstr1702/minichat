// src/app/admin-dashboard/page.tsx
import { auth } from "@/auth";
import { checkUserRole, getAllUsers } from "../actions/checkUserRole";
import { ReactElement } from "react";

export default async function AdminDashboard(): Promise<ReactElement> {
	const session = await auth();

	// Check if the user is authenticated
	if (!session) {
		return <div>Not authenticated</div>;
	}

	if (!session.user?.id) {
		return <div>No user ID found</div>;
	}

	// Check if the user has the 'ADMIN' role
	const isAdmin = await checkUserRole("ADMIN");
	if (!isAdmin) {
		return (
			<div>Access denied. You do not have the required permissions.</div>
		);
	}

	// Fetch all users
	const users = await getAllUsers();

	return (
		<div>
			<h1>Admin Dashboard</h1>
			<pre>{JSON.stringify(session, null, 2)}</pre>
			<h2>Registered Users</h2>
			<pre>{JSON.stringify(users, null, 2)}</pre>
		</div>
	);
}
