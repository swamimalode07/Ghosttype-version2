"use client"
import { Button } from "@/components/ui/button";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useState } from "react";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"

export default function Home() {
  const router=useRouter()

  const [username,setUsername]=useState("")

  const [joinUsername,setJoinUsername]=useState("")
  const [roomCode,setRoomCode]=useState("")

  async function handlecreateRoom(){
    if(!username){
      alert("Please enter username")
      return
    }

    localStorage.setItem("username",username)

    const response=await fetch("http://127.0.0.1:8000/create-room",{
      method:"POST",
      headers: {
        "Content-Type": "application/json",
      },
      body:JSON.stringify({
        username:username
      })
    })

    const data=await response.json()
    console.log(data)
    const roomCode=data.room_code
    router.push(`/room/${roomCode}/lobby`)
  }
  
  async function handleJoinRoom(){
    if(!joinUsername){
      alert("Please enter username")
      return
    }
    if(!roomCode){
      alert("Please enter room code to proceed")
      return
    }
    localStorage.setItem("username",joinUsername)

    const response=await fetch("http://127.0.0.1:8000/join-room",{
      method:"POST",
      headers:{
        "Content-Type": "application/json",
      },
      body:JSON.stringify({
        username: joinUsername,
        room_code: roomCode,
      })
    })

    const data=await response.json()
    console.log("Join event data",data) 
    router.push(`/room/${roomCode}/lobby`)

  }
  

  return (
   
    <div className="min-h-screen bg-background text-foreground">
      <div className="grid grid-cols-2 text-center ">
        <div className="">
          <div className="min-h-screen flex items-center justify-center">
            <div className="max-w-md w-full flex flex-col items-center gap-4 border-2 border-grey-500 p-16 rounded-2xl">
              <h1>Create room</h1>
              <Input placeholder="Enter username" value={username} onChange={(e)=>setUsername(e.target.value)}/>
              <Button className="w-full" onClick={handlecreateRoom}>
                Create Room
              </Button>
            </div>
          </div>
        </div>
        <div>
          <div className="">
              <div className="min-h-screen flex items-center justify-center">
            <div className="max-w-md w-full flex flex-col items-center gap-4 border-2 border-grey-500 p-16 rounded-2xl">
              <h1>Join room</h1>
              <Input placeholder="Username" value={joinUsername} onChange={(e)=>setJoinUsername(e.target.value)}/>
              <Input placeholder="Enter room code" value={roomCode} onChange={(e)=>setRoomCode(e.target.value)}/>
              <Button className="w-full" onClick={handleJoinRoom}>
                Join Room
              </Button>
            </div>
          </div>
          </div>
        </div>
      </div>
   </div>
  );
}
