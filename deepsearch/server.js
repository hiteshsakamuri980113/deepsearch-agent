import config from "./config/config.js";
import app from "./server/express.js";
import mongoose from "mongoose";
import dotenv from "dotenv";
import SpotifyWebApi from "spotify-web-api-node";
import path from "path";
import express from "express";

dotenv.config();

// Configure MongoDB connection
mongoose.Promise = global.Promise;
mongoose
  .connect(config.mongoUri, {
    useNewUrlParser: true,
  })
  .then(() => console.log("Connected to MongoDB"));
mongoose.connection.on("error", () => {
  throw new Error("unable to connect to database: " + config.mongoUri);
});

// Configure Spotify API client
const spotifyApi = new SpotifyWebApi({
  clientId: process.env.SPOTIFY_CLIENT_ID,
  clientSecret: process.env.SPOTIFY_CLIENT_SECRET,
  redirectUri: process.env.SPOTIFY_REDIRECT_URI,
});

console.log("Spotify Client ID:", process.env.SPOTIFY_CLIENT_ID);
console.log("Spotify Client Secret:", process.env.SPOTIFY_CLIENT_SECRET);

// Serve static files from the frontend
const __dirname = path.resolve();
app.use(express.static(path.join(__dirname, "client/dist")));

// Fallback for React Router (serve index.html for all non-API routes)
app.get("*", (req, res) => {
  res.sendFile(path.join(__dirname, "client/dist", "index.html"));
});

// Start the server
app.listen(config.port, (err) => {
  if (err) {
    console.log(err);
  }
  console.info("Server started on port %s.", config.port);
});

// Export the Spotify API client
export { spotifyApi };
