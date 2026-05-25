import { BrowserRouter, Navigate, Route, Routes } from "react-router-dom";
import { ChatProvider } from "./context/ChatContext";
import Login from "./pages/Login";
import ChatPage from "./pages/ChatPage";
import Signup from "./pages/Signup";
import ResetPage from "./components/ResetPage.jsx";
import Onboarding from "./pages/Onboarding.jsx";
import ProtectRouter from "./components/ProtectRouter.jsx";
// import axios from "axios";
import RequireOnboarding from "./components/RequireOnboarding.jsx";
import Profile from "./components/Profile.jsx";
import EditProfile from "./components/EditProfile.jsx";
import axios from "axios";
import { useEffect } from "react";

function App() {
  axios.defaults.withCredentials = true;

  // useEffect(() => {
  //   console.log("Cookies on load:", document.cookie);
  // }, []);

  return (
    <ChatProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/signup" element={<Signup />} />
          <Route path="/login" element={<Login />} />
          {/* <Route path="/profile" element={<Profile />} />
          <Route path="/edit-profile" element={<EditProfile />} /> */}
          <Route
            path="/profile"
            element={
              <ProtectRouter>
                <Profile />
              </ProtectRouter>
            }
          />

          <Route
            path="/edit-profile"
            element={
              <ProtectRouter>
                <EditProfile />
              </ProtectRouter>
            }
          />
          <Route
            path="/"
            element={
              <RequireOnboarding>
                <ChatPage />
              </RequireOnboarding>
            }
          />

          <Route path="/forgot" element={<ResetPage />} />
          <Route
            path="/onboard"
            element={
              <ProtectRouter>
                <Onboarding />
              </ProtectRouter>
            }
          />
        </Routes>
      </BrowserRouter>
    </ChatProvider>
  );
}

export default App;
