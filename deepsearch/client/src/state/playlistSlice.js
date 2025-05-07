import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { syncData, fetchPlaylists, fetchSongs } from "../utils/spotifyUtils";

// Async thunk for syncing and updating playlist data
export const syncAndUpdatePlaylists = createAsyncThunk(
  "playlists/syncAndUpdate",
  async (accessToken) => {
    await syncData(accessToken);
    const playlistsData = await fetchPlaylists();
    return playlistsData;
  }
);

// Async thunk for just fetching playlists
export const fetchPlaylistsThunk = createAsyncThunk(
  "playlists/fetch",
  async () => {
    const playlistsData = await fetchPlaylists();
    return playlistsData;
  }
);

// Async thunk for just fetching songs
export const fetchSongsThunk = createAsyncThunk(
  "playlists/fetchSongs",
  async (allSongIds) => {
    const songsData = await fetchSongs(allSongIds);
    return songsData;
  }
);

export const fetchUserThunk = createAsyncThunk("user", async (accessToken) => {
  const userDetails = await fetchUserThunk(accessToken);
  return userDetails;
});

const playlistSlice = createSlice({
  name: "playlists",
  initialState: {
    items: [],
    songs: {}, // Change songs to an object
    selectedPlaylist: null,
    loading: false,
    error: null,
    syncMessage: null,
    // currentPlaylist: null,
  },
  reducers: {
    setSelectedPlaylist: (state, action) => {
      state.selectedPlaylist = action.payload;
    },
    setSyncMessage: (state, action) => {
      state.syncMessage = action.payload;
    },
    // setCurrentPlaylist: (state, action) => {
    //   state.currentPlaylist = action.payload;
    // },
  },
  extraReducers: (builder) => {
    builder
      // Handle syncAndUpdatePlaylists
      .addCase(syncAndUpdatePlaylists.pending, (state) => {
        state.loading = true;
        state.syncMessage = "Fetching playlist information...";
      })
      .addCase(syncAndUpdatePlaylists.fulfilled, (state, action) => {
        state.loading = false;
        state.items = action.payload;
        state.syncMessage = null;
        state.error = null;
      })
      .addCase(syncAndUpdatePlaylists.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
        state.syncMessage = null;
      })
      // Handle fetchPlaylistsThunk
      .addCase(fetchPlaylistsThunk.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchPlaylistsThunk.fulfilled, (state, action) => {
        state.loading = false;
        state.items = action.payload;
        state.error = null;
      })
      .addCase(fetchPlaylistsThunk.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
      })
      .addCase(fetchSongsThunk.fulfilled, (state, action) => {
        state.loading = false;

        // Transform the array of songs into an object
        const newSongs = action.payload.reduce((acc, song) => {
          acc[song.songId] = song; // Use song.songId as the key
          return acc;
        }, {});

        // Merge the new songs with the existing songs
        state.songs = { ...state.songs, ...newSongs };

        console.log("songs data updated in global state");
        console.log("songs in state:", state.songs);
      });
  },
});

export const { setSelectedPlaylist, setSyncMessage } = playlistSlice.actions;
export default playlistSlice.reducer;
