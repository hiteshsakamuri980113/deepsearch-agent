export const syncData = async (accessToken) => {
  if (!accessToken) {
    alert("Please log in first!");
    return;
  }

  try {
    const response = await fetch(
      `/api/syncWithSpotify?access_token=${accessToken}`
    );
    const data = await response.json();
    console.log(data);
    return data; // Return the data for further use
  } catch (error) {
    return error.message;
    console.error("Error syncing data:", error);
    throw error; // Throw the error to handle it in the calling function
  }
};

export const fetchPlaylists = async () => {
  try {
    const response = await fetch("/api/playlists");
    const data = await response.json();
    // setPlaylists(data); // Update the playlists state
    return data; // Return the data for further use
  } catch (error) {
    console.error("Error fetching playlists:", error);
  }
};

export const fetchSongs = async (songIds) => {
  try {
    const songDetails = await Promise.all(
      songIds.map(async (songId) => {
        const response = await fetch(`/api/songs/${songId}`); // Replace with your backend API endpoint
        const data = await response.json();
        return { id: songId, ...data };
      })
    );

    return songDetails;
  } catch (error) {
    console.error("Error fetching songs:", error);
  }
};

export const fetchUser = async (accessToken) => {
  try {
    const response = await fetch(`/api/user?access_token=${accessToken}`);

    if (response.ok) {
      const data = response.json();
      console.log("user data: ", data);
      return data;
    } else {
      throw new Error("unable to retrieve user data");
    }
  } catch (error) {
    return error.msg;
  }
};

export const sendDataToPythonBackend = async (data) => {
  try {
    // Replace this URL with your Python backend URL
    const pythonBackendUrl = "http://localhost:8000/api/spotify-data";

    const response = await fetch(pythonBackendUrl, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      credentials: "include",
      body: JSON.stringify(data),
    });

    const responseData = await response.json();
    console.log("Data sent to Python backend:", responseData);
    return responseData;
  } catch (error) {
    console.error("Error sending data to Python backend:", error);
    throw error;
  }
};
