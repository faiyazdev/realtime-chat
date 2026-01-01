"use client";

import { Button } from "@/components/ui/button";
import useUsername from "@/hooks/use-username";
import app from "@/lib/eden-client";
import { formatTime } from "@/lib/formatters";
import { useRealtime } from "@/lib/realtime-client";
import { useMutation, useQuery } from "@tanstack/react-query";
import { useParams, useRouter } from "next/navigation";
import React, { useEffect, useState } from "react";

function Room() {
  const params = useParams();
  const roomId = params.roomId as string;
  const { username } = useUsername();
  const router = useRouter();

  const [copy, setCopy] = useState(false);
  const [timeRemaining, setTimeRemaining] = useState<number | null>(200);
  const [inputValue, setInputValue] = useState("");

  const { mutate: sendMessage, isPending: isMessageSending } = useMutation({
    mutationFn: async ({ text }: { text: string }) => {
      await app.api.messages.post(
        { text, sender: username },
        { query: { roomId } }
      );
    },
  });

  const { data: messages, refetch: refetchMessages } = useQuery({
    queryKey: ["messages", roomId],
    queryFn: async () => {
      const res = await app.api.messages.get({ query: { roomId } });
      return res.data;
    },
  });

  const { data: ttlData } = useQuery({
    queryKey: ["ttl", roomId],
    queryFn: async () => {
      const res = await app.api.room.ttl.get({ query: { roomId } });
      return res.data;
    },
  });

  const { mutate: destroyRoom } = useMutation({
    mutationFn: async () => {
      await app.api.room.delete(null, { query: { roomId } });
    },
  });

  useRealtime({
    channels: [roomId],
    events: ["chat.message", "chat.destroy"],
    onData: ({ event }) => {
      if (event === "chat.message") refetchMessages();
      if (event === "chat.destroy") {
        alert("Room has been destroyed!");
        router.push("/?destroyed=true");
      }
    },
  });

  useEffect(() => {
    if (ttlData?.ttl !== undefined) {
      setTimeRemaining(ttlData.ttl);
    }
  }, [ttlData]);

  useEffect(() => {
    if (timeRemaining === null || timeRemaining < 0) {
      router.push("/?destroyed=true");
      return;
    }
    const interval = setInterval(() => {
      setTimeRemaining((prev) => (prev && prev > 0 ? prev - 1 : 0));
    }, 1000);
    return () => clearInterval(interval);
  }, [timeRemaining, router]);

  const handleCopy = () => {
    navigator.clipboard.writeText(window.location.href);
    setCopy(true);
    setTimeout(() => setCopy(false), 2000);
  };

  return (
    <main className="flex h-dvh flex-col">
      {/* Header */}
      <header className="flex flex-col gap-4 border-b p-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="space-y-1">
          <p className="text-xs text-muted-foreground">Room ID</p>
          <div className="flex items-center gap-2">
            <span className="text-sm font-medium break-all">{roomId}</span>
            <Button size="sm" onClick={handleCopy}>
              {copy ? "Copied" : "Copy"}
            </Button>
          </div>
        </div>

        <div className="text-center sm:text-right">
          <p className="text-xs text-muted-foreground">Self-destruction</p>
          <p className="font-mono text-sm">{formatTime(timeRemaining)}</p>
        </div>

        <Button
          onClick={() => destroyRoom()}
          variant="destructive"
          className="w-full sm:w-auto"
        >
          Destroy
        </Button>
      </header>

      {/* Messages */}
      <section className="flex-1 overflow-y-auto p-4 space-y-3">
        {messages?.messages?.length === 0 && (
          <p className="text-sm text-zinc-500">
            No messages yet. Start the conversation!
          </p>
        )}

        {messages?.messages?.map((msg) => (
          <div key={msg.id} className="space-y-1">
            <div className="flex justify-between text-xs text-zinc-500">
              <span>{msg.sender === username ? "You" : msg.sender}</span>
              <span>{formatTime(msg.timeStamp)}</span>
            </div>
            <p className="text-sm break-words">{msg.text}</p>
          </div>
        ))}
      </section>

      {/* Input */}
      <footer className="border-t bg-background p-3">
        <div className="flex items-center gap-2">
          <input
            className="flex-1 rounded-md border bg-background px-3 py-3 text-sm focus:outline-none"
            placeholder="Type a message..."
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter" && inputValue.trim()) {
                sendMessage({ text: inputValue });
                setInputValue("");
              }
            }}
          />
          <Button
            disabled={!inputValue.trim() || isMessageSending}
            onClick={() => {
              sendMessage({ text: inputValue });
              setInputValue("");
            }}
          >
            Send
          </Button>
        </div>
      </footer>
    </main>
  );
}

export default Room;
