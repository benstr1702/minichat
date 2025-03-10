"use client";
import { useRouter } from "next/navigation";

export default function ChatButton() {
	const router = useRouter();
	return (
		<button
			className="px-6 py-2.5 rounded-lg bg-gray-800 text-white font-medium text-sm transition-all duration-200 hover:bg-gray-700 hover:shadow-md hover:scale-[1.02] active:scale-95 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2"
			onClick={() => router.push("/chat")}
		>
			Chat
		</button>
	);
}
