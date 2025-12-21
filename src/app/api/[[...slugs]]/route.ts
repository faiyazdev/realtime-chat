import { redis } from "@/lib/redis";
import { Elysia } from "elysia";
import { nanoid } from "nanoid";

const ROOM_TTL_SECONDS = 60 * 10; // 10 minutes
const room = new Elysia({ prefix: "/room" }).post("/create", async () => {
  const roomId = nanoid();

  await redis.hset(`meta:${roomId}`, {
    createdAt: Date.now(),
    connected: [],
  });

  await redis.expire(`meta:${roomId}`, ROOM_TTL_SECONDS); // 24 hours
  return { roomId };
});

const app = new Elysia({ prefix: "/api" }).use(room);
export type App = typeof app;
export const GET = app.fetch;
export const POST = app.fetch;
