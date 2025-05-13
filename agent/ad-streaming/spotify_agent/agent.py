import os
import subprocess
import urllib.parse
from google.adk.agents import Agent
from google.adk.tools import google_search
import requests
import time
from dotenv import load_dotenv

# Global variables for token management
_last_token_reload_time = 0
_token_reload_interval = 5  # Reload token every 5 seconds

def get_latest_access_token():
    """
    Gets the latest access token from the .env file
    Reloads the .env file each time to ensure latest value is used
    Implements caching to avoid excessive file I/O
    """
    global _last_token_reload_time
    
    # Only reload if it's been more than _token_reload_interval seconds since last reload
    current_time = time.time()
    if current_time - _last_token_reload_time > _token_reload_interval:
        load_dotenv(override=True)  # Force reload of .env file
        _last_token_reload_time = current_time
        
    access_token = os.getenv("SPOTIFY_ACCESS_TOKEN")
    if not access_token:
        print("WARNING: SPOTIFY_ACCESS_TOKEN not found in environment")
    return access_token

def search_tracks(song_names, user_token=None) -> dict:
    # Use provided token or get latest
    token = user_token if user_token else get_latest_access_token()
    
    if not token:
        return {"status": "error", "message": "No valid access token available"}
        
    headers = {"Authorization": f"Bearer {token}"}
    track_uris = []

    for song_name in song_names:
        search_url = "https://api.spotify.com/v1/search"
        params = {"q": song_name, "type": "track", "limit": 1}  # Limit to 1 result per song
        response = requests.get(search_url, headers=headers, params=params)

        if response.status_code != 200:
            return {"status": "error", "message": f"Failed to search for song: {song_name}"}

        results = response.json()
        tracks = results.get("tracks", {}).get("items", [])
        if tracks:
            track_uris.append(tracks[0]["uri"])  # Get the URI of the first result

    return {"status": "success", "track_uris": track_uris}

def create_spotify_playlist(playlist_name: str, song_names: str) -> dict:

    user_token = get_latest_access_token()

    if not user_token:
        return {"status": "error", "message": "No valid access token available"}

    songList = song_names.split(', ')

    search_result = search_tracks(songList, user_token)
    if search_result["status"] != "success":
        return search_result

    track_uris = search_result["track_uris"]

    # Get the current user's profile
    user_profile_url = "https://api.spotify.com/v1/me"
    headers = {"Authorization": f"Bearer {user_token}"}
    response = requests.get(user_profile_url, headers=headers)

    if response.status_code != 200:
        return {"status": "error", "message": "Failed to fetch user profile."}

    user_id = response.json()["id"]

    # Create a new playlist
    create_playlist_url = f"https://api.spotify.com/v1/users/{user_id}/playlists"
    payload = {
        "name": playlist_name,
        "description": "A playlist created by the Spotify agent.",
        "public": False,
    }
    response = requests.post(create_playlist_url, headers=headers, json=payload)

    if response.status_code != 201:
        return {"status": "error", "message": "Failed to create playlist."}

    playlist_id = response.json()["id"]

    # Add tracks to the playlist
    add_tracks_url = f"https://api.spotify.com/v1/playlists/{playlist_id}/tracks"
    payload = {"uris": track_uris}
    response = requests.post(add_tracks_url, headers=headers, json=payload)

    if response.status_code != 201:
        return {"status": "error", "message": "Failed to add tracks to playlist."}
    subprocess.run(["open", "-a", "Spotify"])
    return {
        "status": "success",
        "report": {
            "message": "Playlist created successfully.",
        },
    }

def fetch_spotify_playlists() -> dict:

    user_token = get_latest_access_token()

    if not user_token:
        return {"status": "error", "message": "No valid access token available"}

    print("user_token: ", user_token)

    playlists_url = "https://api.spotify.com/v1/me/playlists"
    headers = {"Authorization": f"Bearer {user_token}"}

    # Make the GET request to fetch playlists
    response = requests.get(playlists_url, headers=headers)

    if response.status_code != 200:
        return {"status": "error", "message": "Failed to fetch playlists."}

    # Parse the response JSON
    playlists_data = response.json()

    # Extract only the playlist names
    playlist_names = [playlist.get("name", "Unknown Playlist") for playlist in playlists_data.get("items", [])]

    # Return the playlist names as a report
    return {
        "status": "success",
        "report": {
            "message": "Fetched playlists successfully.",
            "playlists": playlist_names
        }
    }

root_agent=Agent(
    name="utility_agent",
    model="gemini-2.0-flash-exp",
    description="An agent to help with user's song requests by following the instructions properly.",
    instruction="If the user asks to fetch their playlists, call the 'fetch_spotify_playlists' tool and return the playlist names. If the user asks about song information, fetch it using 'google_search' tool. If the user asks to create a playlist, first let the user know about the songs that are gonna be in the playlist and later ask the name of the playlist and then create the playlist using the 'create_spotify_playlist' tool.",
    tools=[google_search, fetch_spotify_playlists, create_spotify_playlist]
)
