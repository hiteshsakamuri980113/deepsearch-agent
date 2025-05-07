import React, { useState, useEffect } from "react";
import "./App.css";
import { set } from "lodash";

function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [playlists, setPlaylists] = useState([]);
  const [songs, setSongs] = useState([]);
  const [expandedPlaylistId, setExpandedPlaylistId] = useState(null);
  const [likedSongs, setLikedSongs] = useState([]);
  const [topSongs, setTopSongs] = useState([]);
  const [playlistId, setPlaylistId] = useState(null);
  const [filteredSongs, setFilteredSongs] = useState([]);
  const [filterGenre, setFilterGenre] = useState("");
  const [filterYear, setFilterYear] = useState("");
  const [showFilterBlock, setShowFilterBlock] = useState(false);

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const accessToken = params.get("access_token");

    if (accessToken) {
      setIsLoggedIn(true);
      localStorage.setItem("spotify_access_token", accessToken);
      window.history.replaceState({}, document.title, "/");

      // Invoke syncData immediately after login
      syncData();
    }
  }, []);

  const syncData = async () => {
    const accessToken = localStorage.getItem("spotify_access_token");
    if (!accessToken) {
      alert("Please log in first!");
      return;
    }

    const response = await fetch(
      `/api/syncWithSpotify?access_token=${accessToken}`
    );
    const data = await response.json();
    console.log(data);
  };

  const handleLogin = () => {
    window.location.href = "http://localhost:3000/auth";
  };

  const fetchLikedSongs = async () => {
    const accessToken = localStorage.getItem("spotify_access_token");
    if (!accessToken) {
      alert("Please log in first!");
      return;
    }

    try {
      const response = await fetch(
        `/api/getLikedSongs?access_token=${accessToken}`
      );
      const data = await response.json();
      console.log(data);
      setLikedSongs(data.items || []);
      setTopSongs(data.items.slice(0, 10) || []);
    } catch (err) {
      console.error("Error fetching liked songs:", err);
    }
  };

  const fetchPlaylists = async () => {
    const accessToken = localStorage.getItem("spotify_access_token");
    if (!accessToken) {
      alert("Please log in first!");
      return;
    }

    try {
      const response = await fetch(
        `/apigetPlaylists?access_token=${accessToken}`
      );
      const data = await response.json();
      console.log(data);
      setPlaylists(data.items || []);
    } catch (err) {
      console.error("Error fetching playlists:", err);
    }
  };

  const fetchSongsInPlaylist = async (playlistId) => {
    const accessToken = localStorage.getItem("spotify_access_token");
    if (!accessToken) {
      alert("Please log in first!");
      return;
    }

    try {
      const response = await fetch(
        `/apigetPlaylistTracks?access_token=${accessToken}&playlist_id=${playlistId}`
      );
      const data = await response.json();
      console.log(data);
      setSongs(data.items || []);
      setExpandedPlaylistId(playlistId);
    } catch (err) {
      console.error("Error fetching songs in playlist:", err);
    }
  };

  const fetchSongInfo = async (songId) => {
    const accessToken = localStorage.getItem("spotify_access_token");
    if (!accessToken) {
      alert("Please log in first!");
      return;
    }
    try {
      const response = await fetch(
        `/apigetSongInfo?access_token=${accessToken}&song_id=${songId}`
      );
      const data = await response.json();
    } catch (err) {
      console.error("Error fetching song info:", err);
    }
  };

  const createPlaylist = async () => {
    const access_token = localStorage.getItem("spotify_access_token");
    if (!access_token) {
      alert("Please log in first!");
      return;
    }

    try {
      // Map topSongs to valid Spotify track URIs
      const validTracks = topSongs
        .filter((song) => song.track && song.track.id) // Ensure track and id exist
        .map((song) => `spotify:track:${song.track.id}`); // Map to URIs

      console.log("Valid Tracks:", validTracks); // Debugging: Log valid tracks

      if (validTracks.length === 0) {
        alert("No valid tracks to create a playlist.");
        return;
      }

      // Send the valid tracks to the backend
      const response = await fetch(
        `/apicreatePlaylist?access_token=${access_token}`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            topTracks: validTracks, // Send only valid URIs
          }),
        }
      );

      if (!response.ok) {
        alert("Failed to create playlist.");
        return;
      }

      const data = await response.json();
      console.log("Playlist created:", data); // Debugging: Log response
      setPlaylistId(data.playlistId); // Use the response to set the playlist ID
    } catch (err) {
      console.error("Error creating playlist:", err);
    }
  };

  const deletePlaylist = async () => {
    const access_token = localStorage.getItem("spotify_access_token");
    if (!access_token) {
      alert("please log in first!");
      return;
    }
    try {
      const response = await fetch(
        `/apideletePlaylist?access_token=${access_token}`,
        {
          method: "DELETE",
          headers: {
            "content-type": "application/json",
          },
          body: JSON.stringify({
            playlistId: playlistId,
          }),
        }
      );
      if (!response.ok) {
        alert("Failed to delete playlist.");
      }
    } catch (err) {
      console.error("Error deleting playlist:", err);
    }
  };

  const toggleFilterBlock = () => {
    setShowFilterBlock(!showFilterBlock);
  };

  return (
    <div style={{ textAlign: "center", marginTop: "50px" }}>
      <h1>Deep Search</h1>
      {!isLoggedIn ? (
        <button
          onClick={handleLogin}
          style={{
            padding: "10px 20px",
            fontSize: "16px",
            margin: "10px",
            backgroundColor: "#1DB954",
            color: "white",
            border: "none",
            borderRadius: "5px",
            cursor: "pointer",
          }}
        >
          Login to Spotify
        </button>
      ) : (
        <>
          <button
            onClick={fetchPlaylists}
            style={{
              padding: "10px 20px",
              fontSize: "16px",
              margin: "10px",
              backgroundColor: "#1DB954",
              color: "white",
              border: "none",
              borderRadius: "5px",
              cursor: "pointer",
            }}
          >
            Fetch Playlists
          </button>

          <button
            onClick={() => fetchLikedSongs()}
            style={{
              padding: "10px 20px",
              fontSize: "16px",
              margin: "10px",
              backgroundColor: "#1DB954",
              color: "white",
              border: "none",
              borderRadius: "5px",
              cursor: "pointer",
            }}
          >
            Fetch Liked Songs
          </button>

          <button
            onClick={() => createPlaylist()}
            style={{
              padding: "10px 20px",
              fontSize: "16px",
              margin: "10px",
              backgroundColor: "#1DB954",
              color: "white",
              border: "none",
              borderRadius: "5px",
              cursor: "pointer",
            }}
          >
            Create Playlist
          </button>

          <button
            onClick={() => deletePlaylist()}
            style={{
              padding: "10px 20px",
              fontSize: "16px",
              margin: "10px",
              backgroundColor: "#FF4C4C",
              color: "white",
              border: "none",
              borderRadius: "5px",
              cursor: "pointer",
            }}
          >
            Delete Playlist
          </button>

          <button
            onClick={toggleFilterBlock}
            style={{
              padding: "10px 20px",
              fontSize: "16px",
              margin: "10px",
              backgroundColor: "#1DB954",
              color: "white",
              border: "none",
              borderRadius: "5px",
              cursor: "pointer",
            }}
          >
            Display Filter
          </button>

          {showFilterBlock && (
            <div
              style={{
                marginTop: "20px",
                padding: "20px",
                border: "1px solid #ddd",
                borderRadius: "10px",
                backgroundColor: "#f9f9f9",
                textAlign: "left",
              }}
            >
              <h2>Filter Playlists</h2>
              {/* Display Playlists */}
              {playlists.length > 0 ? (
                <div>
                  <h3>Your Playlists</h3>
                  {playlists.map((playlist) => (
                    <div
                      key={playlist.id}
                      style={{
                        padding: "10px",
                        borderBottom: "1px solid #ddd",
                        cursor: "pointer",
                      }}
                      onClick={() => setExpandedPlaylistId(playlist.id)}
                    >
                      <strong>{playlist.name}</strong>
                    </div>
                  ))}
                </div>
              ) : (
                <p>No playlists available. Fetch playlists first.</p>
              )}

              {/* Display Songs in Selected Playlist */}
              {expandedPlaylistId && songs.length > 0 && (
                <div style={{ marginTop: "20px" }}>
                  <h3>Songs in Playlist</h3>
                  {songs.map((song, index) => (
                    <div
                      key={index}
                      style={{
                        padding: "10px",
                        borderBottom: "1px solid #ddd",
                      }}
                    >
                      {song.track.name} by{" "}
                      {song.track.artists
                        .map((artist) => artist.name)
                        .join(", ")}
                    </div>
                  ))}
                </div>
              )}

              {/* Filtering Options */}
              {expandedPlaylistId && (
                <div style={{ marginTop: "20px" }}>
                  <h3>Filter Options</h3>
                  <div style={{ marginBottom: "10px" }}>
                    <label>
                      Genre:{" "}
                      <select
                        value={filterGenre}
                        onChange={(e) => setFilterGenre(e.target.value)}
                        style={{
                          padding: "5px",
                          borderRadius: "5px",
                          border: "1px solid #ddd",
                        }}
                      >
                        <option value="">Select Genre</option>
                        <option value="Pop">Pop</option>
                        <option value="Rock">Rock</option>
                        <option value="Hip-Hop">Hip-Hop</option>
                        <option value="Jazz">Jazz</option>
                      </select>
                    </label>
                  </div>
                  <div style={{ marginBottom: "10px" }}>
                    <label>
                      Release Year:{" "}
                      <input
                        type="number"
                        value={filterYear}
                        onChange={(e) => setFilterYear(e.target.value)}
                        placeholder="Enter year"
                        style={{
                          padding: "5px",
                          borderRadius: "5px",
                          border: "1px solid #ddd",
                        }}
                      />
                    </label>
                  </div>
                  <button
                    onClick={() => console.log("Apply Filter")}
                    style={{
                      padding: "10px 20px",
                      fontSize: "14px",
                      backgroundColor: "#1DB954",
                      color: "white",
                      border: "none",
                      borderRadius: "5px",
                      cursor: "pointer",
                    }}
                  >
                    Apply Filter
                  </button>
                </div>
              )}

              {/* Display Filtered Songs */}
              {filteredSongs.length > 0 && (
                <div style={{ marginTop: "20px" }}>
                  <h3>Filtered Songs</h3>
                  {filteredSongs.map((song, index) => (
                    <div
                      key={index}
                      style={{
                        padding: "10px",
                        borderBottom: "1px solid #ddd",
                      }}
                    >
                      {song.track.name} by{" "}
                      {song.track.artists
                        .map((artist) => artist.name)
                        .join(", ")}
                    </div>
                  ))}
                </div>
              )}

              {/* Button to Create Playlist */}
              {filteredSongs.length > 0 && (
                <button
                  onClick={() => console.log("Create Playlist")}
                  style={{
                    marginTop: "20px",
                    padding: "10px 20px",
                    fontSize: "14px",
                    backgroundColor: "#1DB954",
                    color: "white",
                    border: "none",
                    borderRadius: "5px",
                    cursor: "pointer",
                  }}
                >
                  Create Playlist
                </button>
              )}
            </div>
          )}

          {/* Display Playlists */}
          {playlists.length > 0 && (
            <div
              style={{
                marginTop: "20px",
                textAlign: "left",
                padding: "0 20px",
              }}
            >
              <h2>Your Playlists</h2>
              {playlists.map((playlist) => (
                <div
                  key={playlist.id}
                  style={{
                    padding: "10px",
                    borderBottom: "1px solid #ddd",
                    cursor: "pointer",
                  }}
                  onClick={() => fetchSongsInPlaylist(playlist.id)}
                >
                  <strong>{playlist.name}</strong> - {playlist.tracks.total}{" "}
                  songs
                </div>
              ))}
            </div>
          )}

          {/* Display Songs in Playlist */}
          {expandedPlaylistId && songs.length > 0 && (
            <div
              style={{
                marginTop: "20px",
                textAlign: "left",
                padding: "0 20px",
              }}
            >
              <h2>Songs in Playlist</h2>
              {songs.map((song, index) => (
                <div
                  key={index}
                  style={{
                    padding: "10px",
                    borderBottom: "1px solid #ddd",
                  }}
                >
                  <button
                    onClick={() => fetchSongInfo(song.track.id)}
                    style={{
                      padding: "10px 15px",
                      fontSize: "14px",
                      backgroundColor: "#1DB954",
                      color: "white",
                      border: "none",
                      borderRadius: "5px",
                      cursor: "pointer",
                    }}
                  >
                    {song.track.name} by{" "}
                    {song.track.artists.map((artist) => artist.name).join(", ")}
                  </button>
                </div>
              ))}
            </div>
          )}

          {/* Display Liked Songs */}
          {likedSongs.length > 0 && (
            <div
              style={{
                marginTop: "20px",
                textAlign: "left",
                padding: "0 20px",
              }}
            >
              <h2>Your Liked Songs</h2>
              {likedSongs.map((song, index) => (
                <div
                  key={index}
                  style={{
                    padding: "10px",
                    borderBottom: "1px solid #ddd",
                  }}
                >
                  <button
                    onClick={() => fetchSongInfo(song.track.id)}
                    style={{
                      padding: "10px 15px",
                      fontSize: "14px",
                      backgroundColor: "#1DB954",
                      color: "white",
                      border: "none",
                      borderRadius: "5px",
                      cursor: "pointer",
                    }}
                  >
                    {song.track.name} by{" "}
                    {song.track.artists.map((artist) => artist.name).join(", ")}
                  </button>
                </div>
              ))}
            </div>
          )}
        </>
      )}
    </div>
  );
}

export default App;
