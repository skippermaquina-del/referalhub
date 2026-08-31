"use client";

import { useState } from "react";

export function CopyField({ value }: { value: string }) {
  const [copied, setCopied] = useState(false);

  async function copy() {
    try {
      await navigator.clipboard.writeText(value);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      // Clipboard access can be blocked (insecure origin, permissions) —
      // the URL is still selectable on screen, so there's nothing to recover.
    }
  }

  return (
    <div className="flex items-center gap-2 rounded-md border border-neutral-200 px-3 py-2 dark:border-neutral-800">
      <code className="flex-1 overflow-x-auto whitespace-nowrap font-mono text-xs">{value}</code>
      <button
        type="button"
        onClick={copy}
        className="shrink-0 rounded-md bg-emerald-500 px-3 py-1 text-xs font-medium text-white hover:bg-emerald-600"
      >
        {copied ? "Copied" : "Copy"}
      </button>
    </div>
  );
}
