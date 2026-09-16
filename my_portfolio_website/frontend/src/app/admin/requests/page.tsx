"use client";

import { useEffect, useState } from "react";
import {
  AlertTriangle,
  ArrowRight,
  Briefcase,
  Check,
  Clock,
  ExternalLink,
  Eye,
  Filter,
  Inbox,
  Mail,
  RefreshCw,
  Search,
  ShieldAlert,
  Trash2,
  User,
  X,
} from "lucide-react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input, Textarea } from "@/components/ui/input";
import { adminFetch } from "@/lib/api";
import type { ProjectRequest, RequestStatus } from "@/lib/types";
import { cn, formatDate } from "@/lib/utils";

const STAGES: { key: RequestStatus; label: string; color: string; bg: string; border: string }[] = [
  { key: "NEW", label: "New", color: "text-cyan", bg: "bg-cyan/10", border: "border-cyan/30" },
  { key: "REVIEWING", label: "Reviewing", color: "text-purple-400", bg: "bg-purple-500/10", border: "border-purple-500/30" },
  { key: "PROPOSAL", label: "Proposal", color: "text-amber-400", bg: "bg-amber-500/10", border: "border-amber-500/30" },
  { key: "APPROVED", label: "Approved", color: "text-emerald-400", bg: "bg-emerald-500/10", border: "border-emerald-500/30" },
  { key: "IN_PROGRESS", label: "In Progress", color: "text-blue-400", bg: "bg-blue-500/10", border: "border-blue-500/30" },
  { key: "COMPLETED", label: "Completed", color: "text-green-400", bg: "bg-green-500/10", border: "border-green-500/30" },
  { key: "ARCHIVED", label: "Archived", color: "text-muted-foreground", bg: "bg-surface-2/60", border: "border-border" },
];

export default function AdminRequestsPage() {
  const router = useRouter();
  const [requests, setRequests] = useState<ProjectRequest[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedRequest, setSelectedRequest] = useState<ProjectRequest | null>(null);
  const [filterStage, setFilterStage] = useState<string>("ALL");
  const [searchQuery, setSearchQuery] = useState("");
  const [internalNotes, setInternalNotes] = useState("");
  const [savingNotes, setSavingNotes] = useState(false);
  const [converting, setConverting] = useState(false);
  const [actionError, setActionError] = useState<string | null>(null);

  async function loadRequests() {
    setLoading(true);
    try {
      const data = await adminFetch<ProjectRequest[]>("/admin/requests");
      setRequests(data);
      if (selectedRequest) {
        const refreshed = data.find((r) => r.id === selectedRequest.id);
        if (refreshed) {
          setSelectedRequest(refreshed);
          setInternalNotes(refreshed.internalNotes || "");
        }
      }
    } catch (err) {
      console.error("Failed to load requests:", err);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadRequests();
  }, []);

  async function updateStatus(id: string, status: RequestStatus) {
    try {
      await adminFetch(`/admin/requests/${id}`, {
        method: "PATCH",
        body: JSON.stringify({ status }),
      });
      await loadRequests();
    } catch (err) {
      setActionError(err instanceof Error ? err.message : "Failed to update status");
    }
  }

  async function saveNotes(id: string) {
    setSavingNotes(true);
    try {
      await adminFetch(`/admin/requests/${id}`, {
        method: "PATCH",
        body: JSON.stringify({ internalNotes }),
      });
      await loadRequests();
    } catch (err) {
      setActionError(err instanceof Error ? err.message : "Failed to save notes");
    } finally {
      setSavingNotes(false);
    }
  }

  async function convertToProject(id: string) {
    if (!confirm("Convert this request into an active Client Project?")) return;
    setConverting(true);
    setActionError(null);
    try {
      const project = await adminFetch<{ id: string; title: string }>(
        `/admin/requests/${id}/convert-to-project`,
        { method: "POST" }
      );
      router.push(`/admin/client-projects?selected=${project.id}`);
    } catch (err) {
      setActionError(err instanceof Error ? err.message : "Conversion failed");
      setConverting(false);
    }
  }

  async function deleteRequest(id: string) {
    if (!confirm("Are you sure you want to permanently delete this request?")) return;
    try {
      await adminFetch(`/admin/requests/${id}`, { method: "DELETE" });
      setSelectedRequest(null);
      await loadRequests();
    } catch (err) {
      setActionError(err instanceof Error ? err.message : "Failed to delete request");
    }
  }

  const filteredRequests = requests.filter((req) => {
    if (filterStage !== "ALL" && req.status !== filterStage) return false;
    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase();
      return (
        req.name.toLowerCase().includes(query) ||
        req.email.toLowerCase().includes(query) ||
        req.referenceId.toLowerCase().includes(query) ||
        req.projectType.toLowerCase().includes(query) ||
        (req.company && req.company.toLowerCase().includes(query))
      );
    }
    return true;
  });

  return (
    <div className="space-y-6">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 border-b border-border pb-5">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="font-display text-2xl font-bold tracking-tight text-foreground sm:text-3xl">
              Project Requests Pipeline
            </h1>
            <span className="font-mono text-xs text-cyan border border-cyan/30 px-2 py-0.5 rounded-full bg-cyan/10">
              {requests.length} total
            </span>
          </div>
          <p className="mt-1 font-mono text-xs text-muted-foreground">
            Customer intake pipeline from /start-project • Direct conversion to client projects
          </p>
        </div>

        <div className="flex items-center gap-2">
          <Button
            size="sm"
            variant="secondary"
            onClick={loadRequests}
            disabled={loading}
            className="font-mono text-xs"
          >
            <RefreshCw size={13} className={cn("mr-1.5", loading && "animate-spin")} />
            Refresh
          </Button>
          <a
            href="/start-project"
            target="_blank"
            rel="noreferrer"
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-md border border-cyan/30 bg-cyan/10 text-cyan hover:bg-cyan/20 text-xs font-mono transition-colors"
          >
            <ExternalLink size={13} />
            Public Form
          </a>
        </div>
      </div>

      {/* Filters Bar */}
      <div className="flex flex-col sm:flex-row gap-3 items-stretch sm:items-center justify-between">
        <div className="relative flex-1 max-w-md">
          <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
          <Input
            placeholder="Search by name, email, ref ID, or type..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-9 text-xs font-mono"
          />
        </div>

        <div className="flex items-center gap-1 overflow-x-auto pb-1 text-xs font-mono">
          <button
            type="button"
            onClick={() => setFilterStage("ALL")}
            className={cn(
              "px-2.5 py-1 rounded-md border whitespace-nowrap transition-colors",
              filterStage === "ALL"
                ? "bg-cyan/20 text-cyan border-cyan/40"
                : "bg-surface-2/60 text-muted-foreground border-border hover:text-foreground"
            )}
          >
            All ({requests.length})
          </button>
          {STAGES.map((s) => {
            const count = requests.filter((r) => r.status === s.key).length;
            return (
              <button
                key={s.key}
                type="button"
                onClick={() => setFilterStage(s.key)}
                className={cn(
                  "px-2.5 py-1 rounded-md border whitespace-nowrap transition-colors",
                  filterStage === s.key
                    ? `${s.bg} ${s.color} ${s.border}`
                    : "bg-surface-2/60 text-muted-foreground border-border hover:text-foreground"
                )}
              >
                {s.label} ({count})
              </button>
            );
          })}
        </div>
      </div>

      {/* Desktop Kanban Board */}
      <div className="hidden xl:grid grid-cols-7 gap-3 items-start min-h-[550px]">
        {STAGES.map((stage) => {
          const stageRequests = filteredRequests.filter((r) => r.status === stage.key);
          return (
            <div
              key={stage.key}
              className="flex flex-col rounded-xl border border-border/80 bg-surface/40 backdrop-blur-sm p-3 min-h-[400px]"
            >
              {/* Column Header */}
              <div className="flex items-center justify-between border-b border-border/70 pb-2 mb-3">
                <div className="flex items-center gap-1.5">
                  <span className={cn("text-xs font-mono font-semibold uppercase tracking-wider", stage.color)}>
                    {stage.label}
                  </span>
                </div>
                <span className="font-mono text-[10px] rounded-full px-1.5 py-0.5 bg-surface-2 text-muted-foreground border border-border">
                  {stageRequests.length}
                </span>
              </div>

              {/* Cards in Column */}
              <div className="space-y-2.5 flex-1">
                {stageRequests.map((req) => (
                  <div
                    key={req.id}
                    onClick={() => {
                      setSelectedRequest(req);
                      setInternalNotes(req.internalNotes || "");
                    }}
                    className={cn(
                      "cursor-pointer rounded-lg border p-3 transition-all hover:border-cyan/50 hover:shadow-lg",
                      selectedRequest?.id === req.id
                        ? "border-cyan bg-cyan/10 ring-1 ring-cyan/40"
                        : "border-border/70 bg-surface-2/80 hover:bg-surface-2"
                    )}
                  >
                    <div className="flex items-center justify-between text-[10px] font-mono text-muted-foreground mb-1">
                      <span className="text-cyan font-bold">{req.referenceId}</span>
                      <span>{formatDate(req.createdAt)}</span>
                    </div>

                    <div className="font-medium text-xs text-foreground truncate">{req.name}</div>
                    {req.company && (
                      <div className="text-[10px] text-muted-foreground truncate">{req.company}</div>
                    )}

                    <div className="mt-2 text-[11px] font-mono text-muted-foreground/90 bg-surface/60 rounded px-1.5 py-0.5 border border-border/50 truncate">
                      {req.projectType}
                    </div>

                    {req.budget && (
                      <div className="mt-1.5 text-[10px] font-mono text-emerald-400">
                        {req.budget}
                      </div>
                    )}

                    {req.honeypot && (
                      <div className="mt-1.5 flex items-center gap-1 text-[9px] font-mono text-signal-red">
                        <ShieldAlert size={10} /> Spam Flagged
                      </div>
                    )}
                  </div>
                ))}

                {stageRequests.length === 0 && (
                  <div className="h-28 flex items-center justify-center border border-dashed border-border/40 rounded-lg text-[10px] font-mono text-muted-foreground/60">
                    Empty
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>

      {/* Mobile/Tablet List View */}
      <div className="xl:hidden space-y-3">
        {filteredRequests.map((req) => {
          const currentStage = STAGES.find((s) => s.key === req.status) || STAGES[0];
          return (
            <Card
              key={req.id}
              onClick={() => {
                setSelectedRequest(req);
                setInternalNotes(req.internalNotes || "");
              }}
              className={cn(
                "cursor-pointer p-4 transition-all hover:border-cyan/40",
                selectedRequest?.id === req.id ? "border-cyan bg-cyan/10" : ""
              )}
            >
              <div className="flex items-start justify-between gap-2">
                <div>
                  <div className="flex items-center gap-2">
                    <span className="font-mono text-xs font-bold text-cyan">{req.referenceId}</span>
                    <span
                      className={cn(
                        "font-mono text-[9px] px-2 py-0.5 rounded-full border",
                        currentStage.bg,
                        currentStage.color,
                        currentStage.border
                      )}
                    >
                      {currentStage.label}
                    </span>
                  </div>
                  <h3 className="font-medium text-sm text-foreground mt-1">{req.name}</h3>
                  <div className="text-xs text-muted-foreground">{req.email} {req.company ? `• ${req.company}` : ""}</div>
                </div>

                <div className="text-right font-mono text-[10px] text-muted-foreground">
                  <div>{formatDate(req.createdAt)}</div>
                  {req.budget && <div className="text-emerald-400 mt-1">{req.budget}</div>}
                </div>
              </div>

              <div className="mt-3 text-xs text-muted-foreground line-clamp-2">
                {req.overview}
              </div>
            </Card>
          );
        })}

        {filteredRequests.length === 0 && !loading && (
          <div className="p-12 text-center rounded-xl border border-dashed border-border text-muted-foreground font-mono text-xs">
            No project requests matching criteria.
          </div>
        )}
      </div>

      {/* Request Details Drawer / Modal */}
      {selectedRequest && (
        <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm flex justify-end">
          <div className="w-full max-w-2xl bg-surface border-l border-border h-full overflow-y-auto p-6 flex flex-col justify-between shadow-2xl">
            <div className="space-y-6">
              {/* Header */}
              <div className="flex items-start justify-between border-b border-border pb-4">
                <div>
                  <div className="flex items-center gap-2">
                    <span className="font-mono text-sm font-bold text-cyan">
                      {selectedRequest.referenceId}
                    </span>
                    <span
                      className={cn(
                        "font-mono text-xs px-2.5 py-0.5 rounded-full border",
                        STAGES.find((s) => s.key === selectedRequest.status)?.bg,
                        STAGES.find((s) => s.key === selectedRequest.status)?.color,
                        STAGES.find((s) => s.key === selectedRequest.status)?.border
                      )}
                    >
                      {selectedRequest.status}
                    </span>
                  </div>
                  <h2 className="text-xl font-bold font-display text-foreground mt-1">
                    {selectedRequest.name}
                  </h2>
                  <div className="flex flex-wrap items-center gap-3 font-mono text-xs text-muted-foreground mt-1">
                    <span className="flex items-center gap-1">
                      <Mail size={12} /> {selectedRequest.email}
                    </span>
                    {selectedRequest.company && (
                      <span className="flex items-center gap-1">
                        <User size={12} /> {selectedRequest.company}
                      </span>
                    )}
                    <span className="flex items-center gap-1">
                      <Clock size={12} /> {formatDate(selectedRequest.createdAt)}
                    </span>
                  </div>
                </div>

                <button
                  type="button"
                  onClick={() => setSelectedRequest(null)}
                  className="p-1.5 rounded-md hover:bg-surface-2 text-muted-foreground hover:text-foreground"
                >
                  <X size={18} />
                </button>
              </div>

              {/* Status Selector */}
              <div className="rounded-lg border border-border/80 bg-surface-2/40 p-3.5 space-y-2">
                <label className="font-mono text-xs uppercase tracking-wider text-muted-foreground">
                  Move Pipeline Stage
                </label>
                <div className="flex flex-wrap gap-1.5">
                  {STAGES.map((s) => (
                    <button
                      key={s.key}
                      type="button"
                      onClick={() => updateStatus(selectedRequest.id, s.key)}
                      className={cn(
                        "px-2.5 py-1 rounded-md text-xs font-mono border transition-all",
                        selectedRequest.status === s.key
                          ? `${s.bg} ${s.color} ${s.border} ring-1 ring-cyan/30`
                          : "bg-surface-2/60 text-muted-foreground border-border hover:text-foreground"
                      )}
                    >
                      {s.label}
                    </button>
                  ))}
                </div>
              </div>

              {/* Core Project Spec */}
              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-3 font-mono text-xs">
                  <div className="rounded-lg border border-border/60 bg-surface-2/40 p-3">
                    <span className="text-muted-foreground block text-[10px] uppercase">Project Type</span>
                    <span className="text-foreground font-semibold">{selectedRequest.projectType}</span>
                  </div>
                  <div className="rounded-lg border border-border/60 bg-surface-2/40 p-3">
                    <span className="text-muted-foreground block text-[10px] uppercase">Budget Bracket</span>
                    <span className="text-emerald-400 font-semibold">{selectedRequest.budget || "Flexible"}</span>
                  </div>
                  <div className="rounded-lg border border-border/60 bg-surface-2/40 p-3">
                    <span className="text-muted-foreground block text-[10px] uppercase">Target Timeline</span>
                    <span className="text-foreground font-semibold">{selectedRequest.timeline || "Unspecified"}</span>
                  </div>
                  <div className="rounded-lg border border-border/60 bg-surface-2/40 p-3">
                    <span className="text-muted-foreground block text-[10px] uppercase">Telemetry / Dur</span>
                    <span className="text-muted-foreground">
                      {selectedRequest.durationSeconds ? `${selectedRequest.durationSeconds}s intake` : "Direct"}
                    </span>
                  </div>
                </div>

                {/* Project Overview */}
                <div className="rounded-lg border border-border/60 bg-surface-2/30 p-4 space-y-2">
                  <h4 className="font-mono text-xs uppercase tracking-wider text-cyan">
                    Project Overview
                  </h4>
                  <p className="text-sm leading-relaxed text-foreground whitespace-pre-wrap">
                    {selectedRequest.overview}
                  </p>
                </div>

                {/* Deliverables Checklist */}
                {selectedRequest.deliverables?.length > 0 && (
                  <div className="rounded-lg border border-border/60 bg-surface-2/30 p-4 space-y-2">
                    <h4 className="font-mono text-xs uppercase tracking-wider text-cyan">
                      Required Deliverables
                    </h4>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                      {selectedRequest.deliverables.map((d, i) => (
                        <div key={i} className="flex items-center gap-2 text-xs font-mono text-foreground/90">
                          <Check size={13} className="text-cyan shrink-0" />
                          <span>{d}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Preferred Technologies */}
                {selectedRequest.preferredTech?.length > 0 && (
                  <div className="rounded-lg border border-border/60 bg-surface-2/30 p-4 space-y-2">
                    <h4 className="font-mono text-xs uppercase tracking-wider text-cyan">
                      Preferred Technologies
                    </h4>
                    <div className="flex flex-wrap gap-1.5">
                      {selectedRequest.preferredTech.map((t, i) => (
                        <span
                          key={i}
                          className="px-2 py-0.5 rounded border border-border bg-surface text-xs font-mono text-foreground"
                        >
                          {t}
                        </span>
                      ))}
                    </div>
                  </div>
                )}

                {/* Internal Notes */}
                <div className="rounded-lg border border-border/60 bg-surface-2/30 p-4 space-y-2">
                  <div className="flex items-center justify-between">
                    <h4 className="font-mono text-xs uppercase tracking-wider text-amber-400">
                      Private Internal Notes
                    </h4>
                    <Button
                      size="sm"
                      variant="secondary"
                      onClick={() => saveNotes(selectedRequest.id)}
                      disabled={savingNotes}
                      className="font-mono text-xs h-7"
                    >
                      {savingNotes ? "Saving..." : "Save Notes"}
                    </Button>
                  </div>
                  <Textarea
                    placeholder="Log client discovery notes, estimate ranges, or next steps here..."
                    value={internalNotes}
                    onChange={(e) => setInternalNotes(e.target.value)}
                    rows={3}
                    className="font-mono text-xs"
                  />
                </div>

                {/* Abuse / Security Signals */}
                {(selectedRequest.honeypot || (selectedRequest.durationSeconds && selectedRequest.durationSeconds < 5)) && (
                  <div className="rounded-lg border border-signal-red/40 bg-signal-red/10 p-3.5 flex items-start gap-3">
                    <AlertTriangle className="text-signal-red shrink-0 mt-0.5" size={16} />
                    <div className="text-xs font-mono space-y-1">
                      <div className="font-bold text-signal-red">Potential Spam or Automated Bot</div>
                      {selectedRequest.honeypot && (
                        <div>Honeypot value: &quot;{selectedRequest.honeypot}&quot;</div>
                      )}
                      {selectedRequest.durationSeconds && selectedRequest.durationSeconds < 5 && (
                        <div>Submission completed suspiciously fast ({selectedRequest.durationSeconds}s).</div>
                      )}
                    </div>
                  </div>
                )}

                {actionError && (
                  <div className="text-xs font-mono text-signal-red border border-signal-red/30 bg-signal-red/10 p-2.5 rounded">
                    {actionError}
                  </div>
                )}
              </div>
            </div>

            {/* Bottom Actions Drawer Bar */}
            <div className="border-t border-border pt-4 mt-6 flex items-center justify-between gap-3">
              <Button
                variant="secondary"
                size="sm"
                onClick={() => deleteRequest(selectedRequest.id)}
                className="text-signal-red hover:text-signal-red border-signal-red/30 font-mono text-xs"
              >
                <Trash2 size={13} className="mr-1.5" />
                Delete
              </Button>

              <div className="flex items-center gap-2">
                <Button
                  variant="secondary"
                  size="sm"
                  onClick={() => setSelectedRequest(null)}
                  className="font-mono text-xs"
                >
                  Close
                </Button>

                <Button
                  size="sm"
                  onClick={() => convertToProject(selectedRequest.id)}
                  disabled={converting}
                  className="bg-cyan text-slate-950 hover:bg-cyan-soft font-mono text-xs font-semibold"
                >
                  <Briefcase size={14} className="mr-1.5" />
                  {converting ? "Converting..." : "Convert to Client Project"}
                </Button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
