import { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  UserPlus,
  Mail,
  Lock,
  Eye,
  EyeOff,
  ArrowLeft,
  Loader2,
  Phone,
  User,
} from "lucide-react";
import OtpVerification from "../components/OtpVerification";
import { sileo } from "sileo";

type SignupStep = "form" | "otp";

const API_BASE_URL =
  import.meta.env.VITE_API_BASE_URL || "http://localhost:8080";

const UserSignup = () => {
  const navigate = useNavigate();
  const [step, setStep] = useState<SignupStep>("form");

  // Form fields
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [gender, setGender] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({});

  const validate = (): boolean => {
    const errors: Record<string, string> = {};

    if (!name.trim()) errors.name = "Full name is required";
    if (!email.trim()) errors.email = "Email is required";
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email))
      errors.email = "Enter a valid email address";

    if (!phone.trim()) errors.phone = "Phone number is required";
    else if (!/^\d{10}$/.test(phone.replace(/[\s-]/g, "")))
      errors.phone = "Enter a valid 10-digit phone number";

    if (!gender) errors.gender = "Please select your gender";

    if (!password) errors.password = "Password is required";
    else if (password.length < 6)
      errors.password = "Password must be at least 6 characters";

    if (!confirmPassword)
      errors.confirmPassword = "Please confirm your password";
    else if (password !== confirmPassword)
      errors.confirmPassword = "Passwords do not match";

    setFieldErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    if (!validate()) return;

    setIsLoading(true);

    try {
      // Create user — backend generates OTP and sends email automatically
      const response = await fetch(`${API_BASE_URL}/api/user`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          name,
          email,
          password,
          phone: phone.replace(/[\s-]/g, ""),
          gender,
          role: ["USER"],
        }),
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => null);
        throw new Error(errorData?.message || "Signup failed");
      }

      // Move to OTP step
      setStep("otp");
    } catch (err: any) {
      setError(err.message || "Signup failed. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleOtpVerified = () => {
    // OTP verified — user is saved in backend. Redirect to login.
    sileo.success({ title: "Signup successful!" });
    navigate("/login/user", {
      state: { signupSuccess: true },
    });
  };

  // Show OTP verification screen
  if (step === "otp") {
    return (
      <OtpVerification
        email={email}
        purpose="LOGIN_VERIFY"
        onVerified={handleOtpVerified}
        onBack={() => setStep("form")}
        accentColor="blue"
        verifyUrl={`${API_BASE_URL}/api/user/verify-otp`}
      />
    );
  }

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
      <main className="flex-1 flex flex-col items-center justify-center px-6 py-4">
        {/* Logo */}
        <div className="flex items-center gap-3 mb-6">
          <div
            className="w-14 h-14 bg-gradient-to-br from-blue-600 to-indigo-600 rounded-2xl flex items-center justify-center shadow-lg shadow-blue-500/25"
            style={{ animation: "floatIcon 3s ease-in-out infinite" }}
          >
            <UserPlus className="w-8 h-8 text-white" />
          </div>
        </div>

        {/* Title */}
        <h1 className="text-2xl md:text-3xl font-bold text-slate-900 text-center mb-2">
          Create Your Account
        </h1>
        <p className="text-slate-600 text-center mb-6 max-w-md">
          Join our platform to access product analysis and ingredient
          verification tools
        </p>

        {/* Progress Indicator */}
        <div className="flex items-center gap-3 mb-6">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-full bg-blue-600 text-white flex items-center justify-center text-sm font-bold">
              1
            </div>
            <span className="text-sm font-medium text-slate-900">Details</span>
          </div>
          <div className="w-8 h-px bg-slate-300"></div>
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-full bg-slate-200 text-slate-400 flex items-center justify-center text-sm font-bold">
              2
            </div>
            <span className="text-sm text-slate-400">Verify</span>
          </div>
        </div>

        {/* Signup Form */}
        <div className="w-full max-w-lg">
          <form
            onSubmit={handleSignup}
            className="bg-white rounded-2xl border border-slate-200 p-8 shadow-sm"
          >
            {/* Name & Gender Row */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
              {/* Name Field */}
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1.5">
                  Full Name
                </label>
                <div className="relative">
                  <User className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4.5 h-4.5 text-slate-400" />
                  <input
                    type="text"
                    className={`w-full pl-11 pr-4 py-2.5 border ${
                      fieldErrors.name
                        ? "border-red-300 focus:ring-red-500"
                        : "border-slate-200 focus:ring-blue-500"
                    } rounded-xl text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:border-transparent transition-all text-sm`}
                    placeholder="John Doe"
                    value={name}
                    onChange={(e) => {
                      setName(e.target.value);
                      setFieldErrors((p) => ({ ...p, name: "" }));
                    }}
                  />
                </div>
                {fieldErrors.name && (
                  <p className="text-xs text-red-500 mt-1">
                    {fieldErrors.name}
                  </p>
                )}
              </div>

              {/* Gender Field */}
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1.5">
                  Gender
                </label>
                <div className="relative">
                  <select
                    className={`w-full px-4 py-2.5 border ${
                      fieldErrors.gender
                        ? "border-red-300 focus:ring-red-500"
                        : "border-slate-200 focus:ring-blue-500"
                    } rounded-xl text-slate-900 focus:outline-none focus:ring-2 focus:border-transparent transition-all text-sm appearance-none bg-white cursor-pointer ${
                      !gender ? "text-slate-400" : ""
                    }`}
                    value={gender}
                    onChange={(e) => {
                      setGender(e.target.value);
                      setFieldErrors((p) => ({ ...p, gender: "" }));
                    }}
                  >
                    <option value="" disabled>
                      Select gender
                    </option>
                    <option value="Male">Male</option>
                    <option value="Female">Female</option>
                    <option value="Other">Other</option>
                    <option value="Prefer not to say">Prefer not to say</option>
                  </select>
                  {/* Custom dropdown arrow */}
                  <div className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none">
                    <svg
                      className="w-4 h-4 text-slate-400"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M19 9l-7 7-7-7"
                      />
                    </svg>
                  </div>
                </div>
                {fieldErrors.gender && (
                  <p className="text-xs text-red-500 mt-1">
                    {fieldErrors.gender}
                  </p>
                )}
              </div>
            </div>

            {/* Email Field */}
            <div className="mb-4">
              <label className="block text-sm font-medium text-slate-700 mb-1.5">
                Email Address
              </label>
              <div className="relative">
                <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4.5 h-4.5 text-slate-400" />
                <input
                  type="email"
                  className={`w-full pl-11 pr-4 py-2.5 border ${
                    fieldErrors.email
                      ? "border-red-300 focus:ring-red-500"
                      : "border-slate-200 focus:ring-blue-500"
                  } rounded-xl text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:border-transparent transition-all text-sm`}
                  placeholder="you@example.com"
                  value={email}
                  onChange={(e) => {
                    setEmail(e.target.value);
                    setFieldErrors((p) => ({ ...p, email: "" }));
                  }}
                />
              </div>
              {fieldErrors.email && (
                <p className="text-xs text-red-500 mt-1">{fieldErrors.email}</p>
              )}
            </div>

            {/* Phone Field */}
            <div className="mb-4">
              <label className="block text-sm font-medium text-slate-700 mb-1.5">
                Phone Number
              </label>
              <div className="relative">
                <Phone className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4.5 h-4.5 text-slate-400" />
                <input
                  type="tel"
                  className={`w-full pl-11 pr-4 py-2.5 border ${
                    fieldErrors.phone
                      ? "border-red-300 focus:ring-red-500"
                      : "border-slate-200 focus:ring-blue-500"
                  } rounded-xl text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:border-transparent transition-all text-sm`}
                  placeholder="9876543210"
                  value={phone}
                  onChange={(e) => {
                    setPhone(e.target.value);
                    setFieldErrors((p) => ({ ...p, phone: "" }));
                  }}
                />
              </div>
              {fieldErrors.phone && (
                <p className="text-xs text-red-500 mt-1">{fieldErrors.phone}</p>
              )}
            </div>

            {/* Password Fields Row */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-5">
              {/* Password Field */}
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1.5">
                  Password
                </label>
                <div className="relative">
                  <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4.5 h-4.5 text-slate-400" />
                  <input
                    type={showPassword ? "text" : "password"}
                    className={`w-full pl-11 pr-10 py-2.5 border ${
                      fieldErrors.password
                        ? "border-red-300 focus:ring-red-500"
                        : "border-slate-200 focus:ring-blue-500"
                    } rounded-xl text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:border-transparent transition-all text-sm`}
                    placeholder="Min 6 chars"
                    value={password}
                    onChange={(e) => {
                      setPassword(e.target.value);
                      setFieldErrors((p) => ({ ...p, password: "" }));
                    }}
                  />
                  <button
                    type="button"
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
                    onClick={() => setShowPassword(!showPassword)}
                  >
                    {showPassword ? (
                      <EyeOff className="w-4 h-4" />
                    ) : (
                      <Eye className="w-4 h-4" />
                    )}
                  </button>
                </div>
                {fieldErrors.password && (
                  <p className="text-xs text-red-500 mt-1">
                    {fieldErrors.password}
                  </p>
                )}
              </div>

              {/* Confirm Password Field */}
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1.5">
                  Confirm Password
                </label>
                <div className="relative">
                  <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4.5 h-4.5 text-slate-400" />
                  <input
                    type={showConfirmPassword ? "text" : "password"}
                    className={`w-full pl-11 pr-10 py-2.5 border ${
                      fieldErrors.confirmPassword
                        ? "border-red-300 focus:ring-red-500"
                        : "border-slate-200 focus:ring-blue-500"
                    } rounded-xl text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:border-transparent transition-all text-sm`}
                    placeholder="Re-enter password"
                    value={confirmPassword}
                    onChange={(e) => {
                      setConfirmPassword(e.target.value);
                      setFieldErrors((p) => ({ ...p, confirmPassword: "" }));
                    }}
                  />
                  <button
                    type="button"
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  >
                    {showConfirmPassword ? (
                      <EyeOff className="w-4 h-4" />
                    ) : (
                      <Eye className="w-4 h-4" />
                    )}
                  </button>
                </div>
                {fieldErrors.confirmPassword && (
                  <p className="text-xs text-red-500 mt-1">
                    {fieldErrors.confirmPassword}
                  </p>
                )}
              </div>
            </div>

            {/* Password strength indicator */}
            {password && (
              <div className="mb-5">
                <div className="flex gap-1 mb-1">
                  {[1, 2, 3, 4].map((level) => (
                    <div
                      key={level}
                      className={`h-1 flex-1 rounded-full transition-all duration-300 ${
                        password.length >= level * 3
                          ? level <= 1
                            ? "bg-red-400"
                            : level <= 2
                              ? "bg-orange-400"
                              : level <= 3
                                ? "bg-yellow-400"
                                : "bg-emerald-400"
                          : "bg-slate-100"
                      }`}
                    />
                  ))}
                </div>
                <p className="text-xs text-slate-400">
                  {password.length < 6
                    ? "Weak — add more characters"
                    : password.length < 9
                      ? "Fair — could be stronger"
                      : password.length < 12
                        ? "Good — nice password"
                        : "Strong — excellent!"}
                </p>
              </div>
            )}

            {/* Error Message */}
            {error &&
              sileo.error({
                title: "Something went wrong",
                description: error,
              })}

            {/* Submit Button */}
            <button
              type="submit"
              disabled={isLoading}
              className="w-full py-3 rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 text-white font-semibold hover:shadow-lg hover:shadow-blue-500/25 hover:-translate-y-0.5 active:translate-y-0 transition-all flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:translate-y-0 disabled:hover:shadow-none"
            >
              {isLoading ? (
                <></>
              ) : (
                <>
                  <UserPlus className="w-5 h-5" />
                  Create Account & Verify
                </>
              )}
            </button>

            {/* Terms */}
            <p className="text-xs text-slate-400 text-center mt-4 leading-relaxed">
              By creating an account, you agree to our{" "}
              <a href="#terms" className="text-blue-600 hover:underline">
                Terms of Service
              </a>{" "}
              and{" "}
              <a href="#privacy" className="text-blue-600 hover:underline">
                Privacy Policy
              </a>
            </p>
          </form>

          {/* Login Link */}
          <p className="text-center mt-6 text-sm text-slate-600">
            Already have an account?{" "}
            <button
              onClick={() => navigate("/login/user")}
              className="text-blue-600 hover:text-blue-700 font-medium"
            >
              Sign in instead
            </button>
          </p>
        </div>
      </main>

      {/* Animations */}
      <style>{`
        @keyframes floatIcon {
          0%, 100% { transform: translateY(0); }
          50% { transform: translateY(-6px); }
        }
        .animate-fadeIn {
          animation: fadeIn 0.3s ease-in-out;
        }
        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(-4px); }
          to { opacity: 1; transform: translateY(0); }
        }
      `}</style>
    </div>
  );
};

export default UserSignup;
