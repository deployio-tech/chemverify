import { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  FlaskConical,
  Beaker,
  Sparkles,
  LogOut,
  Stethoscope,
  ChevronDown,
  X,
  Loader2,
  TestTube,
  Zap,
  Atom,
  Droplets,
  Thermometer,
  Wind,
  Sun,
  Activity,
  LayoutDashboard,
  UserCircle,
} from "lucide-react";

/* ─── Types ──────────────────────────────────────────────────────────────── */
interface FormulationIngredient {
  name: string;
  recommended_concentration: string;
  role_in_product: string;
  reason: string;
  caution: string | null;
}

interface FormulationResult {
  product_type: string;
  product_name_suggestion: string;
  formulation_type: string;
  target_pH: string;
  shelf_life_estimate: string;
  patient_profile: {
    skin_type: string;
    skin_condition: string;
    weather: string;
    skin_color: string;
  };
  formulation: FormulationIngredient[];
  application_instructions: string;
  climate_considerations: string;
  formulation_notes: string;
}

/* ─── Role colour map ────────────────────────────────────────────────────── */
const ROLE_COLORS: Record<string, string> = {
  Humectant: "bg-sky-500/10 text-sky-400 border-sky-500/20",
  Emollient: "bg-amber-500/10 text-amber-400 border-amber-500/20",
  Emulsifier: "bg-violet-500/10 text-violet-400 border-violet-500/20",
  Preservative: "bg-red-500/10 text-red-400 border-red-500/20",
  Thickener: "bg-orange-500/10 text-orange-400 border-orange-500/20",
  Antioxidant: "bg-green-500/10 text-green-400 border-green-500/20",
  Active: "bg-pink-500/10 text-pink-400 border-pink-500/20",
  Solvent: "bg-cyan-500/10 text-cyan-400 border-cyan-500/20",
  default: "bg-slate-500/10 text-slate-400 border-slate-500/20",
};

function roleColor(role: string) {
  const key = Object.keys(ROLE_COLORS).find((k) =>
    role.toLowerCase().includes(k.toLowerCase()),
  );
  return key ? ROLE_COLORS[key] : ROLE_COLORS.default;
}

/* ─── Main component ─────────────────────────────────────────────────────── */
const ExpertDashboard = () => {
  const navigate = useNavigate();

  /* form state */
  const [skinType, setSkinType] = useState("");
  const [skinConcerns, setSkinConcerns] = useState<string[]>([]);
  const [productType, setProductType] = useState("");
  const [weather, setWeather] = useState("");
  const [skinColor, setSkinColor] = useState("");

  /* UI state */
  const [isGenerating, setIsGenerating] = useState(false);
  const [result, setResult] = useState<FormulationResult | null>(null);
  const [error, setError] = useState<string | null>(null);

  /* ── options ── */
  const skinTypes = ["Normal", "Dry", "Oily", "Combination", "Sensitive", "Mature"];
  const skinConcernOptions = ["Acne", "Aging", "Hyperpigmentation", "Dehydration", "Redness", "Uneven Texture", "Dark Circles", "Large Pores", "Dullness", "Eczema"];
  const productTypes = ["Serum", "Moisturizer", "Cleanser", "Toner", "Sunscreen", "Eye Cream", "Face Mask", "Exfoliant", "Night Cream", "Spot Treatment"];
  const weatherOptions = ["Hot and humid", "Cold and dry", "Tropical and sunny", "Cold and windy", "Temperate and moderate", "Humid and rainy", "Polluted urban"];
  const skinColorOptions = ["Fair / Light", "Medium / Olive", "Medium / Wheatish", "Medium / Brown", "Dark / Deep"];

  const toggleConcern = (c: string) =>
    setSkinConcerns((p) => (p.includes(c) ? p.filter((x) => x !== c) : [...p, c]));

  /* ── submit ── */
  const handleGenerate = async () => {
    if (!skinType || !productType || !weather || !skinColor || skinConcerns.length === 0) {
      setError("Please fill all required fields marked with *.");
      return;
    }
    setError(null);
    setResult(null);
    setIsGenerating(true);
    try {
      const res = await fetch("http://localhost:8080/api/recommend", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          productType: productType.toLowerCase(),
          skinType: skinType.toLowerCase(),
          skinCondition: skinConcerns.join(", "),
          weather: weather.toLowerCase(),
          skinColor: skinColor.toLowerCase(),
        }),
      });
      if (!res.ok) throw new Error("Server returned " + res.status);
      const raw = await res.json();
      // Spring Boot returns flat DTO; Flask returns { "response": {...} }
      // Handle both gracefully
      const data: FormulationResult = raw.response ? raw.response : raw;
      if (!data.formulation) throw new Error("Unexpected response format from server.");
      setResult(data);
    } catch (e: any) {
      setError(e.message || "An unexpected error occurred.");
    } finally {
      setIsGenerating(false);
    }
  };

  /* ─────────────────────────────────────────────────────────────────────── */
  return (
    <div className="min-h-screen bg-[#080d14] text-white font-['Inter',sans-serif]">

      {/* ── Ambient background glow ── */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden">
        <div className="absolute -top-40 -left-40 w-[600px] h-[600px] rounded-full bg-blue-600/5 blur-[120px]" />
        <div className="absolute top-1/2 -right-60 w-[500px] h-[500px] rounded-full bg-violet-600/5 blur-[120px]" />
        <div className="absolute bottom-0 left-1/3 w-[400px] h-[400px] rounded-full bg-cyan-600/4 blur-[100px]" />
      </div>

      {/* ────────────── HEADER ────────────── */}
      <header className="relative z-10 border-b border-white/5 bg-[#0a1120]/80 backdrop-blur-xl">
        <div className="max-w-[1400px] mx-auto px-8 h-16 flex items-center justify-between">

          {/* Logo */}
          <div className="flex items-center gap-3">
            <div className="relative w-8 h-8 flex items-center justify-center">
              <div className="absolute inset-0 rounded-lg bg-gradient-to-br from-blue-500 to-violet-600 opacity-20" />
              <Atom className="w-5 h-5 text-blue-400" />
            </div>
            <div>
              <span className="text-base font-bold tracking-tight">
                Chem<span className="text-blue-400">Verify</span>
              </span>
              <span className="ml-2 px-2 py-0.5 text-[10px] font-semibold uppercase tracking-widest rounded-full bg-blue-500/10 text-blue-400 border border-blue-500/20">
                Pro
              </span>
            </div>
          </div>

          {/* Nav */}
          <nav className="flex items-center gap-1">
            <button className="flex items-center gap-2 px-4 py-2 rounded-lg text-xs font-medium text-blue-400 bg-blue-500/10 border border-blue-500/20">
              <LayoutDashboard className="w-3.5 h-3.5" />
              Formulation Studio
            </button>
            <button
              className="flex items-center gap-2 px-4 py-2 rounded-lg text-xs font-medium text-slate-400 hover:text-white hover:bg-white/5 transition-all"
              onClick={() => navigate("/profile/expert")}
            >
              <UserCircle className="w-3.5 h-3.5" />
              My Profile
            </button>
            <button
              className="flex items-center gap-2 px-4 py-2 rounded-lg text-xs font-medium text-slate-300 hover:text-red-400 hover:bg-red-500/5 transition-all"
              onClick={() => navigate("/logout")}
            >
              <LogOut className="w-3.5 h-3.5" />
              Logout
            </button>
          </nav>
        </div>
      </header>

      {/* ────────────── BODY ────────────── */}
      <main className="relative z-10 max-w-[1400px] mx-auto px-8 py-10">

        {/* Page title */}
        <div className="mb-10">
          <p className="text-[10px] uppercase tracking-[0.2em] text-blue-400/70 font-semibold mb-2">
            Dermatology · AI Formulation Engine
          </p>
          <h1 className="text-3xl font-bold tracking-tight">
            Custom Product Formulator
          </h1>
          <p className="mt-1.5 text-sm text-slate-300">
            Define a patient's skin profile and let our RAG-powered AI synthesise a
            clinically-backed ingredient formulation.
          </p>
        </div>

        <div className="grid xl:grid-cols-[1fr_380px] gap-8 items-start">

          {/* ─────── LEFT COLUMN ─────── */}
          <div className="space-y-6">

            {/* ── Patient & Product grid ── */}
            <section className="rounded-2xl border border-white/5 bg-white/[0.03] p-6">
              <div className="flex items-center gap-2 mb-6">
                <Stethoscope className="w-4 h-4 text-blue-400" />
                <h2 className="text-sm font-semibold text-white">Patient Profile &amp; Product Target</h2>
              </div>

              <div className="grid md:grid-cols-2 xl:grid-cols-4 gap-4">
                {/* Product Type */}
                <div>
                  <label className="block text-[10px] uppercase tracking-widest text-slate-300 mb-2 font-semibold">
                    Product Type <span className="text-blue-400">*</span>
                  </label>
                  <div className="relative">
                    <select
                      className="w-full px-3.5 py-2.5 rounded-xl bg-white/5 border border-white/8 text-sm text-white appearance-none focus:outline-none focus:ring-1 focus:ring-blue-500/50 focus:border-blue-500/50 transition-all"
                      value={productType}
                      onChange={(e) => setProductType(e.target.value)}
                    >
                      <option value="" className="bg-slate-900">Select…</option>
                      {productTypes.map((t) => <option key={t} value={t} className="bg-slate-900">{t}</option>)}
                    </select>
                    <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-slate-300 pointer-events-none" />
                  </div>
                </div>

                {/* Skin Type */}
                <div>
                  <label className="block text-[10px] uppercase tracking-widest text-slate-300 mb-2 font-semibold">
                    Skin Type <span className="text-blue-400">*</span>
                  </label>
                  <div className="relative">
                    <select
                      className="w-full px-3.5 py-2.5 rounded-xl bg-white/5 border border-white/8 text-sm text-white appearance-none focus:outline-none focus:ring-1 focus:ring-blue-500/50 focus:border-blue-500/50 transition-all"
                      value={skinType}
                      onChange={(e) => setSkinType(e.target.value)}
                    >
                      <option value="" className="bg-slate-900">Select…</option>
                      {skinTypes.map((t) => <option key={t} value={t} className="bg-slate-900">{t}</option>)}
                    </select>
                    <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-slate-300 pointer-events-none" />
                  </div>
                </div>

                {/* Skin Tone */}
                <div>
                  <label className="block text-[10px] uppercase tracking-widest text-slate-300 mb-2 font-semibold">
                    Skin Tone <span className="text-blue-400">*</span>
                  </label>
                  <div className="relative">
                    <select
                      className="w-full px-3.5 py-2.5 rounded-xl bg-white/5 border border-white/8 text-sm text-white appearance-none focus:outline-none focus:ring-1 focus:ring-blue-500/50 focus:border-blue-500/50 transition-all"
                      value={skinColor}
                      onChange={(e) => setSkinColor(e.target.value)}
                    >
                      <option value="" className="bg-slate-900">Select…</option>
                      {skinColorOptions.map((c) => <option key={c} value={c} className="bg-slate-900">{c}</option>)}
                    </select>
                    <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-slate-300 pointer-events-none" />
                  </div>
                </div>

                {/* Weather */}
                <div>
                  <label className="block text-[10px] uppercase tracking-widest text-slate-300 mb-2 font-semibold">
                    Climate <span className="text-blue-400">*</span>
                  </label>
                  <div className="relative">
                    <select
                      className="w-full px-3.5 py-2.5 rounded-xl bg-white/5 border border-white/8 text-sm text-white appearance-none focus:outline-none focus:ring-1 focus:ring-blue-500/50 focus:border-blue-500/50 transition-all"
                      value={weather}
                      onChange={(e) => setWeather(e.target.value)}
                    >
                      <option value="" className="bg-slate-900">Select…</option>
                      {weatherOptions.map((w) => <option key={w} value={w} className="bg-slate-900">{w}</option>)}
                    </select>
                    <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-slate-300 pointer-events-none" />
                  </div>
                </div>
              </div>
            </section>

            {/* ── Skin Concerns ── */}
            <section className="rounded-2xl border border-white/5 bg-white/[0.03] p-6">
              <div className="flex items-center justify-between mb-5">
                <div className="flex items-center gap-2">
                  <Activity className="w-4 h-4 text-violet-400" />
                  <h2 className="text-sm font-semibold text-white">
                    Primary Skin Concerns <span className="text-blue-400">*</span>
                  </h2>
                </div>
                {skinConcerns.length > 0 && (
                  <span className="text-[10px] font-semibold text-violet-400 bg-violet-500/10 border border-violet-500/20 px-2.5 py-1 rounded-full">
                    {skinConcerns.length} selected
                  </span>
                )}
              </div>
              <div className="flex flex-wrap gap-2">
                {skinConcernOptions.map((c) => {
                  const active = skinConcerns.includes(c);
                  return (
                    <button
                      key={c}
                      onClick={() => toggleConcern(c)}
                      className={`px-3.5 py-1.5 rounded-lg text-xs font-medium transition-all border ${
                        active
                          ? "bg-blue-600/20 text-blue-300 border-blue-500/40 shadow-[0_0_12px_rgba(59,130,246,0.15)]"
                          : "bg-white/3 text-slate-400 border-white/6 hover:border-white/15 hover:text-white"
                      }`}
                    >
                      {active && <X className="w-2.5 h-2.5 inline mr-1.5 opacity-70" />}
                      {c}
                    </button>
                  );
                })}
              </div>
            </section>

            {/* ── Error ── */}
            {error && (
              <div className="flex items-start gap-3 px-4 py-3 rounded-xl bg-red-500/8 border border-red-500/20 text-red-400">
                <X className="w-4 h-4 mt-0.5 flex-shrink-0" />
                <p className="text-xs font-medium">{error}</p>
              </div>
            )}

            {/* ── Generate button ── */}
            <button
              onClick={handleGenerate}
              disabled={isGenerating || !skinType || !productType || !weather || !skinColor || skinConcerns.length === 0}
              className="relative w-full py-4 rounded-2xl font-semibold text-sm tracking-wide overflow-hidden
                bg-gradient-to-r from-blue-600 to-violet-600
                hover:from-blue-500 hover:to-violet-500
                disabled:opacity-40 disabled:cursor-not-allowed
                transition-all duration-200
                flex items-center justify-center gap-2.5
                shadow-[0_4px_32px_rgba(99,102,241,0.25)]
                hover:shadow-[0_4px_40px_rgba(99,102,241,0.4)]"
            >
              {/* shimmer overlay */}
              {!isGenerating && (
                <span className="absolute inset-0 bg-gradient-to-r from-transparent via-white/5 to-transparent translate-x-[-100%] hover:translate-x-[100%] transition-transform duration-700" />
              )}
              {isGenerating ? (
                <><Loader2 className="w-4 h-4 animate-spin" /> Synthesising Formulation…</>
              ) : (
                <><Sparkles className="w-4 h-4" /> Generate AI Formulation</>
              )}
            </button>

            {/* ────── RESULT ────── */}
            {result && (
              <div className="space-y-5 pt-2">

                {/* Result header */}
                <div className="rounded-2xl border border-white/6 bg-gradient-to-br from-white/[0.04] to-blue-500/[0.03] p-6">
                  <div className="flex items-start justify-between gap-4 flex-wrap">
                    <div>
                      <p className="text-[10px] uppercase tracking-[0.18em] text-blue-400/70 font-semibold mb-1">
                        AI Formulation Result
                      </p>
                      <h2 className="text-2xl font-bold tracking-tight text-white">
                        {result.product_name_suggestion}
                      </h2>
                    </div>
                    <div className="flex flex-wrap gap-2 mt-1">
                      {[
                        { icon: <FlaskConical className="w-3 h-3" />, label: result.formulation_type },
                        { icon: <TestTube className="w-3 h-3" />, label: `pH ${result.target_pH}` },
                        { icon: <Droplets className="w-3 h-3" />, label: result.shelf_life_estimate },
                      ].map((tag) => (
                        <span key={tag.label} className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-white/5 border border-white/8 text-[11px] text-slate-300 font-medium">
                          {tag.icon} {tag.label}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>

                {/* Ingredient table */}
                <div className="rounded-2xl border border-white/5 bg-white/[0.02] overflow-hidden">
                  <div className="px-6 py-4 border-b border-white/5 flex items-center gap-2">
                    <Beaker className="w-4 h-4 text-blue-400" />
                    <h3 className="text-sm font-semibold">Ingredient Formulation</h3>
                    <span className="ml-auto text-[10px] text-slate-300 font-medium">
                      {result.formulation?.length} ingredients
                    </span>
                  </div>

                  {/* Column headers */}
                  <div className="grid grid-cols-[2fr_1fr_1fr_2fr] gap-4 px-6 py-2.5 border-b border-white/4">
                    {["Ingredient (INCI)", "Role", "Concentration", "Reason"].map((h) => (
                      <p key={h} className="text-[10px] uppercase tracking-widest text-slate-300 font-semibold">{h}</p>
                    ))}
                  </div>

                  <div className="divide-y divide-white/4">
                    {result.formulation?.map((item, idx) => (
                      <div
                        key={idx}
                        className="grid grid-cols-[2fr_1fr_1fr_2fr] gap-4 px-6 py-4 items-start hover:bg-white/[0.025] transition-colors"
                      >
                        <div>
                          <p className="text-sm font-semibold text-white leading-snug">{item.name}</p>
                          {item.caution && (
                            <p className="mt-1.5 flex items-center gap-1 text-[10px] text-amber-400 font-medium">
                              <Zap className="w-2.5 h-2.5" /> {item.caution}
                            </p>
                          )}
                        </div>
                        <div>
                          <span className={`inline-flex px-2.5 py-1 rounded-md text-[10px] font-semibold uppercase tracking-wide border ${roleColor(item.role_in_product)}`}>
                            {item.role_in_product}
                          </span>
                        </div>
                        <div>
                          <span className="text-base font-black text-emerald-400">
                            {item.recommended_concentration}
                          </span>
                        </div>
                        <p className="text-[11px] text-slate-400 leading-relaxed">{item.reason}</p>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Notes row */}
                <div className="grid md:grid-cols-3 gap-4">
                  {[
                    {
                      icon: <Beaker className="w-3.5 h-3.5 text-violet-400" />,
                      label: "Pharmacist Notes",
                      value: result.formulation_notes,
                      border: "border-violet-500/15",
                      bg: "bg-violet-500/5",
                    },
                    {
                      icon: <Wind className="w-3.5 h-3.5 text-cyan-400" />,
                      label: "Climate Protocol",
                      value: result.climate_considerations,
                      border: "border-cyan-500/15",
                      bg: "bg-cyan-500/5",
                    },
                    {
                      icon: <Sun className="w-3.5 h-3.5 text-amber-400" />,
                      label: "Application",
                      value: result.application_instructions,
                      border: "border-amber-500/15",
                      bg: "bg-amber-500/5",
                    },
                  ].map((card) => (
                    <div key={card.label} className={`rounded-xl border ${card.border} ${card.bg} p-4`}>
                      <div className="flex items-center gap-2 mb-2">
                        {card.icon}
                        <p className="text-[10px] uppercase tracking-widest font-semibold text-slate-400">{card.label}</p>
                      </div>
                      <p className="text-xs text-slate-300 leading-relaxed">{card.value}</p>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* ─────── RIGHT SIDEBAR ─────── */}
          <aside className="space-y-5 sticky top-24">

            {/* Profile summary card */}
            <div className="rounded-2xl border border-white/5 bg-white/[0.03] p-5">
              <div className="flex items-center gap-2 mb-4">
                <Thermometer className="w-4 h-4 text-blue-400" />
                <h3 className="text-xs font-semibold uppercase tracking-widest text-slate-400">Profile Preview</h3>
              </div>
              <div className="space-y-2.5">
                {[
                  { label: "Product", value: productType || "—" },
                  { label: "Skin Type", value: skinType || "—" },
                  { label: "Skin Tone", value: skinColor || "—" },
                  { label: "Climate", value: weather || "—" },
                  { label: "Concerns", value: skinConcerns.length ? skinConcerns.join(", ") : "—" },
                ].map((row) => (
                  <div key={row.label} className="flex justify-between gap-3">
                    <span className="text-[10px] uppercase tracking-widest text-slate-300 font-semibold shrink-0">{row.label}</span>
                    <span className="text-xs text-slate-300 text-right truncate max-w-[180px]">{row.value}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* How it works */}
            <div className="rounded-2xl border border-white/5 bg-white/[0.03] p-5">
              <div className="flex items-center gap-2 mb-4">
                <Activity className="w-4 h-4 text-violet-400" />
                <h3 className="text-xs font-semibold uppercase tracking-widest text-slate-400">How It Works</h3>
              </div>
              <ol className="space-y-4">
                {[
                  { step: "01", title: "Vector Search", desc: "Query is embedded and matched against 3 medical ingredient databases." },
                  { step: "02", title: "RAG Pipeline", desc: "Top hits from each DB are combined into a rich clinical context." },
                  { step: "03", title: "AI Formulator", desc: "Groq LLM acts as an expert chemist and outputs a full recipe." },
                ].map((s) => (
                  <li key={s.step} className="flex gap-3">
                    <span className="text-[10px] font-black text-blue-400/60 mt-0.5 shrink-0">{s.step}</span>
                    <div>
                      <p className="text-xs font-semibold text-slate-300">{s.title}</p>
                      <p className="text-[10px] text-slate-300 leading-relaxed mt-0.5">{s.desc}</p>
                    </div>
                  </li>
                ))}
              </ol>
            </div>

            {/* Recent formulations */}
            <div className="rounded-2xl border border-white/5 bg-white/[0.03] p-5">
              <div className="flex items-center gap-2 mb-4">
                <FlaskConical className="w-4 h-4 text-emerald-400" />
                <h3 className="text-xs font-semibold uppercase tracking-widest text-slate-400">Recent</h3>
              </div>
              <div className="space-y-2.5">
                {result && (
                  <div className="flex items-center gap-3 p-2.5 rounded-lg bg-blue-500/8 border border-blue-500/15">
                    <div className="w-1.5 h-1.5 rounded-full bg-emerald-400 shrink-0" />
                    <div className="min-w-0">
                      <p className="text-xs font-medium text-emerald-400 truncate">{result.product_name_suggestion}</p>
                      <p className="text-[10px] text-slate-300">Just now</p>
                    </div>
                  </div>
                )}
                {["Anti-Aging Serum", "Hydrating Moisturizer", "Acne Spot Treatment"].map((name, i) => (
                  <div key={name} className="flex items-center gap-3 p-2.5 rounded-lg hover:bg-white/3 transition-colors cursor-pointer">
                    <div className="w-1.5 h-1.5 rounded-full bg-slate-600 shrink-0" />
                    <div>
                      <p className="text-xs font-medium text-slate-300">{name}</p>
                      <p className="text-[10px] text-slate-300">{["2h", "5h", "Yesterday"][i]} ago</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </aside>
        </div>
      </main>
    </div>
  );
};

export default ExpertDashboard;
