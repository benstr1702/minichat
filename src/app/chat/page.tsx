"use client";

import { useEffect, useState } from "react";
import { io, Socket } from "socket.io-client";

interface Message {
	id: string;
	user: string;
	text: string;
}

export default function Chat() {
	const [socket, setSocket] = useState<Socket | null>(null);
	const [messages, setMessages] = useState<Message[]>([]);
	const [input, setInput] = useState("");

	useEffect(() => {
		const socketInstance = io("http://localhost:3000");
		setSocket(socketInstance);

		socketInstance.on("message", (message: Message) => {
			setMessages((prev) => [...prev, message]);
		});

		return () => {
			socketInstance.disconnect();
		};
	}, []);

	const sendMessage = () => {
		if (input.trim() && socket) {
			const newMessage: Message = {
				id: crypto.randomUUID(), // Remove this if server generates ID
				user: "User",
				text: input.trim(),
			};

			socket.emit("message", newMessage);
			setInput("");
		}
	};

	return (
		<div className="flex flex-col max-w-md mx-auto mt-10 border rounded-lg shadow-lg p-4 bg-white">
			<div className="h-64 overflow-y-auto p-2 border-b">
				{messages.map((msg) => (
					<div key={msg.id} className="mb-2">
						<span className="font-bold">{msg.user}: </span>
						<span>{msg.text}</span>
					</div>
				))}
			</div>

			<div className="flex gap-2 mt-4">
				<input
					type="text"
					value={input}
					onChange={(e) => setInput(e.target.value)}
					onKeyDown={(e) => e.key === "Enter" && sendMessage()}
					placeholder="Type a message..."
					className="flex-1 p-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
				/>
				<button
					onClick={sendMessage}
					className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors duration-200 disabled:opacity-50"
					disabled={!input.trim()}
				>
					Send
				</button>
			</div>
		</div>
	);
}
