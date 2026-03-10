import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import LandingPage from "./pages/LandingPage";
import LoginPage from "./pages/LoginPage";
import UserLogin from "./pages/UserLogin";
import ExpertLogin from "./pages/ExpertLogin";
import UserDashboard from "./pages/UserDashboard";
import ExpertDashboard from "./pages/ExpertDashboard";
import UserProfile from "./pages/UserProfile";
import ExpertProfile from "./pages/ExpertProfile";
import LogoutPage from "./pages/LogoutPage";
import ForgotPassword from "./pages/ForgotPassword";
import UserSignup from "./pages/UserSignup";
import OAuthCallback from "./pages/OAuthCallback";
import "./index.css";

function App() {
  return (
    <Router>
      <Routes>
        {/* Public Pages */}
        <Route path="/" element={<LandingPage />} />

        {/* Login Flow */}
        <Route path="/login" element={<LoginPage />} />
        <Route path="/login/user" element={<UserLogin />} />
        <Route path="/login/expert" element={<ExpertLogin />} />

        {/* OAuth Callback */}
        <Route path="/oauth/callback" element={<OAuthCallback />} />

        {/* Forgot Password */}
        <Route path="/forgot-password" element={<ForgotPassword />} />

        {/* Signup */}
        <Route path="/signup" element={<UserSignup />} />

        {/* Dashboards */}
        <Route path="/dashboard/user" element={<UserDashboard />} />
        <Route path="/dashboard/expert" element={<ExpertDashboard />} />

        {/* Profiles */}
        <Route path="/profile/user" element={<UserProfile />} />
        <Route path="/profile/expert" element={<ExpertProfile />} />

        {/* Logout */}
        <Route path="/logout" element={<LogoutPage />} />
      </Routes>
    </Router>
  );
}

export default App;
