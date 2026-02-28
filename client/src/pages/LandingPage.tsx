import { useNavigate } from "react-router-dom";
import {
  Shield,
  Zap,
  CheckCircle,
  ArrowRight,
  FlaskConical,
} from "lucide-react";
import heroImage from "../assets/hero_lab_analysis.png";
import featureImage from "../assets/feature_safety_analysis.png";
import productsImage from "../assets/cosmetic_products.png";

const LandingPage = () => {
  const navigate = useNavigate();

  const stats = [
    {
      label: "VERIFICATION SPEED",
      value: "< 1.2s",
      sublabel: "Industry leading latency",
    },
    {
      label: "KNOWLEDGE BASE",
      value: "750k+",
      sublabel: "Validated chemical compounds",
    },
    {
      label: "CLINICAL ACCURACY",
      value: "99.98%",
      sublabel: "Certified by EU regulatory labs",
    },
  ];

  const features = [
    {
      icon: <CheckCircle className="w-6 h-6 text-blue-600" />,
      title: "Precision Verification",
      description:
        "Deep-learning models verify chemical purity and reaction stability across 12,000+ interaction permutations.",
    },
    {
      icon: <Shield className="w-6 h-6 text-blue-600" />,
      title: "Safety Compliance",
      description:
        "Automated real-time checks against EChA, FDA, and global regulatory standards with instant PDF audit trails.",
    },
    {
      icon: <Zap className="w-6 h-6 text-blue-600" />,
      title: "R&D Acceleration",
      description:
        "Reduce formulation cycle times by up to 65% by predicting clinical trial outcomes before the first batch is mixed.",
    },
  ];

  return (
    <div className="min-h-screen bg-white">
      {/* Header */}
      <header className="fixed top-0 left-0 right-0 bg-white/95 backdrop-blur-sm border-b border-slate-100 z-50">
        <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <FlaskConical className="w-7 h-7 text-blue-600" />
            <span className="text-xl font-bold text-slate-900">
              ChemVerify <span className="text-blue-600">AI</span>
            </span>
          </div>
          <nav className="hidden md:flex items-center gap-8">
            <a
              href="#platform"
              className="text-sm font-medium text-slate-600 hover:text-slate-900 transition-colors"
            >
              Platform
            </a>
            <a
              href="#safety"
              className="text-sm font-medium text-slate-600 hover:text-slate-900 transition-colors"
            >
              Safety Data
            </a>
            <a
              href="#methodology"
              className="text-sm font-medium text-slate-600 hover:text-slate-900 transition-colors"
            >
              Methodology
            </a>
          </nav>
          <div className="flex items-center gap-3">
            <button className="btn-primary" onClick={() => navigate("/login")}>
              Login as Customer
            </button>
            <button
              className="btn-secondary hidden lg:inline-flex"
              onClick={() => navigate("/login")}
            >
              Login as Dermatologist
            </button>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="pt-32 pb-16 bg-gradient-to-br from-slate-50 via-white to-blue-50">
        <div className="max-w-7xl mx-auto px-6">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div className="animate-[slideInLeft_0.6s_ease_forwards]">
              <span className="inline-block px-3 py-1 text-xs font-semibold text-blue-600 bg-blue-50 rounded-full mb-6">
                CLINICAL-GRADE PRECISION
              </span>
              <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-slate-900 leading-tight mb-6">
                AI-Assisted
                <br />
                Ingredient Analysis
                <br />
                for Clinical R&D
              </h1>
              <p className="text-lg text-slate-600 mb-8 max-w-lg">
                Accelerate cosmetic formulation with our proprietary
                clinical-grade AI verification engine. Built for precision
                matching and global safety compliance.
              </p>
              <div className="flex flex-wrap gap-4">
                <button
                  className="btn-primary"
                  onClick={() => navigate("/login")}
                >
                  Login as Customer
                </button>
                <button
                  className="btn-secondary"
                  onClick={() => navigate("/login")}
                >
                  Login as Dermatologist
                </button>
              </div>
            </div>

            {/* Hero Image */}
            <div className="animate-[slideInRight_0.6s_ease_forwards]">
              <div className="relative rounded-2xl overflow-hidden shadow-2xl">
                <img
                  src={heroImage}
                  alt="AI-Powered Cosmetic Ingredient Analysis Lab"
                  className="w-full h-auto object-cover rounded-2xl"
                  style={{ maxHeight: "460px" }}
                />
                {/* Overlay gradient */}
                <div className="absolute inset-0 bg-gradient-to-t from-slate-900/60 via-transparent to-transparent rounded-2xl"></div>
                {/* Status bar overlay */}
                <div className="absolute bottom-0 left-0 right-0 flex items-center justify-between px-6 py-4">
                  <span className="text-xs text-white/80 tracking-wider font-medium">
                    REAL-TIME VERIFICATION
                  </span>
                  <div className="flex items-center gap-2">
                    <span className="w-2 h-2 bg-emerald-400 rounded-full animate-pulse"></span>
                    <span className="text-xs text-emerald-400 font-medium">
                      SYSTEM ACTIVE
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-6">
          <div className="grid md:grid-cols-3 gap-6">
            {stats.map((stat, index) => (
              <div
                key={index}
                className="bg-white border border-slate-200 rounded-xl p-6 text-center hover:shadow-lg hover:-translate-y-1 transition-all duration-300"
              >
                <span className="text-xs font-semibold text-slate-400 tracking-wider">
                  {stat.label}
                </span>
                <span className="block text-4xl font-bold text-slate-900 mt-2 mb-1">
                  {stat.value}
                </span>
                <span className="text-sm text-slate-500">{stat.sublabel}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Product Showcase Section */}
      <section className="py-20 bg-white" id="safety">
        <div className="max-w-7xl mx-auto px-6">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div className="relative rounded-2xl overflow-hidden shadow-xl group">
              <img
                src={productsImage}
                alt="Cosmetic products being analyzed"
                className="w-full h-80 object-cover rounded-2xl transition-transform duration-500 group-hover:scale-105"
              />
              <div className="absolute inset-0 bg-gradient-to-br from-blue-600/10 to-cyan-600/10 rounded-2xl"></div>
            </div>
            <div>
              <span className="inline-block px-3 py-1 text-xs font-semibold text-blue-600 bg-blue-50 rounded-full mb-4">
                PRODUCT SAFETY
              </span>
              <h2 className="text-3xl md:text-4xl font-bold text-slate-900 mb-4">
                Analyze Every Ingredient
                <br />
                with Confidence
              </h2>
              <p className="text-lg text-slate-600 mb-6 leading-relaxed">
                Simply upload an image of any cosmetic product's ingredient
                list, and our AI engine instantly identifies each chemical
                compound, cross-references it against global safety databases,
                and delivers a comprehensive safety report.
              </p>
              <ul className="space-y-3">
                {[
                  "Instant ingredient identification from images",
                  "Cross-referencing with 750k+ chemical compounds",
                  "Personalized safety recommendations",
                ].map((item, i) => (
                  <li
                    key={i}
                    className="flex items-center gap-3 text-slate-700"
                  >
                    <CheckCircle className="w-5 h-5 text-blue-600 flex-shrink-0" />
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* Core Verification Engine Section */}
      <section className="py-20 bg-slate-50" id="platform">
        <div className="max-w-7xl mx-auto px-6">
          <h2 className="text-3xl md:text-4xl font-bold text-slate-900 mb-4">
            The Core Verification Engine
          </h2>
          <p className="text-lg text-slate-600 mb-12 max-w-2xl">
            Our proprietary algorithms process complex chemical structures to
            ensure absolute safety and performance predictability in every
            formulation.
          </p>
          <div className="grid md:grid-cols-3 gap-6">
            {features.map((feature, index) => (
              <div
                key={index}
                className="bg-white border border-slate-200 rounded-xl p-6 hover:shadow-lg hover:-translate-y-1 transition-all duration-300"
              >
                <div className="w-12 h-12 bg-blue-50 rounded-lg flex items-center justify-center mb-4">
                  {feature.icon}
                </div>
                <h3 className="text-lg font-semibold text-slate-900 mb-2">
                  {feature.title}
                </h3>
                <p className="text-sm text-slate-600 leading-relaxed">
                  {feature.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-6">
          <div className="bg-gradient-to-br from-slate-800 via-slate-900 to-slate-800 rounded-3xl p-12 md:p-16 overflow-hidden relative">
            <div className="grid lg:grid-cols-2 gap-10 items-center">
              <div className="text-center lg:text-left">
                <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
                  Ready to transform your
                  <br />
                  formulation workflow?
                </h2>
                <p className="text-slate-300 mb-8 max-w-xl">
                  Join the world's leading labs and dermatology centers using
                  our clinical-grade recommendation engine to redefine skin
                  science.
                </p>
                <div className="flex flex-wrap justify-center lg:justify-start gap-4">
                  <button className="btn-primary btn-lg">Contact Sales</button>
                  <button className="btn-outline btn-lg">
                    View Methodology <ArrowRight size={18} />
                  </button>
                </div>
              </div>
              <div className="hidden lg:block relative">
                <img
                  src={featureImage}
                  alt="AI Safety Analysis Dashboard"
                  className="w-full h-72 object-cover rounded-xl shadow-lg"
                  style={{ opacity: 0.9 }}
                />
                <div className="absolute inset-0 bg-gradient-to-l from-transparent to-slate-900/40 rounded-xl"></div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-8 bg-white border-t border-slate-100">
        <div className="max-w-7xl mx-auto px-6 flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2">
              <FlaskConical className="w-5 h-5 text-blue-600" />
              <span className="font-semibold text-slate-900">
                ChemVerify AI
              </span>
            </div>
            <span className="text-sm text-slate-500">
              © 2024 ChemVerify Systems Inc. All rights reserved.
            </span>
          </div>
          <div className="flex items-center gap-6">
            <a
              href="#privacy"
              className="text-sm text-slate-500 hover:text-slate-900 transition-colors"
            >
              Privacy Policy
            </a>
            <a
              href="#terms"
              className="text-sm text-slate-500 hover:text-slate-900 transition-colors"
            >
              Terms of Service
            </a>
            <a
              href="#compliance"
              className="text-sm text-slate-500 hover:text-slate-900 transition-colors"
            >
              Compliance
            </a>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default LandingPage;
