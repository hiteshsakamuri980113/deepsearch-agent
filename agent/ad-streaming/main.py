import os
import json
import asyncio
import requests

from pathlib import Path
from dotenv import load_dotenv

from google.genai.types import (
    Part,
    Content,
)

from google.adk.runners import Runner
from google.adk.agents import LiveRequestQueue
from google.adk.agents.run_config import RunConfig
from google.adk.sessions.in_memory_session_service import InMemorySessionService

from fastapi import FastAPI, WebSocket
from fastapi.staticfiles import StaticFiles
from fastapi.responses import FileResponse
from fastapi.middleware.cors import CORSMiddleware

from spotify_agent.agent import root_agent
from pydantic import BaseModel


load_dotenv()

APP_NAME="custom streaming app"
session_service = InMemorySessionService()

# Create the FastAPI app
app = FastAPI()

# Configure CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173"],  # Your React frontend URL
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

def start_agent_session(session_id: str):
    """Starts an agent session"""

    # Create a Session
    session = session_service.create_session(
        app_name=APP_NAME,
        user_id=session_id,
        session_id=session_id,
    )

    #create a runner
    runner = Runner(
        app_name=APP_NAME,
        agent=root_agent,
        session_service=session_service,

    )

    # Set response modality = TEXT
    run_config = RunConfig(response_modalities=["TEXT"])

    # Create a LiveRequestQueue for this session

    live_request_queue = LiveRequestQueue()

    # Start agent session
    live_events=runner.run_live(
        session=session,
        live_request_queue=live_request_queue,
        run_config=run_config

    )

    return live_events, live_request_queue

async def agent_to_client_messaging(websocket, live_events):
    final_text = ""
    """Agent to client communication"""
    while True:
        async for event in live_events:
            if event.turn_complete:
                await websocket.send_text(json.dumps({"turn_complete": True}))
                print("TURN_COMPLETE")
            if event.interrupted:
                await websocket.send_text(json.dumps({"interrupted": True}))
                print("[INTERRUPTED]")
            
            # Read the Content and its first Part
            part: Part = (
                event.content and event.content.parts and event.content.parts[0]
            )

            if not part or not event.partial:
                continue

            # Get the text
            text = event.content and event.content.parts and event.content.parts[0].text
            if not text:
                continue


            # Send the formatted response to the client
            await websocket.send_text(json.dumps({"message": text}))
            print(f"[AGENT TO CLIENT]: {text}")
            asyncio.sleep(0)



def format_agent_response(text: str) -> str:
    """
    Formats the agent's response into a structured format (e.g., HTML or Markdown).
    """
    # Example: Format as HTML
    backslash_char = "\\"
    formatted_text = (
        f"""
        <div style="font-family: Arial, sans-serif; color: #a8f0e8; background-color: #1e1e1e; padding: 10px; border-radius: 8px; line-height: 1.5;">
            <p style="margin-bottom: 10px;">{text.replace('{backslash_char}n', '<br>')}</p>
        </div>
        """
    )
    return formatted_text


async def client_to_agent_messaging(websocket, live_request_queue):
    """Client to agent communication"""
    while True:
        text = await websocket.receive_text()

        content = Content(role="user", parts=[Part.from_text(text=text)])

        live_request_queue.send_content(content=content)

        print(f"[CLIENT TO AGENT]: {text}")
        await asyncio.sleep(0)


def update_env_file(key: str, value: str, env_file_path: str = ".env"):
    env_path = Path(env_file_path)

    # Read the existing .env file
    if env_path.exists():
        with open(env_path, "r") as file:
            lines = file.readlines()
    else:
        lines = []

    # Check if the key already exists
    key_found = False
    for i, line in enumerate(lines):
        if line.startswith(f"{key}="):
            # Update the existing key
            lines[i] = f"{key}={value}\n"
            key_found = True
            break

    # If the key was not found, add it
    if not key_found:
        lines.append(f"{key}={value}\n")

    # Write the updated lines back to the .env file
    with open(env_path, "w") as file:
        file.writelines(lines)

    print(f"Updated {key} in {env_file_path}")


#
# FastAPI web app
#

STATIC_DIR=Path("static")

@app.get("/")
async def root():
    """Serves the index.html"""
    return FileResponse(os.path.join(STATIC_DIR, "index.html"))

class SpotifyData(BaseModel):
    access_token: str
    refresh_token: str = None
    playlist_data: dict = None

@app.post("/api/spotify-data")
async def receive_spotify_data(data: SpotifyData):
    """Endpoint to receive Spotify data from React frontend"""
    print("call received at backend to update access_token")
    try:
        # Update environment variables with the new tokens
        if data.access_token:
            update_env_file("SPOTIFY_ACCESS_TOKEN", data.access_token)
        
        if data.refresh_token:
            update_env_file("REFRESH_TOKEN", data.refresh_token)
            
        # You can process playlist_data here if needed
        
        return {"status": "success", "message": "Data received successfully"}
    except Exception as e:
        return {"status": "error", "message": str(e)}

@app.websocket("/ws/{session_id}")
async def websocket_endpoint(websocket: WebSocket, session_id: int):


    """Client websocket endpoint"""

    # Wait for client connection
    await websocket.accept()
    print(f"Client #{session_id} connected")

    #start agent session
    session_id=str(session_id)
    live_events, live_request_queue = start_agent_session(session_id)

    # Start tasks
    agent_to_client_task = asyncio.create_task(
        agent_to_client_messaging(websocket, live_events)
    )

    client_to_agent_task = asyncio.create_task(
        client_to_agent_messaging(websocket, live_request_queue)
    )

    await asyncio.gather(agent_to_client_task, client_to_agent_task)

    # Disconnected

    print(f"Client #{session_id} disconnected")























