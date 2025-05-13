# DeepSearch Agent

DeepSearch Agent is a powerful application that integrates with the Spotify API to provide two main functionalities:

1. **DeepSearch**: A web application where users can log in with their Spotify account, filter their playlists, and create new playlists with the filtered items.
2. **Agent**: An agentic component that allows users to chat with a Gemini agent and create Spotify playlists directly in their account.

---

## Features

### DeepSearch
- Log in with your Spotify account.
- View and filter your existing Spotify playlists.
- Create new playlists based on filtered items.

### Agent
- Chat with a Gemini agent to create Spotify playlists.
- Seamlessly integrate the agent's suggestions into your Spotify account.

---

## Prerequisites

Before you begin, ensure you have the following:

1. **Spotify Developer Account**:
   - Create a Spotify Developer account at [Spotify Developer Dashboard](https://developer.spotify.com/dashboard/).
   - Create an app to obtain your **Spotify Client ID** and **Spotify Client Secret**.
   - Set the **Redirect URI** in your Spotify app settings (e.g., `http://localhost:3000/callback`).
  
2. **Google API Key**:
   - Gey your API key from Google AI Studio.

2. **Node.js**:
   - Install [Node.js](https://nodejs.org/) (version 14 or higher is recommended).

3. **MongoDB**:
   - Install and set up MongoDB for storing user, playlist and song data.

---

## Installation

Follow these steps to set up and run the application:

1. Clone the Repository:
git clone https://github.com/YOUR_USERNAME/deepsearch-agent.git
cd deepsearch-agent

2. Install the necessary node and python dependencies:

For DeepSearch:
cd deepsearch
npm install

For Agent:
cd agent
pip install google-adk

3. Update the respective keys in the .env files in both deepsearch and agent components.
4. Also update config.js in deepserach component with your mongo uri.


## Run the applications.
deepsearch: npm run dev
agent: uvicorn main:app --reload

Open browser and run http://localhost:5173 to access your application.


