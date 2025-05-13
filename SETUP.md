# Setting Up the DeepSearch Agent Environment

This guide will help you run both the DeepSearch (Node.js) and Agent (Python) applications together.

## Prerequisites

Make sure you have:

- Node.js (v14+)
- Python (v3.9+)
- MongoDB running locally or connection string
- Spotify Developer credentials

## Step 1: Start the DeepSearch Application (Node.js)

1. Navigate to the DeepSearch directory:

```bash
cd deepsearch
```

2. Install dependencies:

```bash
npm install
```

3. Create a `.env` file with your Spotify credentials:

```
SPOTIFY_CLIENT_ID=your_client_id
SPOTIFY_CLIENT_SECRET=your_client_secret
SPOTIFY_REDIRECT_URI=your_spotify_redirect_uri
MONGO_URI=your_mongodb_connection_string
```

4. Start the server:

```bash
npm start
```

The DeepSearch application will run on http://localhost:5173

## Step 2: Start the Agent Application (Python)

1. Open a new terminal window and navigate to the agent directory:

```bash
cd agent/ad-streaming
```

2. Create a virtual environment and install dependencies:

```bash
python -m venv venv
source venv/bin/activate  # On Windows: venv\Scripts\activate
pip install -r requirements.txt  # Create this file if it doesn't exist
```

3. Make sure your `.env` file includes:

```
GOOGLE_API_KEY=your_google_ai_api_key
SPOTIFY_CLIENT_ID=same_as_deepsearch
SPOTIFY_CLIENT_SECRET=same_as_deepsearch
REFRESH_TOKEN=your_spotify_refresh_token
ACCESS_TOKEN=your_spotify_access_token
```

4. Start the FastAPI server:

```bash
uvicorn main:app --reload --port 8000
```

The Agent application will run on http://localhost:8000

## Step 3: Test the Integration

1. Open your browser and navigate to http://localhost:5173
2. Log in with your Spotify account
3. After successful login, the tokens will automatically be sent to the Python backend
4. Open chat window to interact with the agent.(runs on http://localhost:8000)

## Troubleshooting

### Port Conflicts

If you encounter `EADDRINUSE` errors:

#### For the DeepSearch application:

Edit `deepsearch/config/config.js` to change the port:

```javascript
port: process.env.PORT || 3001,
```

#### For the Agent application:

Change the port when starting the server:

```bash
uvicorn main:app --reload --port 8001
```

Make sure to update the CORS settings in the Python backend:

```python
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)
```

### Cross-Origin Issues

If you encounter CORS errors:

1. Check that the Python backend has the correct CORS configuration
2. Verify that the React app is using the correct URL for the Python backend
3. Ensure the `credentials: 'include'` option is set in fetch requests

### Token Not Being Sent

If tokens are not being received by the Python backend:

1. Check the browser console for network errors
2. Verify that `sendDataToPythonBackend` is being called in SpotifyAuthContext
3. Ensure the token URL parameters are correctly parsed in the frontend
