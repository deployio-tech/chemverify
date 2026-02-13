import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {
  User,
  Shield,
  FlaskConical,
  LogOut,
  ArrowLeft,
  Search,
  History,
  Settings,
  Bell,
  Camera,
  Edit3,
  CheckCircle,
  Loader2,
  ChevronRight,
  Star,
  Activity,
  BarChart3,
  Lock,
  Trash2,
} from "lucide-react";

interface UserProfile {
  id: string;
  name: string;
  email: string;
  roles: string[];
}

const UserProfile = () => {
  const navigate = useNavigate();
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");
  const [activeSection, setActiveSection] = useState<
    "overview" | "settings" | "activity"
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
    // Simulate save
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
      <div className="min-h-screen bg-slate-50 flex items-center justify-center">
        <div className="flex flex-col items-center gap-4">
          <Loader2 className="w-10 h-10 text-blue-600 animate-spin" />
          <p className="text-slate-600 font-medium">Loading your profile...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center">
        <div className="bg-white rounded-2xl border border-red-200 p-8 max-w-md text-center">
          <Shield className="w-12 h-12 text-red-400 mx-auto mb-4" />
          <h2 className="text-xl font-bold text-slate-900 mb-2">
            Error Loading Profile
          </h2>
          <p className="text-slate-600 mb-6">{error}</p>
          <button className="btn-primary" onClick={() => navigate("/login")}>
            Back to Login
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50">
      {/* Header */}
      <header className="bg-white border-b border-slate-200 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <FlaskConical className="w-7 h-7 text-blue-600" />
            <span className="text-xl font-bold text-slate-900">
              ChemVerify <span className="text-blue-600">AI</span>
            </span>
            <span className="ml-4 px-3 py-1 bg-slate-100 rounded-full text-xs font-medium text-slate-600">
              Normal Mode
            </span>
          </div>
          <div className="flex items-center gap-4">
            <button
              className="flex items-center gap-2 text-sm text-slate-600 hover:text-blue-600 transition-colors"
              onClick={() => navigate("/dashboard/user")}
            >
              <ArrowLeft className="w-4 h-4" />
              Back to Dashboard
            </button>
            <button
              className="btn-secondary text-sm py-2 px-4"
              onClick={() => navigate("/logout")}
            >
              <LogOut className="w-4 h-4" />
              Logout
            </button>
          </div>
        </div>
      </header>

      {/* Profile Hero */}
      <div className="bg-gradient-to-br from-blue-600 via-blue-500 to-indigo-600 relative overflow-hidden">
        {/* Decorative elements */}
        <div className="absolute inset-0">
          <div className="absolute top-0 right-0 w-96 h-96 bg-white/5 rounded-full -translate-y-1/2 translate-x-1/3" />
          <div className="absolute bottom-0 left-0 w-64 h-64 bg-white/5 rounded-full translate-y-1/2 -translate-x-1/4" />
        </div>

        <div className="max-w-7xl mx-auto px-6 py-12 relative">
          <div className="flex flex-col md:flex-row items-center md:items-end gap-6">
            {/* Avatar */}
            <div className="relative group">
              <div className="w-28 h-28 rounded-3xl bg-white/20 backdrop-blur-sm border-2 border-white/30 flex items-center justify-center text-white text-3xl font-bold shadow-2xl">
                {profile ? getInitials(profile.name) : "U"}
              </div>
              <button className="absolute -bottom-2 -right-2 w-9 h-9 bg-white rounded-full flex items-center justify-center shadow-lg opacity-0 group-hover:opacity-100 transition-opacity">
                <Camera className="w-4 h-4 text-slate-600" />
              </button>
            </div>

            {/* Info */}
            <div className="text-center md:text-left text-white flex-1">
              <div className="flex items-center gap-3 justify-center md:justify-start mb-1">
                {isEditing ? (
                  <div className="flex items-center gap-2">
                    <input
                      type="text"
                      value={editName}
                      onChange={(e) => setEditName(e.target.value)}
                      className="text-2xl font-bold bg-white/10 border border-white/30 rounded-lg px-3 py-1 text-white placeholder:text-white/50 focus:outline-none focus:ring-2 focus:ring-white/50"
                    />
                    <button
                      onClick={handleSaveName}
                      disabled={isSaving}
                      className="p-2 bg-white/20 rounded-lg hover:bg-white/30 transition-colors"
                    >
                      {isSaving ? (
                        <Loader2 className="w-4 h-4 animate-spin" />
                      ) : (
                        <CheckCircle className="w-4 h-4" />
                      )}
                    </button>
                  </div>
                ) : (
                  <>
                    <h1 className="text-2xl md:text-3xl font-bold">
                      {profile?.name}
                    </h1>
                    <button
                      onClick={() => setIsEditing(true)}
                      className="p-1.5 bg-white/10 rounded-lg hover:bg-white/20 transition-colors"
                    >
                      <Edit3 className="w-4 h-4" />
                    </button>
                  </>
                )}
              </div>
              <p className="text-blue-100 mb-3">{profile?.email}</p>
              <div className="flex items-center gap-2 justify-center md:justify-start">
                <span className="px-3 py-1 bg-white/20 backdrop-blur-sm rounded-full text-xs font-semibold border border-white/20">
                  <User className="w-3 h-3 inline mr-1" />
                  Regular User
                </span>
                <span className="px-3 py-1 bg-emerald-500/30 backdrop-blur-sm rounded-full text-xs font-semibold border border-emerald-400/30 text-emerald-100">
                  <CheckCircle className="w-3 h-3 inline mr-1" />
                  Verified
                </span>
              </div>
            </div>

            {/* Quick Stats */}
            <div className="flex gap-6 text-white">
              <div className="text-center">
                <p className="text-3xl font-bold">12</p>
                <p className="text-xs text-blue-200">Analyses</p>
              </div>
              <div className="text-center">
                <p className="text-3xl font-bold">89%</p>
                <p className="text-xs text-blue-200">Safe Products</p>
              </div>
              <div className="text-center">
                <p className="text-3xl font-bold">5</p>
                <p className="text-xs text-blue-200">Saved</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Tab Navigation */}
      <div className="bg-white border-b border-slate-200">
        <div className="max-w-7xl mx-auto px-6">
          <div className="flex gap-8">
            <button
              className={`py-4 text-sm font-medium border-b-2 transition-colors ${
                activeSection === "overview"
                  ? "border-blue-600 text-blue-600"
                  : "border-transparent text-slate-500 hover:text-slate-900"
              }`}
              onClick={() => setActiveSection("overview")}
            >
              Overview
            </button>
            <button
              className={`py-4 text-sm font-medium border-b-2 transition-colors ${
                activeSection === "activity"
                  ? "border-blue-600 text-blue-600"
                  : "border-transparent text-slate-500 hover:text-slate-900"
              }`}
              onClick={() => setActiveSection("activity")}
            >
              Activity
            </button>
            <button
              className={`py-4 text-sm font-medium border-b-2 transition-colors ${
                activeSection === "settings"
                  ? "border-blue-600 text-blue-600"
                  : "border-transparent text-slate-500 hover:text-slate-900"
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
              {/* Profile Details Card */}
              <div className="bg-white rounded-2xl border border-slate-200 p-6">
                <h2 className="text-lg font-semibold text-slate-900 mb-6 flex items-center gap-2">
                  <User className="w-5 h-5 text-blue-600" />
                  Profile Information
                </h2>
                <div className="space-y-5">
                  <div className="flex items-center justify-between py-3 border-b border-slate-100">
                    <div>
                      <p className="text-sm text-slate-500">Full Name</p>
                      <p className="text-slate-900 font-medium">
                        {profile?.name}
                      </p>
                    </div>
                    <button
                      onClick={() => setIsEditing(true)}
                      className="text-sm text-blue-600 hover:text-blue-700 font-medium"
                    >
                      Edit
                    </button>
                  </div>
                  <div className="flex items-center justify-between py-3 border-b border-slate-100">
                    <div>
                      <p className="text-sm text-slate-500">Email Address</p>
                      <p className="text-slate-900 font-medium">
                        {profile?.email}
                      </p>
                    </div>
                    <span className="flex items-center gap-1 text-xs text-emerald-600 bg-emerald-50 px-2 py-1 rounded-full">
                      <CheckCircle className="w-3 h-3" />
                      Verified
                    </span>
                  </div>
                  <div className="flex items-center justify-between py-3 border-b border-slate-100">
                    <div>
                      <p className="text-sm text-slate-500">Account Role</p>
                      <p className="text-slate-900 font-medium">Regular User</p>
                    </div>
                    <span className="px-3 py-1 bg-blue-50 text-blue-600 rounded-full text-xs font-medium">
                      USER
                    </span>
                  </div>
                  <div className="flex items-center justify-between py-3">
                    <div>
                      <p className="text-sm text-slate-500">Account ID</p>
                      <p className="text-slate-900 font-mono text-sm">
                        {profile?.id}
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Quick Actions */}
              <div className="bg-white rounded-2xl border border-slate-200 p-6">
                <h2 className="text-lg font-semibold text-slate-900 mb-6 flex items-center gap-2">
                  <Activity className="w-5 h-5 text-blue-600" />
                  Quick Actions
                </h2>
                <div className="grid sm:grid-cols-2 gap-4">
                  <button
                    onClick={() => navigate("/dashboard/user")}
                    className="p-4 rounded-xl border border-slate-200 hover:border-blue-200 hover:bg-blue-50/50 transition-all group text-left"
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-blue-50 rounded-xl flex items-center justify-center group-hover:bg-blue-100 transition-colors">
                          <Search className="w-5 h-5 text-blue-600" />
                        </div>
                        <div>
                          <p className="text-sm font-semibold text-slate-900">
                            Analyze Ingredients
                          </p>
                          <p className="text-xs text-slate-500">
                            Check product safety
                          </p>
                        </div>
                      </div>
                      <ChevronRight className="w-4 h-4 text-slate-400 group-hover:text-blue-600 transition-colors" />
                    </div>
                  </button>

                  <button
                    onClick={() => navigate("/dashboard/user")}
                    className="p-4 rounded-xl border border-slate-200 hover:border-blue-200 hover:bg-blue-50/50 transition-all group text-left"
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-amber-50 rounded-xl flex items-center justify-center group-hover:bg-amber-100 transition-colors">
                          <History className="w-5 h-5 text-amber-600" />
                        </div>
                        <div>
                          <p className="text-sm font-semibold text-slate-900">
                            View History
                          </p>
                          <p className="text-xs text-slate-500">
                            Past analyses
                          </p>
                        </div>
                      </div>
                      <ChevronRight className="w-4 h-4 text-slate-400 group-hover:text-amber-600 transition-colors" />
                    </div>
                  </button>

                  <button className="p-4 rounded-xl border border-slate-200 hover:border-blue-200 hover:bg-blue-50/50 transition-all group text-left">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-emerald-50 rounded-xl flex items-center justify-center group-hover:bg-emerald-100 transition-colors">
                          <Star className="w-5 h-5 text-emerald-600" />
                        </div>
                        <div>
                          <p className="text-sm font-semibold text-slate-900">
                            Saved Products
                          </p>
                          <p className="text-xs text-slate-500">
                            Your favorites
                          </p>
                        </div>
                      </div>
                      <ChevronRight className="w-4 h-4 text-slate-400 group-hover:text-emerald-600 transition-colors" />
                    </div>
                  </button>

                  <button
                    onClick={() => setActiveSection("settings")}
                    className="p-4 rounded-xl border border-slate-200 hover:border-blue-200 hover:bg-blue-50/50 transition-all group text-left"
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-purple-50 rounded-xl flex items-center justify-center group-hover:bg-purple-100 transition-colors">
                          <Settings className="w-5 h-5 text-purple-600" />
                        </div>
                        <div>
                          <p className="text-sm font-semibold text-slate-900">
                            Account Settings
                          </p>
                          <p className="text-xs text-slate-500">
                            Manage preferences
                          </p>
                        </div>
                      </div>
                      <ChevronRight className="w-4 h-4 text-slate-400 group-hover:text-purple-600 transition-colors" />
                    </div>
                  </button>
                </div>
              </div>
            </div>

            {/* Sidebar */}
            <div className="space-y-6">
              {/* Usage Stats */}
              <div className="bg-white rounded-2xl border border-slate-200 p-6">
                <h3 className="text-sm font-semibold text-slate-900 mb-4 flex items-center gap-2">
                  <BarChart3 className="w-4 h-4 text-blue-600" />
                  Usage Summary
                </h3>
                <div className="space-y-4">
                  <div>
                    <div className="flex items-center justify-between mb-1">
                      <span className="text-sm text-slate-600">
                        Daily Analyses
                      </span>
                      <span className="text-sm font-bold text-slate-900">
                        3 / 10
                      </span>
                    </div>
                    <div className="w-full bg-slate-100 rounded-full h-2">
                      <div
                        className="bg-blue-600 h-2 rounded-full transition-all"
                        style={{ width: "30%" }}
                      />
                    </div>
                  </div>
                  <div>
                    <div className="flex items-center justify-between mb-1">
                      <span className="text-sm text-slate-600">
                        Storage Used
                      </span>
                      <span className="text-sm font-bold text-slate-900">
                        12 / 50
                      </span>
                    </div>
                    <div className="w-full bg-slate-100 rounded-full h-2">
                      <div
                        className="bg-emerald-500 h-2 rounded-full transition-all"
                        style={{ width: "24%" }}
                      />
                    </div>
                  </div>
                </div>
              </div>

              {/* Membership Card */}
              <div className="bg-gradient-to-br from-slate-800 to-slate-900 rounded-2xl p-6 text-white">
                <div className="flex items-center justify-between mb-4">
                  <span className="text-xs text-slate-400 font-medium uppercase tracking-wider">
                    Current Plan
                  </span>
                  <span className="px-2 py-1 bg-blue-500/20 text-blue-300 rounded text-xs font-semibold">
                    Free
                  </span>
                </div>
                <h3 className="text-lg font-bold mb-1">Basic Access</h3>
                <p className="text-sm text-slate-400 mb-4">
                  10 analyses per day with standard safety checks
                </p>
                <button className="w-full py-2.5 bg-blue-600 hover:bg-blue-700 rounded-xl text-sm font-semibold transition-colors">
                  Upgrade to Pro
                </button>
              </div>

              {/* Tips */}
              <div className="bg-blue-50 rounded-2xl p-6">
                <h3 className="text-sm font-semibold text-blue-900 mb-2">
                  💡 Did You Know?
                </h3>
                <p className="text-sm text-blue-700">
                  You can upload product images to automatically extract
                  ingredient lists. Try it in the Analyze tab!
                </p>
              </div>
            </div>
          </div>
        )}

        {activeSection === "activity" && (
          <div className="bg-white rounded-2xl border border-slate-200 p-6">
            <h2 className="text-lg font-semibold text-slate-900 mb-6">
              Recent Activity
            </h2>
            <div className="space-y-4">
              {[
                {
                  action: "Analyzed",
                  product: "CeraVe Moisturizing Cream",
                  time: "2 hours ago",
                  status: "safe",
                },
                {
                  action: "Analyzed",
                  product: "The Ordinary Niacinamide 10%",
                  time: "5 hours ago",
                  status: "safe",
                },
                {
                  action: "Analyzed",
                  product: "Neutrogena Sunscreen SPF 50",
                  time: "Yesterday",
                  status: "caution",
                },
                {
                  action: "Saved",
                  product: "La Roche-Posay Toleriane",
                  time: "2 days ago",
                  status: "safe",
                },
                {
                  action: "Analyzed",
                  product: "Unknown Brand Serum",
                  time: "3 days ago",
                  status: "warning",
                },
              ].map((item, index) => (
                <div
                  key={index}
                  className="flex items-center justify-between p-4 rounded-xl border border-slate-100 hover:bg-slate-50 transition-colors"
                >
                  <div className="flex items-center gap-4">
                    <div
                      className={`w-10 h-10 rounded-xl flex items-center justify-center ${
                        item.status === "safe"
                          ? "bg-emerald-50"
                          : item.status === "caution"
                            ? "bg-amber-50"
                            : "bg-red-50"
                      }`}
                    >
                      <CheckCircle
                        className={`w-5 h-5 ${
                          item.status === "safe"
                            ? "text-emerald-500"
                            : item.status === "caution"
                              ? "text-amber-500"
                              : "text-red-500"
                        }`}
                      />
                    </div>
                    <div>
                      <p className="text-sm font-medium text-slate-900">
                        {item.action}:{" "}
                        <span className="text-blue-600">{item.product}</span>
                      </p>
                      <p className="text-xs text-slate-500">{item.time}</p>
                    </div>
                  </div>
                  <ChevronRight className="w-4 h-4 text-slate-400" />
                </div>
              ))}
            </div>
          </div>
        )}

        {activeSection === "settings" && (
          <div className="space-y-6 max-w-2xl">
            {/* Notifications */}
            <div className="bg-white rounded-2xl border border-slate-200 p-6">
              <h2 className="text-lg font-semibold text-slate-900 mb-6 flex items-center gap-2">
                <Bell className="w-5 h-5 text-blue-600" />
                Notifications
              </h2>
              <div className="space-y-4">
                {[
                  {
                    label: "Analysis Results",
                    desc: "Get notified when analysis is complete",
                  },
                  {
                    label: "Safety Alerts",
                    desc: "Receive alerts about recalled products",
                  },
                  {
                    label: "Product Updates",
                    desc: "Updates about new features",
                  },
                ].map((item, index) => (
                  <div
                    key={index}
                    className="flex items-center justify-between py-3 border-b border-slate-100 last:border-0"
                  >
                    <div>
                      <p className="text-sm font-medium text-slate-900">
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
                      <div className="w-11 h-6 bg-slate-200 rounded-full peer peer-checked:bg-blue-600 transition-colors after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:after:translate-x-full" />
                    </label>
                  </div>
                ))}
              </div>
            </div>

            {/* Security */}
            <div className="bg-white rounded-2xl border border-slate-200 p-6">
              <h2 className="text-lg font-semibold text-slate-900 mb-6 flex items-center gap-2">
                <Lock className="w-5 h-5 text-blue-600" />
                Security
              </h2>
              <div className="space-y-4">
                <button className="w-full flex items-center justify-between py-3 hover:bg-slate-50 rounded-lg px-3 transition-colors">
                  <div>
                    <p className="text-sm font-medium text-slate-900">
                      Change Password
                    </p>
                    <p className="text-xs text-slate-500">
                      Update your account password
                    </p>
                  </div>
                  <ChevronRight className="w-4 h-4 text-slate-400" />
                </button>
                <button className="w-full flex items-center justify-between py-3 hover:bg-slate-50 rounded-lg px-3 transition-colors">
                  <div>
                    <p className="text-sm font-medium text-slate-900">
                      Two-Factor Authentication
                    </p>
                    <p className="text-xs text-slate-500">
                      Add extra security to your account
                    </p>
                  </div>
                  <ChevronRight className="w-4 h-4 text-slate-400" />
                </button>
              </div>
            </div>

            {/* Danger Zone */}
            <div className="bg-white rounded-2xl border border-red-200 p-6">
              <h2 className="text-lg font-semibold text-red-600 mb-4 flex items-center gap-2">
                <Trash2 className="w-5 h-5" />
                Danger Zone
              </h2>
              <p className="text-sm text-slate-600 mb-4">
                Once you delete your account, there is no going back. Please be
                certain.
              </p>
              <button className="px-6 py-2.5 border border-red-200 text-red-600 rounded-xl text-sm font-medium hover:bg-red-50 transition-colors">
                Delete Account
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default UserProfile;
