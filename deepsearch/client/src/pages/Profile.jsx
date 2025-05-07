import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchUserThunk } from "../state/userSlice";
import { useSpotifyAuth } from "../context/SpotifyAuthContext";
import NavigationBar from "../components/NavigationBar";
import Logo from "../assets/Logo.png"; // Import the logo image

const Profile = () => {
  const dispatch = useDispatch();

  // Get user details and loading state from Redux store
  const { user, loading, error } = useSelector((state) => state.user);

  // Get access token from SpotifyAuthContext
  const { accessToken } = useSpotifyAuth();

  // Fetch user details when the component mounts or accessToken changes
  useEffect(() => {
    if (accessToken) {
      dispatch(fetchUserThunk(accessToken));
    }
  }, [accessToken, dispatch]);

  // Render loading or error states
  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-black text-[#a8f0e8]">
        Loading user details...
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-black text-red-500">
        Error fetching user details: {error}
      </div>
    );
  }

  // Render user details
  return (
    <>
      <NavigationBar />
      <div className="flex items-center justify-center min-h-screen bg-black text-[#a8f0e8]">
        <div className="bg-[#1e1e1e] rounded-lg shadow-lg p-8 w-full max-w-lg">
          {/* Profile Picture */}
          <div className="flex justify-center mb-6">
            <img
              src={Logo}
              alt="Profile"
              className="w-24 h-24 rounded-full object-cover"
            />
          </div>

          {/* Profile Title */}
          <h2 className="text-3xl font-bold mb-4 text-center">
            {user?.display_name || "Your Spotify Profile"}
          </h2>

          {/* Divider */}
          <div className="border-t border-gray-600 mb-6"></div>

          {/* Profile Details */}
          <div className="space-y-4 text-lg">
            <div>
              <strong>Email:</strong> {user?.email || "N/A"}
            </div>
            <div>
              <strong>Country:</strong> {user?.country || "N/A"}
            </div>
            <div>
              <strong>Followers:</strong> {user?.followers?.total || 0}
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default Profile;
