"use client";
import { useSession } from "next-auth/react";
import AuthenticationStatus from "@/components/AuthenticationStatus";
import SignOutButton from "@/components/SignOutButton";
import LoginRedirect from "@/components/LoginRedirect";
import ProfileButton from "@/components/ProfileButton";

export default function Home() {
	const { data: session, status } = useSession();

	return (
		<main className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
			<div className="max-w-md mx-auto space-y-8">
				<div className="text-center">
					<h1 className="text-3xl font-semibold text-gray-900 mb-2">
						Welcome
					</h1>
					<p className="text-gray-600">
						{status === "authenticated"
							? "You're signed in"
							: "Please sign in to continue"}
					</p>
				</div>

				<div className="bg-white rounded-lg shadow-sm p-6 space-y-6">
					{status !== "authenticated" ? (
						<div className="transition-all duration-200 hover:scale-[1.02]">
							<LoginRedirect />
						</div>
					) : (
						<div className="transition-all flex justify-center gap-5 duration-200 hover:scale-[1.02]">
							<SignOutButton />
							<ProfileButton />
						</div>
					)}

					<div className="pt-4 border-t border-gray-200">
						<AuthenticationStatus />
					</div>
				</div>
			</div>
		</main>
	);
}
