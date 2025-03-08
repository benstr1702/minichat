// import { auth } from "@/auth";
// import { NextResponse } from "next/server";
// import { headers } from "next/headers";
// import { checkRateLimit } from "@/lib/rate-limit";

// export const GET = auth(async function GET(req) {
// 	try {
// 		if (!req.auth) {
// 			return NextResponse.json(
// 				{ message: "Not authenticated" },
// 				{ status: 401 }
// 			);
// 		}

// 		// Rate limiting check
// 		const headerList = await headers();
// 		const ip = headerList.get("x-forwarded-for");
// 		if (ip === null) {
// 			console.error("IP address is missing");
// 			return;
// 		}
// 		const rateLimitResult = await checkRateLimit(ip);
// 		if (!rateLimitResult.success) {
// 			return NextResponse.json(
// 				{ message: "Too many requests" },
// 				{ status: 429 }
// 			);
// 		}

// 		return NextResponse.json(req.auth, {
// 			headers: {
// 				"Cache-Control": "no-store",
// 			},
// 		});
// 	} catch (error) {
// 		console.error("Error:", error);
// 		return NextResponse.json(
// 			{ message: "Internal server error" },
// 			{ status: 500 }
// 		);
// 	}
// });
