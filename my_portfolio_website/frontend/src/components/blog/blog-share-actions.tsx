"use client";

import React, { useState } from "react";
import { Copy, Check, Share2 } from "lucide-react";

interface BlogShareActionsProps {
  title: string;
}

export function BlogShareActions({ title }: BlogShareActionsProps) {
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(window.location.href);
      setCopied(true);
      setTimeout(() => setCopied(false), 2500);
    } catch {
      // Fallback
    }
  };

  const handleShareTwitter = () => {
    const url = encodeURIComponent(typeof window !== "undefined" ? window.location.href : "");
    const text = encodeURIComponent(`Reading "${title}" by Mohamed Hajith (@HajithMohamed):`);
    window.open(`https://twitter.com/intent/tweet?text=${text}&url=${url}`, "_blank", "noopener,noreferrer");
  };

  const handleShareLinkedIn = () => {
    const url = encodeURIComponent(typeof window !== "undefined" ? window.location.href : "");
    window.open(`https://www.linkedin.com/sharing/share-offsite/?url=${url}`, "_blank", "noopener,noreferrer");
  };

  return (
    <div className="flex flex-wrap items-center gap-2">
      <button
        type="button"
        onClick={handleCopy}
        className="inline-flex items-center gap-1.5 rounded-lg border border-white/10 bg-white/[0.03] px-3 py-1.5 font-mono text-xs text-muted-foreground hover:border-cyan/40 hover:text-cyan transition-all"
        title="Copy article link"
      >
        {copied ? <Check size={12} className="text-emerald-400" /> : <Copy size={12} />}
        <span>{copied ? "Link Copied" : "Copy Link"}</span>
      </button>

      <button
        type="button"
        onClick={handleShareTwitter}
        className="inline-flex items-center gap-1.5 rounded-lg border border-white/10 bg-white/[0.03] px-3 py-1.5 font-mono text-xs text-muted-foreground hover:border-cyan/40 hover:text-cyan transition-all"
        title="Share to Twitter / X"
      >
        <span>X (Twitter)</span>
      </button>

      <button
        type="button"
        onClick={handleShareLinkedIn}
        className="inline-flex items-center gap-1.5 rounded-lg border border-white/10 bg-white/[0.03] px-3 py-1.5 font-mono text-xs text-muted-foreground hover:border-cyan/40 hover:text-cyan transition-all"
        title="Share to LinkedIn"
      >
        <span>LinkedIn</span>
      </button>
    </div>
  );
}
