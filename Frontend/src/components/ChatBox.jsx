import React, { useEffect, useState } from "react";
import socket from "../Socket/Socket";
import axios from "axios";

const ChatBox = ({ user, selectedChat }) => {
  const [message, setMessage] = useState("");
  const [messages, setMessages] = useState([]);

  // ✅ 1. setup socket once
  useEffect(() => {
    if (!user) return;
    socket.emit("setup", user);
  }, [user]);

  // ✅ 2. fetch messages + join chat
  useEffect(() => {
    // console.log("Selected chat:", selectedChat);
    if (!selectedChat) return;

    const fetchMessages = async () => {
      try {
        const res = await axios.get(
          `http://localhost:5000/api/message/${selectedChat._id}`,
          { withCredentials: true },
        );

        setMessages(res.data);
      } catch (error) {
        console.log(error);
      }
    };

    setMessages([]); // clear old messages
    fetchMessages();

    socket.emit("join chat", selectedChat._id);
  }, [selectedChat]);

  // ✅ 3. receive messages (only current chat)
  useEffect(() => {
    socket.on("message received", (newMessage) => {
      if (selectedChat?._id === newMessage.chat._id) {
        setMessages((prev) => [...prev, newMessage]);
      }
    });

    return () => socket.off("message received");
  }, [selectedChat]);

  // ✅ 4. send message
  const sendMessage = async () => {
    if (!message.trim()) return;

    try {
      const res = await axios.post(
        "http://localhost:5000/api/message",
        {
          content: message,
          chatId: selectedChat._id,
        },
        { withCredentials: true },
      );

      // emit realtime
      socket.emit("new message", res.data);

      // update UI
      setMessages((prev) => [...prev, res.data]);
      setMessage("");
    } catch (error) {
      console.log(error);
    }
  };

  // ✅ 5. other user (chat header)
  // const chatUser = selectedChat?.users?.find((u) => u._id !== user._id);
  const chatUser = selectedChat?.users?.find(
    (u) => u?._id && user?._id && u._id !== user._id,
  );
  // console.log("Selected user:", chatUser);
  // console.log("selectedChat:", selectedChat);
  // console.log("users:", selectedChat?.users);
  // console.log("current user:", user);

  return (
    <div className="w-full flex flex-col h-full rounded-lg">
      {/* 🔥 Header */}
      <div className="flex items-center gap-3 border-b w-full pb-4 top-0">
        <img
          src={
            chatUser?.ProfilePic ||
            "https://dummyimage.com/50x50/ccc/000.png&text=U"
          }
          className="w-10 h-10 rounded-full"
        />
        {/* <h1 className="font-semibold">{chatUser?.FullName || "User"}</h1> */}
        <h1>{chatUser?.FullName || "Loading..."}</h1>
      </div>

      {/* 🔥 Messages */}
      <div className="flex-1 overflow-y-auto p-3 space-y-3 hide-scrollbar ">
        {messages.map((msg, i) => (
          <div
            key={i}
            className={`p-3 rounded-xl max-w-xs ${
              msg?.sender?._id === user?._id
                ? "bg-blue-500 ml-auto"
                : "bg-gray-700"
            }`}
          >
            {msg?.content}
          </div>
        ))}
      </div>

      {/* 🔥 Input */}
      <div className="flex gap-2 p-3 bg-gray-800">
        <input
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          className="flex-1 p-2 rounded-lg outline-none"
          placeholder="Type a message..."
        />

        <button
          onClick={sendMessage}
          className="bg-pink-500 px-4 rounded-lg text-white"
        >
          Send
        </button>
      </div>
    </div>
  );
};

export default ChatBox;
