"use client";
import { useState, FormEvent, useEffect } from "react";
import { useSession } from "next-auth/react";
import { updateUserName } from "../actions/updateUserName";

type ProfileData = {
	username: string | null | undefined;
	chatUsername: string | null | undefined; // New field for chat username
	email: string | null | undefined;
	avatarUrl: string | null | undefined;
};

export default function ProfilePage() {
	const [username, setUsername] = useState("");
	const [isEditing, setIsEditing] = useState(false);
	const [error, setError] = useState<string | null>(null);
	const [isLoading, setIsLoading] = useState(false);
	const [successMessage, setSuccessMessage] = useState<string | null>(null);

	const { data: session, status, update: updateSession } = useSession();

	// Create profile data from session
	// The chatUsername will be populated in useEffect after loading from DB
	const profile: ProfileData = {
		username: session?.user?.name ?? "",
		chatUsername: session?.user?.chatName ?? "", // This assumes you add chatName to session
		email: session?.user?.email ?? "",
		avatarUrl: session?.user?.image ?? null,
	};

	// Update local state when session changes
	useEffect(() => {
		if (session?.user?.chatName) {
			setUsername(session.user.chatName);
		} else if (session?.user?.name) {
			setUsername(session.user.name);
		}
	}, [session]);

	const handleSubmit = async (e: FormEvent) => {
		e.preventDefault();

		if (!session?.user?.email) {
			setError("Not authenticated");
			return;
		}

		if (!username.trim()) {
			setError("Username cannot be empty");
			return;
		}

		try {
			setIsLoading(true);
			setError(null);
			setSuccessMessage(null);

			const result = await updateUserName(session.user.email, username);
			if (result.success) {
				// Force session update to get latest data
				await updateSession();
				setIsEditing(false);
				setSuccessMessage("Username updated successfully!");
			} else {
				setError(result.error || "Failed to update username");
			}
		} catch (error) {
			setError("An unexpected error occurred");
			console.error("Error updating username:", error);
		} finally {
			setIsLoading(false);
		}
	};

	return (
		<div className="min-h-screen bg-gray-50 py-8">
			<div className="max-w-2xl mx-auto px-4">
				<h1 className="text-3xl font-semibold text-gray-800 tracking-tight mb-8">
					My Profile
				</h1>

				{/* Profile Card */}
				<div className="bg-white rounded-lg shadow-sm p-6">
					{/* Profile Header */}
					<div className="flex items-center gap-4 mb-8">
						{profile.avatarUrl && (
							<img
								src={profile.avatarUrl}
								alt="User avatar"
								className="w-12 h-12 rounded-full"
							/>
						)}

						<div>
							<h2 className="text-xl font-semibold text-gray-900">
								{profile.username || "No username set"}
							</h2>
						</div>
					</div>

					{/* Success Message */}
					{successMessage && (
						<div className="mb-4 p-2 bg-green-100 border border-green-400 text-green-700 rounded">
							{successMessage}
						</div>
					)}

					{/* Error Message */}
					{error && (
						<div className="mb-4 p-2 bg-red-100 border border-red-400 text-red-700 rounded">
							{error}
						</div>
					)}

					{/* Profile Information */}
					<div className="space-y-6">
						{/* GitHub Info - Read Only */}
						<div>
							<label className="block text-sm font-medium text-gray-700 mb-2">
								GitHub Username (Read-only)
							</label>
							<input
								type="text"
								value={profile.username || ""}
								disabled
								className="w-full px-4 py-2 rounded-md border border-gray-300 bg-gray-50 text-gray-500"
							/>
						</div>

						<div>
							<label className="block text-sm font-medium text-gray-700 mb-2">
								Email
							</label>
							<input
								type="email"
								value={profile.email || ""}
								disabled
								className="w-full px-4 py-2 rounded-md border border-gray-300 bg-gray-50 text-gray-500"
							/>
						</div>

						{/* Editable Chat Username */}
						<form onSubmit={handleSubmit}>
							<div className="mb-4">
								<label
									htmlFor="chat-username"
									className="block text-sm font-medium text-gray-700 mb-2"
								>
									Chat Username
								</label>
								{isEditing ? (
									<input
										id="chat-username"
										type="text"
										value={username}
										onChange={(e) =>
											setUsername(e.target.value)
										}
										className="w-full px-4 py-2 rounded-md border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
										placeholder="Enter new chat username"
									/>
								) : (
									<input
										type="text"
										value={
											session?.user?.chatName ||
											profile.username ||
											""
										}
										disabled
										className="w-full px-4 py-2 rounded-md border border-gray-300 bg-gray-50 text-gray-500"
									/>
								)}
							</div>

							{/* Action Buttons */}
							<div className="flex justify-end gap-4">
								{isEditing ? (
									<>
										<button
											type="button"
											onClick={() => setIsEditing(false)}
											disabled={isLoading}
											className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50 disabled:opacity-50"
										>
											Cancel
										</button>
										<button
											type="submit"
											disabled={isLoading}
											className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:opacity-50"
										>
											{isLoading
												? "Saving..."
												: "Save Username"}
										</button>
									</>
								) : (
									<button
										type="button"
										onClick={() => {
											// Use chatName if available, otherwise use name
											setUsername(
												session?.user?.chatName ||
													profile.username ||
													""
											);
											setIsEditing(true);
											setError(null);
											setSuccessMessage(null);
										}}
										className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
									>
										Change Chat Username
									</button>
								)}
							</div>
						</form>
					</div>
				</div>
			</div>
		</div>
	);
}
