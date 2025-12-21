"use client";
import { Button } from "@/components/ui/button";
import { useParams } from "next/navigation";
import React, { useState } from "react";

function Room() {
  const params = useParams();
  const roomId = params.roomId as string;

  const [copy, setCopy] = useState(false);
  const handleCopy = () => {
    const url = window.location.href;
    navigator.clipboard.writeText(url);
    setCopy(true);
    setTimeout(() => setCopy(false), 2000);
  };
  return (
    <main className="flex flex-col min-h-screen gap-4">
      <header className="flex justify-between">
        <div className="flex flex-col gap-3">
          <h1 className="text-zinc-200">Room ID: </h1>
          <div className="flex">
            <p>{roomId}</p>
            <Button onClick={handleCopy} variant={"outline"}>
              {copy ? "Copied!" : "Copy"}
            </Button>
          </div>
        </div>
        <div className=""></div>
      </header>
    </main>
  );
}

export default Room;
