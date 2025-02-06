import SignInButton from "@/components/SignInButton";

export default function Login() {
	return (
		<main className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
			<div className="max-w-md mx-auto space-y-8">
				<div className="text-center">
					<h1 className="text-3xl font-semibold text-gray-900 mb-2">
						Login
					</h1>
					<p className="text-gray-600">
						You can sign in using any of the providers listed below:{" "}
					</p>
				</div>

				<div className="bg-white rounded-lg shadow-sm p-6 space-y-6">
					<div className="transition-all duration-200 hover:scale-[1.02]">
						<SignInButton />
					</div>
				</div>
			</div>
		</main>
	);
}
