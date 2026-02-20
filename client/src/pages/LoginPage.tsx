import { useNavigate } from "react-router-dom";
import {
  UserSearch,
  Stethoscope,
  ArrowRight,
  Moon,
  Home,
  Info,
  HelpCircle,
  Mail,
} from "lucide-react";

const LoginPage = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-blue-50 flex flex-col">
      {/* Top navigation */}
      <div className="absolute top-6 left-6">
        <button
          className="flex items-center gap-2 text-sm text-slate-600 hover:text-slate-900 transition-colors"
          onClick={() => navigate("/")}
        >
          <Home className="w-4 h-4" />
          Back to Home
        </button>
      </div>
      <div className="absolute top-6 right-6">
        <button className="w-10 h-10 rounded-full bg-slate-100 hover:bg-slate-200 flex items-center justify-center transition-colors">
          <Moon className="w-5 h-5 text-slate-600" />
        </button>
      </div>

      {/* Main Content */}
      <main className="flex-1 flex flex-col items-center justify-center px-6 py-12">
        {/* Logo */}
        <div className="flex items-center gap-3 mb-8">
          <div className="w-12 h-12 bg-blue-600 rounded-xl flex items-center justify-center">
            <UserSearch className="w-7 h-7 text-white" />
          </div>
          <span className="text-2xl font-bold text-slate-900">
            Cherkmal Users
          </span>
        </div>

        {/* Title */}
        <h1 className="text-3xl md:text-4xl font-bold text-slate-900 text-center mb-4">
          Welcome to the Ingredient Intelligence Portal
        </h1>
        <p className="text-slate-600 text-center max-w-xl mb-12">
          Log in to access our Chemical Recommendation & Ingredient Verification
          Engine for advanced dermatology and cosmetic R&D.
        </p>

        {/* Login Cards */}
        <div className="grid md:grid-cols-2 gap-6 max-w-4xl w-full mb-12">
          {/* Normal Mode Card */}
          <div className="bg-white border border-slate-200 rounded-2xl p-8 hover:shadow-xl hover:-translate-y-1 transition-all duration-300 group">
            <div className="flex flex-col items-center text-center">
              <div className="w-16 h-16 bg-slate-100 rounded-2xl flex items-center justify-center mb-6 group-hover:bg-blue-50 transition-colors">
                <UserSearch className="w-8 h-8 text-slate-500 group-hover:text-blue-600 transition-colors" />
              </div>
              <h2 className="text-xl font-bold text-slate-900 mb-2">
                Normal Mode
              </h2>
              <span className="text-sm text-blue-600 font-medium mb-4">
                For Regular Users
              </span>
              <p className="text-sm text-slate-600 mb-8 leading-relaxed">
                Analyze products and verify chemical ingredients for skin safety
                and compliance.
              </p>
              <button
                className="w-full py-3 px-6 rounded-lg border border-slate-200 text-slate-700 font-medium hover:bg-slate-50 hover:border-slate-300 transition-all flex items-center justify-center gap-2 group-hover:border-blue-200"
                onClick={() => navigate("/login/user")}
              >
                Log In as Regular User <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Professional Mode Card */}
          <div className="bg-white border border-blue-200 rounded-2xl p-8 hover:shadow-xl hover:-translate-y-1 transition-all duration-300 group relative overflow-hidden">
            {/* Subtle glow effect */}
            <div className="absolute inset-0 bg-gradient-to-br from-blue-50/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity"></div>

            <div className="relative flex flex-col items-center text-center">
              <div className="w-16 h-16 bg-blue-600 rounded-2xl flex items-center justify-center mb-6 group-hover:scale-105 transition-transform">
                <Stethoscope className="w-8 h-8 text-white" />
              </div>
              <h2 className="text-xl font-bold text-slate-900 mb-2">
                Professional Mode
              </h2>
              <span className="text-sm text-blue-600 font-medium mb-4">
                For Experts & Researchers
              </span>
              <p className="text-sm text-slate-600 mb-8 leading-relaxed">
                Generate safe, AI-powered cosmetic formulations and access
                advanced clinical insights.
              </p>
              <button
                className="w-full py-3 px-6 rounded-lg bg-blue-600 text-white font-medium hover:bg-blue-700 transition-all flex items-center justify-center gap-2 hover:shadow-lg"
                onClick={() => navigate("/login/expert")}
              >
                Log In as Expert User <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>

        {/* Footer Links */}
        <div className="flex items-center gap-6 text-sm text-slate-500 mb-8">
          <a href="#forgot" className="hover:text-blue-600 transition-colors">
            Forgot Password?
          </a>
          <span className="text-slate-300">|</span>
          <a href="#terms" className="hover:text-blue-600 transition-colors">
            Terms of Service
          </a>
          <span className="text-slate-300">|</span>
          <a href="#privacy" className="hover:text-blue-600 transition-colors">
            Privacy Policy
          </a>
        </div>

        {/* Disclaimer */}
        <div className="max-w-2xl w-full bg-slate-50 border border-slate-200 rounded-xl p-4 flex gap-3">
          <Info className="w-5 h-5 text-blue-500 flex-shrink-0 mt-0.5" />
          <p className="text-xs text-slate-600 leading-relaxed">
            By logging in, you agree to our{" "}
            <a href="#legal" className="text-blue-600 hover:underline">
              Legal Disclaimers
            </a>
            . This system is intended for R&D and professional guidance only and
            does not replace professional medical advice or official regulatory
            certifications.
          </p>
        </div>
      </main>

      {/* Bottom Links */}
      <footer className="py-6 flex items-center justify-center gap-8">
        <a
          href="#about"
          className="flex items-center gap-2 text-sm text-slate-500 hover:text-blue-600 transition-colors"
        >
          <HelpCircle className="w-4 h-4" />
          About the Project
        </a>
        <a
          href="#contact"
          className="flex items-center gap-2 text-sm text-slate-500 hover:text-blue-600 transition-colors"
        >
          <Mail className="w-4 h-4" />
          Contact Support
        </a>
      </footer>
    </div>
  );
};

export default LoginPage;
