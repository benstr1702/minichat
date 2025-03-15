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

interface Channel {
	id: string;
	name: string;
	desc: string;
}

let socketInstance: Socket | null = null;

export default function Chat() {
	const [socket, setSocket] = useState<Socket | null>(null);
	const [messages, setMessages] = useState<Message[]>([]);
	const [input, setInput] = useState("");
	const [userName, setUserName] = useState<string | null>(null);
	const [currentChannel, setCurrentChannel] = useState<string>("general");
	const [channelList, setChannelList] = useState<Channel[]>([]);

	useEffect(() => {
		const initializeChat = async () => {
			const user = (await checkUserAuthentication()).chatName;
			setUserName(user);

			let isNewSocket = false;
			if (!socketInstance) {
				socketInstance = io("http://localhost:3000");
				isNewSocket = true;
			}

			console.log(
				`${isNewSocket ? "New" : "Reusing"} socket with ID:`,
				socketInstance.id
			);
			setSocket(socketInstance);

			// Only register listeners if new socket
			if (isNewSocket) {
				socketInstance.on("connect", () => {
					socketInstance?.emit("join", {
						user,
						channel: currentChannel,
					});
					console.log(
						"Emitted join for user:",
						user,
						`To channel: ${currentChannel}`
					);
				});

				socketInstance.on("message", (message: Message) => {
					setMessages((prev) =>
						prev.some((msg) => msg.id === message.id)
							? prev
							: [...prev, message]
					);
				});

				socketInstance.on(
					"availableChannels",
					(availableChannels: Channel[]) => {
						setChannelList(availableChannels);
					}
				);
				socketInstance.on(
					"userJoined",
					(data: { id: string; user: string; channel: string }) => {
						const joinNotification: Message = {
							id: data.id,
							user: "System",
							text: `${data.user} joined the room`,
							type: "notification",
						};
						setMessages((prev) =>
							prev.some((msg) => msg.id === joinNotification.id)
								? prev
								: [...prev, joinNotification]
						);
					}
				);

				socketInstance.on(
					"userLeft",
					(data: { id: string; user: string }) => {
						const leaveNotification: Message = {
							id: data.id,
							user: "System",
							text: `${data.user} left the room`,
							type: "notification",
						};
						setMessages((prev) =>
							prev.some((msg) => msg.id === leaveNotification.id)
								? prev
								: [...prev, leaveNotification]
						);
					}
				);
			}

			return () => {
				if (socketInstance) {
					socketInstance.off("connect");
					socketInstance.off("message");
					socketInstance.off("userJoined");
					socketInstance.off("userLeft");
					console.log("Cleaned up listeners for socket");
				}
			};
		};

		initializeChat();
	}, []);
	const sendMessage = () => {
		if (input.trim() && socket && userName) {
			socket.emit("message", input.trim()); // Send only text; server adds ID and user
			setInput("");
		}
	};
	const switchChannel = (channelId: Channel["id"]) => {
		if (socket && userName && channelId !== currentChannel) {
			socket.emit("join", { user: userName, channel: channelId });
			setCurrentChannel(channelId);
			setMessages([]);
		}
	};

	const handleSwitchButton = (newChannelId: Channel["id"]) => {
		const confirmation = confirm(
			`Are you sure you want to switch channel to ${newChannelId}`
		);
		if (confirmation === true) {
			switchChannel(newChannelId);
			console.log("switched channel");
		} else {
			console.log("cancelled switch");
		}
	};

	return (
		<div className="flex flex-row">
			<div className="w-64 border-2 h-screen bg-slate-200 p-4">
				<h1 className="font-mono m-7 font-medium text-lg text-slate-700">
					Channel List
				</h1>
				<div className="flex flex-col border-2 border-slate-950 rounded p-2 ">
					{channelList.map((channel) => (
						<div
							onClick={() => handleSwitchButton(channel.id)}
							key={channel.id}
							className="group font-mono cursor-pointer hover:bg-white"
						>
							<p className="group">{`#${channel.name}`}</p>
							<span className="hidden font-mono group-hover:block ml-2 ">
								{channel.desc}
							</span>
						</div>
					))}
				</div>
			</div>{" "}
			<div className="flex flex-col max-w-2xl max-h-96 mx-auto mt-10 border rounded-lg shadow-lg p-4 bg-sky">
				<h1 className="self-center font-semibold">{`#${currentChannel}`}</h1>
				<div className="h-96 overflow-y-auto p-2 border-b">
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
									<span className="font-bold">
										{msg.user}:{" "}
									</span>
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
		</div>
	);
}
