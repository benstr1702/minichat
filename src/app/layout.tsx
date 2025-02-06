import type { Metadata } from "next";
import { Providers } from "./providers";

import "./globals.css";

export const metadata: Metadata = {
	title: "Minichat",
	description: "Chat with strangers",
};

export default function RootLayout({
	children,
}: Readonly<{
	children: React.ReactNode;
}>) {
	return (
		<html lang="en">
			<body>
				<Providers>{children}</Providers>
			</body>
		</html>
	);
}
