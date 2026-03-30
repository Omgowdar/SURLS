import { useEffect, useState } from "react";
import { Copy, Trash2, BarChart2, ExternalLink, RefreshCw, Link2, MousePointerClick, AlertTriangle } from "lucide-react";
import toast from "react-hot-toast";
import api from "../api";
import StatsModal from "../components/StatsModal";

export default function Dashboard() {
  const [urls, setUrls] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedCode, setSelectedCode] = useState(null);

  const fetchUrls = async () => {
    setLoading(true);
    try {
      const { data } = await api.get("/urls");
      setUrls(data);
    } catch {
      toast.error("Failed to load URLs");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchUrls(); }, []);

  const handleDelete = async (code) => {
    if (!confirm("Delete this link?")) return;
    try {
      await api.delete(`/${code}`);
      toast.success("Deleted");
      setUrls((prev) => prev.filter((u) => u.shortCode !== code));
    } catch {
      toast.error("Delete failed");
    }
  };

  const copy = (url) => {
    navigator.clipboard.writeText(url);
    toast.success("Copied!");
  };

  const isExpired = (expiresAt) => expiresAt && new Date() > new Date(expiresAt);

  const stats = [
    { label: "Total Links", value: urls.length, icon: Link2, color: "from-indigo-500 to-violet-500", glow: "shadow-indigo-500/20" },
    { label: "Total Clicks", value: urls.reduce((s, u) => s + u.clicks, 0), icon: MousePointerClick, color: "from-emerald-500 to-teal-500", glow: "shadow-emerald-500/20" },
    { label: "Expired Links", value: urls.filter((u) => isExpired(u.expiresAt)).length, icon: AlertTriangle, color: "from-amber-500 to-orange-500", glow: "shadow-amber-500/20" },
  ];

  return (
    <div className="relative min-h-[calc(100vh-65px)]">
      <div className="bg-mesh" />
      <div className="bg-grid" />
      <div className="orb orb-1" />
      <div className="orb orb-2" />

      <div className="relative z-10 max-w-6xl mx-auto px-4 py-10 fade-up">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-black text-white">Dashboard</h1>
            <p className="text-gray-500 text-sm mt-1">Track and manage all your shortened links</p>
          </div>
          <button
            onClick={fetchUrls}
            className="flex items-center gap-2 text-sm glass glass-hover px-4 py-2.5 rounded-xl text-gray-400 hover:text-white font-medium"
          >
            <RefreshCw size={14} className={loading ? "animate-spin" : ""} />
            Refresh
          </button>
        </div>

        {/* Stat cards */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8">
          {stats.map(({ label, value, icon: Icon, color, glow }) => (
            <div key={label} className={`stat-card glass rounded-2xl p-6 shadow-xl ${glow}`}>
              <div className="flex items-center justify-between mb-3">
                <div className={`w-10 h-10 rounded-xl bg-gradient-to-br ${color} flex items-center justify-center shadow-lg`}>
                  <Icon size={18} className="text-white" />
                </div>
              </div>
              <p className="text-4xl font-black text-white mb-1">{value}</p>
              <p className="text-sm text-gray-500">{label}</p>
            </div>
          ))}
        </div>

        {/* Table */}
        {loading ? (
          <div className="glass rounded-2xl p-8 space-y-3">
            {[...Array(4)].map((_, i) => (
              <div key={i} className="shimmer h-12 rounded-xl" />
            ))}
          </div>
        ) : urls.length === 0 ? (
          <div className="glass rounded-2xl p-16 text-center">
            <div className="w-16 h-16 rounded-2xl bg-indigo-500/10 flex items-center justify-center mx-auto mb-4">
              <Link2 size={28} className="text-indigo-400" />
            </div>
            <p className="text-gray-400 font-medium">No links yet</p>
            <p className="text-gray-600 text-sm mt-1">Go shorten something!</p>
          </div>
        ) : (
          <div className="glass rounded-2xl overflow-hidden shadow-2xl shadow-black/50">
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-white/5 text-left">
                    <th className="px-5 py-4 text-xs font-semibold text-gray-500 uppercase tracking-wider">Original URL</th>
                    <th className="px-5 py-4 text-xs font-semibold text-gray-500 uppercase tracking-wider">Short URL</th>
                    <th className="px-5 py-4 text-xs font-semibold text-gray-500 uppercase tracking-wider">Clicks</th>
                    <th className="px-5 py-4 text-xs font-semibold text-gray-500 uppercase tracking-wider">Created</th>
                    <th className="px-5 py-4 text-xs font-semibold text-gray-500 uppercase tracking-wider">Expires</th>
                    <th className="px-5 py-4 text-xs font-semibold text-gray-500 uppercase tracking-wider">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {urls.map((url) => (
                    <tr
                      key={url._id}
                      className={`table-row-hover border-b border-white/5 last:border-0 ${isExpired(url.expiresAt) ? "opacity-40" : ""}`}
                    >
                      <td className="px-5 py-4">
                        <a
                          href={url.originalUrl}
                          target="_blank"
                          rel="noreferrer"
                          className="text-gray-400 hover:text-white transition-colors truncate block max-w-[200px]"
                          title={url.originalUrl}
                        >
                          {url.originalUrl}
                        </a>
                      </td>
                      <td className="px-5 py-4">
                        <a
                          href={url.shortUrl}
                          target="_blank"
                          rel="noreferrer"
                          className="text-indigo-400 hover:text-indigo-300 transition-colors flex items-center gap-1 font-medium"
                        >
                          {url.shortUrl}
                          <ExternalLink size={11} />
                        </a>
                      </td>
                      <td className="px-5 py-4">
                        <span className="badge-pulse inline-flex items-center px-2.5 py-1 rounded-full text-xs font-bold bg-indigo-500/15 text-indigo-300 border border-indigo-500/20">
                          {url.clicks}
                        </span>
                      </td>
                      <td className="px-5 py-4 text-gray-500 text-xs">
                        {new Date(url.createdAt).toLocaleDateString()}
                      </td>
                      <td className="px-5 py-4 text-xs">
                        {url.expiresAt ? (
                          <span className={`px-2 py-1 rounded-lg font-medium ${isExpired(url.expiresAt) ? "bg-red-500/10 text-red-400" : "bg-amber-500/10 text-amber-400"}`}>
                            {isExpired(url.expiresAt) ? "Expired" : new Date(url.expiresAt).toLocaleDateString()}
                          </span>
                        ) : (
                          <span className="text-gray-600">Never</span>
                        )}
                      </td>
                      <td className="px-5 py-4">
                        <div className="flex items-center gap-1">
                          <button onClick={() => copy(url.shortUrl)} className="action-btn text-gray-500 hover:text-white hover:bg-white/10" title="Copy">
                            <Copy size={14} />
                          </button>
                          <button onClick={() => setSelectedCode(url.shortCode)} className="action-btn text-gray-500 hover:text-indigo-400 hover:bg-indigo-500/10" title="Stats">
                            <BarChart2 size={14} />
                          </button>
                          <button onClick={() => handleDelete(url.shortCode)} className="action-btn text-gray-500 hover:text-red-400 hover:bg-red-500/10" title="Delete">
                            <Trash2 size={14} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>

      {selectedCode && <StatsModal code={selectedCode} onClose={() => setSelectedCode(null)} />}
    </div>
  );
}
