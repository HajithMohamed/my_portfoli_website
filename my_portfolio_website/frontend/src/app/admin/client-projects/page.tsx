"use client";

import { useEffect, useState } from "react";
import {
  Briefcase,
  Calendar,
  Check,
  CheckCircle2,
  Clock,
  ExternalLink,
  FolderPlus,
  Mail,
  Plus,
  RefreshCw,
  Trash2,
  User,
  X,
} from "lucide-react";
import { useSearchParams } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input, Textarea } from "@/components/ui/input";
import { adminFetch } from "@/lib/api";
import type { ClientProject, ClientProjectStatus, MilestoneStatus } from "@/lib/types";
import { cn, formatDate } from "@/lib/utils";

const PROJECT_STATUSES: { key: ClientProjectStatus; label: string; color: string; bg: string; border: string }[] = [
  { key: "ACTIVE", label: "Active", color: "text-cyan", bg: "bg-cyan/10", border: "border-cyan/30" },
  { key: "ON_HOLD", label: "On Hold", color: "text-amber-400", bg: "bg-amber-500/10", border: "border-amber-500/30" },
  { key: "COMPLETED", label: "Completed", color: "text-emerald-400", bg: "bg-emerald-500/10", border: "border-emerald-500/30" },
  { key: "CANCELLED", label: "Cancelled", color: "text-muted-foreground", bg: "bg-surface-2/60", border: "border-border" },
];

export default function AdminClientProjectsPage() {
  const searchParams = useSearchParams();
  const preselectedId = searchParams.get("selected");

  const [projects, setProjects] = useState<ClientProject[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedProject, setSelectedProject] = useState<ClientProject | null>(null);
  const [showCreateModal, setShowCreateModal] = useState(false);

  // New task and milestone inputs
  const [newTaskTitle, setNewTaskTitle] = useState("");
  const [newMilestoneTitle, setNewMilestoneTitle] = useState("");
  const [newMilestoneDate, setNewMilestoneDate] = useState("");

  // Project editing
  const [editingNotes, setEditingNotes] = useState("");
  const [savingNotes, setSavingNotes] = useState(false);

  // New Project Form
  const [newProject, setNewProject] = useState({
    title: "",
    clientName: "",
    clientEmail: "",
    clientCompany: "",
    budget: "",
    description: "",
  });

  async function loadProjects() {
    setLoading(true);
    try {
      const data = await adminFetch<ClientProject[]>("/admin/client-projects");
      setProjects(data);

      if (preselectedId) {
        const found = data.find((p) => p.id === preselectedId);
        if (found) {
          setSelectedProject(found);
          setEditingNotes(found.notes || "");
          return;
        }
      }

      if (selectedProject) {
        const refreshed = data.find((p) => p.id === selectedProject.id);
        if (refreshed) {
          setSelectedProject(refreshed);
          setEditingNotes(refreshed.notes || "");
        }
      } else if (data.length > 0) {
        setSelectedProject(data[0]);
        setEditingNotes(data[0].notes || "");
      }
    } catch (err) {
      console.error("Failed to load client projects:", err);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadProjects();
  }, []);

  async function createProject(e: React.FormEvent) {
    e.preventDefault();
    if (!newProject.title.trim() || !newProject.clientName.trim() || !newProject.clientEmail.trim()) {
      return;
    }
    try {
      const created = await adminFetch<ClientProject>("/admin/client-projects", {
        method: "POST",
        body: JSON.stringify(newProject),
      });
      setShowCreateModal(false);
      setNewProject({
        title: "",
        clientName: "",
        clientEmail: "",
        clientCompany: "",
        budget: "",
        description: "",
      });
      await loadProjects();
      setSelectedProject(created);
      setEditingNotes(created.notes || "");
    } catch (err) {
      alert(err instanceof Error ? err.message : "Failed to create project");
    }
  }

  async function updateProjectStatus(id: string, status: ClientProjectStatus) {
    try {
      await adminFetch(`/admin/client-projects/${id}`, {
        method: "PUT",
        body: JSON.stringify({ status }),
      });
      await loadProjects();
    } catch (err) {
      alert(err instanceof Error ? err.message : "Failed to update project status");
    }
  }

  async function saveNotes(id: string) {
    setSavingNotes(true);
    try {
      await adminFetch(`/admin/client-projects/${id}`, {
        method: "PUT",
        body: JSON.stringify({ notes: editingNotes }),
      });
      await loadProjects();
    } catch (err) {
      alert(err instanceof Error ? err.message : "Failed to save notes");
    } finally {
      setSavingNotes(false);
    }
  }

  async function deleteProject(id: string) {
    if (!confirm("Are you sure you want to permanently delete this project?")) return;
    try {
      await adminFetch(`/admin/client-projects/${id}`, { method: "DELETE" });
      setSelectedProject(null);
      await loadProjects();
    } catch (err) {
      alert(err instanceof Error ? err.message : "Failed to delete project");
    }
  }

  // Task Handlers
  async function addTask(e: React.FormEvent) {
    e.preventDefault();
    if (!selectedProject || !newTaskTitle.trim()) return;
    try {
      await adminFetch(`/admin/client-projects/${selectedProject.id}/tasks`, {
        method: "POST",
        body: JSON.stringify({ title: newTaskTitle }),
      });
      setNewTaskTitle("");
      await loadProjects();
    } catch (err) {
      alert(err instanceof Error ? err.message : "Failed to add task");
    }
  }

  async function toggleTask(taskId: string, completed: boolean) {
    if (!selectedProject) return;
    try {
      await adminFetch(`/admin/client-projects/${selectedProject.id}/tasks/${taskId}`, {
        method: "PATCH",
        body: JSON.stringify({ completed: !completed }),
      });
      await loadProjects();
    } catch (err) {
      alert(err instanceof Error ? err.message : "Failed to update task");
    }
  }

  async function deleteTask(taskId: string) {
    if (!selectedProject) return;
    try {
      await adminFetch(`/admin/client-projects/${selectedProject.id}/tasks/${taskId}`, {
        method: "DELETE",
      });
      await loadProjects();
    } catch (err) {
      alert(err instanceof Error ? err.message : "Failed to delete task");
    }
  }

  // Milestone Handlers
  async function addMilestone(e: React.FormEvent) {
    e.preventDefault();
    if (!selectedProject || !newMilestoneTitle.trim()) return;
    try {
      await adminFetch(`/admin/client-projects/${selectedProject.id}/milestones`, {
        method: "POST",
        body: JSON.stringify({
          title: newMilestoneTitle,
          dueDate: newMilestoneDate ? new Date(newMilestoneDate).toISOString() : undefined,
        }),
      });
      setNewMilestoneTitle("");
      setNewMilestoneDate("");
      await loadProjects();
    } catch (err) {
      alert(err instanceof Error ? err.message : "Failed to add milestone");
    }
  }

  async function toggleMilestone(milestoneId: string, currentStatus: MilestoneStatus) {
    if (!selectedProject) return;
    const nextStatus: MilestoneStatus =
      currentStatus === "COMPLETED" ? "PENDING" : currentStatus === "PENDING" ? "IN_PROGRESS" : "COMPLETED";
    try {
      await adminFetch(`/admin/client-projects/${selectedProject.id}/milestones/${milestoneId}`, {
        method: "PATCH",
        body: JSON.stringify({ status: nextStatus }),
      });
      await loadProjects();
    } catch (err) {
      alert(err instanceof Error ? err.message : "Failed to update milestone");
    }
  }

  async function deleteMilestone(milestoneId: string) {
    if (!selectedProject) return;
    try {
      await adminFetch(`/admin/client-projects/${selectedProject.id}/milestones/${milestoneId}`, {
        method: "DELETE",
      });
      await loadProjects();
    } catch (err) {
      alert(err instanceof Error ? err.message : "Failed to delete milestone");
    }
  }

  // Derived progress
  const totalTasks = selectedProject?.tasks?.length || 0;
  const completedTasks = selectedProject?.tasks?.filter((t) => t.completed).length || 0;
  const taskProgressPct = totalTasks > 0 ? Math.round((completedTasks / totalTasks) * 100) : 0;

  return (
    <div className="space-y-6">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 border-b border-border pb-5">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="font-display text-2xl font-bold tracking-tight text-foreground sm:text-3xl">
              Client Projects
            </h1>
            <span className="font-mono text-xs text-cyan border border-cyan/30 px-2 py-0.5 rounded-full bg-cyan/10">
              {projects.length} engagements
            </span>
          </div>
          <p className="mt-1 font-mono text-xs text-muted-foreground">
            Active client work, milestone tracking, deliverable tasks, and engagement scopes
          </p>
        </div>

        <div className="flex items-center gap-2">
          <Button
            size="sm"
            variant="secondary"
            onClick={loadProjects}
            disabled={loading}
            className="font-mono text-xs"
          >
            <RefreshCw size={13} className={cn("mr-1.5", loading && "animate-spin")} />
            Refresh
          </Button>

          <Button
            size="sm"
            onClick={() => setShowCreateModal(true)}
            className="bg-cyan text-slate-950 hover:bg-cyan-soft font-mono text-xs font-semibold"
          >
            <Plus size={14} className="mr-1.5" />
            New Project
          </Button>
        </div>
      </div>

      {/* Main Two-Column Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Left Column: Projects List */}
        <div className="lg:col-span-4 space-y-3">
          <div className="flex items-center justify-between px-1">
            <span className="font-mono text-xs uppercase tracking-wider text-muted-foreground">
              Projects ({projects.length})
            </span>
          </div>

          <div className="space-y-2.5 max-h-[750px] overflow-y-auto pr-1">
            {projects.map((project) => {
              const currentStatus =
                PROJECT_STATUSES.find((s) => s.key === project.status) || PROJECT_STATUSES[0];
              const isSelected = selectedProject?.id === project.id;
              const pTasks = project.tasks?.length || 0;
              const pDone = project.tasks?.filter((t) => t.completed).length || 0;
              const pPct = pTasks > 0 ? Math.round((pDone / pTasks) * 100) : 0;

              return (
                <div
                  key={project.id}
                  onClick={() => {
                    setSelectedProject(project);
                    setEditingNotes(project.notes || "");
                  }}
                  className={cn(
                    "cursor-pointer rounded-xl border p-4 transition-all hover:border-cyan/40 hover:shadow-md",
                    isSelected
                      ? "border-cyan bg-cyan/10 ring-1 ring-cyan/30"
                      : "border-border/70 bg-surface/50 hover:bg-surface-2"
                  )}
                >
                  <div className="flex items-start justify-between gap-2">
                    <h3 className="font-display font-semibold text-sm text-foreground leading-snug">
                      {project.title}
                    </h3>
                    <span
                      className={cn(
                        "font-mono text-[9px] px-2 py-0.5 rounded-full border shrink-0",
                        currentStatus.bg,
                        currentStatus.color,
                        currentStatus.border
                      )}
                    >
                      {currentStatus.label}
                    </span>
                  </div>

                  <div className="mt-1 text-xs text-muted-foreground">
                    {project.clientName} {project.clientCompany ? `(${project.clientCompany})` : ""}
                  </div>

                  {project.budget && (
                    <div className="mt-2 text-xs font-mono text-emerald-400">
                      Budget: {project.budget}
                    </div>
                  )}

                  {/* Tiny Progress Bar */}
                  <div className="mt-3 space-y-1">
                    <div className="flex justify-between text-[10px] font-mono text-muted-foreground">
                      <span>Tasks: {pDone}/{pTasks}</span>
                      <span>{pPct}%</span>
                    </div>
                    <div className="h-1 w-full bg-surface-2 rounded-full overflow-hidden">
                      <div
                        className="h-full bg-cyan transition-all duration-300"
                        style={{ width: `${pPct}%` }}
                      />
                    </div>
                  </div>
                </div>
              );
            })}

            {projects.length === 0 && !loading && (
              <div className="p-8 text-center rounded-xl border border-dashed border-border text-muted-foreground font-mono text-xs">
                No active client projects. Click &quot;New Project&quot; or convert one from the Requests pipeline.
              </div>
            )}
          </div>
        </div>

        {/* Right Column: Selected Project Detail */}
        <div className="lg:col-span-8">
          {selectedProject ? (
            <div className="space-y-6 rounded-2xl border border-border/80 bg-surface/40 p-6 backdrop-blur-sm">
              {/* Project Header */}
              <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4 border-b border-border/70 pb-5">
                <div>
                  <div className="flex flex-wrap items-center gap-2 mb-2">
                    <span
                      className={cn(
                        "font-mono text-xs px-2.5 py-0.5 rounded-full border font-semibold",
                        PROJECT_STATUSES.find((s) => s.key === selectedProject.status)?.bg,
                        PROJECT_STATUSES.find((s) => s.key === selectedProject.status)?.color,
                        PROJECT_STATUSES.find((s) => s.key === selectedProject.status)?.border
                      )}
                    >
                      {selectedProject.status}
                    </span>
                    {selectedProject.request && (
                      <span className="font-mono text-xs text-cyan border border-cyan/30 px-2 py-0.5 rounded-full bg-cyan/10">
                        Intake Ref: {selectedProject.request.referenceId}
                      </span>
                    )}
                  </div>
                  <h2 className="text-2xl font-bold font-display text-foreground">
                    {selectedProject.title}
                  </h2>
                  <div className="flex flex-wrap items-center gap-3 font-mono text-xs text-muted-foreground mt-2">
                    <span className="flex items-center gap-1">
                      <User size={13} /> {selectedProject.clientName}
                    </span>
                    <span className="flex items-center gap-1">
                      <Mail size={13} /> {selectedProject.clientEmail}
                    </span>
                    {selectedProject.clientCompany && (
                      <span>• {selectedProject.clientCompany}</span>
                    )}
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <select
                    value={selectedProject.status}
                    onChange={(e) =>
                      updateProjectStatus(selectedProject.id, e.target.value as ClientProjectStatus)
                    }
                    className="h-8 rounded-md border border-border bg-surface-2 px-2.5 font-mono text-xs text-foreground"
                  >
                    {PROJECT_STATUSES.map((s) => (
                      <option key={s.key} value={s.key}>
                        {s.label}
                      </option>
                    ))}
                  </select>

                  <Button
                    variant="secondary"
                    size="sm"
                    onClick={() => deleteProject(selectedProject.id)}
                    className="h-8 text-signal-red hover:text-signal-red border-signal-red/30"
                  >
                    <Trash2 size={13} />
                  </Button>
                </div>
              </div>

              {/* Progress & Overview Bar */}
              <div className="rounded-xl border border-border/60 bg-surface-2/40 p-4 space-y-3">
                <div className="flex items-center justify-between font-mono text-xs">
                  <span className="text-muted-foreground uppercase tracking-wider">
                    Task Completion Progress
                  </span>
                  <span className="text-cyan font-bold">{taskProgressPct}% ({completedTasks}/{totalTasks} tasks)</span>
                </div>
                <div className="h-2 w-full bg-surface rounded-full overflow-hidden border border-border/40">
                  <div
                    className="h-full bg-gradient-to-r from-cyan to-emerald-400 transition-all duration-500"
                    style={{ width: `${taskProgressPct}%` }}
                  />
                </div>

                {selectedProject.description && (
                  <p className="text-xs text-foreground/90 leading-relaxed pt-2 border-t border-border/40">
                    {selectedProject.description}
                  </p>
                )}
              </div>

              {/* Milestones Section */}
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <h3 className="font-mono text-xs uppercase tracking-wider text-cyan font-bold">
                    Milestones ({selectedProject.milestones?.length || 0})
                  </h3>
                </div>

                {/* Add Milestone Form */}
                <form onSubmit={addMilestone} className="flex gap-2">
                  <Input
                    placeholder="Milestone title (e.g. Architecture Sign-off, Alpha Release)..."
                    value={newMilestoneTitle}
                    onChange={(e) => setNewMilestoneTitle(e.target.value)}
                    className="font-mono text-xs h-8 flex-1"
                  />
                  <Input
                    type="date"
                    value={newMilestoneDate}
                    onChange={(e) => setNewMilestoneDate(e.target.value)}
                    className="font-mono text-xs h-8 w-40"
                  />
                  <Button type="submit" size="sm" className="h-8 font-mono text-xs">
                    Add
                  </Button>
                </form>

                {/* Milestones List */}
                <div className="space-y-2">
                  {selectedProject.milestones?.map((m) => (
                    <div
                      key={m.id}
                      className="flex items-center justify-between p-3 rounded-lg border border-border/70 bg-surface-2/30"
                    >
                      <div className="flex items-center gap-3">
                        <button
                          type="button"
                          onClick={() => toggleMilestone(m.id, m.status)}
                          className={cn(
                            "h-5 w-5 rounded flex items-center justify-center border transition-colors",
                            m.status === "COMPLETED"
                              ? "bg-emerald-500 border-emerald-500 text-slate-950"
                              : m.status === "IN_PROGRESS"
                              ? "border-cyan text-cyan bg-cyan/20"
                              : "border-border hover:border-muted-foreground"
                          )}
                        >
                          {m.status === "COMPLETED" && <Check size={12} strokeWidth={3} />}
                          {m.status === "IN_PROGRESS" && (
                            <span className="h-2 w-2 rounded-full bg-cyan" />
                          )}
                        </button>
                        <div>
                          <span
                            className={cn(
                              "text-xs font-medium",
                              m.status === "COMPLETED"
                                ? "line-through text-muted-foreground"
                                : "text-foreground"
                            )}
                          >
                            {m.title}
                          </span>
                          {m.dueDate && (
                            <span className="ml-2 font-mono text-[10px] text-muted-foreground">
                              Due: {formatDate(m.dueDate)}
                            </span>
                          )}
                        </div>
                      </div>

                      <div className="flex items-center gap-2">
                        <span
                          className={cn(
                            "font-mono text-[9px] uppercase px-1.5 py-0.5 rounded border",
                            m.status === "COMPLETED"
                              ? "text-emerald-400 border-emerald-500/30 bg-emerald-500/10"
                              : m.status === "IN_PROGRESS"
                              ? "text-cyan border-cyan/30 bg-cyan/10"
                              : "text-muted-foreground border-border"
                          )}
                        >
                          {m.status}
                        </span>
                        <button
                          type="button"
                          onClick={() => deleteMilestone(m.id)}
                          className="text-muted-foreground hover:text-signal-red p-1"
                        >
                          <Trash2 size={12} />
                        </button>
                      </div>
                    </div>
                  ))}

                  {(!selectedProject.milestones || selectedProject.milestones.length === 0) && (
                    <div className="text-[11px] font-mono text-muted-foreground/70 p-3 rounded-lg border border-dashed border-border/60 text-center">
                      No milestones recorded yet. Add your project phases above.
                    </div>
                  )}
                </div>
              </div>

              {/* Tasks Section */}
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <h3 className="font-mono text-xs uppercase tracking-wider text-cyan font-bold">
                    Action Items & Tasks ({completedTasks}/{totalTasks})
                  </h3>
                </div>

                {/* Add Task Form */}
                <form onSubmit={addTask} className="flex gap-2">
                  <Input
                    placeholder="New task item..."
                    value={newTaskTitle}
                    onChange={(e) => setNewTaskTitle(e.target.value)}
                    className="font-mono text-xs h-8 flex-1"
                  />
                  <Button type="submit" size="sm" className="h-8 font-mono text-xs">
                    Add Task
                  </Button>
                </form>

                {/* Task List */}
                <div className="space-y-1.5">
                  {selectedProject.tasks?.map((task) => (
                    <div
                      key={task.id}
                      className="flex items-center justify-between px-3 py-2 rounded-md border border-border/50 bg-surface-2/20 hover:bg-surface-2/40"
                    >
                      <label className="flex items-center gap-2.5 cursor-pointer flex-1">
                        <input
                          type="checkbox"
                          checked={task.completed}
                          onChange={() => toggleTask(task.id, task.completed)}
                          className="h-4 w-4 rounded border-border bg-surface text-cyan focus:ring-0 cursor-pointer"
                        />
                        <span
                          className={cn(
                            "text-xs font-mono",
                            task.completed ? "line-through text-muted-foreground" : "text-foreground"
                          )}
                        >
                          {task.title}
                        </span>
                      </label>
                      <button
                        type="button"
                        onClick={() => deleteTask(task.id)}
                        className="text-muted-foreground hover:text-signal-red p-1"
                      >
                        <Trash2 size={12} />
                      </button>
                    </div>
                  ))}

                  {(!selectedProject.tasks || selectedProject.tasks.length === 0) && (
                    <div className="text-[11px] font-mono text-muted-foreground/70 p-3 rounded-lg border border-dashed border-border/60 text-center">
                      No tasks added yet. Breakdown requirements into actionable items.
                    </div>
                  )}
                </div>
              </div>

              {/* Notes Section */}
              <div className="space-y-2 pt-2 border-t border-border/60">
                <div className="flex items-center justify-between">
                  <h3 className="font-mono text-xs uppercase tracking-wider text-amber-400 font-bold">
                    Engagement Notes & Changelog
                  </h3>
                  <Button
                    size="sm"
                    variant="secondary"
                    onClick={() => saveNotes(selectedProject.id)}
                    disabled={savingNotes}
                    className="font-mono text-xs h-7"
                  >
                    {savingNotes ? "Saving..." : "Save Notes"}
                  </Button>
                </div>
                <Textarea
                  placeholder="Record client communications, decisions, links to Figma/staging, or meeting notes..."
                  value={editingNotes}
                  onChange={(e) => setEditingNotes(e.target.value)}
                  rows={4}
                  className="font-mono text-xs"
                />
              </div>
            </div>
          ) : (
            <div className="p-16 text-center rounded-2xl border border-dashed border-border text-muted-foreground font-mono text-xs">
              Select a project from the left or create a new one to view details.
            </div>
          )}
        </div>
      </div>

      {/* New Project Modal */}
      {showCreateModal && (
        <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="w-full max-w-lg bg-surface border border-border rounded-2xl p-6 space-y-4 shadow-2xl">
            <div className="flex items-center justify-between border-b border-border pb-3">
              <h2 className="font-display font-semibold text-lg text-foreground">
                Create New Client Project
              </h2>
              <button
                type="button"
                onClick={() => setShowCreateModal(false)}
                className="p-1 rounded-md text-muted-foreground hover:text-foreground"
              >
                <X size={18} />
              </button>
            </div>

            <form onSubmit={createProject} className="space-y-3 font-mono text-xs">
              <div>
                <label className="block text-muted-foreground mb-1">Project Title *</label>
                <Input
                  required
                  placeholder="e.g. Next-Gen Mobile E-Commerce"
                  value={newProject.title}
                  onChange={(e) => setNewProject({ ...newProject, title: e.target.value })}
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-muted-foreground mb-1">Client Name *</label>
                  <Input
                    required
                    placeholder="e.g. Alex Morgan"
                    value={newProject.clientName}
                    onChange={(e) => setNewProject({ ...newProject, clientName: e.target.value })}
                  />
                </div>
                <div>
                  <label className="block text-muted-foreground mb-1">Client Email *</label>
                  <Input
                    required
                    type="email"
                    placeholder="e.g. alex@company.com"
                    value={newProject.clientEmail}
                    onChange={(e) => setNewProject({ ...newProject, clientEmail: e.target.value })}
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-muted-foreground mb-1">Company (Optional)</label>
                  <Input
                    placeholder="e.g. Nova Retail Ltd"
                    value={newProject.clientCompany}
                    onChange={(e) => setNewProject({ ...newProject, clientCompany: e.target.value })}
                  />
                </div>
                <div>
                  <label className="block text-muted-foreground mb-1">Budget (Optional)</label>
                  <Input
                    placeholder="e.g. $5,000 - $10,000"
                    value={newProject.budget}
                    onChange={(e) => setNewProject({ ...newProject, budget: e.target.value })}
                  />
                </div>
              </div>

              <div>
                <label className="block text-muted-foreground mb-1">Scope / Description</label>
                <Textarea
                  placeholder="Summary of project goals and deliverables..."
                  value={newProject.description}
                  onChange={(e) => setNewProject({ ...newProject, description: e.target.value })}
                  rows={3}
                />
              </div>

              <div className="flex items-center justify-end gap-2 pt-3 border-t border-border">
                <Button
                  type="button"
                  variant="secondary"
                  onClick={() => setShowCreateModal(false)}
                >
                  Cancel
                </Button>
                <Button
                  type="submit"
                  className="bg-cyan text-slate-950 hover:bg-cyan-soft font-semibold"
                >
                  Create Project
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
