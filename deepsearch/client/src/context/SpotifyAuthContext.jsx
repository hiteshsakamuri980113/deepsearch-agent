import { set } from "lodash";
import { createContext, useContext, useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { sendDataToPythonBackend } from "../utils/spotifyUtils";

const SpotifyAuthContext = createContext(null);

export const SpotifyAuthProvider = ({ children }) => {
  const [accessToken, setAccessToken] = useState(null);
  const [refreshToken, setRefreshToken] = useState(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    console.log("spotifyauthcontext useEffect called");
    // Check for access token in URL params (after Spotify redirect)
    const params = new URLSearchParams(window.location.search);
    const tokenFromUrl = params.get("access_token");
    const refreshTokenFromUrl = params.get("refresh_token");

    if (tokenFromUrl) {
      setAccessToken(tokenFromUrl);
      if (refreshTokenFromUrl) {
        setRefreshToken(refreshTokenFromUrl);
      }

      // Clean up URL
      window.history.replaceState({}, document.title, window.location.pathname);

      // Send tokens to Python backend
      sendDataToPythonBackend({
        access_token: tokenFromUrl,
        refresh_token: refreshTokenFromUrl || null,
      }).catch((err) =>
        console.error("Failed to send tokens to Python backend:", err)
      );
    } else {
      console.log("no token at this point");
      // Check if we have a token in localStorage
      const storedToken = localStorage.getItem("spotify_access_token");
      const storedRefreshToken = localStorage.getItem("spotify_refresh_token");

      if (storedToken) {
        setAccessToken(storedToken);
      }

      if (storedRefreshToken) {
        setRefreshToken(storedRefreshToken);
      }
    }
    setLoading(false);
  }, []);

  // Save token to localStorage when it changes
  useEffect(() => {
    console.log("accessToken", accessToken);
    if (accessToken) {
      localStorage.setItem("spotify_access_token", accessToken);

      // If we have both tokens, send to Python backend
      if (refreshToken && accessToken) {
        sendDataToPythonBackend({
          access_token: accessToken,
          refresh_token: refreshToken,
        }).catch((err) =>
          console.error("Failed to send tokens to Python backend:", err)
        );
      }
    } else {
      localStorage.removeItem("spotify_access_token");
    }

    // Save refresh token to localStorage
    if (refreshToken) {
      localStorage.setItem("spotify_refresh_token", refreshToken);
    } else {
      localStorage.removeItem("spotify_refresh_token");
    }
  }, [accessToken, refreshToken]);

  const login = () => {
    // Redirect to your backend auth endpoint
    window.location.href = "/api/auth";
  };

  const logout = async () => {
    if (!accessToken) {
      console.error("No access token to revoke");
      return;
    }

    const response = await fetch("/api/logout", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ accessToken }), // Send the access token to the backend
    });

    if (response.ok) {
      // Handle successful logout
      setAccessToken(null);
      setRefreshToken(null);
      localStorage.removeItem("spotify_access_token");
      localStorage.removeItem("spotify_refresh_token");
      navigate("/");

      console.log("Logged out successfully");
    } else {
      console.error("Logout failed");
    }
  };

  const value = {
    accessToken,
    refreshToken,
    loading,
    isAuthenticated: !!accessToken,
    login,
    logout,
  };

  return (
    <SpotifyAuthContext.Provider value={value}>
      {children}
    </SpotifyAuthContext.Provider>
  );
};

export const useSpotifyAuth = () => {
  const context = useContext(SpotifyAuthContext);
  if (!context) {
    throw new Error("useSpotifyAuth must be used within a SpotifyAuthProvider");
  }
  return context;
};
