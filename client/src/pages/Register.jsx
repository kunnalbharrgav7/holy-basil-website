import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { Check, X } from "lucide-react";
import { useGoogleLogin } from "@react-oauth/google";
import logoImg from "../assets/Logo/logo.png";

export default function Register() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState("");
  const [isRegistering, setIsRegistering] = useState(false);
  const [isGoogleLoading, setIsGoogleLoading] = useState(false);

  const { register, googleLogin } = useAuth();
  const navigate = useNavigate();

  // Password rules checklist
  const hasMinLength = password.length >= 8;
  const hasUpperCase = /[A-Z]/.test(password);
  const hasNumber = /[0-9]/.test(password);
  const hasSpecialChar = /[^A-Za-z0-9]/.test(password);
  const isPasswordValid =
    hasMinLength && hasUpperCase && hasNumber && hasSpecialChar;

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    if (!isPasswordValid) {
      setError("Please meet all password strength requirements.");
      return;
    }

    if (password !== confirmPassword) {
      setError("Passwords do not match.");
      return;
    }

    setIsRegistering(true);
    try {
      await register({ name, email, phone, password });
      navigate("/");
    } catch (err) {
      setError(
        err.response?.data?.message || "Registration failed. Please try again.",
      );
    } finally {
      setIsRegistering(false);
    }
  };

  const handleGoogleRegister = useGoogleLogin({
    onSuccess: async (tokenResponse) => {
      try {
        setIsGoogleLoading(true);
        const res = await fetch(
          "https://www.googleapis.com/oauth2/v3/userinfo",
          {
            headers: { Authorization: `Bearer ${tokenResponse.access_token}` },
          },
        );
        const userInfo = await res.json();

        // 👉 'picture' ko 'avatar' me nikal liya
        const { name, email, sub: googleId, picture: avatar } = userInfo;

        // 👉 Context ko data bhej diya (bina phone ke)
        await googleLogin({ name, email, googleId, avatar });
        navigate("/");
      } catch (err) {
        console.error("Google Auth Error:", err);
        setError("Google authentication failed. Please try again.");
      } finally {
        setIsGoogleLoading(false);
      }
    },
    onError: () => {
      setError("Google authentication failed.");
    },
  });

  return (
    <main className="min-h-screen pt-24 pb-16 bg-[#080D0A] flex items-center justify-center text-[#F5F2EB] px-4">
      <div className="w-full max-w-4xl bg-[#0B1310] border border-emerald-900/40 rounded-[2.5rem] shadow-2xl grid md:grid-cols-2 overflow-hidden relative">
        {/* Left Banner (Exact Original) */}
        <div className="p-8 md:p-12 flex flex-col justify-between border-r border-emerald-900/30">
          <div>
            <div className="mb-10 flex justify-center">
              <img src={logoImg} alt="Holy Basil Ayurveda" className="h-28 md:h-36 lg:h-40 w-auto object-contain transition-transform hover:scale-105" />
            </div>
            <h2 className="font-serif text-3xl md:text-4xl text-white leading-snug text-center">
              "Begin your journey toward balanced vitality and inner harmony."
            </h2>
            <p className="mt-6 text-xs md:text-sm text-[#F5F2EB]/60 leading-relaxed text-center">
              Create an account to unlock exclusive rituals, expert botanical
              formulations, and personalized care.
            </p>
          </div>
          <div className="pt-8 border-t border-emerald-900/20 flex items-center justify-center gap-6 text-[10px] uppercase tracking-widest text-[#F5F2EB]/60 font-bold">
            <span>🌿 Pure Heritage</span>
            <span>•</span>
            <span>Cleanroom Crafted</span>
          </div>
        </div>

        {/* Right Form (Exact Original Layout with additions) */}
        <div className="p-8 md:p-12 flex flex-col justify-center">
          <div className="mb-5">
            <span className="text-[10px] font-bold uppercase tracking-widest text-emerald-400">
              Join The Ritual
            </span>
            <h1 className="font-serif text-2xl md:text-3xl text-white mt-1">
              Create account
            </h1>
            <p className="text-xs text-[#F5F2EB]/50 mt-1">
              Join Holy Basil Ayurveda for a holistic wellness experience.
            </p>
          </div>

          {error && (
            <div className="mb-4 p-3 rounded-xl bg-red-500/10 border border-red-500/30 text-red-400 text-xs">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-3">
            <div>
              <label className="block text-[10px] font-bold uppercase tracking-widest text-[#F5F2EB]/60 mb-1.5">
                Full Name
              </label>
              <input
                type="text"
                required
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="John Doe"
                className="w-full bg-[#060A08] border border-emerald-900/40 rounded-xl px-4 py-2.5 text-xs text-white placeholder-[#F5F2EB]/30 focus:outline-none focus:border-emerald-500 transition-colors"
              />
            </div>

            <div>
              <label className="block text-[10px] font-bold uppercase tracking-widest text-[#F5F2EB]/60 mb-1.5">
                Email Address
              </label>
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="name@example.com"
                className="w-full bg-[#060A08] border border-emerald-900/40 rounded-xl px-4 py-2.5 text-xs text-white placeholder-[#F5F2EB]/30 focus:outline-none focus:border-emerald-500 transition-colors"
              />
            </div>

            <div>
              <label className="block text-[10px] font-bold uppercase tracking-widest text-[#F5F2EB]/60 mb-1.5">
                Phone Number
              </label>
              <input
                type="tel"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                placeholder="+91 XXXXX-XXXXX"
                className="w-full bg-[#060A08] border border-emerald-900/40 rounded-xl px-4 py-2.5 text-xs text-white placeholder-[#F5F2EB]/30 focus:outline-none focus:border-emerald-500 transition-colors"
              />
            </div>

            <div>
              <label className="block text-[10px] font-bold uppercase tracking-widest text-[#F5F2EB]/60 mb-1.5">
                Password
              </label>
              <input
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="At least 8 characters"
                className="w-full bg-[#060A08] border border-emerald-900/40 rounded-xl px-4 py-2.5 text-xs text-white placeholder-[#F5F2EB]/30 focus:outline-none focus:border-emerald-500 transition-colors"
              />

              {/* Password Strength Checklist */}
              {password && (
                <div className="mt-2 p-2.5 rounded-xl bg-[#060A08] border border-emerald-900/30 grid grid-cols-2 gap-1.5 text-[10px]">
                  <div
                    className={`flex items-center gap-1.5 ${hasMinLength ? "text-emerald-400" : "text-[#F5F2EB]/40"}`}
                  >
                    {hasMinLength ? <Check size={12} /> : <X size={12} />} At
                    least 8 chars
                  </div>
                  <div
                    className={`flex items-center gap-1.5 ${hasUpperCase ? "text-emerald-400" : "text-[#F5F2EB]/40"}`}
                  >
                    {hasUpperCase ? <Check size={12} /> : <X size={12} />} 1
                    Uppercase
                  </div>
                  <div
                    className={`flex items-center gap-1.5 ${hasNumber ? "text-emerald-400" : "text-[#F5F2EB]/40"}`}
                  >
                    {hasNumber ? <Check size={12} /> : <X size={12} />} 1 Number
                  </div>
                  <div
                    className={`flex items-center gap-1.5 ${hasSpecialChar ? "text-emerald-400" : "text-[#F5F2EB]/40"}`}
                  >
                    {hasSpecialChar ? <Check size={12} /> : <X size={12} />} 1
                    Special char
                  </div>
                </div>
              )}
            </div>

            <div>
              <label className="block text-[10px] font-bold uppercase tracking-widest text-[#F5F2EB]/60 mb-1.5">
                Confirm Password
              </label>
              <input
                type="password"
                required
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                placeholder="Re-enter password"
                className="w-full bg-[#060A08] border border-emerald-900/40 rounded-xl px-4 py-2.5 text-xs text-white placeholder-[#F5F2EB]/30 focus:outline-none focus:border-emerald-500 transition-colors"
              />
            </div>

            <button
              type="submit"
              disabled={isRegistering || isGoogleLoading || !isPasswordValid}
              className={`w-full py-3.5 mt-2 rounded-xl bg-emerald-600 text-white font-bold text-xs uppercase tracking-wider shadow-[0_0_20px_rgba(16,185,129,0.3)] transition-all ${
                isRegistering
                  ? "opacity-80 cursor-wait"
                  : isGoogleLoading || !isPasswordValid
                  ? "opacity-50 cursor-not-allowed"
                  : "hover:bg-emerald-500 cursor-pointer"
              }`}
            >
              {isRegistering ? "Creating account..." : "Create Account"}
            </button>
          </form>

          {/* Google Button */}
          <button
            type="button"
            onClick={() => handleGoogleRegister()}
            disabled={isRegistering || isGoogleLoading}
            className={`w-full mt-4 flex items-center justify-center gap-3 py-2.5 rounded-xl bg-[#121E1A] border border-emerald-900/40 text-xs font-bold text-white transition-all ${
              isGoogleLoading
                ? "opacity-80 cursor-wait"
                : isRegistering
                ? "opacity-50 cursor-not-allowed"
                : "hover:bg-[#162521] cursor-pointer"
            }`}
          >
            {isGoogleLoading ? (
              "Connecting..."
            ) : (
              <>
                <div className="bg-white p-1 rounded-full flex items-center justify-center">
                  <svg className="w-4 h-4" viewBox="0 0 24 24">
                    <path
                      fill="#4285F4"
                      d="M23.745 12.27c0-.7-.06-1.4-.19-2.07H12v4.51h6.6c-.29 1.52-1.14 2.82-2.4 3.68v3.05h3.88c2.27-2.09 3.66-5.17 3.66-9.17z"
                    />
                    <path
                      fill="#34A853"
                      d="M12 24c3.24 0 5.95-1.08 7.93-2.91l-3.88-3.05c-1.08.72-2.45 1.16-4.05 1.16-3.12 0-5.77-2.11-6.72-4.95H1.2v3.15C3.18 21.32 7.22 24 12 24z"
                    />
                    <path
                      fill="#FBBC05"
                      d="M5.28 14.25c-.25-.72-.38-1.49-.38-2.25s.13-1.53.38-2.25V6.6H1.2C.44 8.14 0 9.99 0 12s.44 3.86 1.2 5.4l4.08-3.15z"
                    />
                    <path
                      fill="#EA4335"
                      d="M12 4.75c1.77 0 3.35.61 4.6 1.8l3.42-3.42C17.95 1.19 15.24 0 12 0 7.22 0 3.18 2.68 1.2 6.6l4.08 3.15c.95-2.84 3.6-4.95 6.72-4.95z"
                    />
                  </svg>
                </div>
                <span>Continue with Google</span>
              </>
            )}
          </button>

          <p className="text-center text-xs text-[#F5F2EB]/50 mt-5">
            Already have an account?{" "}
            <Link
              to="/login"
              className="text-emerald-400 font-bold hover:underline"
            >
              Login
            </Link>
          </p>
        </div>
      </div>
    </main>
  );
}
