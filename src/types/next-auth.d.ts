import "next-auth";

declare module "next-auth" {
	interface Session {
		user: {
			chatName?: string;
		} & DefaultSession["user"];
	}
}
