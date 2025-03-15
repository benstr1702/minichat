import { createServer } from "http";
import next from "next";
import { Server } from "socket.io";
import { v4 as uuidv4 } from "uuid";
// import { messagesTable } from "./src/db/schema";

const dev = process.env.NODE_ENV !== "production";
const app = next({ dev });
const handle = app.getRequestHandler();

const channels = new Map([
	["general", { id: "general", name: "General", desc: "General Chat" }],
	[
		"icebox",
		{
			id: "icebox",
			name: "Icebox",
			desc: "Very cold out here",
		},
	],
	["breeze", { id: "breeze", name: "Breeze", desc: "Breezy Channel" }],
]);
app.prepare().then(() => {
	const server = createServer(handle); // Create HTTP Server
	const io = new Server(server); // Create Socket.IO Server

	const users = new Map(); // new map for user sockets

	io.on("connection", (socket) => {
		// console.log(`Client Connected: ${socket.id}`);
		socket.emit("availableChannels", Array.from(channels.values()));

		socket.on("join", (data) => {
			const { user, channel } = data; // Get user and channel user wants to join from client
			const channelId = channel || channels.get("general")?.id;
			const userData = users.get(socket.id);

			if (userData?.room) socket.leave(userData.room);
			socket.join(channelId);
			console.log(`${user} joined channel: ${channelId}`);
			users.set(socket.id, { username: user, room: channelId });
			io.to(channelId).emit("userJoined", {
				id: uuidv4(),
				user,
				channel: channelId,
			});
		});

		socket.on("message", (msg) => {
			const userData = users.get(socket.id);
			if (userData && userData.room) {
				const messageId = uuidv4();
				console.log(`Emitting message with ID: ${messageId}`);
				io.to(userData.room).emit("message", {
					id: messageId,
					user: userData.username,
					text: msg,
				});
			}
		});

		socket.on("disconnect", () => {
			console.log(`Client disconnected: ${socket.id}`);
			const userData = users.get(socket.id);

			if (userData) {
				console.log(`Chatter Left: ${userData.username}`);
				io.to(userData.room).emit("userLeft", {
					id: uuidv4(),
					user: userData.username,
				});
				users.delete(socket.id);
			} else {
				console.log(`Unknown client disconnected: ${socket.id}`);
			}
		});
	});

	const PORT = process.env.PORT || 3000;
	server
		.listen(PORT, () => {
			console.log(`Server listening on http://localhost:${PORT}`);
		})
		.on("error", (err) => {
			console.error("Failed to start server:", err);
			process.exit(1);
		});
});
