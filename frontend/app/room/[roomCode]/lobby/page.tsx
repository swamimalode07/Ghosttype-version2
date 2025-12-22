"use client";

import { Button } from "@/components/ui/button";
import { useParams } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import PlayerList from "@/components/lobby/PlayerList";
import { useRouter } from "next/navigation";

type GameStatus = "waiting" | "starting" | "playing";

export default function Lobby() {
  const params = useParams();
  const roomCode = params.roomCode as string;
  const router=useRouter()

  const socketRef = useRef<WebSocket | null>(null);

  const [mounted, setMounted] = useState(false);
  const [username, setUsername] = useState<string | null>(null);

  const [players, setPlayers] = useState<string[]>([]);
  const [creator, setCreator] = useState<string | null>(null);

  const [status, setStatus] = useState<GameStatus>("waiting");
  const [countdown, setCountdown] = useState<number | "GO" | null>(null);


  useEffect(() => {
    setMounted(true);
    const storedUsername = localStorage.getItem("username");
    setUsername(storedUsername);
  }, []);

  useEffect(() => {
    if (!username) return;

    const socket = new WebSocket(`ws://127.0.0.1:8000/ws/${roomCode}`);
    socketRef.current = socket;

    socket.onopen = () => {
      console.log("WebSocket connected");

      socket.send(
        JSON.stringify({
          type: "join",
          username,
        })
      );
    };

    socket.onmessage = (e) => {
      const data = JSON.parse(e.data);
      console.log("Server message:", data);

      if (data.type === "players_update") {
        setPlayers(data.players);
        setCreator(data.creator);
        setStatus("waiting");
      }

      if (data.type === "start_race") {
        setStatus("starting");
      }

      if (data.type === "countdown") {
        setCountdown(data.value);

        if (data.value === "GO") {
          setStatus("playing");
          setTimeout(() => {
            router.push(`/room/${roomCode}/race`)
          }, 100);
        }
      }
    };

    socket.onerror = (err) => {
      console.error("WebSocket error", err);
    };

    socket.onclose = () => {
      console.log("WebSocket closed");
    };

    return () => {
      socket.close();
    };
  }, [roomCode, username]);


  function handleStartGame() {
    if (!socketRef.current || !username)  return;

    socketRef.current.send(
      JSON.stringify({
        type: "start_race",
        username,
      })
    );
  }

  if (!mounted) return null;

  return (
    <div className="max-w-2xl mx-auto flex flex-col gap-5 p-6">

      <div className="flex items-center justify-between rounded-md border px-4 py-2">
        <div className="text-sm font-medium">
          Room Code: <span className="font-mono">{roomCode}</span>
        </div>
        <button className="text-sm text-red-500 hover:underline">
          Leave
        </button>
      </div>

      <div className="text-center text-sm font-medium">
        {status === "waiting" && " Waiting for players"}
        {status === "starting" && " Game starting"}
        {status === "playing" && " Game in progress"}
      </div>

      <div className="rounded-md border p-4">
        <div className="text-sm font-semibold mb-3 text-center">
          Players in room
        </div>

        <div className="flex flex-col gap-2">
          {players.map((player) => (
            <PlayerList
              key={player}
              playerName={player}
              isCreator={player === creator}
            />
          ))}
        </div>
      </div>


      {username === creator ? (
        <Button className="w-full mt-4" onClick={handleStartGame} disabled={players.length<2  }>
          {players.length<2 ? (
            <div>
              Waiting for more players to join
            </div>
          ):(
            <div>
              Start Game
            </div>
          )}
        </Button>
      ) : (
        <div className="text-center text-sm text-muted-foreground mt-4">
          Waiting for creator to start the game…
        </div>
      )}

      {status === "starting" && countdown && (
        <div className="fixed inset-0 bg-black/70 flex items-center justify-center text-white text-6xl font-bold">
          {countdown}
        </div>
      )}
    </div>
  );
}
