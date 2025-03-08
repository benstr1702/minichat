import { createServer } from "http";
import next from "next";
import { Server } from "socket.io";
// import { messagesTable } from "./src/db/schema";
import { db } from "./src/db/index";

const dev = process.env.NODE_ENV !== "production";
const app = next({ dev });
const handle = app.getRequestHandler();

// const DEFAULT_ROOM_ID = "jerusalem";
app.prepare().then(() => {
	const server = createServer(handle); // Create HTTP Server
	const io = new Server(server); // Create Socket.IO Server

	const users = new Map(); // new map for user sockets

	io.on("connection", (socket) => {
		console.log(`Client Connected: ${socket.id}`);

		socket.on("join", (data) => {
			console.log(`New Chatter Joined: ${data.user}`);
			console.log("data ", data);

			users.set(socket.id, { username: data.user });
			io.emit("userJoined", { user: data.user });
		});

		socket.on("message", (msg) => {
			io.emit("message", msg);
		});

		socket.on("disconnect", () => {
			console.log(`Client disconnected: ${socket.id}`);
			const disconnectedSocketId = socket.id;
			const userData = users.get(disconnectedSocketId);

			if (userData) {
				console.log(`Chatter Left: ${userData.username}`);
				io.emit("userLeft", { user: userData.username });
				users.delete(disconnectedSocketId);
			} else {
				console.log(`Unknown client disconnected: ${socket.id}`);
			}
		});
	});

	server.listen(3000, () => {
		console.log(" Listening on http://localhost:3000");
	});
});
