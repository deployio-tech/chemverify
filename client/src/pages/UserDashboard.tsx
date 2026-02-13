import { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  Search,
  Upload,
  FlaskConical,
  Shield,
  AlertCircle,
  CheckCircle,
  Loader2,
  LogOut,
  User,
  FileText,
  History,
} from "lucide-react";

const UserDashboard = () => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState<"analyze" | "history">("analyze");
  const [inputType, setInputType] = useState<"text" | "image">("text");
  const [ingredientInput, setIngredientInput] = useState("");
  const [skinType, setSkinType] = useState("");
  const [isAnalyzing, setIsAnalyzing] = useState(false);

  const skinTypes = [
    "Normal",
    "Dry",
    "Oily",
    "Combination",
    "Sensitive",
    "Acne-Prone",
  ];

  const handleAnalyze = async () => {
    if (!ingredientInput.trim()) return;
    setIsAnalyzing(true);
    // Simulate API call
    setTimeout(() => {
      setIsAnalyzing(false);
      // Navigate to results or show results
    }, 2000);
  };

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
              onClick={() => navigate("/profile/user")}
            >
              <User className="w-4 h-4" />
              <span>My Profile</span>
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

      <div className="max-w-7xl mx-auto px-6 py-8">
        {/* Welcome Section */}
        <div className="mb-8">
          <h1 className="text-2xl font-bold text-slate-900 mb-2">
            Ingredient Safety Analyzer
          </h1>
          <p className="text-slate-600">
            Analyze cosmetic products and verify chemical ingredients for skin
            safety and compliance.
          </p>
        </div>

        {/* Tabs */}
        <div className="flex gap-4 mb-8">
          <button
            className={`px-4 py-2 rounded-lg font-medium transition-all ${
              activeTab === "analyze"
                ? "bg-blue-600 text-white"
                : "bg-white text-slate-600 border border-slate-200 hover:bg-slate-50"
            }`}
            onClick={() => setActiveTab("analyze")}
          >
            <Search className="w-4 h-4 inline mr-2" />
            Analyze Ingredients
          </button>
          <button
            className={`px-4 py-2 rounded-lg font-medium transition-all ${
              activeTab === "history"
                ? "bg-blue-600 text-white"
                : "bg-white text-slate-600 border border-slate-200 hover:bg-slate-50"
            }`}
            onClick={() => setActiveTab("history")}
          >
            <History className="w-4 h-4 inline mr-2" />
            Analysis History
          </button>
        </div>

        {activeTab === "analyze" && (
          <div className="grid lg:grid-cols-3 gap-8">
            {/* Main Input Section */}
            <div className="lg:col-span-2">
              <div className="bg-white rounded-2xl border border-slate-200 p-6">
                <h2 className="text-lg font-semibold text-slate-900 mb-6">
                  Enter Ingredients to Analyze
                </h2>

                {/* Input Type Toggle */}
                <div className="flex gap-2 mb-6">
                  <button
                    className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                      inputType === "text"
                        ? "bg-blue-50 text-blue-600 border border-blue-200"
                        : "bg-slate-50 text-slate-600 border border-slate-200 hover:bg-slate-100"
                    }`}
                    onClick={() => setInputType("text")}
                  >
                    <FileText className="w-4 h-4 inline mr-2" />
                    Text Input
                  </button>
                  <button
                    className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                      inputType === "image"
                        ? "bg-blue-50 text-blue-600 border border-blue-200"
                        : "bg-slate-50 text-slate-600 border border-slate-200 hover:bg-slate-100"
                    }`}
                    onClick={() => setInputType("image")}
                  >
                    <Upload className="w-4 h-4 inline mr-2" />
                    Upload Image
                  </button>
                </div>

                {inputType === "text" ? (
                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-slate-700 mb-2">
                        Ingredient List
                      </label>
                      <textarea
                        className="w-full h-40 px-4 py-3 border border-slate-200 rounded-xl text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
                        placeholder="Enter ingredients separated by commas or new lines...&#10;&#10;Example:&#10;Aqua, Glycerin, Niacinamide, Hyaluronic Acid, Salicylic Acid"
                        value={ingredientInput}
                        onChange={(e) => setIngredientInput(e.target.value)}
                      />
                    </div>
                  </div>
                ) : (
                  <div className="border-2 border-dashed border-slate-200 rounded-xl p-8 text-center hover:border-blue-400 transition-colors cursor-pointer">
                    <Upload className="w-12 h-12 text-slate-300 mx-auto mb-4" />
                    <p className="text-slate-600 mb-2">
                      Drag and drop an image of the ingredient list
                    </p>
                    <p className="text-sm text-slate-400 mb-4">
                      or click to browse your files
                    </p>
                    <button className="btn-secondary text-sm">
                      Choose File
                    </button>
                  </div>
                )}

                {/* Skin Type Selection */}
                <div className="mt-6">
                  <label className="block text-sm font-medium text-slate-700 mb-2">
                    Your Skin Type (Optional)
                  </label>
                  <div className="flex flex-wrap gap-2">
                    {skinTypes.map((type) => (
                      <button
                        key={type}
                        className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                          skinType === type
                            ? "bg-blue-600 text-white"
                            : "bg-slate-50 text-slate-600 border border-slate-200 hover:bg-slate-100"
                        }`}
                        onClick={() =>
                          setSkinType(skinType === type ? "" : type)
                        }
                      >
                        {type}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Analyze Button */}
                <button
                  className="btn-primary w-full mt-8"
                  onClick={handleAnalyze}
                  disabled={isAnalyzing || !ingredientInput.trim()}
                >
                  {isAnalyzing ? (
                    <>
                      <Loader2 className="w-5 h-5 animate-spin" />
                      Analyzing...
                    </>
                  ) : (
                    <>
                      <Search className="w-5 h-5" />
                      Analyze Ingredients
                    </>
                  )}
                </button>
              </div>
            </div>

            {/* Sidebar */}
            <div className="space-y-6">
              {/* Quick Stats */}
              <div className="bg-white rounded-2xl border border-slate-200 p-6">
                <h3 className="text-sm font-semibold text-slate-900 mb-4">
                  Your Activity
                </h3>
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-slate-600">
                      Analyses today
                    </span>
                    <span className="text-lg font-bold text-slate-900">3</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-slate-600">
                      Products saved
                    </span>
                    <span className="text-lg font-bold text-slate-900">12</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-slate-600">
                      Safe products
                    </span>
                    <span className="text-lg font-bold text-emerald-600">
                      89%
                    </span>
                  </div>
                </div>
              </div>

              {/* Safety Legend */}
              <div className="bg-white rounded-2xl border border-slate-200 p-6">
                <h3 className="text-sm font-semibold text-slate-900 mb-4">
                  Safety Indicators
                </h3>
                <div className="space-y-3">
                  <div className="flex items-center gap-3">
                    <CheckCircle className="w-5 h-5 text-emerald-500" />
                    <span className="text-sm text-slate-600">Safe for use</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <AlertCircle className="w-5 h-5 text-amber-500" />
                    <span className="text-sm text-slate-600">
                      Use with caution
                    </span>
                  </div>
                  <div className="flex items-center gap-3">
                    <Shield className="w-5 h-5 text-red-500" />
                    <span className="text-sm text-slate-600">
                      Potentially harmful
                    </span>
                  </div>
                </div>
              </div>

              {/* Tips */}
              <div className="bg-blue-50 rounded-2xl p-6">
                <h3 className="text-sm font-semibold text-blue-900 mb-2">
                  💡 Pro Tip
                </h3>
                <p className="text-sm text-blue-700">
                  For best results, copy the full ingredient list from the
                  product packaging. Our AI works better with complete
                  information.
                </p>
              </div>
            </div>
          </div>
        )}

        {activeTab === "history" && (
          <div className="bg-white rounded-2xl border border-slate-200 p-6">
            <p className="text-slate-500 text-center py-12">
              No analysis history yet. Start by analyzing your first product!
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default UserDashboard;
