import axios from "axios";
import { useEffect, useState } from "react";

const UserFriend = ({ setSelectedChat, selectedChat, user, search }) => {
  const [users, setUsers] = useState([]);
  const [loadingChat, setLoadingChat] = useState(false);

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const res = await axios.get("http://localhost:5000/api/user/users", {
          withCredentials: true,
        });
        setUsers(res.data);
      } catch (error) {
        console.log(error);
      }
    };

    fetchUsers();
  }, []);

  // 🔥 FILTER USERS
  const filteredUsers = users.filter((u) =>
    u.FullName.toLowerCase().includes(search.toLowerCase()),
  );

  // 🔥 SELECT USER
  const handleSelectUser = async (selectedUser) => {
    if (loadingChat) return;

    try {
      setLoadingChat(true);

      const res = await axios.post(
        "http://localhost:5000/api/chat",
        { userId: selectedUser._id },
        { withCredentials: true },
      );

      setSelectedChat(res.data);
    } catch (error) {
      console.log(error);
    } finally {
      setLoadingChat(false);
    }
  };

  return (
    <div className="flex flex-col gap-2">
      {/* No Result */}
      {filteredUsers.length === 0 && (
        <p className="text-gray-400 text-sm">No users found</p>
      )}

      {filteredUsers.map((u) => {
        const isSelected =
          selectedChat?.users?.find((chatUser) => chatUser._id !== user?._id)
            ?._id === u._id;

        return (
          <div
            key={u._id}
            onClick={() => handleSelectUser(u)}
            className={`flex items-center gap-3 p-2 rounded-lg cursor-pointer transition
              ${isSelected ? "bg-white/20" : "hover:bg-white/10"}`}
          >
            <img
              src={
                u?.ProfilePic ||
                "https://dummyimage.com/50x50/ccc/000.png&text=U"
              }
              className="w-10 h-10 rounded-full"
            />

            <h3>{u.FullName}</h3>
          </div>
        );
      })}
    </div>
  );
};

export default UserFriend;
