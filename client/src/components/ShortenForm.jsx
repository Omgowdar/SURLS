import { useState } from "react";
import { Copy, Check, Link2, Zap, Hash, Clock, ExternalLink } from "lucide-react";
import toast from "react-hot-toast";
import api from "../api";

export default function ShortenForm() {
  const [originalUrl, setOriginalUrl] = useState("");
  const [customCode, setCustomCode] = useState("");
  const [expiryDays, setExpiryDays] = useState("");
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);
  const [copied, setCopied] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setResult(null);
    try {
      const { data } = await api.post("/shorten", {
        originalUrl,
        customCode: customCode || undefined,
        expiryDays: expiryDays ? Number(expiryDays) : undefined,
      });
      setResult(data);
      toast.success("Short URL created!");
    } catch (err) {
      toast.error(err.response?.data?.error || "Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  const copy = () => {
    navigator.clipboard.writeText(result.shortUrl);
    setCopied(true);
    toast.success("Copied to clipboard!");
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="relative min-h-[calc(100vh-65px)] flex items-center justify-center px-4">
      <div className="bg-mesh" />
      <div className="bg-grid" />
      <div className="orb orb-1" />
      <div className="orb orb-2" />
      <div className="orb orb-3" />

      <div className="relative z-10 w-full max-w-2xl fade-up">
        {/* Hero text */}
        <div className="text-center mb-10">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-indigo-500/10 border border-indigo-500/20 text-indigo-400 text-xs font-semibold mb-4 uppercase tracking-widest">
            <Zap size={12} />
            Smart URL Shortener
          </div>
          <h1 className="text-5xl font-black text-white mb-3 leading-tight">
            Shorten. Share.{" "}
            <span className="bg-gradient-to-r from-indigo-400 to-violet-400 bg-clip-text text-transparent">
              Track.
            </span>
          </h1>
          <p className="text-gray-500 text-base">Paste a long link and get a short, shareable one instantly.</p>
        </div>

        {/* Form card */}
        <div className="glass rounded-3xl p-8 shadow-2xl shadow-black/50">
          <form onSubmit={handleSubmit} className="space-y-5">
            {/* URL input */}
            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-gray-400 uppercase tracking-wider">Long URL</label>
              <div className="relative flex items-center">
                <Link2 size={16} className="absolute left-4 text-gray-500 pointer-events-none" />
                <input
                  type="url"
                  required
                  placeholder="https://example.com/very/long/url/that/needs/shortening"
                  value={originalUrl}
                  onChange={(e) => setOriginalUrl(e.target.value)}
                  className="input-glow w-full rounded-xl pl-11 pr-4 py-3.5 text-sm placeholder-gray-600"
                />
              </div>
            </div>

            {/* Custom code + expiry */}
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-gray-400 uppercase tracking-wider">Custom Code</label>
                <div className="relative">
                  <Hash size={14} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-500" />
                  <input
                    type="text"
                    placeholder="my-link"
                    value={customCode}
                    onChange={(e) => setCustomCode(e.target.value)}
                    className="input-glow w-full rounded-xl pl-9 pr-4 py-3 text-sm placeholder-gray-600"
                  />
                </div>
              </div>
              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-gray-400 uppercase tracking-wider">Expiry (days)</label>
                <div className="relative">
                  <Clock size={14} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-500" />
                  <input
                    type="number"
                    min="1"
                    placeholder="7"
                    value={expiryDays}
                    onChange={(e) => setExpiryDays(e.target.value)}
                    className="input-glow w-full rounded-xl pl-9 pr-4 py-3 text-sm placeholder-gray-600"
                  />
                </div>
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="btn-glow w-full text-white font-bold py-3.5 rounded-xl flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed text-sm"
            >
              <Zap size={16} />
              {loading ? "Shortening..." : "Shorten URL"}
            </button>
          </form>

          {/* Result */}
          {result && (
            <div className="mt-6 p-5 rounded-2xl bg-indigo-500/5 border border-indigo-500/20 fade-up">
              <p className="text-xs font-semibold text-indigo-400 uppercase tracking-wider mb-3">Your short URL is ready</p>
              <div className="flex items-center justify-between gap-3">
                <a
                  href={result.shortUrl}
                  target="_blank"
                  rel="noreferrer"
                  className="flex items-center gap-2 text-indigo-300 font-bold text-lg hover:text-indigo-200 transition-colors truncate group"
                >
                  {result.shortUrl}
                  <ExternalLink size={14} className="opacity-0 group-hover:opacity-100 transition-opacity shrink-0" />
                </a>
                <button
                  onClick={copy}
                  className={`shrink-0 flex items-center gap-1.5 px-4 py-2 rounded-xl text-sm font-semibold transition-all duration-200 ${
                    copied
                      ? "bg-green-500/20 text-green-400 border border-green-500/30"
                      : "bg-white/5 hover:bg-white/10 text-gray-300 border border-white/10 hover:border-indigo-500/40"
                  }`}
                >
                  {copied ? <Check size={14} /> : <Copy size={14} />}
                  {copied ? "Copied!" : "Copy"}
                </button>
              </div>
              {result.expiresAt && (
                <p className="text-xs text-gray-600 mt-2 flex items-center gap-1">
                  <Clock size={11} />
                  Expires {new Date(result.expiresAt).toLocaleDateString()}
                </p>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
