import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { fetchUser } from "../utils/spotifyUtils";

export const fetchUserThunk = createAsyncThunk("user", async (accessToken) => {
  const userDetails = await fetchUser(accessToken);
  return userDetails;
});

const userSlice = createSlice({
  name: "user",
  initialState: {
    user: {},
    loading: true,
    error: null,
  },

  reducers: {},

  extraReducers: (builder) => {
    builder
      .addCase(fetchUserThunk.fulfilled, (state, action) => {
        state.loading = false;
        state.user = action.payload;
      })
      .addCase(fetchUserThunk.rejected, (state, action) => {
        state.loading = false;
        state.error = "Failed to fetch user details";
      });
  },
});

export default userSlice.reducer;
