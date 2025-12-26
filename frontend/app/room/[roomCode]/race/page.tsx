"use client";
import React, { useEffect, useState, useRef } from "react";
import { useParams } from "next/navigation";
import { generate } from "random-words";

interface PlayerState {
  [username: string]: {
    position: number;
    wpm: number;
  };
}

const TypingPage = () => {
  const params = useParams();
  const roomCode = params.roomCode as string;
  const socketRef = useRef<WebSocket | null>(null);
  const charsRef = useRef<HTMLSpanElement[]>([]);

  const [username, setUsername] = useState("");
  const [words, setWords] = useState("");
  const [input, setInput] = useState("");
  const [startTime, setStartTime] = useState<number | null>(null);
  const [wpm, setWpm] = useState(0);
  const [playerStates, setPlayerStates] = useState<PlayerState>({});
  const [creator, setCreator] = useState<string | null>(null);

  // Get username and setup WebSocket
  useEffect(() => {
    const storedUsername = sessionStorage.getItem(`username_${roomCode}`);
    if (storedUsername) {
      setUsername(storedUsername);
    }
  }, [roomCode]);

  // Setup WebSocket connection
  useEffect(() => {
    if (!username) return;

    const protocol = window.location.protocol === "https:" ? "wss:" : "ws:";
    const wsUrl = `${protocol}//localhost:8000/ws/${roomCode}`;

    const ws = new WebSocket(wsUrl);

    ws.onopen = () => {
      console.log("WebSocket connected");
      socketRef.current = ws;
      // Send join event
      ws.send(
        JSON.stringify({
          type: "join",
          username: username,
        })
      );
    };

    ws.onmessage = (event) => {
      const data = JSON.parse(event.data);
      console.log("Received:", data);

      if (data.type === "keystroke") {
        // Update opponent progress
        setPlayerStates((prev) => ({
          ...prev,
          [data.username]: {
            position: data.position,
            wpm: data.wpm,
          },
        }));
      }

      if (data.type === "players_update") {
        setCreator(data.creator);
      }
    };

    ws.onerror = (error) => {
      console.error("WebSocket error:", error);
    };

    ws.onclose = () => {
      console.log("WebSocket closed");
      socketRef.current = null;
    };

    return () => {
      if (ws.readyState === WebSocket.OPEN) {
        ws.close();
      }
    };
  }, [username, roomCode]);

  // Generate words
  useEffect(() => {
    setWords(generate({ exactly: 30, join: " " }));
  }, []);

  // Handle typing
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Backspace") {
        setInput((prev) => prev.slice(0, -1));
        return;
      }

      if (e.key.length !== 1) return;
      if (input.length >= words.length) return;

      if (!startTime) {
        setStartTime(Date.now());
      }

      const newInput = input + e.key;
      setInput(newInput);

      // Calculate WPM
      if (startTime) {
        const elapsedMiliSecs = Date.now() - startTime;
        const elapsedMins = elapsedMiliSecs / 60000;
        const charsTyped = newInput.length;
        const finalWPM = Math.round((charsTyped / 5) / elapsedMins);
        setWpm(finalWPM);
      }

      // Send keystroke via WebSocket
      if (socketRef.current && socketRef.current.readyState === WebSocket.OPEN) {
        socketRef.current.send(
          JSON.stringify({
            type: "keystroke",
            username: username,
            position: newInput.length,
            wpm: startTime ? Math.round(((newInput.length / 5) / ((Date.now() - startTime) / 60000))) : 0,
          })
        );
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [input, words, startTime, username]);

  // Render cursor for a player at a specific position
  const renderCursor = (playerName: string, position: number, isCreator: boolean) => {
    const charElement = charsRef.current[position];
    if (!charElement) return null;

    const rect = charElement.getBoundingClientRect();
    const containerRect = document.querySelector(".typing-container")?.getBoundingClientRect();
    
    if (!containerRect) return null;

    const cursorColor = isCreator ? "bg-red-500" : "bg-green-500";
    const cursorLabelColor = isCreator ? "text-red-400" : "text-green-400";

    return (
      <div
        key={`cursor-${playerName}`}
        className="absolute pointer-events-none"
        style={{
          left: `${rect.left - containerRect.left}px`,
          top: `${rect.top - containerRect.top}px`,
        }}
      >
        <div
          className={`${cursorColor} w-[2px] h-[1.3em] animate-pulse`}
        />
        <div className={`text-xs font-semibold ${cursorLabelColor} whitespace-nowrap -translate-y-full`}>
          {playerName}
        </div>
      </div>
    );
  };

  if (!username || !words) {
    return <div className="text-center mt-10">Loading...</div>;
  }

  return (
    <div className="max-w-4xl mx-auto mt-5 text-center">
      <div className="mb-4 text-sm text-gray-400">
        <span>Your Progress: {input.length}/{words.length}</span>
        <span className="ml-4">WPM: {wpm}</span>
      </div>

      {/* Opponent Progress */}
      {Object.keys(playerStates).length > 0 && (
        <div className="mb-4 p-4 bg-gray-900 rounded border border-gray-700">
          <h3 className="text-sm font-semibold text-gray-300 mb-2">
            Opponent Progress
          </h3>
          {Object.entries(playerStates).map(([opponentName, state]) => (
            <div key={opponentName} className="text-sm text-gray-400">
              <span>{opponentName}:</span>
              <span className="ml-2">
                {state.position}/{words.length}
              </span>
              <span className="ml-4 text-yellow-400">WPM: {state.wpm}</span>
            </div>
          ))}
        </div>
      )}

      <div className="typing-container relative text-2xl leading-relaxed font-mono p-4 rounded bg-gray-950 border border-gray-800">
        {/* Cursors overlay */}
        <div className="absolute inset-0 pointer-events-none">
          {/* Your cursor (red if creator, green otherwise) */}
          {renderCursor(username, input.length, username === creator)}

          {/* Opponent cursors */}
          {Object.entries(playerStates).map(([opponentName, state]) =>
            renderCursor(opponentName, state.position, opponentName === creator)
          )}
        </div>

        {/* Text content */}
        <div className="relative">
          {words.split("").map((char, index) => {
            const typedChar = input[index];

            let className = "text-gray-400";
            if (typedChar !== undefined) {
              className =
                typedChar === char ? "text-green-500" : "text-red-500";
            }

            return (
              <span
                key={index}
                ref={(el) => {
                  if (el) charsRef.current[index] = el;
                }}
                className={className}
              >
                {char}
              </span>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default TypingPage;
