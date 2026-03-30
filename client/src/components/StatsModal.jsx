import { useEffect, useState } from "react";
import { X, TrendingUp, MousePointerClick, Calendar } from "lucide-react";
import {
  LineChart, Line, XAxis, YAxis, Tooltip,
  ResponsiveContainer, CartesianGrid, Area, AreaChart,
} from "recharts";
import api from "../api";

export default function StatsModal({ code, onClose }) {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.get(`/stats/${code}`).then(({ data }) => {
      setStats(data);
      setLoading(false);
    });
  }, [code]);

  const chartData = () => {
    if (!stats?.clickData?.length) return [];
    const counts = {};
    stats.clickData.forEach(({ timestamp }) => {
      const day = new Date(timestamp).toLocaleDateString();
      counts[day] = (counts[day] || 0) + 1;
    });
    return Object.entries(counts).map(([date, clicks]) => ({ date, clicks }));
  };

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 px-4">
      <div className="glass rounded-3xl w-full max-w-lg p-7 relative shadow-2xl shadow-black/60 fade-up">
        <button
          onClick={onClose}
          className="action-btn absolute top-5 right-5 text-gray-500 hover:text-white hover:bg-white/10"
        >
          <X size={18} />
        </button>

        <h2 className="text-lg font-black flex items-center gap-2 mb-5">
          <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-indigo-500 to-violet-600 flex items-center justify-center">
            <TrendingUp size={15} className="text-white" />
          </div>
          Link Analytics
        </h2>

        {loading ? (
          <div className="space-y-3">
            {[...Array(3)].map((_, i) => <div key={i} className="shimmer h-10 rounded-xl" />)}
          </div>
        ) : (
          <>
            <div className="mb-5 p-4 rounded-2xl bg-white/3 border border-white/5">
              <p className="text-xs text-gray-600 truncate mb-0.5">{stats.originalUrl}</p>
              <p className="text-indigo-400 font-bold text-sm">{stats.shortUrl}</p>
            </div>

            <div className="grid grid-cols-2 gap-3 mb-6">
              <div className="stat-card glass rounded-2xl p-4 text-center">
                <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-indigo-500 to-violet-500 flex items-center justify-center mx-auto mb-2">
                  <MousePointerClick size={14} className="text-white" />
                </div>
                <p className="text-3xl font-black text-white">{stats.clicks}</p>
                <p className="text-xs text-gray-500 mt-1">Total Clicks</p>
              </div>
              <div className="stat-card glass rounded-2xl p-4 text-center">
                <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-emerald-500 to-teal-500 flex items-center justify-center mx-auto mb-2">
                  <Calendar size={14} className="text-white" />
                </div>
                <p className="text-sm font-black text-white">{new Date(stats.createdAt).toLocaleDateString()}</p>
                <p className="text-xs text-gray-500 mt-1">Created</p>
              </div>
            </div>

            {chartData().length > 0 ? (
              <>
                <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-3">Clicks over time</p>
                <ResponsiveContainer width="100%" height={160}>
                  <AreaChart data={chartData()}>
                    <defs>
                      <linearGradient id="clickGrad" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#6366f1" stopOpacity={0.3} />
                        <stop offset="95%" stopColor="#6366f1" stopOpacity={0} />
                      </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.04)" />
                    <XAxis dataKey="date" tick={{ fontSize: 10, fill: "#6b7280" }} axisLine={false} tickLine={false} />
                    <YAxis tick={{ fontSize: 10, fill: "#6b7280" }} allowDecimals={false} axisLine={false} tickLine={false} />
                    <Tooltip
                      contentStyle={{ backgroundColor: "#0d0d1a", border: "1px solid rgba(99,102,241,0.3)", borderRadius: 12, fontSize: 12 }}
                      labelStyle={{ color: "#e5e7eb" }}
                      itemStyle={{ color: "#818cf8" }}
                    />
                    <Area type="monotone" dataKey="clicks" stroke="#6366f1" strokeWidth={2} fill="url(#clickGrad)" dot={false} />
                  </AreaChart>
                </ResponsiveContainer>
              </>
            ) : (
              <div className="text-center py-6">
                <MousePointerClick size={24} className="text-gray-700 mx-auto mb-2" />
                <p className="text-sm text-gray-600">No click data yet</p>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}
