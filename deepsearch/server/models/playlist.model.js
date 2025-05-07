import mongoose from "mongoose";

const PlaylistSchema = new mongoose.Schema({
  playlistId: {
    type: String,
    trim: true,
    required: "Playlist ID is required",
  },
  name: {
    type: String,
    trim: true,
    required: "Playlist name is required",
  },
  songs: {
    type: [String], // Array of song IDs
    default: [],
  },
});

export default mongoose.model("Playlist", PlaylistSchema);

// import mongoose from "mongoose";

// const PlaylistSchema = new mongoose.Schema({
//     id:{
//         type: String,
//         trim: true,
//         required: "Id is required",
//     },
//     name: {
//         type: String,
//         trim: true,
//         required: "Name is required",
//     },
//     created: {
//         type: Date,
//         default: Date.now,
//     },
//     updated: {
//         type: Date,
//         default: Date.now,
//     },
//     songs: {
//         type: Array,
//         default: [],
//     },
//     coverPhoto: {
//         type: String,
//         default: "",
//         trim: true,
//     },
//     description: {
//         type: String,
//         default: "",
//         trim: true,
//     },
//     owner: {
//         type: String,
//         default: "",
//         trim: true,
//     },
//     visibility: {
//         type: String,
//         default: "Public",
//         trim: true,
//     },
//     subscribers: {
//         type: Array,
//         default: [],
//     },
//     songList: {
//         type: Array,
//         default: [],
//     },
//     searchTerms: {
//         type: Array,
//         default: [],
//     },
// });
// export default mongoose.model("Playlist", PlaylistSchema);
