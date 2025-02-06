import { useSession } from "next-auth/react";

export default function AuthenticationStatus() {
	const { data: session, status } = useSession();
	const statusStyles = {
		loading: "text-yellow-500 animate-pulse",
		authenticated: "text-green-600",
		unauthenticated: "text-red-600",
	};

	return (
		<div className="flex flex-col">
			<p
				className={`text-lg font-medium transition-colors ${statusStyles[status]}`}
			>
				Status: {status}
			</p>
			<p>Username: {session?.user?.name}</p>
			<p>Email: {session?.user?.email}</p>
			<p>User Id: {session?.user?.id}</p>
			<img
				className="w-14 h-14 rounded-3xl"
				src={session?.user?.image ?? undefined}
			/>
		</div>
	);
}
