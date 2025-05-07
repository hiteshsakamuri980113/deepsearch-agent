import { set } from "lodash";
import { createContext, useContext, useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

const SpotifyAuthContext = createContext(null);

export const SpotifyAuthProvider = ({ children }) => {
  const [accessToken, setAccessToken] = useState(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    console.log("spotifyauthcontext useEffect called");
    // console.log("i see this loading when app loads");
    // Check for access token in URL params (after Spotify redirect)
    const params = new URLSearchParams(window.location.search);
    const tokenFromUrl = params.get("access_token");

    if (tokenFromUrl) {
      setAccessToken(tokenFromUrl);
      // Clean up URL
      window.history.replaceState({}, document.title, window.location.pathname);
    } else {
      console.log("no token at this point");
      // Check if we have a token in localStorage
      const storedToken = localStorage.getItem("spotify_access_token");
      if (storedToken) {
        setAccessToken(storedToken);
      }
    }
    setLoading(false);
  }, []);

  // Save token to localStorage when it changes
  useEffect(() => {
    console.log("accessToken", accessToken);
    if (accessToken) {
      localStorage.setItem("spotify_access_token", accessToken);
    } else {
      localStorage.removeItem("spotify_access_token");
    }
  }, [accessToken]);

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
      localStorage.removeItem("spotify_access_token");
      navigate("/");

      console.log("Logged out successfully");
    } else {
      console.error("Logout failed");
    }
  };

  const value = {
    accessToken,
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
