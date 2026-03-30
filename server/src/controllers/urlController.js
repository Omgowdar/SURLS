const { nanoid } = require("nanoid");
const validUrl = require("valid-url");
const Url = require("../models/Url");

const BASE_URL = process.env.BASE_URL || "http://localhost:3001";

exports.shortenUrl = async (req, res) => {
  const { originalUrl, customCode, expiryDays } = req.body;

  if (!validUrl.isUri(originalUrl))
    return res.status(400).json({ error: "Invalid URL provided" });

  try {
    let shortCode = customCode ? customCode.trim() : nanoid(6);

    if (customCode) {
      const existing = await Url.findOne({ shortCode });
      if (existing) return res.status(409).json({ error: "Custom code already taken" });
    }

    const expiresAt = expiryDays
      ? new Date(Date.now() + expiryDays * 24 * 60 * 60 * 1000)
      : null;

    const url = await Url.create({
      originalUrl,
      shortCode,
      customCode: !!customCode,
      expiresAt,
      user: req.user.id,
    });

    res.status(201).json({
      _id: url._id,
      originalUrl: url.originalUrl,
      shortUrl: `${BASE_URL}/${shortCode}`,
      shortCode: url.shortCode,
      clicks: url.clicks,
      expiresAt: url.expiresAt,
      createdAt: url.createdAt,
    });
  } catch (err) {
    res.status(500).json({ error: "Server error" });
  }
};

exports.redirectUrl = async (req, res) => {
  const { code } = req.params;

  try {
    const url = await Url.findOne({ shortCode: code });
    if (!url) return res.status(404).json({ error: "Short URL not found" });

    if (url.expiresAt && new Date() > url.expiresAt)
      return res.status(410).json({ error: "This link has expired" });

    url.clicks += 1;
    url.clickData.push({
      referrer: req.headers.referer || "Direct",
      userAgent: req.headers["user-agent"] || "",
    });
    await url.save();

    res.redirect(url.originalUrl);
  } catch (err) {
    res.status(500).json({ error: "Server error" });
  }
};

exports.getAllUrls = async (req, res) => {
  try {
    const urls = await Url.find({ user: req.user.id })
      .sort({ createdAt: -1 })
      .select("-clickData");

    const BASE = process.env.BASE_URL || "http://localhost:3001";
    res.json(
      urls.map((u) => ({
        _id: u._id,
        originalUrl: u.originalUrl,
        shortUrl: `${BASE}/${u.shortCode}`,
        shortCode: u.shortCode,
        clicks: u.clicks,
        expiresAt: u.expiresAt,
        createdAt: u.createdAt,
      }))
    );
  } catch (err) {
    res.status(500).json({ error: "Server error" });
  }
};

exports.getUrlStats = async (req, res) => {
  const { code } = req.params;
  try {
    const url = await Url.findOne({ shortCode: code, user: req.user.id });
    if (!url) return res.status(404).json({ error: "Not found" });

    const BASE = process.env.BASE_URL || "http://localhost:3001";
    res.json({
      _id: url._id,
      originalUrl: url.originalUrl,
      shortUrl: `${BASE}/${url.shortCode}`,
      shortCode: url.shortCode,
      clicks: url.clicks,
      clickData: url.clickData,
      expiresAt: url.expiresAt,
      createdAt: url.createdAt,
    });
  } catch (err) {
    res.status(500).json({ error: "Server error" });
  }
};

exports.deleteUrl = async (req, res) => {
  const { code } = req.params;
  try {
    const url = await Url.findOneAndDelete({ shortCode: code, user: req.user.id });
    if (!url) return res.status(404).json({ error: "Not found" });
    res.json({ message: "Deleted successfully" });
  } catch (err) {
    res.status(500).json({ error: "Server error" });
  }
};
