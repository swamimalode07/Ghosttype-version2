"use client"
import Keyboard from "@/components/Keyboard/page";
import { Button } from "@/components/ui/button";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useState } from "react";


export default function Home() {
  const router=useRouter()
  return (
   <>
    <div className="bg-background text-foreground max-w-6xl mx-auto border-r border-l border-gray-500 border-dashed min-h-screen overflow-y-hidden overflow-x-clip">
  <div className="flex justify-between px-10 pt-4 border-b border-gray-500 border-dashed pb-4">
    <div className="flex gap-2">
      <Image src="/assets/image.png" alt="Logo" width={40} height={40} className="bg-white rounded-sm "/>
    <div className="text-xl font-semibold">Ghosttype</div> 
    </div>
  </div>

  <div className="grid grid-cols-8 min-h-[calc(100vh-120px)]">
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
  </div>
</div>
   </>
  );
}
