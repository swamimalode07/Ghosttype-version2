"use client";

import { useState } from "react";

function CodeBlock({ code }: { code: string }) {
  const [copied, setCopied] = useState(false);

  async function handleCopy() {
    try {
      await navigator.clipboard.writeText(code);
      setCopied(true);
      setTimeout(() => setCopied(false), 1000);
    } catch {}
  }

  return (
    <div className="w-full flex items-center gap-2 rounded-md border border-zinc-800 bg-zinc-900 px-3 py-2 text-zinc-100">
      {/* Code */}
      <code className="flex-1 truncate font-mono text-sm">
        {code}
      </code>

      {/* Copy button */}
      <button
        onClick={handleCopy}
        className="shrink-0 rounded border border-zinc-700 px-2 py-1 text-xs hover:bg-zinc-800 transition"
      >
        {copied ? "Copied" : "Copy"}
      </button>
    </div>
  );
}

export default CodeBlock;
