import axios from "axios";
import { useState } from "react";
import { useNavigate } from "react-router-dom";

const ResetPage = () => {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setpassword] = useState("");
  // const
  // const [form,setForm]=useState({
  //   email:"",
  //   password:""
  // })

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const res = await axios.post("http://localhost:5000/api/auth/forget", {
        email,
        password,
      });
      alert(res.data.message);
      // console.log(res);
      navigate("/login");
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <div className="flex justify-center items-center h-screen bg-gray-100">
      <form
        onSubmit={handleSubmit}
        className="bg-white p-6 rounded-lg shadow-md w-80"
      >
        <h2 className="text-xl font-bold mb-4 text-center">
          Forgot Password 🔐
        </h2>
        {/* email  */}
        <label>Email</label>
        <input
          type="email"
          placeholder="Enter your email"
          className="w-full p-2 border rounded mb-4"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />
        {/* new password  */}
        <label>New Password</label>
        <input
          type="password"
          placeholder="Enter your New Password"
          className="w-full p-2 border rounded mb-4"
          value={password || ""}
          onChange={(e) => setpassword(e.target.value)}
          required
        />

        <button
          type="submit"
          className="w-full bg-indigo-600 text-white p-2 rounded hover:bg-indigo-500"
        >
          Reset Password
        </button>
      </form>
    </div>
  );
};

export default ResetPage;
