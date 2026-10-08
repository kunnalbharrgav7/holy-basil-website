import { useState } from "react";
import {
  ArrowRight,
  ShieldCheck,
  TrendingUp,
  Award,
  CheckCircle,
} from "lucide-react";
import axios from "axios";
import { Link } from "react-router-dom";

const indiaStatesAndCities = {
  "Andhra Pradesh": [
    "Visakhapatnam",
    "Vijayawada",
    "Guntur",
    "Tirupati",
    "Nellore",
  ],
  Delhi: [
    "New Delhi",
    "North Delhi",
    "South Delhi",
    "West Delhi",
    "East Delhi",
  ],
  Gujarat: ["Ahmedabad", "Surat", "Vadodara", "Rajkot", "Gandhinagar"],
  Haryana: ["Gurugram", "Faridabad", "Panipat", "Ambala", "Karnal"],
  Karnataka: ["Bengaluru", "Mysuru", "Mangaluru", "Hubballi", "Belagavi"],
  "Madhya Pradesh": ["Indore", "Bhopal", "Jabalpur", "Gwalior", "Ujjain"],
  Maharashtra: ["Mumbai", "Pune", "Nagpur", "Nashik", "Aurangabad"],
  Punjab: ["Ludhiana", "Amritsar", "Jalandhar", "Patiala", "Bathinda"],
  Rajasthan: ["Jaipur", "Jodhpur", "Udaipur", "Kota", "Ajmer"],
  "Tamil Nadu": [
    "Chennai",
    "Coimbatore",
    "Madurai",
    "Tiruchirappalli",
    "Salem",
  ],
  "Uttar Pradesh": [
    "Lucknow",
    "Kanpur",
    "Ghaziabad",
    "Noida",
    "Varanasi",
    "Agra",
  ],
  "West Bengal": ["Kolkata", "Howrah", "Durgapur", "Siliguri", "Asansol"],
};

export default function Franchise() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    state: "",
    city: "",
    budget: "",
    spaceAvailable: "",
  });
  const [availableCities, setAvailableCities] = useState([]);
  const [loading, setLoading] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [error, setError] = useState("");

  const handleStateChange = (e) => {
    const selectedState = e.target.value;
    setFormData({ ...formData, state: selectedState, city: "" });
    setAvailableCities(indiaStatesAndCities[selectedState] || []);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    try {
      const response = await axios.post(
        "http://localhost:5000/api/franchise/apply",
        formData,
      );
      if (response.data.success) {
        setIsSubmitted(true);
      }
    } catch (err) {
      setError(
        err.response?.data?.message ||
          "Something went wrong. Please try again.",
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="min-h-screen bg-[#080D0A] text-[#F5F2EB] pt-8 pb-20 overflow-hidden">
      <div className="container-hba max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* 🌟 PAGE SPECIFIC BREADCRUMB (Subtle & Premium) */}
        {/* <nav aria-label="Breadcrumb" className="mb-10 relative z-10">
          <div className="flex items-center gap-2 text-[10px] sm:text-[11px] font-bold uppercase tracking-[0.2em] text-[#F5F2EB]/40">
            <Link to="/" className="hover:text-emerald-400 transition-colors">
              HOME
            </Link>
            <span className="text-[#F5F2EB]/20">/</span>
            <span className="text-emerald-400">FRANCHISE</span>
          </div>
        </nav> */}

        {/* HEADER SECTION */}
        <div className="text-center max-w-3xl mx-auto mb-16 relative">
          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-96 h-96 bg-amber-500/10 blur-[100px] pointer-events-none rounded-full" />
          <span className="relative z-10 eyebrow inline-block text-[11px] font-bold uppercase tracking-[0.3em] text-amber-400 bg-amber-900/30 px-5 py-2 rounded-full border border-amber-500/20 shadow-[0_0_15px_rgba(245,158,11,0.15)]">
            Partner With Us
          </span>
          <h1 className="relative z-10 mt-6 font-serif text-4xl md:text-6xl text-white leading-tight">
            Build a Legacy of{" "}
            <span className="italic font-normal text-amber-200">
              Ayurvedic Wellness
            </span>
          </h1>
          <p className="relative z-10 mt-6 text-base md:text-lg text-[#F5F2EB]/70 leading-relaxed max-w-2xl mx-auto">
            Join hands with Holy Basil Ayurveda. Bring authentic, high-end
            botanical formulations and traditional healing rituals to your city.
          </p>
        </div>

        {/* BENEFITS GRID */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-16 relative z-10">
          <div className="bg-[#121E1A] p-8 rounded-[2rem] border border-amber-900/30 shadow-md hover:border-amber-500/40 transition-colors">
            <div className="w-12 h-12 rounded-2xl bg-[#080D0A] border border-amber-500/20 flex items-center justify-center text-amber-400 mb-6 shadow-inner">
              <TrendingUp size={24} />
            </div>
            <h3 className="font-serif text-xl text-white mb-3">
              High Growth & ROI
            </h3>
            <p className="text-sm text-[#F5F2EB]/60 leading-relaxed">
              Tap into the booming natural wellness market with a proven retail
              and supply model.
            </p>
          </div>

          <div className="bg-[#121E1A] p-8 rounded-[2rem] border border-amber-900/30 shadow-md hover:border-amber-500/40 transition-colors">
            <div className="w-12 h-12 rounded-2xl bg-[#080D0A] border border-amber-500/20 flex items-center justify-center text-amber-400 mb-6 shadow-inner">
              <ShieldCheck size={24} />
            </div>
            <h3 className="font-serif text-xl text-white mb-3">
              Centralized Inventory
            </h3>
            <p className="text-sm text-[#F5F2EB]/60 leading-relaxed">
              Zero hassle of manufacturing. Direct bulk supply managed securely
              from our central cleanrooms.
            </p>
          </div>

          <div className="bg-[#121E1A] p-8 rounded-[2rem] border border-amber-900/30 shadow-md hover:border-amber-500/40 transition-colors">
            <div className="w-12 h-12 rounded-2xl bg-[#080D0A] border border-amber-500/20 flex items-center justify-center text-amber-400 mb-6 shadow-inner">
              <Award size={24} />
            </div>
            <h3 className="font-serif text-xl text-white mb-3">
              Trusted Heritage Brand
            </h3>
            <p className="text-sm text-[#F5F2EB]/60 leading-relaxed">
              Leverage the prestige of certified organic formulations, premium
              branding, and marketing support.
            </p>
          </div>
        </div>

        {/* FORM / SUCCESS SECTION */}
        {isSubmitted ? (
          <div className="bg-[#121E1A] rounded-[2.5rem] shadow-[0_20px_50px_rgba(0,0,0,0.5)] border border-emerald-900/40 overflow-hidden p-8 sm:p-16 max-w-3xl mx-auto text-center relative">
            <div className="absolute inset-0 bg-emerald-900/10 blur-3xl pointer-events-none" />
            <div className="relative z-10 w-24 h-24 bg-[#080D0A] rounded-full flex items-center justify-center mx-auto mb-8 border-[4px] border-emerald-500/30 shadow-[0_0_30px_rgba(16,185,129,0.3)]">
              <CheckCircle size={40} className="text-emerald-400" />
            </div>
            <h2 className="relative z-10 font-serif text-3xl md:text-4xl text-white mb-4">
              Application Received!
            </h2>
            <p className="relative z-10 text-[#F5F2EB]/70 text-base md:text-lg leading-relaxed max-w-xl mx-auto mb-10">
              Congratulations,{" "}
              <strong className="text-emerald-300">{formData.name}</strong>!
              Your franchise application has been successfully submitted. Our
              partnership team will review your details and contact you within
              24-48 hours.
            </p>
            <Link
              to="/"
              className="btn-primary relative z-10 py-3.5 px-8 shadow-lg inline-block"
            >
              Return to Home
            </Link>
          </div>
        ) : (
          <div className="bg-[#121E1A] rounded-[2.5rem] shadow-xl border border-emerald-900/40 overflow-hidden p-8 sm:p-12 lg:p-16 max-w-4xl mx-auto relative z-10">
            <div className="text-center max-w-xl mx-auto mb-10">
              <h2 className="font-serif text-3xl text-white">
                Franchise Enquiry Form
              </h2>
              <p className="text-sm text-[#F5F2EB]/60 mt-3">
                Fill out your details below. Our expansion team will review and
                get in touch with you shortly.
              </p>
            </div>

            {error && (
              <div className="mb-8 p-4 rounded-2xl bg-red-950/40 border border-red-900/50 text-sm text-red-400 font-medium text-center">
                {error}
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-emerald-400/80 mb-2">
                    Full Name
                  </label>
                  <input
                    type="text"
                    placeholder="Enter your full name"
                    value={formData.name}
                    onChange={(e) =>
                      setFormData({ ...formData, name: e.target.value })
                    }
                    required
                    className="w-full rounded-2xl border border-emerald-900/40 bg-[#080D0A] px-4 py-3.5 text-white outline-none transition focus:border-emerald-500/50 placeholder-[#F5F2EB]/30 shadow-sm"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-emerald-400/80 mb-2">
                    Email Address
                  </label>
                  <input
                    type="email"
                    placeholder="name@example.com"
                    value={formData.email}
                    onChange={(e) =>
                      setFormData({ ...formData, email: e.target.value })
                    }
                    required
                    className="w-full rounded-2xl border border-emerald-900/40 bg-[#080D0A] px-4 py-3.5 text-white outline-none transition focus:border-emerald-500/50 placeholder-[#F5F2EB]/30 shadow-sm"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-emerald-400/80 mb-2">
                    Phone Number
                  </label>
                  <input
                    type="tel"
                    placeholder="+91 98765 43210"
                    value={formData.phone}
                    onChange={(e) =>
                      setFormData({ ...formData, phone: e.target.value })
                    }
                    required
                    className="w-full rounded-2xl border border-emerald-900/40 bg-[#080D0A] px-4 py-3.5 text-white outline-none transition focus:border-emerald-500/50 placeholder-[#F5F2EB]/30 shadow-sm"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-emerald-400/80 mb-2">
                    State
                  </label>
                  <select
                    value={formData.state}
                    onChange={handleStateChange}
                    required
                    className="w-full rounded-2xl border border-emerald-900/40 bg-[#080D0A] px-4 py-3.5 text-white outline-none transition focus:border-emerald-500/50 cursor-pointer shadow-sm"
                  >
                    <option value="" className="bg-[#121E1A]">
                      Select State
                    </option>
                    {Object.keys(indiaStatesAndCities).map((state) => (
                      <option
                        key={state}
                        value={state}
                        className="bg-[#121E1A]"
                      >
                        {state}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-emerald-400/80 mb-2">
                    City
                  </label>
                  <select
                    value={formData.city}
                    onChange={(e) =>
                      setFormData({ ...formData, city: e.target.value })
                    }
                    disabled={!formData.state}
                    required
                    className="w-full rounded-2xl border border-emerald-900/40 bg-[#080D0A] px-4 py-3.5 text-white outline-none transition focus:border-emerald-500/50 cursor-pointer shadow-sm disabled:opacity-50"
                  >
                    <option value="" className="bg-[#121E1A]">
                      Select City
                    </option>
                    {availableCities.map((city) => (
                      <option key={city} value={city} className="bg-[#121E1A]">
                        {city}
                      </option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-emerald-400/80 mb-2">
                    Investment Budget
                  </label>
                  <select
                    value={formData.budget}
                    onChange={(e) =>
                      setFormData({ ...formData, budget: e.target.value })
                    }
                    required
                    className="w-full rounded-2xl border border-emerald-900/40 bg-[#080D0A] px-4 py-3.5 text-white outline-none transition focus:border-emerald-500/50 cursor-pointer shadow-sm"
                  >
                    <option value="" className="bg-[#121E1A]">
                      Select Budget Range
                    </option>
                    <option
                      value="₹10 Lakh - ₹20 Lakh"
                      className="bg-[#121E1A]"
                    >
                      ₹10 Lakh - ₹20 Lakh
                    </option>
                    <option
                      value="₹20 Lakh - ₹50 Lakh"
                      className="bg-[#121E1A]"
                    >
                      ₹20 Lakh - ₹50 Lakh
                    </option>
                    <option value="₹50 Lakh+" className="bg-[#121E1A]">
                      ₹50 Lakh+
                    </option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-emerald-400/80 mb-2">
                  Commercial Space Availability
                </label>
                <select
                  value={formData.spaceAvailable}
                  onChange={(e) =>
                    setFormData({ ...formData, spaceAvailable: e.target.value })
                  }
                  required
                  className="w-full rounded-2xl border border-emerald-900/40 bg-[#080D0A] px-4 py-3.5 text-white outline-none transition focus:border-emerald-500/50 cursor-pointer shadow-sm"
                >
                  <option value="" className="bg-[#121E1A]">
                    Select Space Status
                  </option>
                  <option
                    value="Yes, Ready Space Available"
                    className="bg-[#121E1A]"
                  >
                    Yes, Ready Space Available
                  </option>
                  <option
                    value="Looking to Rent/Buy Soon"
                    className="bg-[#121E1A]"
                  >
                    Looking to Rent/Buy Soon
                  </option>
                  <option
                    value="Need Guidance from Brand"
                    className="bg-[#121E1A]"
                  >
                    Need Guidance from Brand
                  </option>
                </select>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="btn-primary w-full py-4 text-base font-bold shadow-[0_0_20px_rgba(16,185,129,0.3)] hover:shadow-[0_0_30px_rgba(16,185,129,0.5)] transition-all flex items-center justify-center gap-2 mt-8 disabled:opacity-50"
              >
                {loading
                  ? "Submitting Application..."
                  : "Submit Franchise Application"}{" "}
                <ArrowRight size={18} />
              </button>
            </form>
          </div>
        )}
      </div>
    </main>
  );
}
