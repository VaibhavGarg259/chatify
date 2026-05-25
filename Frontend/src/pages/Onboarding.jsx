import axios from "axios";
import React, { useState } from "react";
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";

const Onboarding = () => {
  const [preview, setPreview] = useState("");
  const [bio, setBio] = useState("");
  const [city, setCity] = useState("");
  const [ProfilePic, setProfilePic] = useState(null);
  const navigate = useNavigate();

  const handleImage = (e) => {
    const file = e.target.files[0];
    if (file) {
      setProfilePic(file);
      setPreview(URL.createObjectURL(file));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    // console.log("Selected File:", ProfilePic);
    const Data = new FormData();
    Data.append("profilePic", ProfilePic);
    Data.append("bio", bio);
    Data.append("city", city);
    // Data.append("preview", preview);

    try {
      const res = await axios.post(
        "http://localhost:5000/api/auth/onboard",
        Data,
        {
          withCredentials: true, // 🔥 IMPORTANT
        },
      );
      
      alert(res.data.message);
      navigate("/");
    } catch (error) {
      console.log(error);
      alert(error.response?.data?.message || "Something went wrong");
    }
  };

  return (
    <div className="flex justify-center items-center h-screen bg-gradient-to-r from-indigo-500 to-purple-500">
      <form
        onSubmit={handleSubmit}
        // onSubmit={handleSubmit}
        className="bg-white p-8 rounded-xl shadow-lg w-96"
      >
        <h2 className="text-2xl font-bold text-center mb-6">
          Complete Your Profile
        </h2>

        {/* Profile Pic */}
        <div className="flex justify-center ">
          <div className="relative">
            {/* Circle Profile */}
            <div className=" rounded-full overflow-hidden">
              <img
                src={
                  preview ||
                  "https://cdn-icons-png.flaticon.com/512/149/149071.png"
                }
                alt="profile"
                className="h-32"
              />
            </div>

            {/* Camera Icon Button */}
            <label className="absolute bottom-2 right-2 bg-white p-2 rounded-full shadow cursor-pointer">
              📷
              <input type="file" className="hidden" onChange={handleImage} />
            </label>
          </div>
        </div>

        {/* Bio */}
        <div className="mb-4">
          <label className="block mb-2 font-medium">Bio</label>
          <textarea
            name="bio"
            placeholder="Write something about you..."
            value={bio}
            onChange={(e) => setBio(e.target.value)}
            className="w-full p-2 border rounded"
          />
        </div>

        {/* City */}
        <div className="mb-4">
          <label className="block mb-2 font-medium">City</label>
          <input
            type="text"
            name="city"
            placeholder="Enter your city"
            value={city}
            onChange={(e) => setCity(e.target.value)}
            className="w-full p-2 border rounded"
          />
        </div>

        {/* Submit */}
        <button className="w-full bg-indigo-600 text-white p-2 rounded hover:bg-indigo-500">
          Save Profile
        </button>
      </form>
    </div>
  );
};

export default Onboarding;
