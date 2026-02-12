import { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  Stethoscope,
  Mail,
  Lock,
  Eye,
  EyeOff,
  ArrowLeft,
  Loader2,
  Shield,
  Building2,
} from "lucide-react";

const ExpertLogin = () => {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [licenseId, setLicenseId] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    if (!email || !password) {
      setError("Please fill in all required fields");
      return;
    }

    setIsLoading(true);

    try {
      const response = await fetch("/api/auth/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email,
          password,
          role: "DERMATOLOGIST",
        }),
      });

      if (!response.ok) {
        const errorData = await response.text();
        throw new Error(errorData || "Login failed");
      }

      const data = await response.json();
      localStorage.setItem("token", data.jwt);
      localStorage.setItem("userId", data.id);
      localStorage.setItem("role", data.role);
      navigate("/dashboard/expert");
    } catch (err: any) {
      setError(err.message || "Login failed. Please check your credentials.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-blue-50 flex flex-col">
      {/* Back Button */}
      <div className="p-6">
        <button
          className="flex items-center gap-2 text-sm text-slate-600 hover:text-slate-900 transition-colors"
          onClick={() => navigate("/login")}
        >
          <ArrowLeft className="w-4 h-4" />
          Back to selection
        </button>
      </div>

      {/* Main Content */}
      <main className="flex-1 flex flex-col items-center justify-center px-6 py-8">
        {/* Logo */}
        <div className="flex items-center gap-3 mb-8">
          <div className="w-14 h-14 bg-blue-600 rounded-2xl flex items-center justify-center">
            <Stethoscope className="w-8 h-8 text-white" />
          </div>
        </div>

        {/* Title */}
        <h1 className="text-2xl md:text-3xl font-bold text-slate-900 text-center mb-2">
          Expert User Login
        </h1>
        <p className="text-slate-600 text-center mb-2">
          Access AI formulation studio and advanced clinical insights
        </p>
        <div className="flex items-center gap-2 mb-8">
          <Shield className="w-4 h-4 text-emerald-600" />
          <span className="text-sm text-emerald-600">
            Professional Access Required
          </span>
        </div>

        {/* Login Form */}
        <div className="w-full max-w-md">
          <form
            onSubmit={handleLogin}
            className="bg-white rounded-2xl border border-slate-200 p-8 shadow-sm"
          >
            {/* Email Field */}
            <div className="mb-5">
              <label className="block text-sm font-medium text-slate-700 mb-2">
                Professional Email *
              </label>
              <div className="relative">
                <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                <input
                  type="email"
                  className="w-full pl-12 pr-4 py-3 border border-slate-200 rounded-xl text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                  placeholder="you@institution.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
              </div>
            </div>

            {/* Password Field */}
            <div className="mb-5">
              <label className="block text-sm font-medium text-slate-700 mb-2">
                Password *
              </label>
              <div className="relative">
                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                <input
                  type={showPassword ? "text" : "password"}
                  className="w-full pl-12 pr-12 py-3 border border-slate-200 rounded-xl text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                  placeholder="Enter your password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                />
                <button
                  type="button"
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
                  onClick={() => setShowPassword(!showPassword)}
                >
                  {showPassword ? (
                    <EyeOff className="w-5 h-5" />
                  ) : (
                    <Eye className="w-5 h-5" />
                  )}
                </button>
              </div>
            </div>

            {/* License ID Field */}
            <div className="mb-6">
              <label className="block text-sm font-medium text-slate-700 mb-2">
                Professional License ID{" "}
                <span className="text-slate-400">(Optional)</span>
              </label>
              <div className="relative">
                <Building2 className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                <input
                  type="text"
                  className="w-full pl-12 pr-4 py-3 border border-slate-200 rounded-xl text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                  placeholder="e.g., DERM-2024-XXXXX"
                  value={licenseId}
                  onChange={(e) => setLicenseId(e.target.value)}
                />
              </div>
              <p className="mt-2 text-xs text-slate-400">
                Adding your license unlocks additional regulatory features
              </p>
            </div>

            {/* Error Message */}
            {error && (
              <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg text-sm text-red-600">
                {error}
              </div>
            )}

            {/* Remember & Forgot */}
            <div className="flex items-center justify-between mb-6">
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  className="w-4 h-4 rounded border-slate-300 text-blue-600 focus:ring-blue-500"
                />
                <span className="text-sm text-slate-600">
                  Remember this device
                </span>
              </label>
              <a
                href="#forgot"
                className="text-sm text-blue-600 hover:text-blue-700"
              >
                Forgot password?
              </a>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={isLoading}
              className="w-full py-3 rounded-xl bg-slate-900 text-white font-semibold hover:bg-slate-800 transition-all flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isLoading ? (
                <>
                  <Loader2 className="w-5 h-5 animate-spin" />
                  Verifying credentials...
                </>
              ) : (
                "Access Professional Portal"
              )}
            </button>

            {/* SSO Options */}
            <div className="relative my-6">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-slate-200"></div>
              </div>
              <div className="relative flex justify-center text-sm">
                <span className="px-4 bg-white text-slate-500">
                  or use institutional SSO
                </span>
              </div>
            </div>

            <button
              type="button"
              className="w-full py-3 px-4 border border-slate-200 rounded-xl text-sm font-medium text-slate-700 hover:bg-slate-50 transition-all flex items-center justify-center gap-2"
            >
              <Building2 className="w-5 h-5" />
              Sign in with Institutional Account
            </button>
          </form>

          {/* Request Access Link */}
          <div className="text-center mt-6">
            <p className="text-sm text-slate-600 mb-2">
              Need professional access?
            </p>
            <a
              href="#request"
              className="text-blue-600 hover:text-blue-700 font-medium text-sm"
            >
              Request Expert Account →
            </a>
          </div>

          {/* Security Notice */}
          <div className="mt-8 flex items-center justify-center gap-2 text-xs text-slate-400">
            <Shield className="w-4 h-4" />
            <span>256-bit SSL encryption • HIPAA compliant</span>
          </div>
        </div>
      </main>
    </div>
  );
};

export default ExpertLogin;
