const express = require("express");
const multer = require("multer");

const musicController = require("../controllers/music.controller");
const authMiddleware = require("../middlewares/auth.middleware");

// Middlewares
const upload = multer({
  storage: multer.memoryStorage(),
});
const router = express.Router();

// Routes

// upload a music
router.post(
  "/upload",
  authMiddleware.authArtist,
  upload.single("music"),
  musicController.createMusic,
);

// upload an album
router.post(
  "/createAlbum",
  authMiddleware.authArtist,
  musicController.createAlbum,
);

// get all musics
router.get("/", authMiddleware.authUser, musicController.getAllMusics);

module.exports = router;
