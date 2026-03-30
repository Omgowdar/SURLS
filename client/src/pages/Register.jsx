import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Zap, UserPlus, Mail, Lock, User } from "lucide-react";
import toast from "react-hot-toast";
import { useAuth } from "../context/AuthContext";

export default function Register() {
  const { register } = useAuth();
  const navigate = useNavigate();
  const [form, setForm] = useState({ name: "", email: "", password: "", confirm: "" });
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (form.password !== form.confirm) return toast.error("Passwords do not match");
    if (form.password.length < 6) return toast.error("Password must be at least 6 characters");
    setLoading(true);
    try {
      await register(form.name, form.email, form.password);
      toast.success("Account created!");
      navigate("/");
    } catch (err) {
      toast.error(err.response?.data?.error || "Registration failed");
    } finally {
      setLoading(false);
    }
  };

  const fields = [
    { key: "name", label: "Full Name", type: "text", placeholder: "John Doe", icon: User },
    { key: "email", label: "Email", type: "email", placeholder: "you@example.com", icon: Mail },
    { key: "password", label: "Password", type: "password", placeholder: "••••••••", icon: Lock },
    { key: "confirm", label: "Confirm Password", type: "password", placeholder: "••••••••", icon: Lock },
  ];

  return (
    <div className="relative min-h-screen flex items-center justify-center px-4 py-10">
      <div className="bg-mesh" />
      <div className="bg-grid" />
      <div className="orb orb-1" />
      <div className="orb orb-2" />
      <div className="orb orb-3" />

      <div className="relative z-10 w-full max-w-md fade-up">
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-14 h-14 rounded-2xl bg-gradient-to-br from-indigo-500 to-violet-600 shadow-2xl shadow-indigo-500/40 mb-4">
            <Zap size={28} className="text-white" />
          </div>
          <h1 className="text-3xl font-black text-white mb-1">Create account</h1>
          <p className="text-gray-500 text-sm">Start shortening URLs for free</p>
        </div>

        <form
          onSubmit={handleSubmit}
          className="glass rounded-3xl p-8 space-y-4 shadow-2xl shadow-black/50"
        >
          {fields.map(({ key, label, type, placeholder, icon: Icon }) => (
            <div key={key} className="space-y-1">
              <label className="text-xs font-semibold text-gray-400 uppercase tracking-wider">{label}</label>
              <div className="relative">
                <Icon size={15} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-500" />
                <input
                  type={type}
                  required
                  placeholder={placeholder}
                  value={form[key]}
                  onChange={(e) => setForm({ ...form, [key]: e.target.value })}
                  className="input-glow w-full rounded-xl pl-10 pr-4 py-3 text-sm placeholder-gray-600"
                />
              </div>
            </div>
          ))}

          <button
            type="submit"
            disabled={loading}
            className="btn-glow w-full text-white font-bold py-3 rounded-xl flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed mt-2"
          >
            <UserPlus size={16} />
            {loading ? "Creating account..." : "Create Account"}
          </button>
        </form>

        <p className="text-center text-sm text-gray-600 mt-6">
          Already have an account?{" "}
          <Link to="/login" className="text-indigo-400 hover:text-indigo-300 font-semibold transition-colors">
            Sign in →
          </Link>
        </p>
      </div>
    </div>
  );
}
