import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

const ProtectRouter = ({ children }) => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const checkUser = async () => {
      try {
        const res = await axios.get("http://localhost:5000/api/auth/me", {
          withCredentials: true,
        });

        setLoading(false);
      } catch (error) {
        navigate("/login");
      }
    };

    checkUser();
  }, []);

  if (loading) return <div>Loading...</div>;

  return children;
};

export default ProtectRouter;
