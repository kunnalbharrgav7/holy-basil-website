import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { CheckCircle2, X } from "lucide-react";
import { jwtDecode } from "jwt-decode";
import { GoogleLogin, useGoogleLogin } from "@react-oauth/google";
import logoImg from "../assets/Logo/logo.png";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [isLoggingIn, setIsLoggingIn] = useState(false);
  const [isGoogleLoading, setIsGoogleLoading] = useState(false);

  // Forgot Password States
  const [showForgotModal, setShowForgotModal] = useState(false);
  const [forgotEmail, setForgotEmail] = useState("");
  const [forgotStep, setForgotStep] = useState(1);
  const [newPassword, setNewPassword] = useState("");
  const [confirmNewPassword, setConfirmNewPassword] = useState("");
  const [forgotError, setForgotError] = useState("");

  const { login, forgotPassword, googleLogin } = useAuth();
  const navigate = useNavigate();

  const googleAuth = useGoogleLogin({
    onSuccess: async (tokenResponse) => {
      setIsGoogleLoading(true);
      setError("");
      try {
        const res = await fetch(
          "https://www.googleapis.com/oauth2/v3/userinfo",
          {
            headers: { Authorization: `Bearer ${tokenResponse.access_token}` },
          },
        );
        const userInfo = await res.json();

        // 🌟 YE LINE MISMATCH THI: yahan avatar (picture) add kar diya hai
        const { name, email, sub: googleId, picture: avatar } = userInfo;

        await googleLogin({
          name,
          email,
          googleId,
          avatar, // 👈 Ab avatar yahan pass ho raha hai
        });
        navigate("/");
      } catch (err) {
        console.error(err);
        setError("Google Authentication failed. Please try again.");
      } finally {
        setIsGoogleLoading(false);
      }
    },
    onError: () => setError("Google Login Failed"),
  });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setIsLoggingIn(true);
    try {
      await login(email, password);
      navigate("/");
    } catch (err) {
      setError(err.response?.data?.message || "Invalid email or password");
    } finally {
      setIsLoggingIn(false);
    }
  };

  const handleGoogleLogin = async (credentialResponse) => {
    setError("");
    setIsGoogleLoading(true);
    try {
      // Agar aap @react-oauth/google use kar rahe hain:
      const decoded = jwtDecode(credentialResponse.credential);
      await googleLogin({
        name: decoded.name,
        email: decoded.email,
        googleId: decoded.sub,
      });
      navigate("/");
    } catch (err) {
      console.error(err);
      setError("Google Authentication failed. Please try again.");
    } finally {
      setIsGoogleLoading(false);
    }
  };

  const handleForgotSubmit = async (e) => {
    e.preventDefault();
    setForgotError("");

    if (forgotStep === 1) {
      if (!forgotEmail) {
        setForgotError("Please enter your registered email address.");
        return;
      }

      try {
        // 🌟 Yahan Real API Call hogi
        await forgotPassword(forgotEmail);

        // Success hone par direct Step 3 (Success Message) par bhejenge
        setForgotStep(3);
      } catch (err) {
        setForgotError(
          err.response?.data?.message || "Failed to send email. Try again.",
        );
      }
    }
  };

  return (
    <main className="min-h-screen pt-12 pb-16 bg-[#080D0A] flex items-center justify-center text-[#F5F2EB] px-4">
      <div className="w-full max-w-4xl bg-[#0B1310] border border-emerald-900/40 rounded-[2.5rem] shadow-2xl grid md:grid-cols-2 overflow-hidden relative">
        {/* Left Banner (Exact Original) */}
        <div className="p-8 md:p-12 flex flex-col justify-between border-r border-emerald-900/30">
          <div>
            <div className="mb-10 flex justify-center">
              <img src={logoImg} alt="Holy Basil Ayurveda" className="h-28 md:h-36 lg:h-40 w-auto object-contain transition-transform hover:scale-105" />
            </div>
            <h2 className="font-serif text-3xl md:text-4xl text-white leading-snug text-center">
              "Rooted in ancient tradition, crafted for modern rituals."
            </h2>
            <p className="mt-6 text-xs md:text-sm text-[#F5F2EB]/60 leading-relaxed text-center">
              Log in to access your curated orders, wishlist formulations, and
              personalized wellness journey.
            </p>
          </div>
          <div className="pt-8 border-t border-emerald-900/20 flex items-center justify-center gap-6 text-[10px] uppercase tracking-widest text-[#F5F2EB]/60 font-bold">
            <span>🌿 100% Organic</span>
            <span>•</span>
            <span>GMP Certified</span>
          </div>
        </div>

        {/* Right Form (Exact Original Layout with additions) */}
        <div className="p-8 md:p-12 flex flex-col justify-center">
          <div className="mb-6">
            <span className="text-[10px] font-bold uppercase tracking-widest text-emerald-400">
              Welcome Back
            </span>
            <h1 className="font-serif text-2xl md:text-3xl text-white mt-1">
              Login to your account
            </h1>
            <p className="text-xs text-[#F5F2EB]/50 mt-1">
              Enter your credentials to continue your wellness journey.
            </p>
          </div>

          {error && (
            <div className="mb-4 p-3 rounded-xl bg-red-500/10 border border-red-500/30 text-red-400 text-xs">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-[10px] font-bold uppercase tracking-widest text-[#F5F2EB]/60 mb-2">
                Email Address
              </label>
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="name@example.com"
                className="w-full bg-[#060A08] border border-emerald-900/40 rounded-xl px-4 py-3 text-xs text-white placeholder-[#F5F2EB]/30 focus:outline-none focus:border-emerald-500 transition-colors"
              />
            </div>

            <div>
              <div className="flex items-center justify-between mb-2">
                <label className="block text-[10px] font-bold uppercase tracking-widest text-[#F5F2EB]/60">
                  Password
                </label>
                <button
                  type="button"
                  onClick={() => {
                    setForgotStep(1);
                    setForgotEmail("");
                    setNewPassword("");
                    setConfirmNewPassword("");
                    setForgotError("");
                    setShowForgotModal(true);
                  }}
                  className="text-[11px] text-emerald-400 hover:underline font-medium"
                >
                  Forgot Password?
                </button>
              </div>
              <input
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full bg-[#060A08] border border-emerald-900/40 rounded-xl px-4 py-3 text-xs text-white placeholder-[#F5F2EB]/30 focus:outline-none focus:border-emerald-500 transition-colors"
              />
            </div>

            <button
              type="submit"
              disabled={isLoggingIn || isGoogleLoading}
              className={`w-full py-3.5 mt-2 rounded-xl bg-emerald-600 text-white font-bold text-xs uppercase tracking-wider shadow-[0_0_20px_rgba(16,185,129,0.3)] transition-all ${
                isLoggingIn
                  ? "opacity-80 cursor-wait"
                  : isGoogleLoading
                  ? "opacity-50 cursor-not-allowed"
                  : "hover:bg-emerald-500 cursor-pointer"
              }`}
            >
              {isLoggingIn ? "Logging in..." : "Login"}
            </button>
          </form>

          {/* Google Button */}
          <button
            type="button"
            onClick={() => googleAuth()}
            disabled={isLoggingIn || isGoogleLoading}
            className={`w-full mt-4 flex items-center justify-center gap-3 py-2.5 rounded-xl bg-[#121E1A] border border-emerald-900/40 text-xs font-bold text-white transition-all ${
              isGoogleLoading
                ? "opacity-80 cursor-wait"
                : isLoggingIn
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

          <p className="text-center text-xs text-[#F5F2EB]/50 mt-6">
            Don't have an account?{" "}
            <Link
              to="/register"
              className="text-emerald-400 font-bold hover:underline"
            >
              Create account
            </Link>
          </p>
        </div>
      </div>

      {/* Forgot Password Modal */}
      {showForgotModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm px-4">
          <div className="w-full max-w-md bg-[#0B1310] border border-emerald-900/50 rounded-3xl p-6 md:p-8 shadow-2xl relative">
            <button
              onClick={() => setShowForgotModal(false)}
              className="absolute right-5 top-5 text-[#F5F2EB]/50 hover:text-white"
            >
              <X size={20} />
            </button>
            <div className="mb-6">
              <span className="text-[10px] font-bold uppercase tracking-widest text-emerald-400">
                Account Recovery
              </span>
              <h3 className="font-serif text-2xl text-white mt-1">
                Reset Password
              </h3>
              <p className="text-xs text-[#F5F2EB]/60 mt-1">
                {forgotStep === 1 &&
                  "Enter your email address to receive a secure password reset link."}
                {forgotStep === 2 && "Enter your new password below."}
                {forgotStep === 3 && "Password updated successfully!"}
              </p>
            </div>
            {forgotError && (
              <div className="mb-4 p-3 rounded-xl bg-red-500/10 border border-red-500/30 text-red-400 text-xs">
                {forgotError}
              </div>
            )}
            {forgotStep === 1 && (
              <form onSubmit={handleForgotSubmit} className="space-y-4">
                <input
                  type="email"
                  required
                  value={forgotEmail}
                  onChange={(e) => setForgotEmail(e.target.value)}
                  placeholder="name@example.com"
                  className="w-full bg-[#060A08] border border-emerald-900/40 rounded-xl px-4 py-3 text-xs text-white placeholder-[#F5F2EB]/30 focus:outline-none focus:border-emerald-500"
                />
                <button
                  type="submit"
                  className="w-full py-3 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs uppercase tracking-wider"
                >
                  Send Reset Link
                </button>
              </form>
            )}
            {forgotStep === 2 && (
              <form onSubmit={handleForgotSubmit} className="space-y-4">
                <input
                  type="password"
                  required
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  placeholder="New Password (min 6 chars)"
                  className="w-full bg-[#060A08] border border-emerald-900/40 rounded-xl px-4 py-3 text-xs text-white placeholder-[#F5F2EB]/30 focus:outline-none focus:border-emerald-500"
                />
                <input
                  type="password"
                  required
                  value={confirmNewPassword}
                  onChange={(e) => setConfirmNewPassword(e.target.value)}
                  placeholder="Confirm New Password"
                  className="w-full bg-[#060A08] border border-emerald-900/40 rounded-xl px-4 py-3 text-xs text-white placeholder-[#F5F2EB]/30 focus:outline-none focus:border-emerald-500"
                />
                <button
                  type="submit"
                  className="w-full py-3 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs uppercase tracking-wider"
                >
                  Update Password
                </button>
              </form>
            )}
            {forgotStep === 3 && (
              <div className="text-center py-6 flex flex-col items-center">
                <CheckCircle2 size={48} className="text-emerald-400 mb-3" />
                <h4 className="text-white font-serif text-lg">
                  Check Your Email!
                </h4>
                <p className="text-xs text-[#F5F2EB]/60 mt-1 mb-6">
                  We have sent a secure password reset link to{" "}
                  <b>{forgotEmail}</b>. Please check your inbox and click the
                  link to create a new password.
                </p>
                <button
                  onClick={() => setShowForgotModal(false)}
                  className="w-full py-3 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs uppercase tracking-wider transition-all"
                >
                  Close
                </button>
              </div>
            )}
          </div>
        </div>
      )}
    </main>
  );
}
