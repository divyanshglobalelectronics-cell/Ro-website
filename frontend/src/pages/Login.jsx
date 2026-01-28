import { useState } from "react";
import { useNavigate, Link, useLocation } from "react-router-dom";
import { useAuth } from "../context/AuthContext.jsx";
import { useToast } from "../context/ToastContext.jsx";
import { FiEye, FiEyeOff, FiLock, FiMail } from "react-icons/fi";

const API_BASE = process.env.REACT_APP_API_URL || 'http://localhost:5000';

export default function Login() {
  const { loginWithToken } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const params = new URLSearchParams(location.search);
  const returnTo = params.get("returnTo") || "/";
  const { showToast } = useToast();
  const [form, setForm] = useState({ email: "", password: "" });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const submit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      const res = await fetch(`${API_BASE}/api/auth/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Login failed please try again");
      loginWithToken(data.token, data.user);
      if (data.user && data.user.isAdmin) {
        navigate("/admin");
      } else {
        navigate(returnTo);
      }
    } catch (e) {
      setError(e.message || "Login failed please try again");
      showToast(e.message || "Login failed please try again", { type: "error" });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-[linear-gradient(156.2deg,_rgba(0,0,0,1)_14.8%,_rgba(32,104,177,1)_68.1%,_rgba(222,229,237,1)_129%)] px-4">
      <div className="max-w-5xl w-full grid md:grid-cols-2 gap-8 items-center">
        {/* LEFT PANEL */}
        <div className="hidden md:flex flex-col gap-4 text-white">
          <h1 className="text-3xl font-bold">Welcome back 👋</h1>
          <p className="text-white/80">
            Login to manage your orders, track installations and book RO service in just a few
            clicks.
          </p>
          <ul className="space-y-2 text-sm text-white/80">
            <li>• View and download invoices anytime</li>
            <li>• Track service history and AMC plans</li>
            <li>• Get faster support and priority service</li>
          </ul>
        </div>

        {/* RIGHT PANEL - FORM */}
        <div className="bg-white/95 backdrop-blur-xl border border-white/40 rounded-2xl shadow-2xl p-6 sm:p-8">
          <h2 className="text-2xl font-bold text-gray-900 text-center">Login to your account</h2>
          <p className="text-sm text-gray-500 text-center mt-1">
            Enter your details to access your dashboard.
          </p>

          {error && (
            <p className="mt-4 mb-2 px-4 py-3 text-sm text-red-700 bg-red-50 border border-red-200 rounded-lg">
              {error}
            </p>
          )}

          <form onSubmit={submit} className="mt-5 space-y-4">
            <div>
              <label className="block text-sm text-gray-700">Email</label>
              <div className="mt-1 relative">
                <span className="absolute inset-y-0 left-3 flex items-center text-gray-400">
                  <FiMail />
                </span>
                <input
                  type="email"
                  className="mt-0 w-full border rounded-lg px-9 py-2 text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  required
                  value={form.email}
                  onChange={(e) => setForm({ ...form, email: e.target.value })}
                  placeholder="you@example.com"
                />
              </div>
            </div>
            <div>
              <label className="block text-sm text-gray-700">Password</label>
              <div className="mt-1 relative">
                <span className="absolute inset-y-0 left-3 flex items-center text-gray-400">
                  <FiLock />
                </span>
                <input
                  type={showPassword ? "text" : "password"}
                  className="w-full border rounded-lg px-9 py-2 pr-10 text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  required
                  value={form.password}
                  onChange={(e) => setForm({ ...form, password: e.target.value })}
                />
                <button
                  type="button"
                  aria-label={showPassword ? "Hide password" : "Show password"}
                  className="absolute inset-y-0 right-3 flex items-center text-gray-500 hover:text-gray-700"
                  onClick={() => setShowPassword((v) => !v)}
                >
                  {showPassword ? <FiEyeOff /> : <FiEye />}
                </button>
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full mt-2 px-5 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-sm font-semibold disabled:opacity-70"
            >
              {loading ? "Logging in..." : "Login"}
            </button>

            <div className="flex items-center justify-between text-xs sm:text-sm gap-2 text-gray-600 mt-3">
              <span>
                Don&apos;t have an account?{" "}
                <Link
                  to={`/signup?returnTo=${encodeURIComponent(returnTo)}`}
                  className="text-blue-600 hover:underline"
                >
                  Sign up
                </Link>
              </span>
              <Link to="/forgot-password" className="text-blue-600 hover:underline">
                Forgot password?
              </Link>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
