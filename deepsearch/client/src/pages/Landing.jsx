// import NavigationBar from "../components/NavigationBar";
import Logo from "../assets/Logo.png";
import { useSpotifyAuth } from "../context/SpotifyAuthContext";
import { Navigate } from "react-router-dom";

const Landing = () => {
  const { login, isAuthenticated } = useSpotifyAuth();
  console.log("isAuthenticated", isAuthenticated);

  if (isAuthenticated) {
    return <Navigate to="/new-search" replace />;
  }

  return (
    <>
      {/* Navigation Bar */}
      <div className="flex justify-between items-center p-6 bg-black text-teal-300">
        <h2 className="text-xl font-bold">Deep Search</h2>
        <div className="space-x-6">
          <a
            href="/community"
            className="text-xl font-bold hover:text-teal-300"
          >
            Community
          </a>
          <button
            onClick={login}
            className="text-xl font-bold hover:text-teal-300"
          >
            Login
          </button>
        </div>
      </div>

      <div className="flex min-h-screen bg-black text-teal-300 p-10">
        {/* Left Section */}
        <div className="w-1/2 flex flex-col justify-center">
          <h1 className="text-4xl font-bold">Find Your Music, Your Way</h1>
          <p className="mt-4 text-lg">
            Tired of scrolling endlessly to find the perfect songs for your
            Spotify playlists? Deep Search gives you powerful filtering tools to
            search your music by genre, tempo, release year, and more.
          </p>
          <ul className="mt-4 space-y-2">
            <li>🔍 Search deeper.</li>
            <li>💿 Discover more.</li>
            <li>🎵 Play exactly what you want.</li>
          </ul>
          <p className="mt-6">Get started by logging in with Spotify!</p>
          <button
            onClick={login}
            className="mt-4 bg-gray-700 text-teal-300 px-4 py-2 rounded-full text-sm font-semibold hover:bg-gray-600 inline-block"
          >
            Login with Spotify
          </button>
        </div>

        {/* Right Section - Only Logo */}
        <div className="w-1/2 flex items-center justify-center">
          <img
            src={Logo}
            alt="Deep Search Logo"
            className="w-1/2 h-auto object-contain"
          />
        </div>
      </div>
    </>
  );
};

export default Landing;
