import express from "express";
import spotifyCtrl from "../controllers/spotify.controller.js";

const router = express.Router();

router.get("/auth", spotifyCtrl.getSpotifyAuth);
router.get("/callback", spotifyCtrl.handleSpotifyCallback);
router.post("/logout", spotifyCtrl.logout);

export default router;
