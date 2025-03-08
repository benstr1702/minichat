// src/components/SignInButton.tsx
"use client";
import { signIn } from "next-auth/react";
export default function SignInButton() {
	return (
		<button
			className="w-full flex items-center justify-center gap-2 px-6 py-2.5 rounded-lg bg-gray-800 text-white font-medium text-sm transition-all duration-200 hover:bg-gray-700 hover:shadow-md hover:scale-[1.02] active:scale-95 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2"
			onClick={() => signIn("github", { callbackUrl: "/" })}
		>
			<img
				src="/github-mark-white.svg"
				alt="GitHub Icon"
				className="w-5 h-5"
			/>

			<span>Sign in with GitHub</span>
		</button>
	);
}
