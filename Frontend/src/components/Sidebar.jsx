import { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const Sidebar = ({ search, setSearch }) => {
  const [user, setUser] = useState(null);
  const navigate = useNavigate();
  // const [user, setUser] = useState(null);
  // const [search, setSearch] = useState("");

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

  return (
    <div className="flex gap-4 w-full">
      <div>
        <img
          src={
            user?.ProfilePic ||
            "https://dummyimage.com/50x50/ccc/000.png&text=U"
          }
          alt="profile"
          onClick={() => navigate("/profile")}
          className="w-10 h-10 rounded-full object-cover cursor-pointer"
        />
      </div>

      <div className="w-full">
        <input
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-full p-2 rounded-lg bg-white/10 placeholder-gray-300"
          placeholder="Search"
        />
      </div>
    </div>
  );
};

export default Sidebar;
