import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

const RequireOnboarding = ({ children }) => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // console.log("Before API call:", document.cookie);
    const checkUser = async () => {
      try {
        const res = await axios.get("http://localhost:5000/api/auth/me", {
          withCredentials: true,
        });

        if (!res.data.user.isOnboarded) {
          navigate("/onboard");
        }

        setLoading(false); // ✅ always run
      } catch (error) {
        console.log(error);

        if (error.response?.status === 401) {
          navigate("/login"); // only if not logged in
        } else {
          alert("Server error");
        }

        setLoading(false); // ✅ important
      }
    };

    checkUser();
  }, [navigate]); // ✅ add dependency

  if (loading) return <div>Loading...</div>;

  return children;
};

export default RequireOnboarding;
