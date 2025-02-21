import { createServer } from "http";
import next from "next";
import { Server } from "socket.io";

const dev = process.env.NODE_ENV !== "production";
const app = next({ dev });
const handle = app.getRequestHandler();

app.prepare().then(() => {
	const server = createServer(handle);
	const io = new Server(server);

	io.on("connection", (socket) => {
		console.log(`Client connected: ${socket.id}`);

		socket.on("message", (msg) => {
			io.emit("message", msg);
		});

		socket.on("disconnect", () => {
			console.log(`Client disconnected: ${socket.id}`);
		});
	});

	server.listen(3000, () => {
		console.log("> Ready on http://localhost:3000");
	});
});
