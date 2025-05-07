import { configureStore } from "@reduxjs/toolkit";
import playlistReducer from "../state/playlistSlice";
import userReducer from "../state/userSlice";

export const store = configureStore({
  reducer: {
    playlists: playlistReducer,
    user: userReducer,
    // ... other reducers
  },
});
