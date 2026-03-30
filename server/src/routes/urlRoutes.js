const express = require("express");
const router = express.Router();
const auth = require("../middleware/auth");
const { shortenUrl, getAllUrls, getUrlStats, deleteUrl } = require("../controllers/urlController");

router.post("/shorten", auth, shortenUrl);
router.get("/urls", auth, getAllUrls);
router.get("/stats/:code", auth, getUrlStats);
router.delete("/:code", auth, deleteUrl);

module.exports = router;
