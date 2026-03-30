import { Link, useLocation, useNavigate } from "react-router-dom";
import { Link2, BarChart2, LogOut, User, Zap } from "lucide-react";
import { useAuth } from "../context/AuthContext";
import toast from "react-hot-toast";

export default function Navbar() {
  const { pathname } = useLocation();
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    toast.success("Logged out");
    navigate("/login");
  };

  return (
    <nav className="relative z-10 border-b border-white/5 bg-black/30 backdrop-blur-xl px-6 py-4 flex items-center justify-between">
      <Link to="/" className="logo-glow flex items-center gap-2 group">
        <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-indigo-500 to-violet-600 flex items-center justify-center shadow-lg shadow-indigo-500/30">
          <Zap size={16} className="text-white" />
        </div>
        <span className="text-xl font-black tracking-tight bg-gradient-to-r from-indigo-400 to-violet-400 bg-clip-text text-transparent">
          SURLS
        </span>
      </Link>

      {user && (
        <div className="flex items-center gap-1">
          <Link
            to="/"
            className={`nav-link px-4 py-2 rounded-xl text-sm font-medium transition-all duration-200 ${
              pathname === "/"
                ? "bg-indigo-500/20 text-indigo-300 shadow-inner shadow-indigo-500/10"
                : "text-gray-400 hover:text-white hover:bg-white/5"
            }`}
          >
            Shorten
          </Link>
          <Link
            to="/dashboard"
            className={`nav-link px-4 py-2 rounded-xl text-sm font-medium flex items-center gap-1.5 transition-all duration-200 ${
              pathname === "/dashboard"
                ? "bg-indigo-500/20 text-indigo-300 shadow-inner shadow-indigo-500/10"
                : "text-gray-400 hover:text-white hover:bg-white/5"
            }`}
          >
            <BarChart2 size={14} />
            Dashboard
          </Link>

          <div className="flex items-center gap-2 ml-3 pl-3 border-l border-white/10">
            <div className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-white/5 border border-white/8">
              <div className="w-6 h-6 rounded-full bg-gradient-to-br from-indigo-400 to-violet-500 flex items-center justify-center">
                <User size={11} className="text-white" />
              </div>
              <span className="text-sm text-gray-300 font-medium">{user.name}</span>
            </div>
            <button
              onClick={handleLogout}
              title="Logout"
              className="action-btn text-gray-500 hover:text-red-400 hover:bg-red-500/10"
            >
              <LogOut size={15} />
            </button>
          </div>
        </div>
      )}
    </nav>
  );
}
