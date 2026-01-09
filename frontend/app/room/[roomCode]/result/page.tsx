"use client"

import React, { useEffect, useState } from "react"
import { useParams } from "next/navigation"
import { fetchRoomResult } from "@/lib/api"

type RaceResult = {
  room_code?: string
  winner?: string
  winner_wpm?: number
  winner_accuracy?: number
  loser?: string | null
  loser_wpm?: number | null
  loser_accuracy?: number | null
}

const Results = () => {
  const params = useParams() as { roomCode?: string }
  const roomCode = params?.roomCode
  const [loading, setLoading] = useState(false)
  const [result, setResult] = useState<RaceResult | null>(null)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    if (!roomCode) return
    setLoading(true)
    setError(null)

    fetchRoomResult(roomCode)
      .then((data) => {
        if (data?.status === "ok" && data.result) {
          setResult(data.result)
        } else {
          setResult(null)
          setError("No results found for this room")
        }
      })
      .catch((err) => setError(String(err)))
      .finally(() => setLoading(false))
  }, [roomCode])

  return (
    <div className="min-h-screen flex items-center justify-center p-4">
      <div className="max-w-md w-full bg-white/5 rounded-lg p-6 text-sm">
        <h1 className="text-xl font-semibold mb-3">Results</h1>

        {loading && <div>Loading results…</div>}

        {error && !loading && <div className="text-red-500">{error}</div>}

        {!loading && result && (
          <div className="space-y-3">
            <div>
              <strong>Winner:</strong> {result.winner ?? "—"}
            </div>
            <div>
              <strong>Winner WPM:</strong> {result.winner_wpm ?? "—"}
            </div>
            <div>
              <strong>Winner Accuracy:</strong> {result.winner_accuracy != null ? `${result.winner_accuracy}%` : "—"}
            </div>

            {result.loser ? (
              <div className="mt-4">
                <div>
                  <strong>Loser:</strong> {result.loser}
                </div>
                <div>
                  <strong>Loser WPM:</strong> {result.loser_wpm ?? "—"}
                </div>
                <div>
                  <strong>Loser Accuracy:</strong> {result.loser_accuracy != null ? `${result.loser_accuracy}%` : "—"}
                </div>
              </div>
            ) : (
              <div className="mt-4">No opponent recorded.</div>
            )}

            <div className="mt-4 text-xs text-gray-400">
              <div>Room: {result.room_code ?? roomCode}</div>
              <div>Raw DB fields shown when available.</div>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

export default Results