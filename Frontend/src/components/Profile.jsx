import axios from "axios";
import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

const Profile = () => {
  const [user, setUser] = useState(null);
  const navigate = useNavigate();

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

  if (!user)
    return <div className="text-center mt-10 text-gray-500">Loading...</div>;

  return (
    <div className="min-h-screen flex justify-center items-center bg-gradient-to-r from-indigo-500 to-purple-600">
      <div className="bg-white rounded-2xl shadow-xl p-6 w-80 text-center">
        {/* go back to home page    */}
        <button
          className="absolute left-128 top-50 text-gray-500 hover:text-gray-700 transition "
          onClick={() => navigate("/")}
        >
          <img
            src="left-arrow.png"
            alt="Back"
            className="h-10 w-10 cursor-pointer "
          />
        </button>
        {/* Profile Image */}
        <img
          src={
            user.ProfilePic
              ? user.ProfilePic.startsWith("http")
                ? user.ProfilePic
                : `http://localhost:5000${user.ProfilePic}`
              : "https://dummyimage.com/100x100"
          }
          alt="profile"
          className="w-24 h-24 mx-auto rounded-full object-cover border-4 border-indigo-500"
        />

        {/* Name */}
        <h2 className="text-xl font-bold mt-3">{user.FullName}</h2>

        {/* Bio */}
        <p className="text-gray-500 text-sm mt-1">
          {user.Bio || "No bio added"}
        </p>

        {/* Info */}
        <div className="mt-4 text-sm text-gray-700 space-y-1">
          <p>📧 {user.email}</p>
          <p>📱 {user.PhoneNo}</p>
          <p>📍 {user.City}</p>
        </div>

        {/* Button */}
        <button
          className="mt-5 w-full bg-indigo-600 text-white py-2 rounded-lg hover:bg-indigo-500 transition cursor-pointer"
          onClick={() => navigate("/edit-profile")}
        >
          Edit Profile
        </button>
      </div>
    </div>
  );
};

export default Profile;
