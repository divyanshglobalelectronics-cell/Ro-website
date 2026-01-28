import { useState, useMemo } from "react";
import { useNavigate, Link, useLocation } from "react-router-dom";
import { useAuth } from "../context/AuthContext.jsx";
import { useToast } from "../context/ToastContext.jsx";
import { FiEye, FiEyeOff, FiUser, FiMail, FiLock } from "react-icons/fi";


  const API_BASE = import.meta.env.REACT_APP_API_URL || "";

export default function Signup() {
  const { loginWithToken } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const params = new URLSearchParams(location.search);
  const returnTo = params.get("returnTo") || "/";
  const { showToast } = useToast();
  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
  });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);

  const passwordStrength = useMemo(() => {
    const pwd = form.password;
    if (!pwd) return { label: "Weak", color: "bg-white", width: "w-1/3" };
    let score = 0;
    if (pwd.length >= 8) score++;
    if (/[A-Z]/.test(pwd)) score++;
    if (/[0-9]/.test(pwd)) score++;
    if (/[^A-Za-z0-9]/.test(pwd)) score++;
    if (score <= 1) return { label: "Weak", color: "bg-red-400", width: "w-1/3" };
    if (score === 2) return { label: "Medium", color: "bg-yellow-400", width: "w-2/3" };
    return { label: "Strong", color: "bg-green-500", width: "w-full" };
  }, [form.password]);

  const submit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      if (form.password !== form.confirmPassword) {
        const err = new Error("Passwords do not match");
        showToast(err.message, { type: "error" });
        throw err;
      }
      const res = await fetch(`${API_BASE}/api/auth/signup`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name: form.name, email: form.email, password: form.password }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Signup failed");
      loginWithToken(data.token, data.user);
      navigate(returnTo);
    } catch (e) {
      setError(e.message || "Signup failed");
      showToast(e.message || "Signup failed", { type: "error" });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-[radial-gradient(circle_703px_at_15.9%_53.4%,_rgba(80,15,85,1)_0%,_rgba(11,83,149,1)_100.2%)] px-4">
      <div className="w-full max-w-5xl grid md:grid-cols-2 gap-6 bg-black/20 rounded-2xl overflow-hidden shadow-2xl border border-white/10">
        {/* LEFT - BRAND PITCH */}
        <div className="hidden md:flex flex-col justify-center gap-4 px-8 py-10 bg-[radial-gradient(circle_349px_at_0.3%_48.6%,_rgba(0,0,0,1)_0%,_rgba(87,124,253,0.89)_100.7%)] text-white">
          <h1 className="text-2xl font-bold">
            Pure Water, Pure Life — Join Divyansh Global RO
          </h1>
          <p className="font-semibold text-sm">
            Create your account and enjoy a seamless RO shopping & service experience.
          </p>
          <ul className="text-sm space-y-2 text-white/90">
            <li>• Track orders, invoices and service history</li>
            <li>• Get reminders for filter change and maintenance</li>
            <li>• Access special offers and AMC benefits</li>
          </ul>
          <div className="mt-4 flex flex-wrap gap-2 text-xs text-white/80">
            <span className="px-3 py-1 rounded-full bg-white/10 border border-white/20">
              24/7 Water Support
            </span>
            <span className="px-3 py-1 rounded-full bg-white/10 border border-white/20">
              Genuine Parts Only
            </span>
          </div>
        </div>

        {/* RIGHT - FORM */}
        <div className="bg-white px-6 sm:px-8 py-8 flex flex-col items-center justify-center">
          <h1 className="text-2xl font-bold text-gray-900 text-center">Create your account</h1>
          <p className="text-sm text-gray-500 text-center mt-1">
            It only takes a minute to get started.
          </p>

          {error && (
            <p className="mt-4 mb-2 px-4 py-3 text-sm text-red-700 bg-red-50 border border-red-200 rounded-lg w-full">
              {error}
            </p>
          )}

          <form onSubmit={submit} className="mt-4 bg-white border rounded-lg p-5 space-y-4 w-full">
            {/* NAME */}
            <div>
              <label className="block text-sm text-gray-700">Name</label>
              <div className="mt-1 relative">
                <span className="absolute inset-y-0 left-3 flex items-center text-gray-400">
                  <FiUser />
                </span>
                <input
                  className="mt-0 w-full border rounded-lg px-9 py-2 text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  required
                  value={form.name}
                  onChange={(e) => setForm({ ...form, name: e.target.value })}
                  placeholder="Your full name"
                />
              </div>
            </div>

            {/* EMAIL */}
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

            {/* PASSWORD */}
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
                  placeholder="Create a strong password"
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
              {/* Strength meter */}
              <div className="mt-2 flex items-center gap-2">
                <div className="w-full h-1.5 bg-gray-200 rounded-full overflow-hidden">
                  <div className={`h-full ${passwordStrength.color} ${passwordStrength.width}`} />
                </div>
                <span className="text-xs text-gray-500">{passwordStrength.label}</span>
              </div>
            </div>

            {/* CONFIRM PASSWORD */}
            <div>
              <label className="block text-sm text-gray-700">Confirm Password</label>
              <div className="mt-1 relative">
                <span className="absolute inset-y-0 left-3 flex items-center text-gray-400">
                  <FiLock />
                </span>
                <input
                  type={showConfirm ? "text" : "password"}
                  className="w-full border rounded-lg px-9 py-2 pr-10 text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  required
                  value={form.confirmPassword}
                  onChange={(e) => setForm({ ...form, confirmPassword: e.target.value })}
                  placeholder="Re-enter password"
                />
                <button
                  type="button"
                  aria-label={showConfirm ? "Hide password" : "Show password"}
                  className="absolute inset-y-0 right-3 flex items-center text-gray-500 hover:text-gray-700"
                  onClick={() => setShowConfirm((v) => !v)}
                >
                  {showConfirm ? <FiEyeOff /> : <FiEye />}
                </button>
              </div>
            </div>

            {/* SUBMIT */}
            <button
              type="submit"
              disabled={loading}
              className="w-full px-5 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-sm font-semibold disabled:opacity-70"
            >
              {loading ? "Creating account..." : "Create account"}
            </button>

            <div className="flex items-center justify-between text-xs sm:text-sm text-gray-600 pt-1">
              <span>
                Already have an account?{" "}
                <Link
                  to={`/login?returnTo=${encodeURIComponent(returnTo)}`}
                  className="text-blue-600 hover:underline"
                >
                  Login
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
