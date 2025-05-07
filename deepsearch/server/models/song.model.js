import mongoose from "mongoose";

const SongSchema = new mongoose.Schema({
  songId: {
    type: String,
    trim: true,
    required: "Song ID is required",
  },
  songName: {
    type: String,
    trim: true,
    required: "Song name is required",
  },
  artists: {
    type: [String], // Array of artist names
    default: [],
  },
  genre: {
    type: [String], // Array of genres
    default: [], // Default to an empty array
  },
  playlistId: {
    type: String, // Reference to the playlist this song belongs to
    trim: true,
  },
  albumId: {
    type: String, // Reference to the album this song belongs to
    trim: true,
  },
  releaseYear: {
    type: Number, // Year the song was released
    default: null,
  },
  popularity: {
    type: Number, // Popularity score
    default: 0, // Default value for popularity
  },
  duration: {
    type: Number, // Duration of the song in seconds
    default: 0, // Default value for duration
  },
});

export default mongoose.model("Song", SongSchema);
