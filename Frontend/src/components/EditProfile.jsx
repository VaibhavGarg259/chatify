import axios from "axios";
import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

const EditProfile = () => {
  const [user, setUser] = useState(null);
  const [FullName, setFullName] = useState("");
  const [Bio, setBio] = useState("");
  const [City, setCity] = useState("");
  const [ProfilePic, setProfilePic] = useState(null);
  const [preview, setPreview] = useState("");

  const navigate = useNavigate();

  useEffect(() => {
    const fetchMe = async () => {
      try {
        const res = await axios.get("http://localhost:5000/api/auth/me", {
          withCredentials: true,
        });

        setUser(res.data.user);
        setFullName(res.data.user.FullName);
        setBio(res.data.user.Bio);
        setCity(res.data.user.City);
        setProfilePic(res.data.user.ProfilePic);
        setPreview(res.data.user.ProfilePic);
      } catch (error) {
        console.log(error);
      }
    };

    fetchMe();
  }, []);

  const handleImage = (e) => {
    const file = e.target.files[0];
    if (file) {
      setProfilePic(file);
      setPreview(URL.createObjectURL(file));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const data = new FormData();
    data.append("FullName", FullName);
    data.append("Bio", Bio);
    data.append("City", City);
    if (ProfilePic) data.append("profilePic", ProfilePic);

    try {
      const res = await axios.put(
        "http://localhost:5000/api/auth/update",
        data,
        { withCredentials: true },
      );

      alert(res.data.message);

      // ✅ UI update
      setUser(res.data.user);

      // ✅ redirect
      navigate("/profile");
    } catch (error) {
      console.log(error);
      alert("Update failed");
    }
  };

  if (!user) return <p className="text-center mt-10">Loading...</p>;

  return (
    <div className="flex justify-center items-center min-h-screen bg-gray-100">
      <form
        onSubmit={handleSubmit}
        className="bg-white p-6 rounded-xl shadow-lg w-80 space-y-4"
      >
        <h2 className="text-xl font-bold text-center">Edit Profile</h2>

        {/* Profile Image Preview */}
        <div className="flex justify-center">
          <div className="relative">
            <div className=" rounded-full overflow-hidden">
              <img
                src={
                  preview ||
                  (user.ProfilePic
                    ? `http://localhost:5000${user.ProfilePic}`
                    : "https://dummyimage.com/100x100")
                }
                className="w-20 h-20 rounded-full object-cover"
              />
            </div>

            {/* Image Upload */}
            <label className="absolute top-12 left-14 bg-white p-2 rounded-full shadow cursor-pointer">
              📷
              <input type="file" className="hidden" onChange={handleImage} />
            </label>
          </div>
        </div>

        {/* Image Upload */}
        {/* <label className="absolute bottom-2 right-2 bg-white p-2 rounded-full shadow cursor-pointer">
          📷
          <input type="file" className="hidden" onChange={handleImage} />
        </label> */}
        {/* <input
          type="file"
          onChange={(e) => {
            const file = e.target.files[0];
            setProfilePic(file);
            setPreview(URL.createObjectURL(file));
          }}
        /> */}

        {/* Name */}
        <input
          value={FullName}
          onChange={(e) => setFullName(e.target.value)}
          className="w-full p-2 border rounded"
          placeholder="Full Name"
        />

        {/* Bio */}
        <textarea
          value={Bio}
          onChange={(e) => setBio(e.target.value)}
          className="w-full p-2 border rounded"
          placeholder="Bio"
        />

        {/* City */}
        <input
          value={City}
          onChange={(e) => setCity(e.target.value)}
          className="w-full p-2 border rounded"
          placeholder="City"
        />

        <button className="w-full bg-indigo-600 text-white py-2 rounded hover:bg-indigo-500">
          Save Changes
        </button>
      </form>
    </div>
  );
};

export default EditProfile;
