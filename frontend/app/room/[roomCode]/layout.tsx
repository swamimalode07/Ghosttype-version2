// app/room/[roomCode]/lobby/layout.tsx

export default function LobbyLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen w-full max-w-3xl mx-auto bg-background text-foreground mt-20">
      {children}
    </div>
  );
}
