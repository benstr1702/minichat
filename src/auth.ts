// // src/auth.ts
// import NextAuth from "next-auth";
// import GitHub from "next-auth/providers/github";

// export const { handlers, signIn, signOut, auth } = NextAuth({
// 	providers: [
// 		GitHub({
// 			clientId: process.env.AUTH_GITHUB_ID,
// 			clientSecret: process.env.AUTH_GITHUB_SECRET,
// 		}),
// 	],
// 	callbacks: {
// 		signIn: async ({ user, account, profile }) => {
// 			if (account?.provider === "github") {
// 				console.table({
// 					username: user.name,
// 					email: user.email,
// 					image: user.image,
// 					providerAccountId: account.providerAccountId,
// 					provider: account.provider,
// 					profileAddress: profile?.address,
// 					profileBirthDate: profile?.birthdate,
// 					profileEmail: profile?.email,
// 					profileEmailVerified: profile?.email_verified,
// 				});

// 				return true;
// 			}
// 			return false;
// 		},
// 		session: async ({ session, token }) => {
// 			if (session.user && token.sub) {
// 				session.user.id = token.sub;
// 			}
// 			return session;
// 		},
// 		jwt: async ({ token, user }) => {
// 			if (user) {
// 				token.id = user.id;
// 			}
// 			return token;
// 		},
// 	},
// });

import { createClient } from "@libsql/client";
import { drizzle } from "drizzle-orm/libsql";
import { eq } from "drizzle-orm";
import { usersTable } from "./db/schema";
import NextAuth from "next-auth";
import GitHub from "next-auth/providers/github";

// Initialize database with HTTP client
const client = createClient({
	url: process.env.DATABASE_URL!,
	authToken: process.env.DATABASE_AUTH_TOKEN!,
});

const db = drizzle(client);

export const { handlers, signIn, signOut, auth } = NextAuth({
	providers: [
		GitHub({
			clientId: process.env.AUTH_GITHUB_ID,
			clientSecret: process.env.AUTH_GITHUB_SECRET,
		}),
	],
	callbacks: {
		signIn: async ({ user, account, profile }) => {
			if (account?.provider === "github") {
				try {
					// Check if user already exists
					const existingUser = await db
						.select()
						.from(usersTable)
						.where(
							eq(usersTable.providerId, account.providerAccountId)
						)
						.get();

					if (!existingUser) {
						// Create new user with proper type inference
						const newUser: typeof usersTable.$inferInsert = {
							name: user.name || null,
							email: user.email!, // We know this exists from GitHub
							image: user.image || null,
							provider: account.provider,
							providerId: account.providerAccountId,
						};

						await db.insert(usersTable).values(newUser);
					} else {
						// Update existing user
						await db
							.update(usersTable)
							.set({
								name: user.name || null,
								email: user.email!,
								image: user.image || null,
							})
							.where(
								eq(
									usersTable.providerId,
									account.providerAccountId
								)
							);
					}
					return true;
				} catch (error) {
					console.error("Error managing user in database:", error);
					return false; // Prevent sign in if database operation fails
				}
			}
			return false;
		},
		session: async ({ session, token }) => {
			if (session.user && token.sub) {
				// Get user from database
				const dbUser = await db
					.select()
					.from(usersTable)
					.where(eq(usersTable.providerId, token.sub))
					.get();

				if (dbUser) {
					session.user.id = dbUser.id.toString();
				}
			}
			return session;
		},
		jwt: async ({ token, user, account }) => {
			if (user && account) {
				token.sub = account.providerAccountId;
			}
			return token;
		},
	},
});
