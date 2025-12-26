from fastapi import FastAPI, WebSocket, WebSocketDisconnect
from pydantic import BaseModel
from supabaseclient import supabase
from fastapi.middleware.cors import CORSMiddleware
import os

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://localhost:3000",
        "http://127.0.0.1:3000",
    ],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)



@app.get("/")
def root():
    return {"message": "Hello ghosttypeee!!!!!!!!!!!!!!!!! Connected Successfully!"}




# -Create room function
class CreateRoom(BaseModel):
    username: str

@app.post("/create-room")
def create_room(data: CreateRoom):
    import random, string
    room_code = "".join(random.choices(string.ascii_uppercase + string.digits, k=6))

    supabase.table("rooms").insert({
        "room_code": room_code,
        "creator": data.username
    }).execute()

    return {"room_code": room_code, "creator": data.username}

# Join room function

class JoinRoom(BaseModel):
    room_code: str
    username: str   

@app.post("/join-room")
def join_room(data: JoinRoom):
    room = supabase.table("rooms").select("*").eq("room_code", data.room_code).execute()
    if not room.data:
        return {"error": "Room not found"}

    supabase.table("room_users").insert({
        "username": data.username,
        "room_code": data.room_code
    }).execute()

    return {"status": "Joined"}


# Websocket stuff

active_rooms = {}
@app.websocket("/ws/{room_code}")
async def websocket_endpoint(websocket: WebSocket, room_code: str):
    await websocket.accept()

    # Setup room memory
    if room_code not in active_rooms:
        active_rooms[room_code] = {
            "creator": None,
            "players": [],
            "connections": [],
            "usernames": {},
            "words": ""
        }

    room = active_rooms[room_code]
    room["connections"].append(websocket)

    # Load creator if missing
    if room["creator"] is None:
        db = supabase.table("rooms").select("creator").eq("room_code", room_code).execute()
        if db.data:
            room["creator"] = db.data[0]["creator"]

    try:
        while True:
            data = await websocket.receive_json()
            event_type = data.get("type")
            username = data.get("username")

            # join event
            if event_type == "join":
                # Limit room to two users
                if len(room["players"]) >= 2:
                    await websocket.send_json({
                        "type": "room_full",
                        "message": "Room already has 2 players"
                    })
                    await websocket.close()
                    continue

                # Mark creator
                if username == room["creator"]:
                    room["creator"] = username

                room["usernames"][websocket] = username
                if username not in room["players"]:
                    room["players"].append(username)

                # Broadcast players
                msg = {
                    "type": "players_update",
                    "players": room["players"],
                    "creator": room["creator"]
                }
                for conn in room["connections"]:
                    await conn.send_json(msg)

            # start race event
            elif event_type == "start_race":
                # Must join first
                if websocket not in room["usernames"]:
                    await websocket.send_json({
                        "type": "error",
                        "message": "You must join before starting the race"
                    })
                    continue

                # Only creator can start
                if username != room["creator"]:
                    await websocket.send_json({
                        "type": "error",
                        "message": "Only the creator can start the race"
                    })
                    continue

                # Generate words once for the room
                import random
                words_list = [
                    "the", "quick", "brown", "fox", "jumps", "over", "lazy", "dog",
                    "python", "javascript", "typescript", "react", "fastapi", "code",
                    "programming", "developer", "software", "computer", "keyboard", "typing",
                    "speed", "accuracy", "race", "challenge", "test", "practice", "skill",
                    "learn", "improve", "performance", "compete", "victory", "success"
                ]
                random.shuffle(words_list)
                room_words = " ".join(words_list[:30])
                room["words"] = room_words

                # Send words to all players
                for conn in room["connections"]:
                    await conn.send_json({
                        "type": "words",
                        "words": room_words
                    })

                # Notify start
                for conn in room["connections"]:
                    await conn.send_json({"type": "start_race"})

                # Countdown
                import asyncio
                for num in [3, 2, 1]:
                    await asyncio.sleep(1)
                    for conn in room["connections"]:
                        await conn.send_json({
                            "type": "countdown",
                            "value": num
                        })

                await asyncio.sleep(1)
                for conn in room["connections"]:
                    await conn.send_json({
                        "type": "countdown",
                        "value": "GO"
                    })

            # keystroke event
            elif event_type == "keystroke":
                # Broadcast to all other connections
                for conn in room["connections"]:
                    if conn != websocket:
                        await conn.send_json(data)

            # other events
            else:
                for conn in room["connections"]:
                    if conn != websocket:
                        await conn.send_json(data)

    except WebSocketDisconnect:
        # Remove connection
        room["connections"].remove(websocket)

        # Remove user
        username = room["usernames"].get(websocket)
        if username in room["players"]:
            room["players"].remove(username)

        if websocket in room["usernames"]:
            del room["usernames"][websocket]

        # Clear room if empty
        if len(room["connections"]) == 0:
            del active_rooms[room_code]


# save results

class RaceResult(BaseModel):
    room_code: str
    winner: str
    winner_wpm: int
    winner_accuracy: float
    loser: str | None = None
    loser_wpm: int | None = None
    loser_accuracy: float | None = None

@app.post("/save-results")
def save_results(data: RaceResult):
    result = supabase.table("race_results").insert({
        "room_code": data.room_code,
        "winner": data.winner,
        "winner_wpm": data.winner_wpm,
        "winner_accuracy": data.winner_accuracy,
        "loser": data.loser,
        "loser_wpm": data.loser_wpm,
        "loser_accuracy": data.loser_accuracy
    }).execute()
    return {"status": "saved", "data": result.data}