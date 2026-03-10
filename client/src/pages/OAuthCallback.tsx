import { useEffect, useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { sileo } from "sileo";
import { Loader2, AlertCircle } from "lucide-react";

const OAuthCallback = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const token = searchParams.get("token");
    const userId = searchParams.get("userId");
    const role = searchParams.get("role");
    const errorParam = searchParams.get("error");

    if (errorParam) {
      setError(decodeURIComponent(errorParam));
      sileo.error({
        title: "OAuth Login Failed",
        description: decodeURIComponent(errorParam),
      });
      return;
    }

    if (token && userId && role) {
      // Store JWT token and user info in localStorage
      localStorage.setItem("token", token);
      localStorage.setItem("userId", userId);
      localStorage.setItem("role", role);

      sileo.success({ title: "Login successful!" });

      // Redirect to the appropriate dashboard based on role
      const normalizedRole = role.toUpperCase();
      if (
        normalizedRole.includes("DERMATOLOGIST") ||
        normalizedRole.includes("EXPERT")
      ) {
        navigate("/dashboard/expert", { replace: true });
      } else {
        navigate("/dashboard/user", { replace: true });
      }
    } else {
      setError("Missing authentication data. Please try again.");
      sileo.error({
        title: "OAuth Login Failed",
        description: "Missing authentication data from the server.",
      });
    }
  }, [searchParams, navigate]);

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-blue-50 flex flex-col items-center justify-center px-6">
        <div className="bg-white rounded-2xl border border-red-200 p-8 shadow-sm max-w-md w-full text-center">
          <div className="w-16 h-16 bg-red-50 rounded-full flex items-center justify-center mx-auto mb-4">
            <AlertCircle className="w-8 h-8 text-red-500" />
          </div>
          <h2 className="text-xl font-bold text-slate-900 mb-2">
            Login Failed
          </h2>
          <p className="text-sm text-slate-600 mb-6">{error}</p>
          <button
            onClick={() => navigate("/login")}
            className="w-full py-3 rounded-xl bg-slate-900 text-white font-semibold hover:bg-slate-800 transition-all"
          >
            Back to Login
          </button>
        </div>
      </div>
    );
  }

  // Loading state while processing OAuth callback
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-blue-50 flex flex-col items-center justify-center px-6">
      <div className="bg-white rounded-2xl border border-slate-200 p-8 shadow-sm max-w-md w-full text-center">
        <Loader2 className="w-10 h-10 text-blue-600 animate-spin mx-auto mb-4" />
        <h2 className="text-xl font-bold text-slate-900 mb-2">
          Signing you in...
        </h2>
        <p className="text-sm text-slate-500">
          Processing your authentication. Please wait.
        </p>
      </div>
    </div>
  );
};

export default OAuthCallback;
