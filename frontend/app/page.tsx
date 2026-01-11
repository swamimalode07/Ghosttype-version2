"use client"

import { useState } from "react";
import { Button } from "@/components/ui/button";
import CreateRoomModal from "@/components/CreateRoomModal";
import JoinRoomModal from "@/components/JoinRoomModal";
import Keyboard from "@/components/Keyboard/page";

export default function Home() {
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [isJoinModalOpen, setIsJoinModalOpen] = useState(false);

  return (
    <div className="min-h-screen bg-background text-foreground flex items-center justify-between border-r border-l border-gray-700 max-w-6xl mx-auto px-8 overflow-hidden">
      {/* Left Section */}
      <div className="flex flex-col gap-6 flex-1">
        {/* Title */}
        <div className="text-left flex flex-col gap-2">
          <h1 className="text-6xl font-semibold ">Type Faster with</h1>
          <h1 className="text-6xl font-semibold ">GhostType</h1>
          <p className="text-[#B2B2B2] mt-1 text-lg">Join a room or create your own to start typing!</p>
        </div>

        {/* Buttons */}
        <div className="flex gap-4">
          <Button
            variant="redbutton"
            size="light"
            onClick={() => setIsCreateModalOpen(true)}
            className="px-5 py-5 text-lg"
          >
            Create Room
            <svg width="31" height="31" viewBox="0 0 31 31" fill="none" xmlns="http://www.w3.org/2000/svg">
<circle cx="15.5" cy="15.5" r="15.5" fill="#FD6969"/>
<path d="M22.5 9.5L22 20.5" stroke="white" stroke-width="3" stroke-linecap="round"/>
<path d="M8 22.5L22.5 9.5" stroke="white" stroke-width="3" stroke-linecap="round"/>
<path d="M22 9.5L11.5 9" stroke="white" stroke-width="3" stroke-linecap="round"/>
</svg>

          </Button>
          <Button
            size="light"
            variant="default"
            onClick={() => setIsJoinModalOpen(true)}
            className="px-5 py-5 text-lg"
          >
            Join Room
          </Button>
        </div>
      </div>

      {/* Right Section - Keyboard */}
      <div className="flex-1 flex justify-end items-center translate-x-32">
        <Keyboard />
      </div>

      {/* Modals */}
      <CreateRoomModal
        isOpen={isCreateModalOpen}
        onClose={() => setIsCreateModalOpen(false)}
      />
      <JoinRoomModal
        isOpen={isJoinModalOpen}
        onClose={() => setIsJoinModalOpen(false)}
      />
    </div>
  );
}
