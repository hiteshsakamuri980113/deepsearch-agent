import errorHandler from "../helpers/dbErrorHandler.js";
import extend from "lodash/extend.js";
import { spotifyApi } from "../../server.js";
import axios from "axios";

const scopes = [
  "playlist-read-private", // Scope to read private playlists
  "playlist-read-collaborative", // Scope to read collaborative playlists
  "user-library-read", // Scope to read the user's saved tracks
  "playlist-modify-public", // Scope to create and modify public playlists
  "playlist-modify-private", // Scope to create and modify private playlists
  "user-read-private",
  "user-read-email",
];

const getSpotifyAuth = (req, res) => {
  console.log("access token in spotify api:", spotifyApi.getAccessToken());
  console.log("refresh token in spotify api:", spotifyApi.getRefreshToken());
  const authUrl = spotifyApi.createAuthorizeURL(scopes, "your_state_value");
  res.redirect(authUrl);
};

const handleSpotifyCallback = async (req, res) => {
  const code = req.query.code;

  try {
    const data = await spotifyApi.authorizationCodeGrant(code);
    const accessToken = data.body.access_token;
    const refreshToken = data.body.refresh_token;

    // Save tokens for future use (e.g., in a database or session)
    spotifyApi.setAccessToken(accessToken);
    spotifyApi.setRefreshToken(refreshToken);

    console.log("refresh_token: ", refreshToken);

    res.redirect(
      `http://localhost:5173/new-search?access_token=${accessToken}`
    );
  } catch (err) {
    console.error("Error during Spotify authorization:", err);
    res.status(500).send("Failed to authenticate with Spotify.");
  }
};

const revokeSpotifyTokens = async (accessToken) => {
  try {
    const clientId = process.env.SPOTIFY_CLIENT_ID;
    const clientSecret = process.env.SPOTIFY_CLIENT_SECRET;

    // Spotify token revocation endpoint
    const revokeUrl = "https://accounts.spotify.com/api/token";

    // Make a POST request to revoke the token
    const response = await axios.post(
      revokeUrl,
      new URLSearchParams({
        token: accessToken,
        token_type_hint: "access_token", // Specify the type of token being revoked
      }),
      {
        headers: {
          Authorization: `Basic ${Buffer.from(
            `${clientId}:${clientSecret}`
          ).toString("base64")}`,
          "Content-Type": "application/x-www-form-urlencoded",
        },
      }
    );

    console.log("Token revoked successfully:", response.data);
  } catch (err) {
    console.error(
      "Error revoking Spotify token:",
      err.response?.data || err.message
    );
  }
};

const logout = async (req, res) => {
  try {
    const { accessToken } = req.body; // Get the token from the frontend
    spotifyApi.setAccessToken(null);
    spotifyApi.setRefreshToken(null);

    if (accessToken) {
      console.log("Revoking token...");
      await revokeSpotifyTokens(accessToken); // Revoke the token on Spotify's servers
    } else {
      console.error("No access token provided for revocation");
      return res.status(400).send("Access token is required for logout");
    }

    res.status(200).send("Logged out successfully");
  } catch (err) {
    console.error("Error during logout:", err);
    res.status(500).send("Failed to log out.");
  }
};

export default { getSpotifyAuth, handleSpotifyCallback, logout };
