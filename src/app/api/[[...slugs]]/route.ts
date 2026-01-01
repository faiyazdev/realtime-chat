import { redis } from "@/lib/redis";
import { Elysia } from "elysia";
import { nanoid } from "nanoid";
import { authMiddleware } from "./auth";
import { z } from "zod";
import { Message, realtime } from "@/lib/realtime";

const ROOM_TTL_SECONDS = 60 * 10; // 10 minutes
const room = new Elysia({ prefix: "/room" })
  .post("/create", async () => {
    const roomId = nanoid();

    await redis.hset(`meta:${roomId}`, {
      createdAt: Date.now(),
      connected: [],
    });

    await redis.expire(`meta:${roomId}`, ROOM_TTL_SECONDS); // 24 hours
    return { roomId };
  })
  .use(authMiddleware)
  .get(
    "ttl",
    async ({ auth }) => {
      const ttl = await redis.ttl(`meta:${auth.roomId}`);
      return { ttl };
    },
    {
      query: z.object({
        roomId: z.string(),
      }),
    }
  )
  .delete(
    "/",
    async ({ auth }) => {
      const { roomId } = auth;
      await redis.del(`meta:${roomId}`);
      await redis.del(`messages:${roomId}`);
      await realtime
        .channel(roomId)
        .emit("chat.destroy", { isDestroyed: true });
    },
    {
      query: z.object({
        roomId: z.string(),
      }),
    }
  );

const messages = new Elysia({ prefix: "/messages" })
  .use(authMiddleware)
  .get(
    "/",
    async ({ auth }) => {
      const messages = await redis.lrange<Message>(
        `messages:${auth.roomId}`,
        0,
        -1
      );
      return {
        messages: messages.map((msg) => ({
          ...msg,
          token: msg.token === auth.token ? auth.token : undefined,
        })),
      };
    },
    {
      query: z.object({
        roomId: z.string(),
      }),
    }
  )
  .post(
    "/",
    async ({ auth, body }) => {
      const { sender, text } = body;
      const { roomId } = auth;
      const roomExists = redis.exists(`meta:${roomId}`);
      if (!roomExists) throw new Error("room doesn't exist");
      const message: Message = {
        id: nanoid(),
        sender,
        text,
        timeStamp: Date.now(),
        roomId,
      };
      // add message to history
      await redis.rpush(`messages:${roomId}`, {
        ...message,
        token: auth.token,
      });
      await realtime.channel(roomId).emit("chat.message", message);

      const remaining = await redis.ttl(`meta:${roomId}`);

      await redis.expire(`messages:${roomId}`, remaining);
      await redis.expire(`history:${roomId}`, remaining);
      await redis.expire(roomId, remaining);
    },
    {
      body: z.object({
        sender: z.string().max(50),
        text: z.string().max(1000),
      }),
    }
  );
const app = new Elysia({ prefix: "/api" }).use(room).use(messages);
export type App = typeof app;
export const GET = app.fetch;
export const POST = app.fetch;
export const DELETE = app.fetch;
