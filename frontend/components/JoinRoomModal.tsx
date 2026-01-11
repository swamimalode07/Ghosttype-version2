"use client"

import { useState } from "react";
import { useRouter } from "next/navigation";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

interface JoinRoomModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function JoinRoomModal({ isOpen, onClose }: JoinRoomModalProps) {
  const router = useRouter();
  const [username, setUsername] = useState("");
  const [roomCode, setRoomCode] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleJoinRoom = async () => {
    if (!username.trim()) {
      alert("Please enter a username");
      return;
    }
    if (!roomCode.trim()) {
      alert("Please enter a room code");
      return;
    }

    setIsLoading(true);
    try {
      const response = await fetch("http://127.0.0.1:8000/join-room", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          username: username,
          room_code: roomCode,
        }),
      });

      const data = await response.json();
      localStorage.setItem("username", username);
      router.push(`/room/${roomCode}/lobby`);
    } catch (error) {
      console.error("Error joining room:", error);
      alert("Failed to join room. Please check the room code and try again.");
    } finally {
      setIsLoading(false);
      onClose();
      setUsername("");
      setRoomCode("");
    }
  };

  const handleOpenChange = (open: boolean) => {
    if (!open) {
      onClose();
      setUsername("");
      setRoomCode("");
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={handleOpenChange}>
      <DialogContent className="w-full max-w-md">
        <DialogHeader>
          <DialogTitle>Join Room</DialogTitle>
          <DialogDescription>
            Enter your username and room code to join a typing race
          </DialogDescription>
        </DialogHeader>
        <div className="space-y-4">
          <Input
            placeholder="Enter your username"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            disabled={isLoading}
          />
          <Input
            placeholder="Enter room code"
            value={roomCode}
            onChange={(e) => setRoomCode(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && handleJoinRoom()}
            disabled={isLoading}
          />
          <Button
            className="w-full"
            onClick={handleJoinRoom}
            disabled={isLoading}
          >
            {isLoading ? "Joining..." : "Join Room"}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
