interface PlayerListProps {
  playerName: string
  isCreator: boolean
}

const PlayerList = ({ playerName, isCreator }: PlayerListProps) => {
  return (
    <div className="flex justify-between items-center rounded-md border px-3 py-2">
      <span>{playerName}</span>
      {isCreator && (
        <span className="text-xs text-muted-foreground">Creator</span>
      )}
    </div>
  )
}

export default PlayerList
