import { useState, useRef, useMemo, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { sileo } from "sileo";
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
  Star,
  AlertTriangle,
  Lightbulb,
  ShieldCheck,
  Eye,
  ArrowLeft,
  Calendar,
  ChevronRight,
  Clock,
  Package,
} from "lucide-react";

// const API_BASE_URL =
//   import.meta.env.VITE_API_BASE_URL || "http://localhost:8080";

// Helper to get safety badge styles
const getSafetyBadge = (level: string) => {
  switch (level) {
    case "safe":
      return {
        bg: "bg-emerald-50",
        text: "text-emerald-700",
        border: "border-emerald-200",
        icon: <CheckCircle className="w-4 h-4 text-emerald-500" />,
        label: "Safe",
      };
    case "caution":
      return {
        bg: "bg-amber-50",
        text: "text-amber-700",
        border: "border-amber-200",
        icon: <AlertTriangle className="w-4 h-4 text-amber-500" />,
        label: "Caution",
      };
    case "avoid":
      return {
        bg: "bg-red-50",
        text: "text-red-700",
        border: "border-red-200",
        icon: <Shield className="w-4 h-4 text-red-500" />,
        label: "Avoid",
      };
    default:
      return {
        bg: "bg-slate-50",
        text: "text-slate-700",
        border: "border-slate-200",
        icon: <Eye className="w-4 h-4 text-slate-500" />,
        label: level,
      };
  }
};

// Helper to get safety score color
const getScoreColor = (score: number) => {
  if (score >= 8) return "text-emerald-600";
  if (score >= 5) return "text-amber-600";
  return "text-red-600";
};

const getScoreBg = (score: number) => {
  if (score >= 8) return "bg-emerald-50 border-emerald-200";
  if (score >= 5) return "bg-amber-50 border-amber-200";
  return "bg-red-50 border-red-200";
};

const getScoreBorderLeft = (score: number) => {
  if (score >= 8) return "border-l-emerald-500";
  if (score >= 5) return "border-l-amber-500";
  return "border-l-red-500";
};

// Helper to parse ragResponse JSON string into result object
const parseRagResponse = (ragResponse: string | null): any => {
  if (!ragResponse) return null;
  try {
    let parsed = JSON.parse(ragResponse);
    if (parsed && parsed.response) parsed = parsed.response;
    return parsed;
  } catch {
    return null;
  }
};

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
  const [selectedHistoryId, setSelectedHistoryId] = useState<string | null>(
    null,
  );
  const [historyData, setHistoryData] = useState<any[]>([]);
  const [historyLoading, setHistoryLoading] = useState(false);

  const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || "http://localhost:8080";

  // Fetch analysis history from backend
  const fetchHistory = async () => {
    const token = localStorage.getItem("token");
    if (!token) return;
    setHistoryLoading(true);
    try {
      const res = await fetch(
        `${API_BASE_URL}/api/chemicalIngredients/history`,
        {
          headers: { Authorization: `Bearer ${token}` },
        },
      );
      if (res.ok) {
        const data = await res.json();
        setHistoryData(data);
      }
    } catch (err) {
      console.error("Failed to fetch history:", err);
    } finally {
      setHistoryLoading(false);
    }
  };

  useEffect(() => {
    if (activeTab === "history") fetchHistory();
  }, [activeTab]);

  const selectedHistory = useMemo(
    () => historyData.find((h: any) => h.id === selectedHistoryId) ?? null,
    [selectedHistoryId, historyData],
  );

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
        // ─────────────────────────────────────────────────────────────
        // IMAGE UPLOAD FLOW
        // Sends the selected image file + skinType to the Spring Boot
        // backend at http://localhost:8080/api/chemicalIngredients/
        // ─────────────────────────────────────────────────────────────

        // Step 1: Create a FormData object to send multipart/form-data.
        //         The Spring Boot controller expects two @RequestPart params:
        //           - "file"  → the image (MultipartFile)
        //           - "data"  → JSON body with { skinType, ingredients }
        const formData = new FormData();

        // Step 2: Append the selected image file under the key "file".
        //         This maps to @RequestPart("file") MultipartFile file
        formData.append("file", selectedFile!);

        // Step 3: Build the JSON payload matching userChemRequestDTO.
        //         - skinType:    the user's selected skin type (e.g. "Oily")
        //         - ingredients: empty array since the backend extracts
        //                        ingredients from the image via OCR (Lambda)
        const requestData = {
          skinType: skinType || "Normal",
          ingredients: [] as string[],
        };

        // Step 4: Append the JSON payload as a Blob with type "application/json".
        //         This is required because @RequestPart("data") expects JSON,
        //         and FormData needs an explicit content type for non-file parts.
        formData.append(
          "data",
          new Blob([JSON.stringify(requestData)], { type: "application/json" }),
        );

        console.log("Sending image + skinType to Spring Boot backend:", {
          fileName: selectedFile!.name,
          fileSize: selectedFile!.size,
          skinType: requestData.skinType,
        });

        // Step 5: Send the FormData to the Spring Boot API.
        //         IMPORTANT: Do NOT set "Content-Type" header manually —
        //         the browser auto-sets it to "multipart/form-data" with
        //         the correct boundary when using FormData.
        const response = await fetch(
          `${API_BASE_URL}/api/chemicalIngredients/`,
          {
            method: "POST",
            headers: {
              // Authorization header if the user is logged in
              ...(token ? { Authorization: `Bearer ${token}` } : {}),
            },
            body: formData,
          },
        );

        // Step 6: Handle the response from the backend
        if (!response.ok) {
          const errorText = await response.text();
          throw new Error(
            errorText || `Request failed with status ${response.status}`,
          );
        }

        // Step 7: Parse the response JSON.
        //         The backend returns:
        //         {
        //           message: "Analysis completed successfully",
        //           id: "<document_id>",
        //           status: "COMPLETED",
        //           extractedText: "<OCR text from Lambda>",
        //           ragResponse: "<LLM analysis result>"
        //         }
        const text = await response.text();
        let data;
        try {
          data = JSON.parse(text);
        } catch {
          data = { message: text };
        }

        // Step 8: Extract the ragResponse and parse it.
        //         ragResponse from Spring Boot is a JSON *string* like:
        //         "{\"response\": { ...analysis data... }}"
        //         We need to: (a) parse the string → object,
        //                     (b) extract the inner .response key
        let result = data.ragResponse || data.response || data;

        // If ragResponse is a string, parse it into an object
        if (typeof result === "string") {
          try {
            result = JSON.parse(result);
          } catch {
            // If parsing fails, keep as-is
          }
        }

        // Unwrap the inner "response" key if present (Flask wraps it)
        if (result && typeof result === "object" && result.response) {
          result = result.response;
        }

        setAnalysisResult(result);
        console.log("Analysis result:", result);

        sileo.success({
          title: "Analysis Complete!",
          description: "Scroll down to check the analysis results.",
        });
      }
    } catch (error: any) {
      console.error("Analysis failed:", error);
      setAnalysisError(
        error.message || "Something went wrong. Please try again.",
      );
      sileo.error({
        title: "Analysis Failed",
        description: error.message || "Something went wrong. Please try again.",
      });
    } finally {
      setIsAnalyzing(false);
    }
  };

  // Render the beautiful analysis results
  const renderAnalysisResult = () => {
    if (!analysisResult) return null;

    const {
      skin_type,
      safety_score,
      overall_rating,
      ingredients,
      best_ingredients,
      ingredients_to_watch,
      allergen_warnings,
      product_summary,
      recommendations,
    } = analysisResult;

    return (
      <div className="mt-8 space-y-6 animate-in fade-in duration-500">
        {/* Header Card — Score + Rating */}
        <div
          className={`rounded-2xl border p-6 ${getScoreBg(safety_score || 0)}`}
        >
          <div className="flex items-center justify-between flex-wrap gap-4">
            <div className="flex items-center gap-4">
              <div
                className={`text-5xl font-bold ${getScoreColor(safety_score || 0)}`}
              >
                {safety_score || "?"}
                <span className="text-lg font-normal text-slate-400">/10</span>
              </div>
              <div>
                <h3 className="text-lg font-semibold text-slate-900">
                  {overall_rating || "Analysis Complete"}
                </h3>
                <p className="text-sm text-slate-600">
                  Skin Type:{" "}
                  <span className="font-medium capitalize">
                    {skin_type || "Not specified"}
                  </span>
                </p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <ShieldCheck
                className={`w-8 h-8 ${getScoreColor(safety_score || 0)}`}
              />
            </div>
          </div>
        </div>

        {/* Product Summary */}
        {product_summary && (
          <div className="bg-white rounded-2xl border border-slate-200 p-5">
            <h4 className="text-sm font-semibold text-slate-900 mb-2 flex items-center gap-2">
              <FileText className="w-4 h-4 text-blue-500" />
              Product Summary
            </h4>
            <p className="text-sm text-slate-600 leading-relaxed">
              {product_summary}
            </p>
          </div>
        )}

        {/* Best Ingredients & Watch List */}
        <div className="grid sm:grid-cols-2 gap-4">
          {best_ingredients && best_ingredients.length > 0 && (
            <div className="bg-emerald-50 rounded-2xl border border-emerald-200 p-5">
              <h4 className="text-sm font-semibold text-emerald-800 mb-3 flex items-center gap-2">
                <Star className="w-4 h-4 text-emerald-500" />
                Best Ingredients
              </h4>
              <ul className="space-y-2">
                {best_ingredients.map((name: string, i: number) => (
                  <li
                    key={i}
                    className="flex items-center gap-2 text-sm text-emerald-700"
                  >
                    <CheckCircle className="w-3.5 h-3.5 text-emerald-500 shrink-0" />
                    <span className="capitalize">{name}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}

          {ingredients_to_watch && ingredients_to_watch.length > 0 && (
            <div className="bg-amber-50 rounded-2xl border border-amber-200 p-5">
              <h4 className="text-sm font-semibold text-amber-800 mb-3 flex items-center gap-2">
                <Eye className="w-4 h-4 text-amber-500" />
                Ingredients to Watch
              </h4>
              <ul className="space-y-2">
                {ingredients_to_watch.map((name: string, i: number) => (
                  <li
                    key={i}
                    className="flex items-center gap-2 text-sm text-amber-700"
                  >
                    <AlertTriangle className="w-3.5 h-3.5 text-amber-500 shrink-0" />
                    <span className="capitalize">{name}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>

        {/* Allergen Warnings */}
        {allergen_warnings && allergen_warnings.length > 0 && (
          <div className="bg-red-50 rounded-2xl border border-red-200 p-5">
            <h4 className="text-sm font-semibold text-red-800 mb-3 flex items-center gap-2">
              <AlertCircle className="w-4 h-4 text-red-500" />
              Allergen Warnings
            </h4>
            <div className="flex flex-wrap gap-2">
              {allergen_warnings.map((name: string, i: number) => (
                <span
                  key={i}
                  className="px-3 py-1 bg-red-100 text-red-700 rounded-full text-xs font-medium capitalize"
                >
                  {name}
                </span>
              ))}
            </div>
          </div>
        )}

        {/* Full Ingredients List */}
        {ingredients && ingredients.length > 0 && (
          <div className="bg-white rounded-2xl border border-slate-200 p-5">
            <h4 className="text-sm font-semibold text-slate-900 mb-4 flex items-center gap-2">
              <FlaskConical className="w-4 h-4 text-blue-500" />
              Ingredients Analysis ({ingredients.length} ingredients)
            </h4>
            <div className="space-y-3">
              {ingredients.map((ing: any, i: number) => {
                const badge = getSafetyBadge(ing.safety_level);
                return (
                  <div
                    key={i}
                    className={`flex items-start justify-between gap-3 p-3 rounded-xl border ${badge.border} ${badge.bg} transition-all hover:shadow-sm`}
                  >
                    <div className="flex items-start gap-3 min-w-0">
                      <div className="mt-0.5 shrink-0">{badge.icon}</div>
                      <div className="min-w-0">
                        <p className="text-sm font-medium text-slate-900 capitalize">
                          {ing.name}
                        </p>
                        <p className="text-xs text-slate-500 mt-0.5">
                          {ing.benefit}
                        </p>
                      </div>
                    </div>
                    <span
                      className={`px-2.5 py-1 rounded-full text-xs font-medium shrink-0 ${badge.text} ${badge.bg} border ${badge.border}`}
                    >
                      {badge.label}
                    </span>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* Recommendations */}
        {recommendations && recommendations.length > 0 && (
          <div className="bg-blue-50 rounded-2xl border border-blue-200 p-5">
            <h4 className="text-sm font-semibold text-blue-800 mb-3 flex items-center gap-2">
              <Lightbulb className="w-4 h-4 text-blue-500" />
              Recommendations
            </h4>
            <ul className="space-y-2">
              {recommendations.map((rec: string, i: number) => (
                <li
                  key={i}
                  className="flex items-start gap-2 text-sm text-blue-700"
                >
                  <span className="mt-1 w-1.5 h-1.5 rounded-full bg-blue-400 shrink-0" />
                  {rec}
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>
    );
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
                    Your Skin Type
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

                {/* Beautiful Result Display */}
                {renderAnalysisResult()}
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
          <div>
            {/* Loading State */}
            {historyLoading ? (
              <div className="flex flex-col items-center justify-center py-20">
                <Loader2 className="w-10 h-10 text-blue-500 animate-spin mb-4" />
                <p className="text-slate-500">Loading analysis history...</p>
              </div>
            ) : historyData.length === 0 ? (
              /* Empty State */
              <div className="flex flex-col items-center justify-center py-20 text-center">
                <div className="w-20 h-20 rounded-full bg-blue-50 flex items-center justify-center mb-6">
                  <FlaskConical className="w-10 h-10 text-blue-400" />
                </div>
                <h2 className="text-xl font-bold text-slate-900 mb-2">
                  No Analyses Yet
                </h2>
                <p className="text-slate-500 max-w-md mb-8">
                  You haven't analysed any products yet. Upload an image or
                  enter ingredients to get started with your first analysis.
                </p>
                <button
                  className="btn-primary px-8 py-3"
                  onClick={() => setActiveTab("analyze")}
                >
                  <Search className="w-5 h-5" />
                  Start Analysing
                </button>
              </div>
            ) : selectedHistory ? (
              /* ── Detail View ── */
              <div className="space-y-6">
                <button
                  onClick={() => setSelectedHistoryId(null)}
                  className="inline-flex items-center gap-2 text-sm font-medium text-blue-600 hover:text-blue-800 transition-colors"
                >
                  <ArrowLeft className="w-4 h-4" />
                  Back to History
                </button>

                <div className="bg-white rounded-2xl border border-slate-200 p-6">
                  <div className="flex items-start justify-between flex-wrap gap-4 mb-6">
                    <div>
                      <h2 className="text-xl font-bold text-slate-900">
                        Analysis — {selectedHistory.skinType}
                      </h2>
                      <div className="flex items-center gap-4 mt-2 text-sm text-slate-500">
                        {selectedHistory.createdAt && (
                          <>
                            <span className="inline-flex items-center gap-1">
                              <Calendar className="w-3.5 h-3.5" />
                              {new Date(
                                selectedHistory.createdAt,
                              ).toLocaleDateString("en-IN", {
                                day: "numeric",
                                month: "long",
                                year: "numeric",
                              })}
                            </span>
                            <span className="inline-flex items-center gap-1">
                              <Clock className="w-3.5 h-3.5" />
                              {new Date(
                                selectedHistory.createdAt,
                              ).toLocaleTimeString("en-IN", {
                                hour: "2-digit",
                                minute: "2-digit",
                              })}
                            </span>
                          </>
                        )}
                        <span className="inline-flex items-center gap-1 capitalize px-2 py-0.5 rounded-full bg-slate-100 text-xs font-medium">
                          {selectedHistory.imageUrl ? (
                            <>
                              <Upload className="w-3 h-3" /> Image
                            </>
                          ) : (
                            <>
                              <FileText className="w-3 h-3" /> Text
                            </>
                          )}
                        </span>
                        <span
                          className={`px-2 py-0.5 rounded-full text-xs font-medium ${selectedHistory.status === "COMPLETED" ? "bg-emerald-100 text-emerald-700" : selectedHistory.status === "FAILED" ? "bg-red-100 text-red-700" : "bg-amber-100 text-amber-700"}`}
                        >
                          {selectedHistory.status}
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Render parsed RAG result */}
                  {(() => {
                    const r = parseRagResponse(selectedHistory.ragResponse);
                    if (!r)
                      return (
                        <p className="text-sm text-slate-500">
                          No analysis result available for this record.
                        </p>
                      );
                    return (
                      <div className="space-y-6">
                        {/* Score header */}
                        <div
                          className={`rounded-2xl border p-6 ${getScoreBg(r.safety_score || 0)}`}
                        >
                          <div className="flex items-center justify-between flex-wrap gap-4">
                            <div className="flex items-center gap-4">
                              <div
                                className={`text-5xl font-bold ${getScoreColor(r.safety_score || 0)}`}
                              >
                                {r.safety_score || "?"}
                                <span className="text-lg font-normal text-slate-400">
                                  /10
                                </span>
                              </div>
                              <div>
                                <h3 className="text-lg font-semibold text-slate-900">
                                  {r.overall_rating || "Analysis Complete"}
                                </h3>
                                <p className="text-sm text-slate-600">
                                  Skin Type:{" "}
                                  <span className="font-medium capitalize">
                                    {r.skin_type || selectedHistory.skinType}
                                  </span>
                                </p>
                              </div>
                            </div>
                            <ShieldCheck
                              className={`w-8 h-8 ${getScoreColor(r.safety_score || 0)}`}
                            />
                          </div>
                        </div>

                        {/* Summary */}
                        {r.product_summary && (
                          <div className="bg-white rounded-2xl border border-slate-200 p-5">
                            <h4 className="text-sm font-semibold text-slate-900 mb-2 flex items-center gap-2">
                              <FileText className="w-4 h-4 text-blue-500" />{" "}
                              Product Summary
                            </h4>
                            <p className="text-sm text-slate-600 leading-relaxed">
                              {r.product_summary}
                            </p>
                          </div>
                        )}

                        {/* Best / Watch */}
                        <div className="grid sm:grid-cols-2 gap-4">
                          {r.best_ingredients?.length > 0 && (
                            <div className="bg-emerald-50 rounded-2xl border border-emerald-200 p-5">
                              <h4 className="text-sm font-semibold text-emerald-800 mb-3 flex items-center gap-2">
                                <Star className="w-4 h-4 text-emerald-500" />{" "}
                                Best Ingredients
                              </h4>
                              <ul className="space-y-2">
                                {r.best_ingredients.map(
                                  (n: string, i: number) => (
                                    <li
                                      key={i}
                                      className="flex items-center gap-2 text-sm text-emerald-700"
                                    >
                                      <CheckCircle className="w-3.5 h-3.5 text-emerald-500 shrink-0" />
                                      <span className="capitalize">{n}</span>
                                    </li>
                                  ),
                                )}
                              </ul>
                            </div>
                          )}
                          {r.ingredients_to_watch?.length > 0 && (
                            <div className="bg-amber-50 rounded-2xl border border-amber-200 p-5">
                              <h4 className="text-sm font-semibold text-amber-800 mb-3 flex items-center gap-2">
                                <Eye className="w-4 h-4 text-amber-500" />{" "}
                                Ingredients to Watch
                              </h4>
                              <ul className="space-y-2">
                                {r.ingredients_to_watch.map(
                                  (n: string, i: number) => (
                                    <li
                                      key={i}
                                      className="flex items-center gap-2 text-sm text-amber-700"
                                    >
                                      <AlertTriangle className="w-3.5 h-3.5 text-amber-500 shrink-0" />
                                      <span className="capitalize">{n}</span>
                                    </li>
                                  ),
                                )}
                              </ul>
                            </div>
                          )}
                        </div>

                        {/* Allergens */}
                        {r.allergen_warnings?.length > 0 && (
                          <div className="bg-red-50 rounded-2xl border border-red-200 p-5">
                            <h4 className="text-sm font-semibold text-red-800 mb-3 flex items-center gap-2">
                              <AlertCircle className="w-4 h-4 text-red-500" />{" "}
                              Allergen Warnings
                            </h4>
                            <div className="flex flex-wrap gap-2">
                              {r.allergen_warnings.map(
                                (n: string, i: number) => (
                                  <span
                                    key={i}
                                    className="px-3 py-1 bg-red-100 text-red-700 rounded-full text-xs font-medium capitalize"
                                  >
                                    {n}
                                  </span>
                                ),
                              )}
                            </div>
                          </div>
                        )}

                        {/* Full ingredients */}
                        {r.ingredients?.length > 0 && (
                          <div className="bg-white rounded-2xl border border-slate-200 p-5">
                            <h4 className="text-sm font-semibold text-slate-900 mb-4 flex items-center gap-2">
                              <FlaskConical className="w-4 h-4 text-blue-500" />{" "}
                              Ingredients Analysis ({r.ingredients.length})
                            </h4>
                            <div className="space-y-3">
                              {r.ingredients.map((ing: any, i: number) => {
                                const badge = getSafetyBadge(ing.safety_level);
                                return (
                                  <div
                                    key={i}
                                    className={`flex items-start justify-between gap-3 p-3 rounded-xl border ${badge.border} ${badge.bg} transition-all hover:shadow-sm`}
                                  >
                                    <div className="flex items-start gap-3 min-w-0">
                                      <div className="mt-0.5 shrink-0">
                                        {badge.icon}
                                      </div>
                                      <div className="min-w-0">
                                        <p className="text-sm font-medium text-slate-900 capitalize">
                                          {ing.name}
                                        </p>
                                        <p className="text-xs text-slate-500 mt-0.5">
                                          {ing.benefit}
                                        </p>
                                      </div>
                                    </div>
                                    <span
                                      className={`px-2.5 py-1 rounded-full text-xs font-medium shrink-0 ${badge.text} ${badge.bg} border ${badge.border}`}
                                    >
                                      {badge.label}
                                    </span>
                                  </div>
                                );
                              })}
                            </div>
                          </div>
                        )}

                        {/* Recommendations */}
                        {r.recommendations?.length > 0 && (
                          <div className="bg-blue-50 rounded-2xl border border-blue-200 p-5">
                            <h4 className="text-sm font-semibold text-blue-800 mb-3 flex items-center gap-2">
                              <Lightbulb className="w-4 h-4 text-blue-500" />{" "}
                              Recommendations
                            </h4>
                            <ul className="space-y-2">
                              {r.recommendations.map(
                                (rec: string, i: number) => (
                                  <li
                                    key={i}
                                    className="flex items-start gap-2 text-sm text-blue-700"
                                  >
                                    <span className="mt-1 w-1.5 h-1.5 rounded-full bg-blue-400 shrink-0" />
                                    {rec}
                                  </li>
                                ),
                              )}
                            </ul>
                          </div>
                        )}
                      </div>
                    );
                  })()}
                </div>
              </div>
            ) : (
              /* ── List View ── */
              <div className="space-y-4">
                <div className="flex items-center justify-between mb-2">
                  <h2 className="text-lg font-semibold text-slate-900">
                    Recent Analyses
                  </h2>
                  <span className="text-sm text-slate-500">
                    {historyData.length} results
                  </span>
                </div>

                {historyData.map((item: any) => {
                  const parsed = parseRagResponse(item.ragResponse);
                  const score = parsed?.safety_score || 0;
                  const scoreColor = getScoreColor(score);
                  const scoreBg = getScoreBg(score);
                  return (
                    <button
                      key={item.id}
                      onClick={() => setSelectedHistoryId(item.id)}
                      className={`w-full text-left bg-white rounded-2xl border border-slate-200 border-l-4 ${getScoreBorderLeft(score)} p-5 hover:border-blue-300 hover:border-l-blue-500 hover:shadow-md transition-all duration-200 group overflow-hidden`}
                    >
                      <div className="flex items-center gap-4">
                        {/* Score circle */}
                        <div
                          className={`w-14 h-14 rounded-xl flex flex-col items-center justify-center shrink-0 border ${scoreBg}`}
                        >
                          <span
                            className={`text-xl font-bold leading-none ${scoreColor}`}
                          >
                            {score || "?"}
                          </span>
                          <span className="text-[10px] text-slate-400">
                            /10
                          </span>
                        </div>

                        {/* Info */}
                        <div className="flex-1 min-w-0">
                          <h3 className="text-sm font-semibold text-slate-900 truncate group-hover:text-blue-700 transition-colors">
                            {parsed?.overall_rating ||
                              `Analysis — ${item.skinType}`}
                          </h3>
                          <div className="flex items-center gap-3 mt-1.5 text-xs text-slate-500">
                            {item.createdAt && (
                              <span className="inline-flex items-center gap-1">
                                <Calendar className="w-3 h-3" />
                                {new Date(item.createdAt).toLocaleDateString(
                                  "en-IN",
                                  {
                                    day: "numeric",
                                    month: "short",
                                    year: "numeric",
                                  },
                                )}
                              </span>
                            )}
                            <span className="inline-flex items-center gap-1 capitalize">
                              <Package className="w-3 h-3" />
                              {item.skinType}
                            </span>
                            <span
                              className={`px-2 py-0.5 rounded-full text-xs font-medium ${item.status === "COMPLETED" ? "bg-emerald-100 text-emerald-700" : item.status === "FAILED" ? "bg-red-100 text-red-700" : "bg-amber-100 text-amber-700"}`}
                            >
                              {item.status}
                            </span>
                          </div>
                          <p className="text-xs text-slate-400 mt-1 truncate">
                            {parsed?.product_summary ||
                              "Analysis in progress..."}
                          </p>
                        </div>

                        {/* Arrow */}
                        <ChevronRight className="w-5 h-5 text-slate-300 group-hover:text-blue-500 transition-colors shrink-0" />
                      </div>
                    </button>
                  );
                })}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default UserDashboard;
