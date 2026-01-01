"use client";

import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { useMutation } from "@tanstack/react-query";
import app from "@/lib/eden-client";
import { useRouter, useSearchParams } from "next/navigation";
import useUsername from "@/hooks/use-username";

export default function SecureRoomUI() {
  const router = useRouter();
  const { username } = useUsername();
  const searchParams = useSearchParams();

  const wasDestroyed = searchParams.get("destroyed") === "true";
  const error = searchParams.get("error");

  const { mutate: createRoom, isPending } = useMutation({
    mutationFn: async () => {
      const res = await app.api.room.create.post();
      if (res.status === 200) {
        router.push(`/room/${res.data?.roomId}`);
      }
    },
  });

  return (
    <div className="flex w-full justify-center px-3 py-6 sm:px-6">
      <Card className="w-full max-w-md rounded-xl">
        {/* Alerts */}
        {wasDestroyed && (
          <div className="mx-4 mt-4 rounded-lg bg-green-100 p-3 text-sm leading-relaxed text-green-700">
            <span className="font-medium">Success!</span> The secure room has
            been destroyed.
          </div>
        )}

        {error === "room_not_found" && (
          <div className="mx-4 mt-4 rounded-lg bg-red-100 p-3 text-sm leading-relaxed text-red-700">
            <span className="font-medium">Error!</span> The secure room was not
            found.
          </div>
        )}

        {error === "room-full" && (
          <div className="mx-4 mt-4 rounded-lg bg-red-100 p-3 text-sm leading-relaxed text-red-700">
            <span className="font-medium">Error!</span> The secure room is full.
          </div>
        )}

        <CardContent className="space-y-5 px-4 py-5 sm:px-6 sm:py-6">
          <div className="space-y-1.5">
            <Label htmlFor="username" className="text-sm">
              Your Identity
            </Label>
            <Input
              id="username"
              value={username}
              readOnly
              className="h-11 text-base"
            />
          </div>

          <Button
            onClick={() => createRoom()}
            disabled={isPending}
            className="h-11 w-full text-base dark:bg-amber-400"
          >
            {isPending ? "Creating..." : "Create Secure Room"}
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}
