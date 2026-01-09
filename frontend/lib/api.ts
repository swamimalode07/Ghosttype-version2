export async function fetchRoomResult(roomCode: string) {
  const res = await fetch(`/api/results?roomCode=${encodeURIComponent(roomCode)}`)
  if (!res.ok) {
    const text = await res.text()
    throw new Error(text || `Failed to fetch result (${res.status})`)
  }
  return res.json()
}
