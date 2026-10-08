import { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Lock, CheckCircle2 } from "lucide-react";
import api from "../services/api";

export default function ResetPassword() {
  const { token } = useParams(); // URL se token nikalne ke liye
  const navigate = useNavigate();

  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    if (password.length < 8) {
      setError("Password must be at least 8 characters.");
      return;
    }
    if (password !== confirmPassword) {
      setError("Passwords do not match.");
      return;
    }

    setLoading(true);
    try {
      // Backend api call with token
      await api.post(`/auth/reset-password/${token}`, { password });
      setSuccess(true);
      setTimeout(() => navigate("/login"), 3000);
    } catch (err) {
      setError(err.response?.data?.message || "Invalid or expired token.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="min-h-screen pt-24 pb-16 bg-[#080D0A] flex items-center justify-center text-[#F5F2EB] px-4">
      <div className="w-full max-w-md bg-[#0B1310] border border-emerald-900/40 rounded-[2.5rem] p-8 md:p-10 shadow-2xl relative">
        {success ? (
          <div className="text-center py-6 flex flex-col items-center">
            <CheckCircle2 size={56} className="text-emerald-400 mb-4" />
            <h2 className="font-serif text-2xl text-white mb-2">
              Password Updated!
            </h2>
            <p className="text-xs text-[#F5F2EB]/60">
              Your password has been reset successfully. Redirecting to login...
            </p>
          </div>
        ) : (
          <>
            <div className="mb-8 text-center">
              <span className="text-[10px] font-bold uppercase tracking-[0.2em] text-emerald-400">
                Holy Basil Ayurveda
              </span>
              <h1 className="font-serif text-2xl md:text-3xl text-white mt-2">
                Set New Password
              </h1>
              <p className="text-xs text-[#F5F2EB]/50 mt-2">
                Enter a strong password for your account.
              </p>
            </div>

            {error && (
              <div className="mb-6 p-3 rounded-xl bg-red-500/10 border border-red-500/30 text-red-400 text-xs text-center">
                {error}
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-[10px] font-bold uppercase tracking-widest text-[#F5F2EB]/60 mb-2">
                  New Password
                </label>
                <div className="relative">
                  <Lock
                    className="absolute left-3.5 top-1/2 -translate-y-1/2 text-emerald-500/50"
                    size={16}
                  />
                  <input
                    type="password"
                    required
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="At least 8 characters"
                    className="w-full bg-[#060A08] border border-emerald-900/40 rounded-xl px-4 py-3 pl-10 text-xs text-white placeholder-[#F5F2EB]/30 focus:outline-none focus:border-emerald-500 transition-colors"
                  />
                </div>
              </div>

              <div>
                <label className="block text-[10px] font-bold uppercase tracking-widest text-[#F5F2EB]/60 mb-2">
                  Confirm Password
                </label>
                <div className="relative">
                  <Lock
                    className="absolute left-3.5 top-1/2 -translate-y-1/2 text-emerald-500/50"
                    size={16}
                  />
                  <input
                    type="password"
                    required
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    placeholder="Re-enter password"
                    className="w-full bg-[#060A08] border border-emerald-900/40 rounded-xl px-4 py-3 pl-10 text-xs text-white placeholder-[#F5F2EB]/30 focus:outline-none focus:border-emerald-500 transition-colors"
                  />
                </div>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full py-3.5 mt-4 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs uppercase tracking-wider shadow-[0_0_20px_rgba(16,185,129,0.3)] transition-all disabled:opacity-50"
              >
                {loading ? "Updating..." : "Update Password"}
              </button>
            </form>
          </>
        )}
      </div>
    </main>
  );
}
