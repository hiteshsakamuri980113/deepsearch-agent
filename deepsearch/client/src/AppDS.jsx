import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
  useLocation,
} from "react-router-dom";
import Landing from "./pages/Landing";
import NewSearch from "./pages/NewSearch";
import Playlists from "./pages/Playlists";
import Profile from "./pages/Profile";
import "./App.css";
import { SpotifyAuthProvider } from "./context/SpotifyAuthContext";
import PrivateRoute from "./components/PrivateRoute";
import Agent from "./components/Agent";

function AppDS() {
  return (
    <Router>
      <SpotifyAuthProvider>
        <AppContent />
      </SpotifyAuthProvider>
    </Router>
  );
}

function AppContent() {
  const location = useLocation(); // Now inside the Router context

  return (
    <>
      <Routes>
        <Route path="/" element={<Landing />} />
        {/* Protected routes */}
        <Route
          path="/new-search"
          element={
            <PrivateRoute>
              <NewSearch />
            </PrivateRoute>
          }
        />
        <Route
          path="/playlists"
          element={
            <PrivateRoute>
              <Playlists />
            </PrivateRoute>
          }
        />
        <Route
          path="/profile"
          element={
            <PrivateRoute>
              <Profile />
            </PrivateRoute>
          }
        />
      </Routes>
      {/* Conditionally render the Agent component */}
      {location.pathname !== "/" && <Agent />}
    </>
  );
}

export default AppDS;
