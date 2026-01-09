import { NextResponse } from "next/server"

export async function GET(request: Request) {
  const url = new URL(request.url)
  const roomCode = url.searchParams.get("roomCode")
  if (!roomCode) {
    return NextResponse.json({ status: "error", message: "roomCode is required" }, { status: 400 })
  }

  const backendUrl = process.env.BACKEND_URL || "http://localhost:8000"

  try {
    const res = await fetch(`${backendUrl}/results/${encodeURIComponent(roomCode)}`)
    const data = await res.json()
    return NextResponse.json(data, { status: res.ok ? 200 : 502 })
  } catch (err) {
    return NextResponse.json({ status: "error", message: String(err) }, { status: 500 })
  }
}
