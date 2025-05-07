import express from "express";
import playListCtrl from "../controllers/playlist.controller.js";

const router = express.Router();
// router.route("/api/playlists").post(playListCtrl.create);

router.route("/syncWithSpotify").get(playListCtrl.syncPlaylistsWithSpotify);

// router.route("/api/getPlaylists").get(playListCtrl.getPlaylists);
// // router.route("/api/getPlaylistById").get(playListCtrl.getPlaylistById);

// router.route("/api/getPlaylistTracks").get(playListCtrl.getPlaylistTracks);

// router.route("/api/getSongInfo").get(playListCtrl.getSongInfo);

// router.route("/api/getLikedSongs").get(playListCtrl.getLikedSongs);
router.route("/createPlaylist").post(playListCtrl.createPlaylist);

router.route("/deletePlaylist").delete(playListCtrl.deletePlaylist);

router.get("/playlists", playListCtrl.getAllPlaylists);

router.get("/playlists/:playlistId", playListCtrl.getPlaylistById); // router.param("playlistId", playListCtrl.playlistByID);

router.get("/songs/:songId", playListCtrl.getSongById);

router.post("/createSpotifyPlaylist", playListCtrl.createSpotifyPlaylist);

export default router;
