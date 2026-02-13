import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {
  Stethoscope,
  Shield,
  FlaskConical,
  LogOut,
  ArrowLeft,
  Camera,
  Edit3,
  CheckCircle,
  Loader2,
  ChevronRight,
  Activity,
  BarChart3,
  Lock,
  Trash2,
  Bell,
  Beaker,
  Award,
  BookOpen,
  FileDown,
  TestTube,
  Zap,
  Globe,
  Building2,
  GraduationCap,
  Briefcase,
  Star,
} from "lucide-react";

interface UserProfile {
  id: string;
  name: string;
  email: string;
  roles: string[];
}

const ExpertProfile = () => {
  const navigate = useNavigate();
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");
  const [activeSection, setActiveSection] = useState<
    "overview" | "credentials" | "settings"
  >("overview");
  const [isEditing, setIsEditing] = useState(false);
  const [editName, setEditName] = useState("");
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    fetchProfile();
  }, []);

  const fetchProfile = async () => {
    try {
      const token = localStorage.getItem("token");
      if (!token) {
        navigate("/login");
        return;
      }

      const response = await fetch("/api/users/me", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (!response.ok) {
        throw new Error("Failed to fetch profile");
      }

      const data = await response.json();
      setProfile(data);
      setEditName(data.name);
    } catch (err: any) {
      setError(err.message || "Failed to load profile");
    } finally {
      setIsLoading(false);
    }
  };

  const handleSaveName = async () => {
    setIsSaving(true);
    setTimeout(() => {
      if (profile) {
        setProfile({ ...profile, name: editName });
      }
      setIsEditing(false);
      setIsSaving(false);
    }, 1000);
  };

  const getInitials = (name: string) => {
    return name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase()
      .slice(0, 2);
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-slate-900 flex items-center justify-center">
        <div className="flex flex-col items-center gap-4">
          <Loader2 className="w-10 h-10 text-blue-400 animate-spin" />
          <p className="text-slate-400 font-medium">Loading your profile...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-slate-900 flex items-center justify-center">
        <div className="bg-slate-800 rounded-2xl border border-red-500/30 p-8 max-w-md text-center">
          <Shield className="w-12 h-12 text-red-400 mx-auto mb-4" />
          <h2 className="text-xl font-bold text-white mb-2">
            Error Loading Profile
          </h2>
          <p className="text-slate-400 mb-6">{error}</p>
          <button
            className="px-6 py-3 bg-blue-600 text-white rounded-xl font-semibold hover:bg-blue-700 transition-colors"
            onClick={() => navigate("/login")}
          >
            Back to Login
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-900">
      {/* Header */}
      <header className="bg-slate-800 border-b border-slate-700 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <FlaskConical className="w-7 h-7 text-blue-400" />
            <span className="text-xl font-bold text-white">
              ChemVerify <span className="text-blue-400">AI</span>
            </span>
            <span className="ml-4 px-3 py-1 bg-blue-500/20 rounded-full text-xs font-medium text-blue-400 border border-blue-500/30">
              Professional Mode
            </span>
          </div>
          <div className="flex items-center gap-4">
            <button
              className="flex items-center gap-2 text-sm text-slate-400 hover:text-blue-400 transition-colors"
              onClick={() => navigate("/dashboard/expert")}
            >
              <ArrowLeft className="w-4 h-4" />
              Back to Studio
            </button>
            <button
              className="flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium text-slate-300 border border-slate-600 hover:bg-slate-700 transition-all"
              onClick={() => navigate("/logout")}
            >
              <LogOut className="w-4 h-4" />
              Logout
            </button>
          </div>
        </div>
      </header>

      {/* Profile Hero */}
      <div className="relative overflow-hidden">
        {/* Animated grid background */}
        <div className="absolute inset-0 bg-gradient-to-br from-blue-600/20 via-slate-800 to-purple-600/20" />
        <div
          className="absolute inset-0"
          style={{
            backgroundImage:
              "radial-gradient(circle at 1px 1px, rgba(255,255,255,0.05) 1px, transparent 0)",
            backgroundSize: "40px 40px",
          }}
        />

        {/* Glowing orbs */}
        <div className="absolute top-0 right-1/4 w-72 h-72 bg-blue-500/10 rounded-full blur-3xl" />
        <div className="absolute bottom-0 left-1/4 w-96 h-96 bg-purple-500/10 rounded-full blur-3xl" />

        <div className="max-w-7xl mx-auto px-6 py-12 relative">
          <div className="flex flex-col md:flex-row items-center md:items-end gap-8">
            {/* Avatar */}
            <div className="relative group">
              <div className="w-32 h-32 rounded-3xl bg-gradient-to-br from-blue-500 to-blue-700 flex items-center justify-center text-white text-4xl font-bold shadow-2xl shadow-blue-500/20 border-2 border-blue-400/30">
                {profile ? getInitials(profile.name) : "D"}
              </div>
              <div className="absolute -bottom-1 -right-1 w-10 h-10 bg-emerald-500 rounded-xl flex items-center justify-center border-4 border-slate-900">
                <CheckCircle className="w-5 h-5 text-white" />
              </div>
              <button className="absolute -bottom-2 -left-2 w-9 h-9 bg-slate-700 rounded-full flex items-center justify-center shadow-lg opacity-0 group-hover:opacity-100 transition-opacity border border-slate-600">
                <Camera className="w-4 h-4 text-slate-300" />
              </button>
            </div>

            {/* Info */}
            <div className="text-center md:text-left flex-1">
              <div className="flex items-center gap-3 justify-center md:justify-start mb-1">
                {isEditing ? (
                  <div className="flex items-center gap-2">
                    <input
                      type="text"
                      value={editName}
                      onChange={(e) => setEditName(e.target.value)}
                      className="text-2xl font-bold bg-slate-700/50 border border-slate-600 rounded-lg px-3 py-1 text-white placeholder:text-slate-500 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                    <button
                      onClick={handleSaveName}
                      disabled={isSaving}
                      className="p-2 bg-blue-600 rounded-lg hover:bg-blue-700 transition-colors"
                    >
                      {isSaving ? (
                        <Loader2 className="w-4 h-4 text-white animate-spin" />
                      ) : (
                        <CheckCircle className="w-4 h-4 text-white" />
                      )}
                    </button>
                  </div>
                ) : (
                  <>
                    <h1 className="text-2xl md:text-3xl font-bold text-white">
                      {profile?.name}
                    </h1>
                    <button
                      onClick={() => setIsEditing(true)}
                      className="p-1.5 bg-slate-700/50 rounded-lg hover:bg-slate-700 transition-colors"
                    >
                      <Edit3 className="w-4 h-4 text-slate-400" />
                    </button>
                  </>
                )}
              </div>
              <p className="text-slate-400 mb-3">{profile?.email}</p>
              <div className="flex items-center gap-2 justify-center md:justify-start flex-wrap">
                <span className="px-3 py-1 bg-blue-500/20 rounded-full text-xs font-semibold text-blue-300 border border-blue-500/30">
                  <Stethoscope className="w-3 h-3 inline mr-1" />
                  Dermatologist
                </span>
                <span className="px-3 py-1 bg-emerald-500/20 rounded-full text-xs font-semibold text-emerald-300 border border-emerald-500/30">
                  <Shield className="w-3 h-3 inline mr-1" />
                  Verified Professional
                </span>
                <span className="px-3 py-1 bg-amber-500/20 rounded-full text-xs font-semibold text-amber-300 border border-amber-500/30">
                  <Award className="w-3 h-3 inline mr-1" />
                  Licensed
                </span>
              </div>
            </div>

            {/* Quick Stats */}
            <div className="flex gap-6">
              <div className="text-center px-4 py-3 bg-slate-800/50 backdrop-blur-sm rounded-2xl border border-slate-700">
                <p className="text-3xl font-bold text-white">47</p>
                <p className="text-xs text-slate-400">Formulations</p>
              </div>
              <div className="text-center px-4 py-3 bg-slate-800/50 backdrop-blur-sm rounded-2xl border border-slate-700">
                <p className="text-3xl font-bold text-emerald-400">12</p>
                <p className="text-xs text-slate-400">Reports</p>
              </div>
              <div className="text-center px-4 py-3 bg-slate-800/50 backdrop-blur-sm rounded-2xl border border-slate-700">
                <p className="text-3xl font-bold text-blue-400">847</p>
                <p className="text-xs text-slate-400">API Credits</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Tab Navigation */}
      <div className="bg-slate-800 border-b border-slate-700">
        <div className="max-w-7xl mx-auto px-6">
          <div className="flex gap-8">
            <button
              className={`py-4 text-sm font-medium border-b-2 transition-colors ${
                activeSection === "overview"
                  ? "border-blue-500 text-blue-400"
                  : "border-transparent text-slate-500 hover:text-slate-300"
              }`}
              onClick={() => setActiveSection("overview")}
            >
              Overview
            </button>
            <button
              className={`py-4 text-sm font-medium border-b-2 transition-colors ${
                activeSection === "credentials"
                  ? "border-blue-500 text-blue-400"
                  : "border-transparent text-slate-500 hover:text-slate-300"
              }`}
              onClick={() => setActiveSection("credentials")}
            >
              Credentials
            </button>
            <button
              className={`py-4 text-sm font-medium border-b-2 transition-colors ${
                activeSection === "settings"
                  ? "border-blue-500 text-blue-400"
                  : "border-transparent text-slate-500 hover:text-slate-300"
              }`}
              onClick={() => setActiveSection("settings")}
            >
              Settings
            </button>
          </div>
        </div>
      </div>

      {/* Content Area */}
      <div className="max-w-7xl mx-auto px-6 py-8">
        {activeSection === "overview" && (
          <div className="grid lg:grid-cols-3 gap-8">
            {/* Main Content */}
            <div className="lg:col-span-2 space-y-6">
              {/* Profile Details */}
              <div className="bg-slate-800 rounded-2xl border border-slate-700 p-6">
                <h2 className="text-lg font-semibold text-white mb-6 flex items-center gap-2">
                  <Stethoscope className="w-5 h-5 text-blue-400" />
                  Professional Profile
                </h2>
                <div className="space-y-5">
                  <div className="flex items-center justify-between py-3 border-b border-slate-700">
                    <div>
                      <p className="text-sm text-slate-500">Full Name</p>
                      <p className="text-white font-medium">{profile?.name}</p>
                    </div>
                    <button
                      onClick={() => setIsEditing(true)}
                      className="text-sm text-blue-400 hover:text-blue-300 font-medium"
                    >
                      Edit
                    </button>
                  </div>
                  <div className="flex items-center justify-between py-3 border-b border-slate-700">
                    <div>
                      <p className="text-sm text-slate-500">
                        Professional Email
                      </p>
                      <p className="text-white font-medium">{profile?.email}</p>
                    </div>
                    <span className="flex items-center gap-1 text-xs text-emerald-400 bg-emerald-500/10 px-2 py-1 rounded-full border border-emerald-500/20">
                      <CheckCircle className="w-3 h-3" />
                      Verified
                    </span>
                  </div>
                  <div className="flex items-center justify-between py-3 border-b border-slate-700">
                    <div>
                      <p className="text-sm text-slate-500">Account Role</p>
                      <p className="text-white font-medium">
                        Dermatologist / Expert
                      </p>
                    </div>
                    <span className="px-3 py-1 bg-blue-500/10 text-blue-400 rounded-full text-xs font-medium border border-blue-500/20">
                      DERMATOLOGIST
                    </span>
                  </div>
                  <div className="flex items-center justify-between py-3">
                    <div>
                      <p className="text-sm text-slate-500">Account ID</p>
                      <p className="text-slate-300 font-mono text-sm">
                        {profile?.id}
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Quick Actions */}
              <div className="bg-slate-800 rounded-2xl border border-slate-700 p-6">
                <h2 className="text-lg font-semibold text-white mb-6 flex items-center gap-2">
                  <Zap className="w-5 h-5 text-amber-400" />
                  Quick Actions
                </h2>
                <div className="grid sm:grid-cols-2 gap-4">
                  <button
                    onClick={() => navigate("/dashboard/expert")}
                    className="p-4 rounded-xl border border-slate-700 hover:border-blue-500/50 hover:bg-slate-700/50 transition-all group text-left"
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-blue-500/10 rounded-xl flex items-center justify-center group-hover:bg-blue-500/20 transition-colors">
                          <Beaker className="w-5 h-5 text-blue-400" />
                        </div>
                        <div>
                          <p className="text-sm font-semibold text-white">
                            Generate Formulation
                          </p>
                          <p className="text-xs text-slate-500">
                            AI-powered creation
                          </p>
                        </div>
                      </div>
                      <ChevronRight className="w-4 h-4 text-slate-600 group-hover:text-blue-400 transition-colors" />
                    </div>
                  </button>

                  <button
                    onClick={() => navigate("/dashboard/expert")}
                    className="p-4 rounded-xl border border-slate-700 hover:border-blue-500/50 hover:bg-slate-700/50 transition-all group text-left"
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-purple-500/10 rounded-xl flex items-center justify-center group-hover:bg-purple-500/20 transition-colors">
                          <TestTube className="w-5 h-5 text-purple-400" />
                        </div>
                        <div>
                          <p className="text-sm font-semibold text-white">
                            Analyze Formula
                          </p>
                          <p className="text-xs text-slate-500">
                            Safety assessment
                          </p>
                        </div>
                      </div>
                      <ChevronRight className="w-4 h-4 text-slate-600 group-hover:text-purple-400 transition-colors" />
                    </div>
                  </button>

                  <button
                    onClick={() => navigate("/dashboard/expert")}
                    className="p-4 rounded-xl border border-slate-700 hover:border-blue-500/50 hover:bg-slate-700/50 transition-all group text-left"
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-emerald-500/10 rounded-xl flex items-center justify-center group-hover:bg-emerald-500/20 transition-colors">
                          <BookOpen className="w-5 h-5 text-emerald-400" />
                        </div>
                        <div>
                          <p className="text-sm font-semibold text-white">
                            Ingredient Library
                          </p>
                          <p className="text-xs text-slate-500">
                            750k+ compounds
                          </p>
                        </div>
                      </div>
                      <ChevronRight className="w-4 h-4 text-slate-600 group-hover:text-emerald-400 transition-colors" />
                    </div>
                  </button>

                  <button className="p-4 rounded-xl border border-slate-700 hover:border-blue-500/50 hover:bg-slate-700/50 transition-all group text-left">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-amber-500/10 rounded-xl flex items-center justify-center group-hover:bg-amber-500/20 transition-colors">
                          <FileDown className="w-5 h-5 text-amber-400" />
                        </div>
                        <div>
                          <p className="text-sm font-semibold text-white">
                            Export Reports
                          </p>
                          <p className="text-xs text-slate-500">
                            Download PDFs
                          </p>
                        </div>
                      </div>
                      <ChevronRight className="w-4 h-4 text-slate-600 group-hover:text-amber-400 transition-colors" />
                    </div>
                  </button>
                </div>
              </div>

              {/* Recent Activity */}
              <div className="bg-slate-800 rounded-2xl border border-slate-700 p-6">
                <div className="flex items-center justify-between mb-6">
                  <h2 className="text-lg font-semibold text-white flex items-center gap-2">
                    <Activity className="w-5 h-5 text-blue-400" />
                    Recent Activity
                  </h2>
                  <button className="text-xs text-blue-400 hover:text-blue-300 transition-colors">
                    View All
                  </button>
                </div>
                <div className="space-y-3">
                  {[
                    {
                      action: "Generated",
                      item: "Anti-Aging Serum Formula",
                      time: "2 hours ago",
                      icon: Beaker,
                      color: "blue",
                    },
                    {
                      action: "Exported",
                      item: "Hydrating Moisturizer Report",
                      time: "5 hours ago",
                      icon: FileDown,
                      color: "emerald",
                    },
                    {
                      action: "Analyzed",
                      item: "Retinol Stability Test",
                      time: "Yesterday",
                      icon: TestTube,
                      color: "purple",
                    },
                    {
                      action: "Generated",
                      item: "Acne Spot Treatment",
                      time: "2 days ago",
                      icon: Beaker,
                      color: "blue",
                    },
                  ].map((item, index) => (
                    <div
                      key={index}
                      className="flex items-center gap-4 p-3 rounded-xl bg-slate-750 hover:bg-slate-700/50 transition-colors"
                    >
                      <div
                        className={`w-9 h-9 rounded-lg flex items-center justify-center ${
                          item.color === "blue"
                            ? "bg-blue-500/10"
                            : item.color === "emerald"
                              ? "bg-emerald-500/10"
                              : "bg-purple-500/10"
                        }`}
                      >
                        <item.icon
                          className={`w-4 h-4 ${
                            item.color === "blue"
                              ? "text-blue-400"
                              : item.color === "emerald"
                                ? "text-emerald-400"
                                : "text-purple-400"
                          }`}
                        />
                      </div>
                      <div className="flex-1">
                        <p className="text-sm text-white">
                          {item.action}:{" "}
                          <span className="text-blue-400">{item.item}</span>
                        </p>
                        <p className="text-xs text-slate-500">{item.time}</p>
                      </div>
                      <ChevronRight className="w-4 h-4 text-slate-600" />
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Sidebar */}
            <div className="space-y-6">
              {/* API Usage */}
              <div className="bg-slate-800 rounded-2xl border border-slate-700 p-6">
                <h3 className="text-sm font-semibold text-white mb-4 flex items-center gap-2">
                  <BarChart3 className="w-4 h-4 text-blue-400" />
                  API Usage
                </h3>
                <div className="space-y-4">
                  <div>
                    <div className="flex items-center justify-between mb-1">
                      <span className="text-sm text-slate-400">
                        API Credits
                      </span>
                      <span className="text-sm font-bold text-white">
                        847 / 1000
                      </span>
                    </div>
                    <div className="w-full bg-slate-700 rounded-full h-2">
                      <div
                        className="bg-gradient-to-r from-blue-500 to-blue-400 h-2 rounded-full transition-all"
                        style={{ width: "84.7%" }}
                      />
                    </div>
                  </div>
                  <div>
                    <div className="flex items-center justify-between mb-1">
                      <span className="text-sm text-slate-400">
                        Formulations Today
                      </span>
                      <span className="text-sm font-bold text-white">
                        7 / 50
                      </span>
                    </div>
                    <div className="w-full bg-slate-700 rounded-full h-2">
                      <div
                        className="bg-gradient-to-r from-emerald-500 to-emerald-400 h-2 rounded-full transition-all"
                        style={{ width: "14%" }}
                      />
                    </div>
                  </div>
                  <div>
                    <div className="flex items-center justify-between mb-1">
                      <span className="text-sm text-slate-400">Storage</span>
                      <span className="text-sm font-bold text-white">
                        2.3 / 10 GB
                      </span>
                    </div>
                    <div className="w-full bg-slate-700 rounded-full h-2">
                      <div
                        className="bg-gradient-to-r from-amber-500 to-amber-400 h-2 rounded-full transition-all"
                        style={{ width: "23%" }}
                      />
                    </div>
                  </div>
                </div>
              </div>

              {/* Subscription Card */}
              <div className="relative overflow-hidden rounded-2xl">
                <div className="absolute inset-0 bg-gradient-to-br from-blue-600 via-blue-700 to-indigo-800" />
                <div
                  className="absolute inset-0"
                  style={{
                    backgroundImage:
                      "radial-gradient(circle at 2px 2px, rgba(255,255,255,0.05) 1px, transparent 0)",
                    backgroundSize: "24px 24px",
                  }}
                />
                <div className="relative p-6">
                  <div className="flex items-center justify-between mb-3">
                    <span className="text-xs text-blue-200 font-medium uppercase tracking-wider">
                      Current Plan
                    </span>
                    <span className="px-2 py-1 bg-white/20 text-white rounded text-xs font-semibold backdrop-blur-sm">
                      Professional
                    </span>
                  </div>
                  <h3 className="text-lg font-bold text-white mb-1">
                    Expert Access
                  </h3>
                  <p className="text-sm text-blue-200 mb-4">
                    Unlimited formulations, FDA checks, PDF exports
                  </p>
                  <div className="flex items-baseline gap-1 mb-4">
                    <span className="text-3xl font-bold text-white">$49</span>
                    <span className="text-sm text-blue-200">/month</span>
                  </div>
                  <button className="w-full py-2.5 bg-white/20 hover:bg-white/30 rounded-xl text-sm font-semibold text-white transition-colors backdrop-blur-sm border border-white/10">
                    Manage Subscription
                  </button>
                </div>
              </div>

              {/* Professional Features */}
              <div className="bg-slate-800 rounded-2xl border border-slate-700 p-6">
                <h3 className="text-sm font-semibold text-white mb-4">
                  Unlocked Features
                </h3>
                <div className="space-y-3">
                  <div className="flex items-center gap-3">
                    <Shield className="w-5 h-5 text-emerald-400" />
                    <span className="text-sm text-slate-300">
                      FDA Compliance Check
                    </span>
                  </div>
                  <div className="flex items-center gap-3">
                    <Zap className="w-5 h-5 text-amber-400" />
                    <span className="text-sm text-slate-300">
                      Synergy Analysis
                    </span>
                  </div>
                  <div className="flex items-center gap-3">
                    <FileDown className="w-5 h-5 text-blue-400" />
                    <span className="text-sm text-slate-300">PDF Export</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <TestTube className="w-5 h-5 text-purple-400" />
                    <span className="text-sm text-slate-300">
                      Stability Prediction
                    </span>
                  </div>
                  <div className="flex items-center gap-3">
                    <Globe className="w-5 h-5 text-cyan-400" />
                    <span className="text-sm text-slate-300">
                      Regulatory Multi-Region
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {activeSection === "credentials" && (
          <div className="space-y-6 max-w-3xl">
            {/* Professional Credentials */}
            <div className="bg-slate-800 rounded-2xl border border-slate-700 p-6">
              <h2 className="text-lg font-semibold text-white mb-6 flex items-center gap-2">
                <Award className="w-5 h-5 text-amber-400" />
                Professional Credentials
              </h2>
              <div className="space-y-5">
                <div className="flex items-start gap-4 p-4 rounded-xl bg-slate-700/30 border border-slate-700">
                  <div className="w-12 h-12 bg-blue-500/10 rounded-xl flex items-center justify-center flex-shrink-0">
                    <GraduationCap className="w-6 h-6 text-blue-400" />
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center justify-between">
                      <h3 className="text-sm font-semibold text-white">
                        Medical License
                      </h3>
                      <span className="px-2 py-1 bg-emerald-500/10 text-emerald-400 rounded text-xs font-medium border border-emerald-500/20">
                        Active
                      </span>
                    </div>
                    <p className="text-sm text-slate-400 mt-1">
                      License ID: DERM-2024-XXXXX
                    </p>
                    <p className="text-xs text-slate-500 mt-0.5">
                      Expires: December 2026
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-4 p-4 rounded-xl bg-slate-700/30 border border-slate-700">
                  <div className="w-12 h-12 bg-purple-500/10 rounded-xl flex items-center justify-center flex-shrink-0">
                    <Building2 className="w-6 h-6 text-purple-400" />
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center justify-between">
                      <h3 className="text-sm font-semibold text-white">
                        Institution Affiliation
                      </h3>
                      <button className="text-xs text-blue-400 hover:text-blue-300">
                        Add
                      </button>
                    </div>
                    <p className="text-sm text-slate-500 mt-1">
                      No affiliation added yet
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-4 p-4 rounded-xl bg-slate-700/30 border border-slate-700">
                  <div className="w-12 h-12 bg-amber-500/10 rounded-xl flex items-center justify-center flex-shrink-0">
                    <Briefcase className="w-6 h-6 text-amber-400" />
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center justify-between">
                      <h3 className="text-sm font-semibold text-white">
                        Specialization
                      </h3>
                      <button className="text-xs text-blue-400 hover:text-blue-300">
                        Edit
                      </button>
                    </div>
                    <p className="text-sm text-slate-400 mt-1">
                      Cosmetic Dermatology & R&D
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Certifications */}
            <div className="bg-slate-800 rounded-2xl border border-slate-700 p-6">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-lg font-semibold text-white flex items-center gap-2">
                  <Star className="w-5 h-5 text-amber-400" />
                  Certifications
                </h2>
                <button className="text-xs text-blue-400 hover:text-blue-300 px-3 py-1.5 rounded-lg border border-slate-700 hover:border-blue-500/30 transition-colors">
                  + Add Certificate
                </button>
              </div>
              <div className="text-center py-8">
                <Award className="w-12 h-12 text-slate-600 mx-auto mb-3" />
                <p className="text-sm text-slate-500">
                  No certifications uploaded yet
                </p>
                <p className="text-xs text-slate-600 mt-1">
                  Upload your professional certifications for verification
                </p>
              </div>
            </div>
          </div>
        )}

        {activeSection === "settings" && (
          <div className="space-y-6 max-w-2xl">
            {/* Notifications */}
            <div className="bg-slate-800 rounded-2xl border border-slate-700 p-6">
              <h2 className="text-lg font-semibold text-white mb-6 flex items-center gap-2">
                <Bell className="w-5 h-5 text-blue-400" />
                Notifications
              </h2>
              <div className="space-y-4">
                {[
                  {
                    label: "Formulation Results",
                    desc: "Get notified when AI formulation is ready",
                  },
                  {
                    label: "Regulatory Updates",
                    desc: "FDA and global regulation changes",
                  },
                  {
                    label: "API Usage Alerts",
                    desc: "Alerts when credits are running low",
                  },
                  {
                    label: "Research Insights",
                    desc: "New ingredient studies and papers",
                  },
                ].map((item, index) => (
                  <div
                    key={index}
                    className="flex items-center justify-between py-3 border-b border-slate-700 last:border-0"
                  >
                    <div>
                      <p className="text-sm font-medium text-white">
                        {item.label}
                      </p>
                      <p className="text-xs text-slate-500">{item.desc}</p>
                    </div>
                    <label className="relative inline-flex items-center cursor-pointer">
                      <input
                        type="checkbox"
                        defaultChecked
                        className="sr-only peer"
                      />
                      <div className="w-11 h-6 bg-slate-700 rounded-full peer peer-checked:bg-blue-600 transition-colors after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-slate-400 peer-checked:after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:after:translate-x-full" />
                    </label>
                  </div>
                ))}
              </div>
            </div>

            {/* Security */}
            <div className="bg-slate-800 rounded-2xl border border-slate-700 p-6">
              <h2 className="text-lg font-semibold text-white mb-6 flex items-center gap-2">
                <Lock className="w-5 h-5 text-blue-400" />
                Security
              </h2>
              <div className="space-y-4">
                <button className="w-full flex items-center justify-between py-3 hover:bg-slate-700/50 rounded-lg px-3 transition-colors">
                  <div>
                    <p className="text-sm font-medium text-white">
                      Change Password
                    </p>
                    <p className="text-xs text-slate-500">
                      Update your account password
                    </p>
                  </div>
                  <ChevronRight className="w-4 h-4 text-slate-600" />
                </button>
                <button className="w-full flex items-center justify-between py-3 hover:bg-slate-700/50 rounded-lg px-3 transition-colors">
                  <div>
                    <p className="text-sm font-medium text-white">
                      Two-Factor Authentication
                    </p>
                    <p className="text-xs text-slate-500">
                      Required for professional accounts
                    </p>
                  </div>
                  <span className="px-2 py-1 bg-amber-500/10 text-amber-400 rounded text-xs border border-amber-500/20">
                    Recommended
                  </span>
                </button>
                <button className="w-full flex items-center justify-between py-3 hover:bg-slate-700/50 rounded-lg px-3 transition-colors">
                  <div>
                    <p className="text-sm font-medium text-white">
                      Active Sessions
                    </p>
                    <p className="text-xs text-slate-500">
                      Manage your logged-in devices
                    </p>
                  </div>
                  <ChevronRight className="w-4 h-4 text-slate-600" />
                </button>
              </div>
            </div>

            {/* HIPAA Compliance */}
            <div className="bg-slate-800 rounded-2xl border border-emerald-500/30 p-6">
              <h2 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
                <Shield className="w-5 h-5 text-emerald-400" />
                HIPAA Compliance
              </h2>
              <p className="text-sm text-slate-400 mb-4">
                Your account is configured for HIPAA-compliant data handling.
                All formulations and patient data are encrypted at rest and in
                transit.
              </p>
              <div className="flex items-center gap-2 text-sm text-emerald-400">
                <CheckCircle className="w-4 h-4" />
                <span>All compliance checks passed</span>
              </div>
            </div>

            {/* Danger Zone */}
            <div className="bg-slate-800 rounded-2xl border border-red-500/30 p-6">
              <h2 className="text-lg font-semibold text-red-400 mb-4 flex items-center gap-2">
                <Trash2 className="w-5 h-5" />
                Danger Zone
              </h2>
              <p className="text-sm text-slate-400 mb-4">
                Deleting your professional account will permanently remove all
                formulations, reports, and credentials. This action cannot be
                undone.
              </p>
              <button className="px-6 py-2.5 border border-red-500/30 text-red-400 rounded-xl text-sm font-medium hover:bg-red-500/10 transition-colors">
                Delete Professional Account
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ExpertProfile;
