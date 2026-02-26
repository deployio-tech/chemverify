import { useState, useRef } from "react";
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

const API_BASE_URL =
  import.meta.env.VITE_API_BASE_URL || "http://localhost:8080";

const UserDashboard = () => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState<"analyze" | "history">("analyze");
  const [inputType, setInputType] = useState<"text" | "image">("text");
  const [ingredientInput, setIngredientInput] = useState("");
  const [skinType, setSkinType] = useState("");
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [analysisResult, setAnalysisResult] = useState<any>(null);
  const [analysisError, setAnalysisError] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const skinTypes = [
    "Normal",
    "Dry",
    "Oily",
    "Combination",
    "Sensitive",
    "Acne-Prone",
  ];

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file && file.type.startsWith("image/")) {
      setSelectedFile(file);
    } else {
      setSelectedFile(null);
      alert("Please select a valid image file (e.g., PNG, JPG, WEBP).");
    }
    // Reset input so re-selecting the same file triggers change
    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  const handleRemoveFile = () => {
    setSelectedFile(null);
    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  const handleAnalyze = async () => {
    if (inputType === "text" && !ingredientInput.trim()) return;
    if (inputType === "image" && !selectedFile) return;

    setIsAnalyzing(true);
    setAnalysisError(null);
    setAnalysisResult(null);

    const token = localStorage.getItem("token");

    try {
      if (inputType === "text") {
        // Parse ingredients into a lowercase array
        const ingredientsArray = ingredientInput
          .split(/[,\n]+/)
          .map((item) => item.trim().toLowerCase())
          .filter((item) => item.length > 0);

        console.log("Ingredients array:", ingredientsArray);

        // TODO: Replace with actual text-based API call
        // Example: await fetch('/api/analyze', { method: 'POST', body: JSON.stringify({ ingredients: ingredientsArray, skinType }) })
      } else {
        // Image upload flow — send to /api/chemicalIngredients/
        const formData = new FormData();
        formData.append("file", selectedFile!);

        // Send the DTO as a JSON blob part named "data"
        const dtoPayload = {
          skinType: skinType || null,
          ingredients: [],
        };
        formData.append(
          "data",
          new Blob([JSON.stringify(dtoPayload)], {
            type: "application/json",
          }),
        );

        console.log(
          "Uploading image:",
          selectedFile!.name,
          "with payload:",
          dtoPayload,
        );

        const response = await fetch(
          `${API_BASE_URL}/api/chemicalIngredients/`,
          {
            method: "POST",
            headers: {
              ...(token ? { Authorization: `Bearer ${token}` } : {}),
            },
            body: formData,
          },
        );

        if (!response.ok) {
          const errorText = await response.text();
          throw new Error(
            errorText || `Request failed with status ${response.status}`,
          );
        }

        const data = await response.json();
        setAnalysisResult(data);
        console.log("Analysis result:", data);
      }
    } catch (error: any) {
      console.error("Analysis failed:", error);
      setAnalysisError(
        error.message || "Something went wrong. Please try again.",
      );
    } finally {
      setIsAnalyzing(false);
    }
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
                  <div
                    className="border-2 border-dashed border-slate-200 rounded-xl p-8 text-center hover:border-blue-400 transition-colors cursor-pointer"
                    onClick={() =>
                      !selectedFile && fileInputRef.current?.click()
                    }
                  >
                    <input
                      type="file"
                      ref={fileInputRef}
                      accept="image/*"
                      onChange={handleFileSelect}
                      className="hidden"
                    />
                    {selectedFile ? (
                      <div className="flex flex-col items-center gap-3">
                        <img
                          src={URL.createObjectURL(selectedFile)}
                          alt="Preview"
                          className="max-h-40 rounded-lg object-contain"
                        />
                        <p className="text-sm font-medium text-slate-700">
                          {selectedFile.name}
                        </p>
                        <p className="text-xs text-slate-400">
                          {(selectedFile.size / 1024).toFixed(1)} KB
                        </p>
                        <button
                          type="button"
                          className="btn-secondary text-sm text-red-500 border-red-200 hover:bg-red-50"
                          onClick={(e) => {
                            e.stopPropagation();
                            handleRemoveFile();
                          }}
                        >
                          Remove File
                        </button>
                      </div>
                    ) : (
                      <>
                        <Upload className="w-12 h-12 text-slate-300 mx-auto mb-4" />
                        <p className="text-slate-600 mb-2">
                          Click to upload an image of the ingredient list
                        </p>
                        <p className="text-sm text-slate-400 mb-4">
                          Accepts PNG, JPG, WEBP, GIF images only
                        </p>
                        <button
                          type="button"
                          className="btn-secondary text-sm"
                          onClick={() => fileInputRef.current?.click()}
                        >
                          Choose Image
                        </button>
                      </>
                    )}
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
                  disabled={
                    isAnalyzing ||
                    (inputType === "text" && !ingredientInput.trim()) ||
                    (inputType === "image" && !selectedFile)
                  }
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

                {/* Error Display */}
                {analysisError && (
                  <div className="mt-6 p-4 bg-red-50 border border-red-200 rounded-xl flex items-start gap-3">
                    <AlertCircle className="w-5 h-5 text-red-500 mt-0.5 shrink-0" />
                    <div>
                      <p className="text-sm font-medium text-red-800">
                        Analysis Failed
                      </p>
                      <p className="text-sm text-red-600 mt-1">
                        {analysisError}
                      </p>
                    </div>
                  </div>
                )}

                {/* Result Display */}
                {analysisResult && (
                  <div className="mt-6 p-4 bg-emerald-50 border border-emerald-200 rounded-xl flex items-start gap-3">
                    <CheckCircle className="w-5 h-5 text-emerald-500 mt-0.5 shrink-0" />
                    <div className="w-full">
                      <p className="text-sm font-medium text-emerald-800">
                        Analysis Complete
                      </p>
                      <pre className="mt-2 text-sm text-emerald-700 bg-emerald-100 rounded-lg p-3 overflow-x-auto whitespace-pre-wrap">
                        {JSON.stringify(analysisResult, null, 2)}
                      </pre>
                    </div>
                  </div>
                )}
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
