import { useState, useRef } from "react";
import { useNavigate } from "react-router-dom";
import {
  KeyRound,
  Mail,
  ArrowLeft,
  Loader2,
  ShieldCheck,
  Lock,
  Eye,
  EyeOff,
  CheckCircle2,
  XCircle,
  Timer,
  RefreshCw,
} from "lucide-react";

type Step = "email" | "otp" | "reset" | "success";

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || "http://localhost:8080";

const ForgotPassword = () => {
  const navigate = useNavigate();
  const [step, setStep] = useState<Step>("email");
  const [email, setEmail] = useState("");
  const [otp, setOtp] = useState<string[]>(["", "", "", "", "", ""]);
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const [countdown, setCountdown] = useState(0);
  const [canResend, setCanResend] = useState(false);
  const [shakeError, setShakeError] = useState(false);
  const inputRefs = useRef<(HTMLInputElement | null)[]>([]);

  // Countdown timer
  const startCountdown = () => {
    setCountdown(60);
    setCanResend(false);
    const interval = setInterval(() => {
      setCountdown((prev) => {
        if (prev <= 1) {
          clearInterval(interval);
          setCanResend(true);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
  };

  // STEP 1: Send OTP to email
  const handleSendOtp = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    if (!email) {
      setError("Please enter your email address");
      return;
    }

    setIsLoading(true);
    try {
      const response = await fetch(`${API_BASE_URL}/api/auth/otp/send`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, purpose: "FORGOT_PASSWORD" }),
      });

      if (!response.ok) throw new Error("Failed to send verification code");

      setStep("otp");
      startCountdown();
      setTimeout(() => inputRefs.current[0]?.focus(), 200);
    } catch (err: any) {
      setError(err.message || "Something went wrong. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  // STEP 2: Verify OTP
  const handleVerifyOtp = async (otpCode: string) => {
    if (otpCode.length !== 6) return;

    setIsLoading(true);
    setError("");
    try {
      const response = await fetch(`${API_BASE_URL}/api/auth/otp/verify`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email,
          otp: otpCode,
          purpose: "FORGOT_PASSWORD",
        }),
      });

      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.message || "Invalid verification code");
      }

      setStep("reset");
    } catch (err: any) {
      setError(err.message || "Verification failed. Please try again.");
      setShakeError(true);
      setTimeout(() => setShakeError(false), 600);
      setOtp(["", "", "", "", "", ""]);
      inputRefs.current[0]?.focus();
    } finally {
      setIsLoading(false);
    }
  };

  // STEP 3: Reset Password
  const handleResetPassword = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    if (!newPassword || !confirmPassword) {
      setError("Please fill in both fields");
      return;
    }

    if (newPassword.length < 8) {
      setError("Password must be at least 8 characters");
      return;
    }

    if (newPassword !== confirmPassword) {
      setError("Passwords do not match");
      return;
    }

    setIsLoading(true);
    try {
      const response = await fetch(`${API_BASE_URL}/api/auth/otp/reset-password`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email,
          otp: otp.join(""),
          newPassword,
        }),
      });

      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.message || "Password reset failed");
      }

      setStep("success");
    } catch (err: any) {
      setError(err.message || "Something went wrong. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  // OTP Input handlers
  const handleOtpChange = (index: number, value: string) => {
    if (!/^\d*$/.test(value)) return;
    const newOtp = [...otp];
    newOtp[index] = value.slice(-1);
    setOtp(newOtp);
    setError("");

    if (value && index < 5) inputRefs.current[index + 1]?.focus();

    if (value && index === 5) {
      const fullOtp = newOtp.join("");
      if (fullOtp.length === 6) handleVerifyOtp(fullOtp);
    }
  };

  const handleOtpKeyDown = (index: number, e: React.KeyboardEvent) => {
    if (e.key === "Backspace" && !otp[index] && index > 0) {
      inputRefs.current[index - 1]?.focus();
      const newOtp = [...otp];
      newOtp[index - 1] = "";
      setOtp(newOtp);
    }
    if (e.key === "ArrowLeft" && index > 0)
      inputRefs.current[index - 1]?.focus();
    if (e.key === "ArrowRight" && index < 5)
      inputRefs.current[index + 1]?.focus();
  };

  const handleOtpPaste = (e: React.ClipboardEvent) => {
    e.preventDefault();
    const pastedData = e.clipboardData
      .getData("text")
      .replace(/\D/g, "")
      .slice(0, 6);
    if (!pastedData.length) return;
    const newOtp = [...otp];
    for (let i = 0; i < pastedData.length; i++) newOtp[i] = pastedData[i];
    setOtp(newOtp);
    setError("");
    const focusIndex = Math.min(pastedData.length, 5);
    inputRefs.current[focusIndex]?.focus();
    if (pastedData.length === 6) handleVerifyOtp(pastedData);
  };

  const handleResend = async () => {
    if (!canResend) return;
    setIsLoading(true);
    setError("");
    try {
      await fetch(`${API_BASE_URL}/api/auth/otp/send`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, purpose: "FORGOT_PASSWORD" }),
      });
      startCountdown();
      setOtp(["", "", "", "", "", ""]);
      inputRefs.current[0]?.focus();
    } catch {
      setError("Failed to resend code.");
    } finally {
      setIsLoading(false);
    }
  };

  const maskedEmail = email.replace(/(.{2})(.*)(@.*)/, "$1***$3");

  const getStepIndicator = () => {
    const steps = [
      {
        label: "Email",
        active:
          step === "email" ||
          step === "otp" ||
          step === "reset" ||
          step === "success",
      },
      {
        label: "Verify",
        active: step === "otp" || step === "reset" || step === "success",
      },
      { label: "Reset", active: step === "reset" || step === "success" },
    ];

    return (
      <div className="flex items-center justify-center gap-2 mb-8">
        {steps.map((s, i) => (
          <div key={i} className="flex items-center gap-2">
            <div
              className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold transition-all duration-500
                ${s.active ? "bg-gradient-to-br from-violet-600 to-purple-600 text-white shadow-md shadow-violet-500/25" : "bg-slate-100 text-slate-400"}`}
            >
              {step === "success" ? (
                <CheckCircle2 className="w-4 h-4" />
              ) : (
                i + 1
              )}
            </div>
            {i < 2 && (
              <div
                className={`w-8 h-0.5 transition-all duration-500 ${
                  steps[i + 1].active ? "bg-violet-400" : "bg-slate-200"
                }`}
              />
            )}
          </div>
        ))}
      </div>
    );
  };

  // Password strength indicator
  const getPasswordStrength = () => {
    if (!newPassword) return { level: 0, label: "", color: "" };
    let strength = 0;
    if (newPassword.length >= 8) strength++;
    if (/[A-Z]/.test(newPassword)) strength++;
    if (/[a-z]/.test(newPassword)) strength++;
    if (/[0-9]/.test(newPassword)) strength++;
    if (/[^A-Za-z0-9]/.test(newPassword)) strength++;

    if (strength <= 2)
      return { level: strength, label: "Weak", color: "bg-red-400" };
    if (strength <= 3)
      return { level: strength, label: "Fair", color: "bg-amber-400" };
    if (strength <= 4)
      return { level: strength, label: "Good", color: "bg-blue-400" };
    return { level: strength, label: "Strong", color: "bg-emerald-400" };
  };

  const passwordStrength = getPasswordStrength();

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-violet-50 flex flex-col">
      {/* Back Button */}
      <div className="p-6">
        <button
          className="flex items-center gap-2 text-sm text-slate-600 hover:text-slate-900 transition-colors"
          onClick={() => {
            if (step === "email") navigate(-1);
            else if (step === "otp") setStep("email");
            else if (step === "reset") setStep("otp");
            else navigate("/login");
          }}
        >
          <ArrowLeft className="w-4 h-4" />
          {step === "success" ? "Back to login" : "Back"}
        </button>
      </div>

      <main className="flex-1 flex flex-col items-center justify-center px-6 py-8">
        {/* Icon */}
        <div className="relative mb-6">
          <div
            className="w-20 h-20 rounded-2xl bg-gradient-to-br from-violet-600 to-purple-600 flex items-center justify-center shadow-lg shadow-violet-500/25"
            style={{
              animation:
                step === "success"
                  ? "successPulse 0.6s ease-in-out"
                  : "floatShield 3s ease-in-out infinite",
            }}
          >
            {step === "success" ? (
              <CheckCircle2 className="w-10 h-10 text-white" />
            ) : step === "reset" ? (
              <Lock className="w-10 h-10 text-white" />
            ) : step === "otp" ? (
              <ShieldCheck className="w-10 h-10 text-white" />
            ) : (
              <KeyRound className="w-10 h-10 text-white" />
            )}
          </div>
          <div
            className="absolute -inset-3 rounded-3xl border-2 border-violet-100"
            style={{ animation: "pulseRing 2s ease-in-out infinite" }}
          />
        </div>

        {/* Step Indicator */}
        {getStepIndicator()}

        {/* ============ EMAIL STEP ============ */}
        {step === "email" && (
          <>
            <h1 className="text-2xl md:text-3xl font-bold text-slate-900 text-center mb-2">
              Forgot Password?
            </h1>
            <p className="text-slate-500 text-center mb-8 max-w-sm">
              No worries! Enter your email and we'll send you a verification
              code to reset your password.
            </p>

            <div className="w-full max-w-md">
              <form
                onSubmit={handleSendOtp}
                className="bg-white rounded-2xl border border-slate-200 p-8 shadow-sm"
              >
                <div className="mb-6">
                  <label className="block text-sm font-medium text-slate-700 mb-2">
                    Email Address
                  </label>
                  <div className="relative">
                    <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                    <input
                      type="email"
                      className="w-full pl-12 pr-4 py-3 border border-slate-200 rounded-xl text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-violet-500 focus:border-transparent transition-all"
                      placeholder="you@example.com"
                      value={email}
                      onChange={(e) => {
                        setEmail(e.target.value);
                        setError("");
                      }}
                      autoFocus
                    />
                  </div>
                </div>

                {error && (
                  <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-xl flex items-center gap-2 text-sm text-red-600">
                    <XCircle className="w-4 h-4 flex-shrink-0" />
                    {error}
                  </div>
                )}

                <button
                  type="submit"
                  disabled={isLoading || !email}
                  className="w-full py-3.5 rounded-xl bg-gradient-to-r from-violet-600 to-purple-600 text-white font-semibold transition-all duration-200 flex items-center justify-center gap-2
                    disabled:opacity-40 disabled:cursor-not-allowed
                    hover:shadow-lg shadow-violet-500/25 hover:-translate-y-0.5 active:translate-y-0"
                >
                  {isLoading ? (
                    <>
                      <Loader2 className="w-5 h-5 animate-spin" />
                      Sending code...
                    </>
                  ) : (
                    <>
                      <Mail className="w-5 h-5" />
                      Send Verification Code
                    </>
                  )}
                </button>
              </form>

              <p className="text-center mt-6 text-sm text-slate-500">
                Remember your password?{" "}
                <button
                  onClick={() => navigate("/login")}
                  className="text-violet-600 hover:text-violet-700 font-medium"
                >
                  Sign in
                </button>
              </p>
            </div>
          </>
        )}

        {/* ============ OTP STEP ============ */}
        {step === "otp" && (
          <>
            <h1 className="text-2xl md:text-3xl font-bold text-slate-900 text-center mb-2">
              Enter Verification Code
            </h1>
            <p className="text-slate-500 text-center mb-2 max-w-sm">
              We sent a 6-digit code to
            </p>
            <div className="flex items-center gap-2 mb-8">
              <Mail className="w-4 h-4 text-violet-600" />
              <span className="text-sm font-medium text-violet-600">
                {maskedEmail}
              </span>
            </div>

            <div
              className={`w-full max-w-md transition-transform duration-300 ${shakeError ? "animate-shake" : ""}`}
            >
              <div className="bg-white rounded-2xl border border-slate-200 p-8 shadow-sm">
                {/* OTP Inputs */}
                <div className="flex justify-center gap-3 mb-6">
                  {otp.map((digit, index) => (
                    <input
                      key={index}
                      ref={(el) => {
                        inputRefs.current[index] = el;
                      }}
                      type="text"
                      inputMode="numeric"
                      maxLength={1}
                      value={digit}
                      onChange={(e) => handleOtpChange(index, e.target.value)}
                      onKeyDown={(e) => handleOtpKeyDown(index, e)}
                      onPaste={index === 0 ? handleOtpPaste : undefined}
                      disabled={isLoading}
                      className={`w-12 h-14 md:w-14 md:h-16 text-center text-xl md:text-2xl font-bold rounded-xl border-2 transition-all duration-200 outline-none
                        ${digit ? "border-violet-500 bg-violet-50" : "border-slate-200 bg-slate-50"}
                        focus:ring-2 focus:ring-violet-500 focus:border-transparent
                        ${isLoading ? "opacity-50 cursor-not-allowed" : "hover:border-slate-300"}
                        text-slate-900`}
                      style={{ caretColor: "transparent" }}
                    />
                  ))}
                </div>

                {error && (
                  <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-xl flex items-center gap-2 text-sm text-red-600 animate-fadeIn">
                    <XCircle className="w-4 h-4 flex-shrink-0" />
                    {error}
                  </div>
                )}

                <button
                  onClick={() => handleVerifyOtp(otp.join(""))}
                  disabled={isLoading || otp.join("").length !== 6}
                  className="w-full py-3.5 rounded-xl bg-gradient-to-r from-violet-600 to-purple-600 text-white font-semibold transition-all duration-200 flex items-center justify-center gap-2
                    disabled:opacity-40 disabled:cursor-not-allowed
                    hover:shadow-lg shadow-violet-500/25 hover:-translate-y-0.5 active:translate-y-0"
                >
                  {isLoading ? (
                    <>
                      <Loader2 className="w-5 h-5 animate-spin" />
                      Verifying...
                    </>
                  ) : (
                    <>
                      <ShieldCheck className="w-5 h-5" />
                      Verify Code
                    </>
                  )}
                </button>

                {/* Resend */}
                <div className="relative my-6">
                  <div className="absolute inset-0 flex items-center">
                    <div className="w-full border-t border-slate-100" />
                  </div>
                  <div className="relative flex justify-center text-xs">
                    <span className="px-4 bg-white text-slate-400">
                      didn't receive the code?
                    </span>
                  </div>
                </div>

                <div className="flex items-center justify-center">
                  {canResend ? (
                    <button
                      onClick={handleResend}
                      disabled={isLoading}
                      className="flex items-center gap-2 text-sm font-medium text-violet-600 hover:underline transition-colors disabled:opacity-50"
                    >
                      <RefreshCw className="w-4 h-4" />
                      Resend Verification Code
                    </button>
                  ) : (
                    <div className="flex items-center gap-2 text-sm text-slate-400">
                      <Timer className="w-4 h-4" />
                      <span>
                        Resend available in{" "}
                        <span className="font-semibold text-violet-500">
                          {countdown}s
                        </span>
                      </span>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </>
        )}

        {/* ============ RESET PASSWORD STEP ============ */}
        {step === "reset" && (
          <>
            <h1 className="text-2xl md:text-3xl font-bold text-slate-900 text-center mb-2">
              Create New Password
            </h1>
            <p className="text-slate-500 text-center mb-8 max-w-sm">
              Your identity has been verified. Choose a strong new password for
              your account.
            </p>

            <div className="w-full max-w-md">
              <form
                onSubmit={handleResetPassword}
                className="bg-white rounded-2xl border border-slate-200 p-8 shadow-sm"
              >
                {/* New Password */}
                <div className="mb-5">
                  <label className="block text-sm font-medium text-slate-700 mb-2">
                    New Password
                  </label>
                  <div className="relative">
                    <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                    <input
                      type={showPassword ? "text" : "password"}
                      className="w-full pl-12 pr-12 py-3 border border-slate-200 rounded-xl text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-violet-500 focus:border-transparent transition-all"
                      placeholder="Min. 8 characters"
                      value={newPassword}
                      onChange={(e) => {
                        setNewPassword(e.target.value);
                        setError("");
                      }}
                      autoFocus
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
                  {/* Password Strength Bar */}
                  {newPassword && (
                    <div className="mt-3">
                      <div className="flex gap-1 mb-1">
                        {[1, 2, 3, 4, 5].map((i) => (
                          <div
                            key={i}
                            className={`h-1.5 flex-1 rounded-full transition-all duration-300 ${
                              i <= passwordStrength.level
                                ? passwordStrength.color
                                : "bg-slate-100"
                            }`}
                          />
                        ))}
                      </div>
                      <p className="text-xs text-slate-500">
                        Strength:{" "}
                        <span className="font-medium">
                          {passwordStrength.label}
                        </span>
                      </p>
                    </div>
                  )}
                </div>

                {/* Confirm Password */}
                <div className="mb-6">
                  <label className="block text-sm font-medium text-slate-700 mb-2">
                    Confirm Password
                  </label>
                  <div className="relative">
                    <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                    <input
                      type={showConfirm ? "text" : "password"}
                      className={`w-full pl-12 pr-12 py-3 border rounded-xl text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-violet-500 focus:border-transparent transition-all
                        ${confirmPassword && confirmPassword !== newPassword ? "border-red-300 bg-red-50/50" : "border-slate-200"}`}
                      placeholder="Re-enter your password"
                      value={confirmPassword}
                      onChange={(e) => {
                        setConfirmPassword(e.target.value);
                        setError("");
                      }}
                    />
                    <button
                      type="button"
                      className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
                      onClick={() => setShowConfirm(!showConfirm)}
                    >
                      {showConfirm ? (
                        <EyeOff className="w-5 h-5" />
                      ) : (
                        <Eye className="w-5 h-5" />
                      )}
                    </button>
                  </div>
                  {confirmPassword && confirmPassword !== newPassword && (
                    <p className="mt-2 text-xs text-red-500 flex items-center gap-1">
                      <XCircle className="w-3 h-3" />
                      Passwords do not match
                    </p>
                  )}
                  {confirmPassword && confirmPassword === newPassword && (
                    <p className="mt-2 text-xs text-emerald-500 flex items-center gap-1">
                      <CheckCircle2 className="w-3 h-3" />
                      Passwords match
                    </p>
                  )}
                </div>

                {error && (
                  <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-xl flex items-center gap-2 text-sm text-red-600">
                    <XCircle className="w-4 h-4 flex-shrink-0" />
                    {error}
                  </div>
                )}

                <button
                  type="submit"
                  disabled={
                    isLoading ||
                    !newPassword ||
                    !confirmPassword ||
                    newPassword !== confirmPassword
                  }
                  className="w-full py-3.5 rounded-xl bg-gradient-to-r from-violet-600 to-purple-600 text-white font-semibold transition-all duration-200 flex items-center justify-center gap-2
                    disabled:opacity-40 disabled:cursor-not-allowed
                    hover:shadow-lg shadow-violet-500/25 hover:-translate-y-0.5 active:translate-y-0"
                >
                  {isLoading ? (
                    <>
                      <Loader2 className="w-5 h-5 animate-spin" />
                      Resetting password...
                    </>
                  ) : (
                    <>
                      <KeyRound className="w-5 h-5" />
                      Reset Password
                    </>
                  )}
                </button>
              </form>
            </div>
          </>
        )}

        {/* ============ SUCCESS STEP ============ */}
        {step === "success" && (
          <>
            <h1 className="text-2xl md:text-3xl font-bold text-slate-900 text-center mb-2">
              Password Reset Successfully!
            </h1>
            <p className="text-slate-500 text-center mb-8 max-w-sm">
              Your password has been updated. You can now sign in with your new
              password.
            </p>

            <div className="w-full max-w-md">
              <div className="bg-white rounded-2xl border border-slate-200 p-8 shadow-sm text-center">
                <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-emerald-50 flex items-center justify-center">
                  <CheckCircle2 className="w-8 h-8 text-emerald-600" />
                </div>
                <p className="text-slate-600 mb-6">
                  Your account is secure. You'll be redirected to the login
                  page.
                </p>
                <button
                  onClick={() => navigate("/login")}
                  className="w-full py-3.5 rounded-xl bg-gradient-to-r from-violet-600 to-purple-600 text-white font-semibold transition-all duration-200 flex items-center justify-center gap-2
                    hover:shadow-lg shadow-violet-500/25 hover:-translate-y-0.5 active:translate-y-0"
                >
                  <ArrowLeft className="w-5 h-5" />
                  Back to Sign In
                </button>
              </div>
            </div>
          </>
        )}
      </main>

      {/* Animations */}
      <style>{`
        @keyframes floatShield {
          0%, 100% { transform: translateY(0); }
          50% { transform: translateY(-6px); }
        }
        @keyframes successPulse {
          0% { transform: scale(1); }
          50% { transform: scale(1.15); }
          100% { transform: scale(1); }
        }
        @keyframes pulseRing {
          0%, 100% { opacity: 0.4; transform: scale(1); }
          50% { opacity: 0.15; transform: scale(1.05); }
        }
        .animate-shake {
          animation: shake 0.5s ease-in-out;
        }
        @keyframes shake {
          0%, 100% { transform: translateX(0); }
          10%, 50%, 90% { transform: translateX(-4px); }
          30%, 70% { transform: translateX(4px); }
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

export default ForgotPassword;
