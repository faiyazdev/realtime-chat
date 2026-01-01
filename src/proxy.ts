import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { redis } from "./lib/redis";
import { nanoid } from "nanoid";

export async function proxy(req: NextRequest) {
  const pathname = req.nextUrl.pathname;
  const roomMatch = pathname.match(/^\/room\/([^\/]+)$/);
  if (!roomMatch) return NextResponse.redirect(new URL("/", req.url));
  const roomId = roomMatch[1];
  const metaData = await redis.hgetall<{
    connected: string[];
    createdAt: number;
  }>(`meta:${roomId}`);
  if (!metaData)
    return NextResponse.redirect(new URL("/?error=not-found-room", req.url));
  const existingToken = req.cookies.get("x-auth-token")?.value;
  if (existingToken && metaData.connected.includes(existingToken)) {
    return NextResponse.next();
  }
  if (metaData.connected.length >= 2) {
    return NextResponse.redirect(new URL("/?error=room-full", req.url));
  }
  const response = NextResponse.next();
  const token = nanoid();
  response.cookies.set("x-auth-token", token, {
    httpOnly: true,
    path: "/",
    secure: process.env.NODE_ENV === "production",
    sameSite: "strict",
  });
  await redis.hset(`meta:${roomId}`, {
    connected: [...(metaData.connected || []), token],
  });
  return response;
}

export const config = {
  matcher: "/room/:path*",
};
