"use client";

import { useEffect, useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { generateUsername } from "@/lib/generate-username";
import { useMutation } from "@tanstack/react-query";
import app from "@/lib/eden-client";
import { useRouter } from "next/navigation";

export default function SecureRoomUI() {
  const [username, setUsername] = useState<null | string>(null);
  const STORAGE_KEY = "realtime-chat-username";
  const router = useRouter();
  useEffect(() => {
    const storedUsername = localStorage.getItem(STORAGE_KEY);
    if (storedUsername) {
      setUsername(storedUsername);
    } else {
      const generatedUsername = generateUsername();
      localStorage.setItem(STORAGE_KEY, generatedUsername);
      setUsername(generatedUsername);
    }
  }, [username]);

  const { mutate: createRoom } = useMutation({
    mutationFn: async () => {
      const res = await app.api.room.create.post();
      if (res.status === 200) {
        router.push(`/room/${res.data?.roomId}`);
      }
    },
  });
  return (
    <Card className="w-full max-w-md">
      <CardContent className="p-6 space-y-6">
        <div className="space-y-4">
          <Label htmlFor="username">Your Identity</Label>
          <Input
            id="username"
            placeholder="Enter your username"
            value={username || "Loading..."}
            onChange={(e) => setUsername(e.target.value)}
          />
        </div>

        <Button
          onClick={() => createRoom()}
          className="w-full bg-white text-black"
        >
          Create Secure Room
        </Button>
      </CardContent>
    </Card>
  );
}
