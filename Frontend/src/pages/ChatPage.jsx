import { useEffect, useState } from "react";
import ChatBox from "../components/ChatBox.jsx";
import Sidebar from "../components/Sidebar.jsx";
import UserFriend from "../components/UserFirend.jsx";
// import axios from "axios";
import axios from "../utils/axios";

const ChatPage = () => {
  const [selectedChat, setSelectedChat] = useState(null);
  const [search, setSearch] = useState("");
  const [user, setUser] = useState(null);

  useEffect(() => {
    const fetchMe = async () => {
      try {
        const res = await axios.get("http://localhost:5000/api/auth/me", {
          withCredentials: true,
        });
        setUser(res.data.user);
      } catch (error) {
        console.log(error);
      }
    };

    fetchMe();
  }, []);

  const chatUser = selectedChat?.users?.find(
    (u) => u?._id && user?._id && u._id !== user._id,
  );
  return (
    <div className="h-screen bg-gradient-to-br from-purple-900 via-indigo-900 to-black text-white flex">
      {/* Sidebar */}
      <div className="w-1/4 border-r border-white/10 p-4 overflow-auto">
        <Sidebar search={search} setSearch={setSearch} />
        {/* show all user  */}
        <div className="mt-4 space-y-3">
          {/* <UserFriend search={search} setSelectedChat={setSelectedChat} /> */}
          <UserFriend
            setSelectedChat={setSelectedChat}
            selectedChat={selectedChat}
            user={user}
            search={search} // 🔥 pass search
          />
        </div>
      </div>

      {/* Chat Section */}
      <div className="w-2/4 flex flex-col justify-between p-4">
        <ChatBox user={user} selectedChat={selectedChat} />
      </div>

      {/* Profile */}
      <div className="w-1/4 border-l border-white/10 p-4">
        <div className="flex flex-col items-center">
          <div className=" rounded-full overflow-hidden">
            <div className="rounded-full overflow-hidden ">
              <img
                src={
                  chatUser?.ProfilePic ||
                  "https://dummyimage.com/50x50/ccc/000.png&text=U"
                }
                className="w-30 h-30 rounded-full"
              />
            </div>
          </div>
          <h2 className="mt-3 text-xl font-bold">
            {chatUser?.FullName || "Loading..."}
          </h2>
          <p className="text-green-400">Online</p>
        </div>

        <div className="mt-6">
          <h3 className="font-semibold mb-2">About</h3>
          <p className="text-sm text-gray-300">
            {chatUser?.Bio || "No information available"}
          </p>
        </div>

        {/* add ai assistant section here */}
        {/* <div className="mt-6">
          <h3 className="font-semibold mb-2">AI Assistant</h3>
          <div className="grid grid-cols-2 gap-2">
            <button className="bg-white/10 p-2 rounded-lg">Replies</button>
            <button className="bg-white/10 p-2 rounded-lg">Summaries</button>
            <button className="bg-white/10 p-2 rounded-lg col-span-2">
              Talk to AI
            </button>
          </div>
        </div> */}
      </div>
    </div>
  );
};

export default ChatPage;
