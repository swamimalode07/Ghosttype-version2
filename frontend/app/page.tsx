"use client"
import Keyboard from "@/components/Keyboard/page";
import { Button } from "@/components/ui/button";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { Instrument_Sans } from "next/font/google";


export default function Home() {
  const router=useRouter()
  return (
   <>
    <div className="bg-background text-foreground max-w-6xl mx-auto border-x border-[#565656] border-dashed h-screen overflow-hidden">
      <div className="flex justify-between px-10 py-4 border-b border-[#565656] border-dashed h-16">

    <div className="flex gap-2">
      <Image src="/assets/image.png" alt="Logo" width={40} height={40} className="bg-white rounded-sm "/>
    <div className="text-xl font-semibold">Ghosttype</div> 
    </div>
  </div>

  <div className="grid grid-cols-8 h-[calc(100vh-1rem)]">

    <div className="col-span-5 flex items-center">
      <div className="flex flex-col gap-6 px-10">
        <h1 className="text-6xl font-semibold leading-tight">
          Type faster with <br /> GhostType
        </h1> 

        <div className="flex gap-3">
          <Button variant="redbutton" onClick={()=>router.push("/choose-option")}>
            Get started
          </Button>
          <button className="rounded-lg bg-[#27272A]  px-4 py-2 text-sm">
            Open source
          </button>
        </div>
      </div>
    </div>

    <div className="col-span-3 flex items-center justify-center">
      <Keyboard/>
    </div>
    <div className="flex flex-row w-full col-span-8 px-10 gap-6 border-t border-dashed border-[#565656]">
      <div className="flex flex-col gap-2 border-r border-dashed border-[#565656] pt-4 last:border-r-0">
        <div className="grid grid-cols-10 ">
           <div className="col-span-1 pt-1">
              <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#ffffff" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="icon icon-tabler icons-tabler-outline icon-tabler-git-merge"><path stroke="none" d="M0 0h24v24H0z" fill="none"/><path d="M7 18m-2 0a2 2 0 1 0 4 0a2 2 0 1 0 -4 0" /><path d="M7 6m-2 0a2 2 0 1 0 4 0a2 2 0 1 0 -4 0" /><path d="M17 12m-2 0a2 2 0 1 0 4 0a2 2 0 1 0 -4 0" /><path d="M7 8l0 8" /><path d="M7 8a4 4 0 0 0 4 4h4" /></svg>
           </div>
           <div className="col-span-9 max-w-[95%]">
            <p className="font-semibold text-md">Open Source</p>
            <p className="text-[#757575] text-sm ">Your stats will only be shared in the leaderboard  this will not be public and accesible</p>
           </div>
        </div>
        
      </div><div className="flex flex-col gap-2 border-r border-dashed border-[#565656] pt-4 last:border-r-0">
        <div className="grid grid-cols-10">
           <div className="col-span-1 pt-1">
              <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#ffffff" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="icon icon-tabler icons-tabler-outline icon-tabler-git-merge"><path stroke="none" d="M0 0h24v24H0z" fill="none"/><path d="M7 18m-2 0a2 2 0 1 0 4 0a2 2 0 1 0 -4 0" /><path d="M7 6m-2 0a2 2 0 1 0 4 0a2 2 0 1 0 -4 0" /><path d="M17 12m-2 0a2 2 0 1 0 4 0a2 2 0 1 0 -4 0" /><path d="M7 8l0 8" /><path d="M7 8a4 4 0 0 0 4 4h4" /></svg>
           </div>
           <div className="col-span-9 max-w-[95%]">
            <p className="font-semibold text-md">Open Source</p>
            <p className="text-[#757575] text-sm">Your stats will only be shared in the leaderboard  this will not be public and accesible</p>
           </div>
        </div>
        
      </div><div className="flex flex-col gap-2 border-r border-dashed border-[#565656] pt-4 last:border-r-0">
        <div className="grid grid-cols-10">
           <div className="col-span-1 pt-1">
              <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#ffffff" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="icon icon-tabler icons-tabler-outline icon-tabler-git-merge"><path stroke="none" d="M0 0h24v24H0z" fill="none"/><path d="M7 18m-2 0a2 2 0 1 0 4 0a2 2 0 1 0 -4 0" /><path d="M7 6m-2 0a2 2 0 1 0 4 0a2 2 0 1 0 -4 0" /><path d="M17 12m-2 0a2 2 0 1 0 4 0a2 2 0 1 0 -4 0" /><path d="M7 8l0 8" /><path d="M7 8a4 4 0 0 0 4 4h4" /></svg>
           </div>
           <div className="col-span-9 max-w-[95%]s">
            <p className="font-semibold text-md">Open Source</p>
            <p className="text-[#757575] text-sm">Your stats will only be shared in the leaderboard  this will not be public and accesible</p>
           </div>
        </div>
        
      </div>
    </div>
  </div>
</div>
   </>
  );
}
