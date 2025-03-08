"use client";
import { useEffect, useState } from "react";
import { io, Socket } from "socket.io-client";
import { checkUserAuthentication } from "../actions/checkUserAuthentication";

interface Message {
	id: string;
	user: string;
	text: string;
	type?: "message" | "notification";
}

let socketInstance: Socket | null = null;
export default function Chat() {
	const [socket, setSocket] = useState<Socket | null>(null);
	const [messages, setMessages] = useState<Message[]>([]);
	const [input, setInput] = useState("");
	const [userName, setUserName] = useState<string | null>(null);

	useEffect(() => {
		const initializeChat = async () => {
			const user = (await checkUserAuthentication()).chatName;
			setUserName(user);

			if (!socketInstance) {
				socketInstance = io("http://localhost:3000");
				console.log("New socket created with ID:", socketInstance.id);
			} else {
				console.log("Reusing socket with ID:", socketInstance.id);
			}

			setSocket(socketInstance);

			if (!socketInstance.connected) {
				socketInstance.emit("join", { user });
				console.log("Emitted join for user:", user);
			} else if (socketInstance.disconnected) {
				socketInstance.connect();
				socketInstance.emit("join", { user });
				console.log("Reconnected and emitted join for user:", user);
			}

			socketInstance.on("message", (message: Message) => {
				setMessages((prev) => [...prev, message]);
			});

			socketInstance.on("userJoined", (data: { user: string }) => {
				const joinNotification: Message = {
					id: crypto.randomUUID(),
					user: "System",
					text: `${data.user} joined the room`,
					type: "notification",
				};
				console.log(joinNotification);

				setMessages((prev) => [...prev, joinNotification]);
			});

			socketInstance.on(
				"userLeft",
				(data: { user: { username: string } }) => {
					console.log(data);
					const leaveNotification: Message = {
						id: crypto.randomUUID(),
						user: "System",
						text: `${data.user} left the room`,
						type: "notification",
					};
					console.log(leaveNotification);
					setMessages((prev) => [...prev, leaveNotification]);
				}
			);

			return () => {
				socketInstance?.off("userJoined");
				socketInstance?.off("userLeft");
				socketInstance?.off("message");
				console.log("Cleaned up listeners for socket");
			};
		};

		initializeChat();
	}, []);

	const sendMessage = async () => {
		if (input.trim() && socket && userName) {
			console.log(messages);

			const newMessage: Message = {
				id: crypto.randomUUID(),
				user: userName, // Use the stored userName instead of calling checkUserAuthentication again
				text: input.trim(),
				type: "message",
			};
			socket.emit("message", newMessage);
			setInput("");
		}
	};

	return (
		<div className="flex flex-col max-w-md mx-auto mt-10 border rounded-lg shadow-lg p-4 bg-white">
			<div className="h-64 overflow-y-auto p-2 border-b">
				{messages.map((msg) => (
					<div
						key={msg.id}
						className={`mb-2 ${
							msg.type === "notification"
								? "text-center text-gray-500 italic text-sm"
								: ""
						}`}
					>
						{msg.type === "notification" ? (
							<span>{msg.text}</span>
						) : (
							<>
								<span className="font-bold">{msg.user}: </span>
								<span>{msg.text}</span>
							</>
						)}
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
