import { useState, useEffect, useRef, useCallback } from "react";
import {
  ShieldCheck,
  Loader2,
  ArrowLeft,
  RefreshCw,
  Mail,
  CheckCircle2,
  XCircle,
  Timer,
} from "lucide-react";

interface OtpVerificationProps {
  email: string;
  purpose: "LOGIN_VERIFY" | "FORGOT_PASSWORD" | "SIGNUP_VERIFY";
  onVerified: () => void;
  onBack: () => void;
  accentColor?: string; // tailwind color like "blue" or "emerald"
  verifyUrl?: string; // optional custom verify endpoint
}

const API_BASE_URL =
  import.meta.env.VITE_API_BASE_URL || "http://localhost:8080";

const OtpVerification = ({
  email,
  purpose,
  onVerified,
  onBack,
  accentColor = "blue",
  verifyUrl,
}: OtpVerificationProps) => {
  const [otp, setOtp] = useState<string[]>(["", "", "", "", "", ""]);
  const [isVerifying, setIsVerifying] = useState(false);
  const [isResending, setIsResending] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);
  const [countdown, setCountdown] = useState(60);
  const [canResend, setCanResend] = useState(false);
  const [shakeError, setShakeError] = useState(false);
  const inputRefs = useRef<(HTMLInputElement | null)[]>([]);

  // Focus first input on mount
  useEffect(() => {
    inputRefs.current[0]?.focus();
  }, []);

  // Countdown timer
  useEffect(() => {
    if (countdown > 0) {
      const timer = setTimeout(() => setCountdown(countdown - 1), 1000);
      return () => clearTimeout(timer);
    } else {
      setCanResend(true);
    }
  }, [countdown]);

  const handleChange = (index: number, value: string) => {
    if (!/^\d*$/.test(value)) return; // Only digits

    const newOtp = [...otp];
    newOtp[index] = value.slice(-1); // Take last digit
    setOtp(newOtp);
    setError("");

    // Auto-focus next input
    if (value && index < 5) {
      inputRefs.current[index + 1]?.focus();
    }

    // Auto-submit when all 6 digits entered
    if (value && index === 5) {
      const fullOtp = newOtp.join("");
      if (fullOtp.length === 6) {
        handleVerify(fullOtp);
      }
    }
  };

  const handleKeyDown = (index: number, e: React.KeyboardEvent) => {
    if (e.key === "Backspace" && !otp[index] && index > 0) {
      inputRefs.current[index - 1]?.focus();
      const newOtp = [...otp];
      newOtp[index - 1] = "";
      setOtp(newOtp);
    }
    if (e.key === "ArrowLeft" && index > 0) {
      inputRefs.current[index - 1]?.focus();
    }
    if (e.key === "ArrowRight" && index < 5) {
      inputRefs.current[index + 1]?.focus();
    }
  };

  const handlePaste = (e: React.ClipboardEvent) => {
    e.preventDefault();
    const pastedData = e.clipboardData
      .getData("text")
      .replace(/\D/g, "")
      .slice(0, 6);
    if (pastedData.length === 0) return;
    const newOtp = [...otp];
    for (let i = 0; i < pastedData.length; i++) {
      newOtp[i] = pastedData[i];
    }
    setOtp(newOtp);
    setError("");

    const focusIndex = Math.min(pastedData.length, 5);
    inputRefs.current[focusIndex]?.focus();

    if (pastedData.length === 6) {
      handleVerify(pastedData);
    }
  };

  const handleVerify = useCallback(
    async (otpCode: string) => {
      if (otpCode.length !== 6) {
        setError("Please enter the complete 6-digit code");
        return;
      }

      setIsVerifying(true);
      setError("");

      try {
        const response = await fetch(
          verifyUrl || `${API_BASE_URL}/api/auth/otp/verify`,
          {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ email, otp: otpCode, purpose }),
          },
        );

        if (!response.ok) {
          const data = await response.json();
          throw new Error(data.message || "Invalid OTP");
        }

        setSuccess(true);
        setTimeout(() => onVerified(), 1200);
      } catch (err: any) {
        setError(err.message || "Verification failed. Please try again.");
        setShakeError(true);
        setTimeout(() => setShakeError(false), 600);
        // Clear OTP on failed attempt
        setOtp(["", "", "", "", "", ""]);
        inputRefs.current[0]?.focus();
      } finally {
        setIsVerifying(false);
      }
    },
    [email, purpose, onVerified],
  );

  const handleResend = async () => {
    if (!canResend) return;
    setIsResending(true);
    setError("");

    try {
      const response = await fetch(`${API_BASE_URL}/api/auth/otp/send`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, purpose }),
      });

      if (!response.ok) throw new Error("Failed to resend OTP");

      setCountdown(60);
      setCanResend(false);
      setOtp(["", "", "", "", "", ""]);
      inputRefs.current[0]?.focus();
    } catch (err: any) {
      setError("Failed to resend code. Please try again.");
    } finally {
      setIsResending(false);
    }
  };

  const maskedEmail = email.replace(/(.{2})(.*)(@.*)/, "$1***$3");

  const accentMap: Record<string, Record<string, string>> = {
    blue: {
      bg: "bg-blue-600",
      bgLight: "bg-blue-50",
      ring: "focus:ring-blue-500",
      border: "border-blue-300",
      borderActive: "border-blue-500",
      text: "text-blue-600",
      textLight: "text-blue-500",
      gradient: "from-blue-600 to-indigo-600",
      glow: "shadow-blue-500/25",
    },
    emerald: {
      bg: "bg-emerald-600",
      bgLight: "bg-emerald-50",
      ring: "focus:ring-emerald-500",
      border: "border-emerald-300",
      borderActive: "border-emerald-500",
      text: "text-emerald-600",
      textLight: "text-emerald-500",
      gradient: "from-emerald-600 to-teal-600",
      glow: "shadow-emerald-500/25",
    },
  };

  const colors = accentMap[accentColor] || accentMap.blue;

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-blue-50 flex flex-col">
      {/* Back Button */}
      <div className="p-6">
        <button
          className="flex items-center gap-2 text-sm text-slate-600 hover:text-slate-900 transition-colors"
          onClick={onBack}
        >
          <ArrowLeft className="w-4 h-4" />
          Back
        </button>
      </div>

      {/* Main Content */}
      <main className="flex-1 flex flex-col items-center justify-center px-6 py-8">
        {/* Animated Shield Icon */}
        <div className="relative mb-8">
          <div
            className={`w-20 h-20 rounded-2xl bg-gradient-to-br ${colors.gradient} flex items-center justify-center shadow-lg ${colors.glow} transition-transform duration-300`}
            style={{
              animation: success
                ? "successPulse 0.6s ease-in-out"
                : "floatShield 3s ease-in-out infinite",
            }}
          >
            {success ? (
              <CheckCircle2 className="w-10 h-10 text-white" />
            ) : (
              <ShieldCheck className="w-10 h-10 text-white" />
            )}
          </div>
          {/* Decorative ring */}
          <div
            className={`absolute -inset-3 rounded-3xl border-2 ${
              success ? "border-emerald-200" : "border-slate-100"
            } transition-colors duration-500`}
            style={{
              animation: "pulseRing 2s ease-in-out infinite",
            }}
          />
        </div>

        {/* Title */}
        <h1 className="text-2xl md:text-3xl font-bold text-slate-900 text-center mb-2">
          {success ? "Verified!" : "Verify Your Identity"}
        </h1>
        <p className="text-slate-500 text-center mb-2 max-w-sm">
          {success
            ? "Your identity has been verified successfully."
            : "We sent a 6-digit verification code to"}
        </p>
        {!success && (
          <div className="flex items-center gap-2 mb-8">
            <Mail className={`w-4 h-4 ${colors.text}`} />
            <span className={`text-sm font-medium ${colors.text}`}>
              {maskedEmail}
            </span>
          </div>
        )}

        {!success && (
          <div
            className={`w-full max-w-md transition-transform duration-300 ${
              shakeError ? "animate-shake" : ""
            }`}
          >
            {/* OTP Card */}
            <div className="bg-white rounded-2xl border border-slate-200 p-8 shadow-sm">
              {/* OTP Input Grid */}
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
                    onChange={(e) => handleChange(index, e.target.value)}
                    onKeyDown={(e) => handleKeyDown(index, e)}
                    onPaste={index === 0 ? handlePaste : undefined}
                    disabled={isVerifying}
                    className={`w-12 h-14 md:w-14 md:h-16 text-center text-xl md:text-2xl font-bold rounded-xl border-2 transition-all duration-200 outline-none
                      ${
                        digit
                          ? `${colors.borderActive} ${colors.bgLight}`
                          : "border-slate-200 bg-slate-50"
                      }
                      ${colors.ring} focus:ring-2 focus:border-transparent
                      ${isVerifying ? "opacity-50 cursor-not-allowed" : "hover:border-slate-300"}
                      text-slate-900 placeholder:text-slate-300`}
                    style={{
                      caretColor: "transparent",
                    }}
                  />
                ))}
              </div>

              {/* Error Message */}
              {error && (
                <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-xl flex items-center gap-2 text-sm text-red-600 animate-fadeIn">
                  <XCircle className="w-4 h-4 flex-shrink-0" />
                  {error}
                </div>
              )}

              {/* Verify Button */}
              <button
                onClick={() => handleVerify(otp.join(""))}
                disabled={isVerifying || otp.join("").length !== 6}
                className={`w-full py-3.5 rounded-xl bg-gradient-to-r ${colors.gradient} text-white font-semibold transition-all duration-200 flex items-center justify-center gap-2 
                  disabled:opacity-40 disabled:cursor-not-allowed
                  hover:shadow-lg ${colors.glow} hover:-translate-y-0.5
                  active:translate-y-0`}
              >
                {isVerifying ? (
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

              {/* Divider */}
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

              {/* Resend Section */}
              <div className="flex items-center justify-center">
                {canResend ? (
                  <button
                    onClick={handleResend}
                    disabled={isResending}
                    className={`flex items-center gap-2 text-sm font-medium ${colors.text} hover:underline transition-colors disabled:opacity-50`}
                  >
                    {isResending ? (
                      <>
                        <Loader2 className="w-4 h-4 animate-spin" />
                        Sending...
                      </>
                    ) : (
                      <>
                        <RefreshCw className="w-4 h-4" />
                        Resend Verification Code
                      </>
                    )}
                  </button>
                ) : (
                  <div className="flex items-center gap-2 text-sm text-slate-400">
                    <Timer className="w-4 h-4" />
                    <span>
                      Resend available in{" "}
                      <span className={`font-semibold ${colors.textLight}`}>
                        {countdown}s
                      </span>
                    </span>
                  </div>
                )}
              </div>
            </div>

            {/* Security Notice */}
            <div className="mt-6 flex items-center justify-center gap-2 text-xs text-slate-400">
              <ShieldCheck className="w-3.5 h-3.5" />
              <span>End-to-end encrypted • Code expires in 5 min</span>
            </div>
          </div>
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

export default OtpVerification;
