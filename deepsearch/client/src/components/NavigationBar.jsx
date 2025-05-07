import React, { useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { useSpotifyAuth } from "../context/SpotifyAuthContext";

const NavigationBar = () => {
  const navigate = useNavigate();
  const location = useLocation(); // Get the current path
  const [isDropdownOpen, setIsDropdownOpen] = useState(false); //
  //
  //State to toggle dropdown
  const { logout } = useSpotifyAuth(); // Access the logout function from context

  const navStyle = {
    position: "fixed",
    top: 0,
    left: 0,
    right: 0,
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    padding: "20px 40px",
    backgroundColor: "#1e1e1e", // Dark background
    color: "#a8f0e8", // Teal text color
    fontSize: "16px",
    fontWeight: "normal",
    zIndex: 1000, // Ensure it stays on top
  };

  const leftLogoStyle = {
    fontSize: "20px",
    fontWeight: "bold",
    cursor: "pointer",
    color: "#a8f0e8", // Teal color for the logo
  };

  const rightContainerStyle = {
    display: "flex",
    gap: "30px",
    position: "relative", // For dropdown positioning
  };

  const navLinkStyle = (path) => ({
    textDecoration: "none",
    color: location.pathname === path ? "#6ee7b7" : "#a8f0e8", // Highlight active link
    cursor: "pointer",
    transition: "color 0.3s ease, text-shadow 0.3s ease, transform 0.3s ease", // Smooth transition for color and glow
    textShadow:
      location.pathname === path
        ? "0 0 6px #6ee7b7, 0 0 12px #6ee7b7, 0 0 18px #34d399" // Softer gradient glow
        : "none",
    transform: location.pathname === path ? "scale(1.05)" : "none", // Slightly enlarge the active link
  });

  const dropdownStyle = {
    position: "absolute",
    top: "100%", // Position below the Account button
    right: "-13px",
    backgroundColor: "#2a2a2a", // Match the application's dark theme
    borderRadius: "8px",
    boxShadow: "0 4px 8px rgba(0, 0, 0, 0.2)", // Subtle shadow for depth
    overflow: "hidden",
    zIndex: 1001, // Ensure it appears above other elements
    opacity: isDropdownOpen ? 1 : 0, // Fade-in effect
    transform: isDropdownOpen ? "translateY(0)" : "translateY(-10px)", // Slide-down effect
    transition: "opacity 0.3s ease, transform 0.3s ease", // Smooth animation
  };

  const dropdownItemStyle = {
    padding: "10px 20px",
    color: "#a8f0e8", // Teal text color
    cursor: "pointer",
    transition: "background-color 0.3s ease",
  };

  const dropdownItemHoverStyle = {
    backgroundColor: "#3a3a3a", // Slightly lighter background on hover
  };

  return (
    <div style={navStyle}>
      {/* Logo */}
      <div onClick={() => navigate("/new-search")} style={leftLogoStyle}>
        Deep <span style={{ fontWeight: "normal" }}>Search</span>
      </div>

      {/* Navigation Links */}
      <div style={rightContainerStyle}>
        <span
          onClick={() => navigate("/new-search")}
          style={navLinkStyle("/new-search")}
        >
          New Search
        </span>
        {/* <span
          onClick={() => navigate("/dashboard")}
          style={navLinkStyle("/dashboard")}
        >
          Dashboard
        </span>
        <span
          onClick={() => navigate("/searches")}
          style={navLinkStyle("/searches")}
        >
          Your Searches
        </span> */}

        <span
          onClick={() => navigate("/playlists")}
          style={navLinkStyle("/playlists")}
        >
          Your Playlists
        </span>
        {/* <span
          onClick={() => navigate("/community")}
          style={navLinkStyle("/community")}
        >
          Community
        </span> */}

        {/* Account Dropdown */}
        <div
          style={{ position: "relative" }}
          onMouseEnter={() => setIsDropdownOpen(true)}
          onMouseLeave={() => setIsDropdownOpen(false)}
        >
          <span
            style={navLinkStyle("/account")}
            aria-expanded={isDropdownOpen}
            aria-label="Account menu"
          >
            Account
          </span>
          <div style={dropdownStyle}>
            <div
              style={dropdownItemStyle}
              onMouseEnter={(e) =>
                (e.target.style.backgroundColor =
                  dropdownItemHoverStyle.backgroundColor)
              }
              onMouseLeave={(e) =>
                (e.target.style.backgroundColor = "transparent")
              }
              onClick={() => navigate("/profile")}
            >
              Profile
            </div>
            <div
              style={dropdownItemStyle}
              onMouseEnter={(e) =>
                (e.target.style.backgroundColor =
                  dropdownItemHoverStyle.backgroundColor)
              }
              onMouseLeave={(e) =>
                (e.target.style.backgroundColor = "transparent")
              }
              onClick={logout}
            >
              Logout
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default NavigationBar;
