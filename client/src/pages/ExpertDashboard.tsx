import { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  FlaskConical,
  Beaker,
  Sparkles,
  Settings2,
  LogOut,
  Stethoscope,
  ChevronDown,
  Plus,
  X,
  Loader2,
  FileDown,
  BookOpen,
  TestTube,
  Shield,
  Zap,
  Search,
} from "lucide-react";

const ExpertDashboard = () => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState<
    "formulate" | "analyze" | "library"
  >("formulate");
  const [skinType, setSkinType] = useState("");
  const [skinConcerns, setSkinConcerns] = useState<string[]>([]);
  const [productType, setProductType] = useState("");
  const [concentration, setConcentration] = useState("standard");
  const [excludeIngredients, setExcludeIngredients] = useState("");
  const [includeIngredients, setIncludeIngredients] = useState("");
  const [isGenerating, setIsGenerating] = useState(false);
  const [advancedOpen, setAdvancedOpen] = useState(false);

  const skinTypes = [
    "Normal",
    "Dry",
    "Oily",
    "Combination",
    "Sensitive",
    "Mature",
  ];

  const skinConcernOptions = [
    "Acne",
    "Aging",
    "Hyperpigmentation",
    "Dehydration",
    "Redness",
    "Uneven Texture",
    "Dark Circles",
    "Large Pores",
    "Dullness",
    "Eczema",
  ];

  const productTypes = [
    "Serum",
    "Moisturizer",
    "Cleanser",
    "Toner",
    "Sunscreen",
    "Eye Cream",
    "Face Mask",
    "Exfoliant",
    "Essence",
    "Spot Treatment",
  ];

  const toggleConcern = (concern: string) => {
    setSkinConcerns((prev) =>
      prev.includes(concern)
        ? prev.filter((c) => c !== concern)
        : [...prev, concern],
    );
  };

  const handleGenerate = async () => {
    if (!skinType || !productType || skinConcerns.length === 0) return;
    setIsGenerating(true);
    setTimeout(() => {
      setIsGenerating(false);
    }, 3000);
  };

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
              onClick={() => navigate("/profile/expert")}
            >
              <Stethoscope className="w-4 h-4" />
              <span>My Profile</span>
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

      <div className="max-w-7xl mx-auto px-6 py-8">
        {/* Welcome Section */}
        <div className="mb-8">
          <h1 className="text-2xl font-bold text-white mb-2">
            AI Formulation Studio
          </h1>
          <p className="text-slate-400">
            Generate safe, AI-powered cosmetic formulations with clinical-grade
            ingredient recommendations.
          </p>
        </div>

        {/* Tabs */}
        <div className="flex gap-2 mb-8 bg-slate-800 p-1 rounded-xl w-fit">
          <button
            className={`px-4 py-2 rounded-lg font-medium text-sm transition-all ${
              activeTab === "formulate"
                ? "bg-blue-600 text-white"
                : "text-slate-400 hover:text-white"
            }`}
            onClick={() => setActiveTab("formulate")}
          >
            <Beaker className="w-4 h-4 inline mr-2" />
            Generate Formulation
          </button>
          <button
            className={`px-4 py-2 rounded-lg font-medium text-sm transition-all ${
              activeTab === "analyze"
                ? "bg-blue-600 text-white"
                : "text-slate-400 hover:text-white"
            }`}
            onClick={() => setActiveTab("analyze")}
          >
            <TestTube className="w-4 h-4 inline mr-2" />
            Analyze Formula
          </button>
          <button
            className={`px-4 py-2 rounded-lg font-medium text-sm transition-all ${
              activeTab === "library"
                ? "bg-blue-600 text-white"
                : "text-slate-400 hover:text-white"
            }`}
            onClick={() => setActiveTab("library")}
          >
            <BookOpen className="w-4 h-4 inline mr-2" />
            Ingredient Library
          </button>
        </div>

        {activeTab === "formulate" && (
          <div className="grid lg:grid-cols-3 gap-8">
            {/* Main Form */}
            <div className="lg:col-span-2 space-y-6">
              {/* Product Type */}
              <div className="bg-slate-800 rounded-2xl border border-slate-700 p-6">
                <h2 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
                  <Beaker className="w-5 h-5 text-blue-400" />
                  Product Configuration
                </h2>

                <div className="grid md:grid-cols-2 gap-6">
                  {/* Product Type */}
                  <div>
                    <label className="block text-sm font-medium text-slate-300 mb-2">
                      Product Type *
                    </label>
                    <div className="relative">
                      <select
                        className="w-full px-4 py-3 bg-slate-700 border border-slate-600 rounded-xl text-white appearance-none focus:outline-none focus:ring-2 focus:ring-blue-500"
                        value={productType}
                        onChange={(e) => setProductType(e.target.value)}
                      >
                        <option value="">Select product type...</option>
                        {productTypes.map((type) => (
                          <option key={type} value={type}>
                            {type}
                          </option>
                        ))}
                      </select>
                      <ChevronDown className="absolute right-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 pointer-events-none" />
                    </div>
                  </div>

                  {/* Skin Type */}
                  <div>
                    <label className="block text-sm font-medium text-slate-300 mb-2">
                      Target Skin Type *
                    </label>
                    <div className="relative">
                      <select
                        className="w-full px-4 py-3 bg-slate-700 border border-slate-600 rounded-xl text-white appearance-none focus:outline-none focus:ring-2 focus:ring-blue-500"
                        value={skinType}
                        onChange={(e) => setSkinType(e.target.value)}
                      >
                        <option value="">Select skin type...</option>
                        {skinTypes.map((type) => (
                          <option key={type} value={type}>
                            {type}
                          </option>
                        ))}
                      </select>
                      <ChevronDown className="absolute right-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 pointer-events-none" />
                    </div>
                  </div>
                </div>
              </div>

              {/* Skin Concerns */}
              <div className="bg-slate-800 rounded-2xl border border-slate-700 p-6">
                <h2 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
                  <Sparkles className="w-5 h-5 text-amber-400" />
                  Target Skin Concerns *
                </h2>
                <p className="text-sm text-slate-400 mb-4">
                  Select one or more concerns to address
                </p>
                <div className="flex flex-wrap gap-2">
                  {skinConcernOptions.map((concern) => (
                    <button
                      key={concern}
                      className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                        skinConcerns.includes(concern)
                          ? "bg-blue-600 text-white"
                          : "bg-slate-700 text-slate-300 border border-slate-600 hover:border-slate-500"
                      }`}
                      onClick={() => toggleConcern(concern)}
                    >
                      {skinConcerns.includes(concern) && (
                        <X className="w-3 h-3 inline mr-1" />
                      )}
                      {concern}
                    </button>
                  ))}
                </div>
              </div>

              {/* Advanced Options */}
              <div className="bg-slate-800 rounded-2xl border border-slate-700 overflow-hidden">
                <button
                  className="w-full px-6 py-4 flex items-center justify-between text-white hover:bg-slate-750 transition-colors"
                  onClick={() => setAdvancedOpen(!advancedOpen)}
                >
                  <span className="flex items-center gap-2 font-semibold">
                    <Settings2 className="w-5 h-5 text-slate-400" />
                    Advanced Options
                  </span>
                  <ChevronDown
                    className={`w-5 h-5 text-slate-400 transition-transform ${advancedOpen ? "rotate-180" : ""}`}
                  />
                </button>

                {advancedOpen && (
                  <div className="px-6 pb-6 space-y-6 border-t border-slate-700 pt-6">
                    {/* Concentration */}
                    <div>
                      <label className="block text-sm font-medium text-slate-300 mb-2">
                        Active Concentration Level
                      </label>
                      <div className="flex gap-2">
                        {["low", "standard", "high", "clinical"].map(
                          (level) => (
                            <button
                              key={level}
                              className={`px-4 py-2 rounded-lg text-sm font-medium capitalize transition-all ${
                                concentration === level
                                  ? "bg-blue-600 text-white"
                                  : "bg-slate-700 text-slate-300 border border-slate-600 hover:border-slate-500"
                              }`}
                              onClick={() => setConcentration(level)}
                            >
                              {level}
                            </button>
                          ),
                        )}
                      </div>
                    </div>

                    {/* Include Ingredients */}
                    <div>
                      <label className="block text-sm font-medium text-slate-300 mb-2">
                        Must Include Ingredients
                      </label>
                      <textarea
                        className="w-full h-20 px-4 py-3 bg-slate-700 border border-slate-600 rounded-xl text-white placeholder:text-slate-500 focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none"
                        placeholder="e.g., Niacinamide, Vitamin C, Retinol"
                        value={includeIngredients}
                        onChange={(e) => setIncludeIngredients(e.target.value)}
                      />
                    </div>

                    {/* Exclude Ingredients */}
                    <div>
                      <label className="block text-sm font-medium text-slate-300 mb-2">
                        Exclude Ingredients (Allergies/Preferences)
                      </label>
                      <textarea
                        className="w-full h-20 px-4 py-3 bg-slate-700 border border-slate-600 rounded-xl text-white placeholder:text-slate-500 focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none"
                        placeholder="e.g., Fragrance, Parabens, Sulfates"
                        value={excludeIngredients}
                        onChange={(e) => setExcludeIngredients(e.target.value)}
                      />
                    </div>
                  </div>
                )}
              </div>

              {/* Generate Button */}
              <button
                className="w-full py-4 rounded-xl bg-gradient-to-r from-blue-600 to-blue-500 text-white font-semibold hover:from-blue-700 hover:to-blue-600 transition-all flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
                onClick={handleGenerate}
                disabled={
                  isGenerating ||
                  !skinType ||
                  !productType ||
                  skinConcerns.length === 0
                }
              >
                {isGenerating ? (
                  <>
                    <Loader2 className="w-5 h-5 animate-spin" />
                    Generating Formulation...
                  </>
                ) : (
                  <>
                    <Sparkles className="w-5 h-5" />
                    Generate AI Formulation
                  </>
                )}
              </button>
            </div>

            {/* Sidebar */}
            <div className="space-y-6">
              {/* Quick Stats */}
              <div className="bg-slate-800 rounded-2xl border border-slate-700 p-6">
                <h3 className="text-sm font-semibold text-white mb-4">
                  Session Statistics
                </h3>
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-slate-400">
                      Formulations today
                    </span>
                    <span className="text-lg font-bold text-white">7</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-slate-400">
                      Exported reports
                    </span>
                    <span className="text-lg font-bold text-white">3</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-slate-400">API credits</span>
                    <span className="text-lg font-bold text-emerald-400">
                      847
                    </span>
                  </div>
                </div>
              </div>

              {/* Features */}
              <div className="bg-slate-800 rounded-2xl border border-slate-700 p-6">
                <h3 className="text-sm font-semibold text-white mb-4">
                  Professional Features
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
                </div>
              </div>

              {/* Recent Formulations */}
              <div className="bg-slate-800 rounded-2xl border border-slate-700 p-6">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-sm font-semibold text-white">
                    Recent Formulations
                  </h3>
                  <button className="text-xs text-blue-400 hover:text-blue-300">
                    View All
                  </button>
                </div>
                <div className="space-y-3">
                  <div className="p-3 bg-slate-700/50 rounded-lg">
                    <p className="text-sm text-white font-medium">
                      Anti-Aging Serum
                    </p>
                    <p className="text-xs text-slate-400">2 hours ago</p>
                  </div>
                  <div className="p-3 bg-slate-700/50 rounded-lg">
                    <p className="text-sm text-white font-medium">
                      Hydrating Moisturizer
                    </p>
                    <p className="text-xs text-slate-400">5 hours ago</p>
                  </div>
                  <div className="p-3 bg-slate-700/50 rounded-lg">
                    <p className="text-sm text-white font-medium">
                      Acne Spot Treatment
                    </p>
                    <p className="text-xs text-slate-400">Yesterday</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {activeTab === "analyze" && (
          <div className="bg-slate-800 rounded-2xl border border-slate-700 p-8 text-center">
            <TestTube className="w-12 h-12 text-slate-600 mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-white mb-2">
              Formula Analyzer
            </h3>
            <p className="text-slate-400 mb-6">
              Upload or paste an existing formulation to analyze ingredient
              interactions and safety.
            </p>
            <button className="btn-primary">
              <Plus className="w-4 h-4" />
              Start New Analysis
            </button>
          </div>
        )}

        {activeTab === "library" && (
          <div className="bg-slate-800 rounded-2xl border border-slate-700 p-8 text-center">
            <BookOpen className="w-12 h-12 text-slate-600 mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-white mb-2">
              Ingredient Library
            </h3>
            <p className="text-slate-400 mb-6">
              Access our database of 750k+ validated chemical compounds with
              detailed safety profiles.
            </p>
            <button className="btn-primary">
              <Search className="w-4 h-4" />
              Browse Library
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default ExpertDashboard;
