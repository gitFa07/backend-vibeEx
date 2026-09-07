require("dotenv").config();

const express = require("express");
const cookieParser = require("cookie-parser");
const authRoutes = require("./routes/auth.routes");
const musicRoutes = require("./routes/music.routes");

const app = express();

// Middleware
app.use(express.json());
app.use(cookieParser());

// Routes
app.use("/api/auth", authRoutes);
app.use("/api/music", musicRoutes);

app.get("/", (req, res) => {
  res.send("MusicApp is up and running");
});

module.exports = app;
