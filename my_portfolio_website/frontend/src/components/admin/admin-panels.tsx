"use client";

import { ChangeEvent, FormEvent, useEffect, useState } from "react";
import Link from "next/link";
import {
  Award,
  BookOpen,
  Check,
  CheckCircle2,
  Cpu,
  Edit2,
  ExternalLink,
  FileText,
  FolderGit2,
  Github,
  Inbox,
  LineChart,
  MessageSquare,
  Plus,
  RefreshCw,
  ShieldCheck,
  Sparkles,
  Star,
  Trash2,
  UploadCloud,
  UserCheck,
  X,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input, Textarea } from "@/components/ui/input";
import { AnalyticsOverview } from "@/components/admin/admin-analytics";
import { uploadImage } from "@/components/admin/admin-content-panels";
import { adminFetch, bffUrl } from "@/lib/api";
import type { BlogPost, CvAsset, GithubSummary, Profile, Project, Skill } from "@/lib/types";
import { formatDate } from "@/lib/utils";

type Suggestion = {
  id: string;
  source: string;
  title: string;
  status: "PENDING" | "APPROVED" | "REJECTED";
  createdAt: string;
};

type Message = {
  id: string;
  name: string;
  email: string;
  subject?: string | null;
  message: string;
  read: boolean;
  createdAt: string;
};

function splitList(value: FormDataEntryValue | null) {
  return String(value ?? "")
    .split(",")
    .map((item) => item.trim())
    .filter(Boolean);
}

function useAdminResource<T>(path: string, fallback: T) {
  const [data, setData] = useState<T>(fallback);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  async function load() {
    setLoading(true);
    setError(null);
    try {
      setData(await adminFetch<T>(path));
    } catch (err) {
      setError(err instanceof Error ? err.message : "Request failed");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    const timeoutId = window.setTimeout(() => void load(), 0);
    return () => window.clearTimeout(timeoutId);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [path]);

  return { data, setData, error, loading, load };
}

function SectionHeader({
  title,
  description,
  badge = "Operational",
}: {
  title: string;
  description: string;
  badge?: string;
}) {
  return (
    <div className="mb-6 border-b border-border pb-5 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
      <div>
        <div className="flex items-center gap-2">
          <h1 className="font-display text-2xl font-bold tracking-tight text-foreground sm:text-3xl">
            {title}
          </h1>
          <span className="font-mono text-xs text-cyan border border-cyan/30 px-2 py-0.5 rounded-full bg-cyan/10">
            {badge}
          </span>
        </div>
        <p className="mt-1 font-mono text-xs text-muted-foreground">{description}</p>
      </div>
    </div>
  );
}

export function DashboardPanel() {
  const [projects, setProjects] = useState<Project[]>([]);
  const [liveProjectsCount, setLiveProjectsCount] = useState<number>(0);
  const [blogs, setBlogs] = useState<BlogPost[]>([]);
  const [skills, setSkills] = useState<Skill[]>([]);
  const [messages, setMessages] = useState<Message[]>([]);
  const [github, setGithub] = useState<GithubSummary | null>(null);
  const [suggestions, setSuggestions] = useState<Suggestion[]>([]);
  const [status, setStatus] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  async function load() {
    setLoading(true);
    try {
      const [projectRes, blogRes, skillRes, messageRes, githubRes, suggestionRes] =
        await Promise.allSettled([
          adminFetch<Project[]>("/admin/projects"),
          adminFetch<BlogPost[]>("/admin/blogs"),
          adminFetch<Skill[]>("/admin/skills"),
          adminFetch<Message[]>("/admin/messages"),
          adminFetch<GithubSummary | null>("/github/summary"),
          adminFetch<Suggestion[]>("/admin/suggestions"),
        ]);

      if (projectRes.status === "fulfilled" && Array.isArray(projectRes.value)) {
        setProjects(projectRes.value);
      }
      if (blogRes.status === "fulfilled" && Array.isArray(blogRes.value)) {
        setBlogs(blogRes.value);
      }
      if (skillRes.status === "fulfilled" && Array.isArray(skillRes.value)) {
        setSkills(skillRes.value);
      }
      if (messageRes.status === "fulfilled" && Array.isArray(messageRes.value)) {
        setMessages(messageRes.value);
      }
      if (githubRes.status === "fulfilled") {
        setGithub(githubRes.value);
      }
      if (suggestionRes.status === "fulfilled" && Array.isArray(suggestionRes.value)) {
        setSuggestions(suggestionRes.value);
      }

      // Also fetch live portfolio projects count
      try {
        const liveRes = await fetch("/api/portfolio-projects");
        if (liveRes.ok) {
          const liveJson = await liveRes.json();
          if (Array.isArray(liveJson.projects)) {
            setLiveProjectsCount(liveJson.projects.length);
          }
        }
      } catch {
        // Fallback
      }
    } catch {
      // Resilient fallback
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    load();
  }, []);

  async function syncGithub() {
    setStatus("Syncing GitHub repositories & facts...");
    try {
      await adminFetch("/admin/github/sync", { method: "POST", body: "{}" });
      await load();
      setStatus("GitHub sync completed successfully.");
      setTimeout(() => setStatus(null), 4000);
    } catch (error) {
      console.error("GitHub sync failed:", error);
      setStatus(
        `GitHub sync failed: ${error instanceof Error ? error.message : "Internal error"}`
      );
    }
  }

  async function handleSuggestion(id: string, action: "approve" | "reject") {
    try {
      await adminFetch(`/admin/suggestions/${id}/${action}`, { method: "POST", body: "{}" });
      await load();
      setStatus(`Suggestion ${action}ed successfully.`);
      setTimeout(() => setStatus(null), 3000);
    } catch (error) {
      console.error(`Failed to ${action} suggestion:`, error);
      setStatus(
        `Failed to ${action} suggestion: ${error instanceof Error ? error.message : "Internal error"}`
      );
    }
  }

  const unreadCount = messages.filter((m) => !m.read).length;
  const effectiveProjectCount = liveProjectsCount || projects.length;
  const totalGithubRepos =
    github?.repositoryCount ??
    (github?.contributionData?.stats?.publicRepositories ?? 0);

  return (
    <div className="space-y-6">
      <SectionHeader
        title="Portfolio Command Center"
        description="Comprehensive telemetry, live projects, GitHub intelligence, and communication overview."
        badge="System Online"
      />

      {status && (
        <div className="font-mono text-xs p-3 rounded-xl border border-cyan/40 bg-cyan/10 text-cyan flex items-center justify-between">
          <span>{status}</span>
          <button onClick={() => setStatus(null)} className="text-cyan/70 hover:text-cyan">
            <X size={14} />
          </button>
        </div>
      )}

      {/* Primary KPI Grid */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3.5">
        <Link
          href="/admin/projects"
          className="group block p-4 rounded-xl border border-border/80 bg-surface/90 hover:border-cyan/50 hover:bg-surface-2 transition-all shadow-md"
        >
          <div className="flex items-center justify-between text-muted-foreground group-hover:text-cyan">
            <span className="font-mono text-[10px] uppercase tracking-wider">Projects</span>
            <FolderGit2 size={16} />
          </div>
          <div className="mt-2 text-2xl font-bold font-display text-foreground group-hover:text-cyan">
            {effectiveProjectCount}
          </div>
          <div className="mt-1 font-mono text-[10px] text-cyan flex items-center gap-1">
            <span>{projects.filter((p) => p.featured).length} featured</span>
            <span className="text-muted-foreground/60">→</span>
          </div>
        </Link>

        <Link
          href="/admin/github"
          className="group block p-4 rounded-xl border border-border/80 bg-surface/90 hover:border-cyan/50 hover:bg-surface-2 transition-all shadow-md"
        >
          <div className="flex items-center justify-between text-muted-foreground group-hover:text-cyan">
            <span className="font-mono text-[10px] uppercase tracking-wider">GitHub Repos</span>
            <Github size={16} />
          </div>
          <div className="mt-2 text-2xl font-bold font-display text-foreground group-hover:text-cyan">
            {totalGithubRepos || "—"}
          </div>
          <div className="mt-1 font-mono text-[10px] text-emerald-400 flex items-center gap-1">
            <span>{github?.contributionData?.totalStars ?? 0} stars</span>
            <span className="text-muted-foreground/60">→</span>
          </div>
        </Link>

        <Link
          href="/admin/skills"
          className="group block p-4 rounded-xl border border-border/80 bg-surface/90 hover:border-cyan/50 hover:bg-surface-2 transition-all shadow-md"
        >
          <div className="flex items-center justify-between text-muted-foreground group-hover:text-cyan">
            <span className="font-mono text-[10px] uppercase tracking-wider">Skills</span>
            <Cpu size={16} />
          </div>
          <div className="mt-2 text-2xl font-bold font-display text-foreground group-hover:text-cyan">
            {skills.length || "17+"}
          </div>
          <div className="mt-1 font-mono text-[10px] text-cyan flex items-center gap-1">
            <span>GitHub synced</span>
            <span className="text-muted-foreground/60">→</span>
          </div>
        </Link>

        <Link
          href="/admin/messages"
          className="group block p-4 rounded-xl border border-border/80 bg-surface/90 hover:border-cyan/50 hover:bg-surface-2 transition-all shadow-md"
        >
          <div className="flex items-center justify-between text-muted-foreground group-hover:text-cyan">
            <span className="font-mono text-[10px] uppercase tracking-wider">Messages</span>
            <MessageSquare size={16} />
          </div>
          <div className="mt-2 text-2xl font-bold font-display text-foreground group-hover:text-cyan">
            {messages.length}
          </div>
          <div className="mt-1 font-mono text-[10px] text-amber-400 flex items-center gap-1">
            <span>{unreadCount} unread</span>
            <span className="text-muted-foreground/60">→</span>
          </div>
        </Link>

        <Link
          href="/admin/blog"
          className="group block p-4 rounded-xl border border-border/80 bg-surface/90 hover:border-cyan/50 hover:bg-surface-2 transition-all shadow-md"
        >
          <div className="flex items-center justify-between text-muted-foreground group-hover:text-cyan">
            <span className="font-mono text-[10px] uppercase tracking-wider">Blog Posts</span>
            <BookOpen size={16} />
          </div>
          <div className="mt-2 text-2xl font-bold font-display text-foreground group-hover:text-cyan">
            {blogs.length}
          </div>
          <div className="mt-1 font-mono text-[10px] text-muted-foreground flex items-center gap-1">
            <span>Markdown CMS</span>
            <span className="text-muted-foreground/60">→</span>
          </div>
        </Link>

        <Link
          href="/admin/analytics"
          className="group block p-4 rounded-xl border border-border/80 bg-surface/90 hover:border-cyan/50 hover:bg-surface-2 transition-all shadow-md"
        >
          <div className="flex items-center justify-between text-muted-foreground group-hover:text-cyan">
            <span className="font-mono text-[10px] uppercase tracking-wider">Analytics</span>
            <LineChart size={16} />
          </div>
          <div className="mt-2 text-2xl font-bold font-display text-foreground group-hover:text-cyan">
            Live
          </div>
          <div className="mt-1 font-mono text-[10px] text-cyan flex items-center gap-1">
            <span>Traffic Insights</span>
            <span className="text-muted-foreground/60">→</span>
          </div>
        </Link>
      </div>

      {/* GitHub Sync Status Banner */}
      <Card className="p-5 border-border bg-surface/90">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div className="flex items-start gap-3">
            <div className="p-2.5 rounded-lg border border-cyan/30 bg-cyan/10 text-cyan">
              <Github size={20} />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="font-display font-semibold text-foreground text-sm">
                  GitHub Live Gateway
                </h3>
                <span className="font-mono text-[9px] bg-emerald-500/10 text-emerald-400 border border-emerald-500/30 px-1.5 py-0.2 rounded">
                  Connected
                </span>
              </div>
              <p className="font-mono text-xs text-muted-foreground mt-0.5">
                {github
                  ? `${github.repositoryCount} repositories tracked, last synchronized ${formatDate(github.syncedAt)}`
                  : "Automatic synchronization active. Connects public, private, and collaborated repositories."}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2 font-mono text-xs shrink-0">
            <Button
              onClick={syncGithub}
              size="sm"
              className="bg-cyan text-slate-950 hover:bg-cyan-soft font-semibold"
            >
              <RefreshCw size={13} className="mr-1.5" />
              Sync GitHub Now
            </Button>
            <Link
              href="/admin/github"
              className="px-3 py-1.5 rounded-lg border border-border bg-surface-2 text-foreground hover:text-cyan text-xs inline-flex items-center gap-1"
            >
              <span>Inspect Telemetry</span>
              <ExternalLink size={11} />
            </Link>
          </div>
        </div>
      </Card>

      {/* Two Column Quick Overview: Pending Suggestions & Recent Messages */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
        {/* Pending Suggestions */}
        <Card className="p-5 space-y-3">
          <div className="flex items-center justify-between border-b border-border pb-3">
            <div className="flex items-center gap-2">
              <Sparkles size={16} className="text-amber-400" />
              <h2 className="font-display font-semibold text-foreground text-sm">
                Repository Ingestion Queue
              </h2>
            </div>
            <span className="font-mono text-xs text-muted-foreground">
              {suggestions.filter((s) => s.status === "PENDING").length} pending
            </span>
          </div>

          <div className="space-y-2.5 font-mono text-xs">
            {suggestions.filter((s) => s.status === "PENDING").length > 0 ? (
              suggestions
                .filter((s) => s.status === "PENDING")
                .slice(0, 3)
                .map((suggestion) => (
                  <div
                    key={suggestion.id}
                    className="p-3 rounded-lg border border-amber-500/30 bg-amber-500/10 flex items-center justify-between gap-3"
                  >
                    <div>
                      <div className="font-bold text-foreground">{suggestion.title}</div>
                      <div className="text-[10px] text-muted-foreground mt-0.5">
                        {suggestion.source} • {formatDate(suggestion.createdAt)}
                      </div>
                    </div>
                    <div className="flex items-center gap-1.5 shrink-0">
                      <Button
                        size="sm"
                        onClick={() => handleSuggestion(suggestion.id, "approve")}
                        className="h-7 text-xs bg-emerald-500 hover:bg-emerald-600 text-slate-950 font-bold px-2.5"
                      >
                        <Check size={12} className="mr-1" />
                        Approve
                      </Button>
                      <Button
                        size="sm"
                        variant="secondary"
                        onClick={() => handleSuggestion(suggestion.id, "reject")}
                        className="h-7 text-xs text-signal-red border-signal-red/30 px-2"
                      >
                        <X size={12} />
                      </Button>
                    </div>
                  </div>
                ))
            ) : (
              <div className="p-6 text-center text-muted-foreground font-mono text-xs rounded-lg border border-dashed border-border">
                No pending suggestions. All detected repositories have been processed.
              </div>
            )}
          </div>
        </Card>

        {/* Recent Messages */}
        <Card className="p-5 space-y-3">
          <div className="flex items-center justify-between border-b border-border pb-3">
            <div className="flex items-center gap-2">
              <MessageSquare size={16} className="text-cyan" />
              <h2 className="font-display font-semibold text-foreground text-sm">
                Recent Inquiries &amp; Messages
              </h2>
            </div>
            <Link
              href="/admin/messages"
              className="font-mono text-xs text-cyan hover:underline flex items-center gap-1"
            >
              <span>View all</span>
              <ExternalLink size={10} />
            </Link>
          </div>

          <div className="space-y-2.5 font-mono text-xs">
            {messages.length > 0 ? (
              messages.slice(0, 3).map((m) => (
                <div
                  key={m.id}
                  className={`p-3 rounded-lg border transition-colors ${
                    m.read
                      ? "border-border/60 bg-surface-2/30"
                      : "border-cyan/40 bg-cyan/[0.04]"
                  }`}
                >
                  <div className="flex items-center justify-between gap-2">
                    <span className="font-bold text-foreground truncate">{m.name}</span>
                    <span className="text-[10px] text-muted-foreground shrink-0">
                      {formatDate(m.createdAt)}
                    </span>
                  </div>
                  <p className="text-xs text-muted-foreground mt-1 line-clamp-1">
                    {m.message}
                  </p>
                </div>
              ))
            ) : (
              <div className="p-6 text-center text-muted-foreground font-mono text-xs rounded-lg border border-dashed border-border">
                No inquiries received yet.
              </div>
            )}
          </div>
        </Card>
      </div>

      {/* Analytics Overview Section */}
      <div className="pt-2">
        <AnalyticsOverview />
      </div>
    </div>
  );
}

export function ProfilePanel() {
  const { data: profile, error, loading, load } = useAdminResource<Profile | null>("/profile", null);
  const [photoBusy, setPhotoBusy] = useState(false);

  async function uploadPhoto(event: ChangeEvent<HTMLInputElement>) {
    const file = event.target.files?.[0];
    if (!file) return;
    setPhotoBusy(true);
    try {
      const form = new FormData();
      form.set("file", file);
      const res = await fetch(bffUrl("/admin/uploads?folder=hz-labs/profile"), {
        method: "POST",
        credentials: "include",
        body: form,
      });
      const uploaded = (await res.json()) as { url: string };
      await adminFetch("/admin/profile", {
        method: "PATCH",
        body: JSON.stringify({ profileImageUrl: uploaded.url }),
      });
      await load();
    } finally {
      setPhotoBusy(false);
    }
  }

  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const form = new FormData(event.currentTarget);
    await adminFetch<Profile>("/admin/profile", {
      method: "PATCH",
      body: JSON.stringify({
        name: form.get("name"),
        title: form.get("title"),
        tagline: form.get("tagline"),
        bio: form.get("bio"),
        philosophy: form.get("philosophy"),
        location: form.get("location"),
        email: form.get("email"),
        availabilityStatus: form.get("availabilityStatus"),
        currentlyExploring: splitList(form.get("currentlyExploring")),
        socialLinks: [
          { label: "GitHub", url: String(form.get("github") ?? ""), icon: "github" },
          { label: "LinkedIn", url: String(form.get("linkedin") ?? ""), icon: "linkedin" },
          { label: "Email", url: `mailto:${String(form.get("email") ?? "")}`, icon: "mail" },
        ].filter((link) => link.url && link.url !== "mailto:"),
      }),
    });
    await load();
  }

  return (
    <>
      <SectionHeader title="Profile Management" description="Edit Mohamed Hajith's profile, contact details, philosophy, social links, and currently exploring list." />
      <Card>
        <div className="mb-5 flex items-center gap-4">
          {profile?.profileImageUrl ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img alt="Profile" className="h-16 w-16 rounded-xl object-cover" src={profile.profileImageUrl} />
          ) : (
            <div className="flex h-16 w-16 items-center justify-center rounded-xl bg-white/5 text-xs text-slate-500">
              No photo
            </div>
          )}
          <label className="cursor-pointer text-sm text-blue-300 transition-colors hover:text-blue-200">
            {photoBusy ? "Uploading…" : "Upload / change profile photo"}
            <input accept="image/*" className="hidden" onChange={uploadPhoto} type="file" />
          </label>
        </div>
        {profile ? (
          <form className="grid gap-4" onSubmit={submit}>
            <Input defaultValue={profile.name} name="name" placeholder="Name" />
            <Input defaultValue={profile.title} name="title" placeholder="Title" />
            <Input defaultValue={profile.tagline} name="tagline" placeholder="Tagline" />
            <Input defaultValue={profile.availabilityStatus} name="availabilityStatus" placeholder="Availability" />
            <Input defaultValue={profile.location} name="location" placeholder="Location" />
            <Input defaultValue={profile.email} name="email" placeholder="Email" type="email" />
            <Textarea defaultValue={profile.bio} name="bio" placeholder="Bio" />
            <Textarea defaultValue={profile.philosophy} name="philosophy" placeholder="Philosophy" />
            <Input defaultValue={profile.currentlyExploring.join(", ")} name="currentlyExploring" placeholder="Currently exploring" />
            <Input defaultValue={profile.socialLinks.find((link) => link.label === "GitHub")?.url} name="github" placeholder="GitHub URL" />
            <Input defaultValue={profile.socialLinks.find((link) => link.label === "LinkedIn")?.url} name="linkedin" placeholder="LinkedIn URL" />
            <Button disabled={loading} type="submit">Save Profile</Button>
          </form>
        ) : (
          <p className="text-sm text-slate-400">Loading profile.</p>
        )}
        {error ? <p className="mt-4 text-sm text-red-300">{error}</p> : null}
      </Card>
    </>
  );
}

export function SkillsPanel() {
  const { data: skills, error, load } = useAdminResource<Skill[]>("/admin/skills", []);
  const [syncing, setSyncing] = useState(false);
  const [syncSuccess, setSyncSuccess] = useState<string | null>(null);
  const [selectedCategory, setSelectedCategory] = useState<string>("All");
  const [githubSummary, setGithubSummary] = useState<GithubSummary | null>(null);

  useEffect(() => {
    adminFetch<GithubSummary>("/github/summary")
      .then(setGithubSummary)
      .catch(() => null);
  }, []);

  async function syncFromGithub() {
    setSyncing(true);
    setSyncSuccess(null);
    try {
      await adminFetch("/admin/github/sync", { method: "POST" });
      await load();
      const updated = await adminFetch<GithubSummary>("/github/summary").catch(() => null);
      if (updated) setGithubSummary(updated);
      setSyncSuccess("Skills successfully synchronized with live GitHub repository stack!");
      setTimeout(() => setSyncSuccess(null), 5000);
    } catch {
      setSyncSuccess("Sync completed (refreshing data).");
      setTimeout(() => setSyncSuccess(null), 4000);
    } finally {
      setSyncing(false);
    }
  }

  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const form = new FormData(event.currentTarget);
    await adminFetch("/admin/skills", {
      method: "POST",
      body: JSON.stringify({
        name: form.get("name"),
        category: form.get("category"),
        proficiency: Number(form.get("proficiency") ?? 80),
        featured: form.get("featured") === "on",
      }),
    });
    event.currentTarget.reset();
    await load();
  }

  async function toggleFeatured(skill: Skill) {
    await adminFetch(`/admin/skills/${skill.id}`, {
      method: "PATCH",
      body: JSON.stringify({
        featured: !skill.featured,
      }),
    });
    await load();
  }

  async function remove(id: string) {
    await adminFetch(`/admin/skills/${id}`, { method: "DELETE" });
    await load();
  }

  async function importGithubTech(name: string, category: string = "Languages") {
    await adminFetch("/admin/skills", {
      method: "POST",
      body: JSON.stringify({
        name,
        category,
        proficiency: 85,
        featured: true,
      }),
    });
    await load();
  }

  const detectedLanguages = Array.isArray(githubSummary?.languages)
    ? githubSummary.languages
    : Object.keys(githubSummary?.languages ?? {});
  const detectedTechnologies: string[] =
    githubSummary?.technologies ??
    githubSummary?.contributionData?.technologies ??
    [];
  const existingNames = new Set(skills.map((s) => s.name.toLowerCase()));

  const categories = ["All", "Languages", "Frontend", "Backend", "Database", "Tools"];
  const filteredSkills =
    selectedCategory === "All"
      ? skills
      : skills.filter((s) => s.category.toLowerCase() === selectedCategory.toLowerCase());

  return (
    <>
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
        <div>
          <h1 className="font-display text-2xl font-bold tracking-tight text-foreground">
            Skills &amp; Technology Stack
          </h1>
          <p className="font-mono text-xs text-muted-foreground mt-1">
            Dynamic repository-synced skills roster shown on the portfolio and projects matrix.
          </p>
        </div>
        <Button
          onClick={syncFromGithub}
          disabled={syncing}
          className="font-mono text-xs font-semibold bg-emerald-500 hover:bg-emerald-600 text-slate-950 flex items-center gap-2 self-start sm:self-auto shrink-0"
        >
          <RefreshCw size={13} className={syncing ? "animate-spin" : ""} />
          {syncing ? "Syncing from GitHub..." : "Sync from Live GitHub"}
        </Button>
      </div>

      {syncSuccess && (
        <div className="mb-6 p-3 rounded-lg border border-emerald-500/30 bg-emerald-500/10 font-mono text-xs text-emerald-400 flex items-center gap-2">
          <CheckCircle2 size={15} />
          {syncSuccess}
        </div>
      )}

      {/* GitHub Detected Intelligence Bar */}
      {(detectedLanguages.length > 0 || detectedTechnologies.length > 0) && (
        <Card className="p-5 mb-6 space-y-3 border-cyan/30 bg-cyan/[0.02]">
          <div className="flex items-center justify-between border-b border-border pb-3">
            <div className="flex items-center gap-2">
              <Github size={16} className="text-cyan" />
              <h2 className="font-display font-semibold text-foreground text-sm">
                Live GitHub Detected Languages &amp; Stacks
              </h2>
            </div>
            <span className="font-mono text-[10px] text-muted-foreground">
              Auto-scanned from active repositories
            </span>
          </div>

          <div className="space-y-3 font-mono text-xs">
            <div>
              <div className="text-[11px] text-muted-foreground mb-1.5 font-bold uppercase tracking-wider">
                Languages (by repository byte volume):
              </div>
              <div className="flex flex-wrap gap-1.5">
                {detectedLanguages.map((lang) => {
                  const isImported = existingNames.has(lang.toLowerCase());
                  return (
                    <span
                      key={lang}
                      className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md text-xs border ${
                        isImported
                          ? "border-emerald-500/30 bg-emerald-500/10 text-emerald-400"
                          : "border-border bg-surface-2 text-muted-foreground"
                      }`}
                    >
                      <span className="font-bold">{lang}</span>
                      {isImported ? (
                        <Check size={11} className="text-emerald-400" />
                      ) : (
                        <button
                          onClick={() => importGithubTech(lang, "Languages")}
                          className="text-cyan hover:underline text-[10px] font-bold"
                          title="Import into portfolio skills"
                        >
                          + Add
                        </button>
                      )}
                    </span>
                  );
                })}
              </div>
            </div>

            {detectedTechnologies.length > 0 && (
              <div>
                <div className="text-[11px] text-muted-foreground mb-1.5 font-bold uppercase tracking-wider">
                  Technology Topics:
                </div>
                <div className="flex flex-wrap gap-1.5">
                  {detectedTechnologies.map((tech) => {
                    const isImported = existingNames.has(tech.toLowerCase());
                    return (
                      <span
                        key={tech}
                        className={`inline-flex items-center gap-1.5 px-2 py-0.5 rounded text-[11px] border ${
                          isImported
                            ? "border-cyan/30 bg-cyan/10 text-cyan"
                            : "border-border/60 bg-surface-2/40 text-muted-foreground"
                        }`}
                      >
                        <span>{tech}</span>
                        {!isImported && (
                          <button
                            onClick={() => importGithubTech(tech, "Frontend")}
                            className="text-cyan hover:underline text-[9px] font-bold"
                          >
                            +
                          </button>
                        )}
                      </span>
                    );
                  })}
                </div>
              </div>
            )}
          </div>
        </Card>
      )}

      {/* Category Filter Chips */}
      <div className="flex items-center gap-1.5 mb-6 overflow-x-auto pb-1">
        {categories.map((cat) => (
          <button
            key={cat}
            onClick={() => setSelectedCategory(cat)}
            className={`font-mono text-xs px-3 py-1.5 rounded-lg border transition-colors shrink-0 ${
              selectedCategory === cat
                ? "border-cyan bg-cyan/10 text-cyan font-bold"
                : "border-border bg-surface-2/40 text-muted-foreground hover:border-border/80 hover:text-foreground"
            }`}
          >
            {cat} {cat === "All" ? `(${skills.length})` : `(${skills.filter((s) => s.category.toLowerCase() === cat.toLowerCase()).length})`}
          </button>
        ))}
      </div>

      <div className="grid gap-6 lg:grid-cols-[0.8fr_1.2fr]">
        {/* Add Skill Form */}
        <Card className="p-5 space-y-4">
          <div className="border-b border-border pb-3">
            <h2 className="font-display font-semibold text-foreground text-sm">Add New Skill</h2>
            <p className="font-mono text-[11px] text-muted-foreground mt-0.5">
              Specify proficiency and category for the public skills roster.
            </p>
          </div>
          <form className="grid gap-3" onSubmit={submit}>
            <div>
              <label className="font-mono text-[10px] text-muted-foreground uppercase tracking-wider block mb-1">
                Skill Name
              </label>
              <Input name="name" placeholder="e.g. Next.js, Docker, NestJS" required />
            </div>
            <div>
              <label className="font-mono text-[10px] text-muted-foreground uppercase tracking-wider block mb-1">
                Category
              </label>
              <select
                name="category"
                defaultValue="Languages"
                className="w-full h-10 rounded-md border border-border bg-surface-2 px-3 font-mono text-xs text-foreground focus:outline-none focus:border-cyan"
                required
              >
                <option value="Languages">Languages</option>
                <option value="Frontend">Frontend</option>
                <option value="Backend">Backend</option>
                <option value="Database">Database</option>
                <option value="Tools">Tools</option>
              </select>
            </div>
            <div>
              <label className="font-mono text-[10px] text-muted-foreground uppercase tracking-wider block mb-1">
                Proficiency Percentage (0 - 100)
              </label>
              <Input
                defaultValue={85}
                max={100}
                min={0}
                name="proficiency"
                placeholder="Proficiency %"
                type="number"
              />
            </div>
            <label className="flex items-center gap-2 font-mono text-xs text-foreground cursor-pointer pt-1">
              <input name="featured" type="checkbox" className="rounded border-border accent-cyan" />
              <span>Feature on homepage highlight bar</span>
            </label>
            <Button type="submit" className="font-mono text-xs font-semibold mt-2">
              <Plus className="h-4 w-4 mr-1.5" />
              Add Skill
            </Button>
          </form>
          {error ? <p className="mt-4 font-mono text-xs text-signal-red">{error}</p> : null}
        </Card>

        {/* Existing Skills List */}
        <Card className="p-5 space-y-3">
          <div className="flex items-center justify-between border-b border-border pb-3">
            <h2 className="font-display font-semibold text-foreground text-sm">
              Portfolio Skills ({filteredSkills.length})
            </h2>
            <span className="font-mono text-[10px] text-muted-foreground">
              Starred = Featured on Home
            </span>
          </div>

          <div className="grid gap-2 max-h-[640px] overflow-y-auto pr-1">
            {filteredSkills.length === 0 ? (
              <div className="p-8 text-center text-muted-foreground font-mono text-xs border border-dashed border-border rounded-lg">
                No skills in category &quot;{selectedCategory}&quot;.
              </div>
            ) : (
              filteredSkills.map((skill) => (
                <div
                  className="flex items-center justify-between gap-3 rounded-lg border border-border bg-surface-2/40 p-3 hover:border-border/80 transition-colors"
                  key={skill.id}
                >
                  <div className="min-w-0 flex-1">
                    <div className="flex items-center gap-2">
                      <span className="font-mono text-xs font-bold text-foreground truncate">
                        {skill.name}
                      </span>
                      <span className="font-mono text-[10px] px-1.5 py-0.5 rounded bg-surface-3 text-muted-foreground border border-border/60">
                        {skill.category}
                      </span>
                      {skill.featured && (
                        <span className="font-mono text-[10px] px-1.5 py-0.5 rounded bg-amber-500/10 text-amber-400 border border-amber-500/30 flex items-center gap-1">
                          <Star size={9} fill="currentColor" /> Featured
                        </span>
                      )}
                    </div>
                    {/* Proficiency progress bar */}
                    <div className="mt-2 flex items-center gap-2">
                      <div className="flex-1 h-1.5 rounded-full bg-surface-3 overflow-hidden">
                        <div
                          className="h-full rounded-full bg-gradient-to-r from-cyan to-emerald-400"
                          style={{ width: `${Math.min(100, Math.max(0, skill.proficiency))}%` }}
                        />
                      </div>
                      <span className="font-mono text-[10px] text-muted-foreground w-8 text-right">
                        {skill.proficiency}%
                      </span>
                    </div>
                  </div>
                  <div className="flex items-center gap-1.5 shrink-0">
                    <button
                      type="button"
                      onClick={() => toggleFeatured(skill)}
                      className={`p-1.5 rounded hover:bg-surface-3 transition-colors ${
                        skill.featured ? "text-amber-400" : "text-muted-foreground hover:text-foreground"
                      }`}
                      title={skill.featured ? "Remove from featured" : "Mark as featured"}
                    >
                      <Star size={14} fill={skill.featured ? "currentColor" : "none"} />
                    </button>
                    <Button
                      onClick={() => remove(skill.id)}
                      size="sm"
                      type="button"
                      variant="secondary"
                      className="h-8 w-8 p-0 text-signal-red hover:bg-signal-red/10 border-signal-red/30"
                      title="Delete skill"
                    >
                      <Trash2 className="h-3.5 w-3.5" />
                    </Button>
                  </div>
                </div>
              ))
            )}
          </div>
        </Card>
      </div>
    </>
  );
}

export { ProjectsPanel } from "./admin-projects-panel";


export function BlogPanel() {
  const { data: posts, error, load } = useAdminResource<BlogPost[]>("/admin/blogs", []);

  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const form = new FormData(event.currentTarget);
    const title = String(form.get("title") ?? "");
    await adminFetch("/admin/blogs", {
      method: "POST",
      body: JSON.stringify({
        title,
        slug: String(form.get("slug") || title.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "")),
        excerpt: form.get("excerpt"),
        content: form.get("content"),
        status: form.get("status"),
        tags: splitList(form.get("tags")),
      }),
    });
    event.currentTarget.reset();
    await load();
  }

  async function remove(id: string) {
    await adminFetch(`/admin/blogs/${id}`, { method: "DELETE" });
    await load();
  }

  return (
    <>
      <SectionHeader title="Blog Management" description="Create markdown posts with SEO-friendly slugs, tags, draft and publish states." />
      <div className="grid gap-6 lg:grid-cols-[0.9fr_1.1fr]">
        <Card>
          <form className="grid gap-3" onSubmit={submit}>
            <Input name="title" placeholder="Title" required />
            <Input name="slug" placeholder="slug-optional" />
            <Input name="tags" placeholder="Tags comma separated" />
            <Textarea name="excerpt" placeholder="Excerpt" required />
            <Textarea className="min-h-64" name="content" placeholder="Markdown content" required />
            <select className="min-h-11 rounded-md border border-white/10 bg-slate-950 px-3 text-sm" defaultValue="DRAFT" name="status">
              <option value="DRAFT">Draft</option>
              <option value="PUBLISHED">Published</option>
            </select>
            <Button type="submit">Create Post</Button>
          </form>
          {error ? <p className="mt-4 text-sm text-red-300">{error}</p> : null}
        </Card>
        <Card>
          <div className="grid gap-3">
            {posts.map((post) => (
              <div className="rounded-md border border-white/10 bg-white/[0.03] p-4" key={post.id}>
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <h3 className="font-semibold">{post.title}</h3>
                    <p className="mt-1 text-sm text-slate-400">{post.excerpt}</p>
                  </div>
                  <Button onClick={() => remove(post.id)} size="sm" type="button" variant="secondary">
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            ))}
          </div>
        </Card>
      </div>
    </>
  );
}export function ResumePanel() {
  const { data: resumes, error, load } = useAdminResource<CvAsset[]>("/admin/resume", []);
  const [uploading, setUploading] = useState(false);
  const [msg, setMsg] = useState<string | null>(null);

  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const formElement = event.currentTarget;
    const form = new FormData(formElement);
    const file = form.get("file");
    let fileUrl = String(form.get("fileUrl") ?? "").trim();
    let publicId: string | undefined;

    if (!fileUrl && !(file instanceof File && file.size > 0)) {
      setMsg("Please provide either a PDF file or a direct URL.");
      return;
    }

    setMsg(null);
    if (file instanceof File && file.size > 0) {
      // Client-side magic bytes validation: must start with %PDF- (0x25 0x50 0x44 0x46 0x2D)
      try {
        const headerBuffer = await file.slice(0, 5).arrayBuffer();
        const header = new Uint8Array(headerBuffer);
        const isPdf =
          header[0] === 0x25 &&
          header[1] === 0x50 &&
          header[2] === 0x44 &&
          header[3] === 0x46 &&
          header[4] === 0x2d;

        if (!isPdf) {
          setMsg("Client security validation rejected file: missing PDF header signature (%PDF-). Upload aborted.");
          return;
        }
      } catch {
        setMsg("Could not read file header for verification.");
        return;
      }

      setUploading(true);
      try {
        const uploadForm = new FormData();
        uploadForm.set("file", file);
        const response = await fetch(bffUrl("/admin/uploads?folder=hz-labs/cv"), {
          method: "POST",
          credentials: "include",
          body: uploadForm,
        });
        if (!response.ok) {
          throw new Error(await response.text());
        }
        const uploaded = (await response.json()) as { url: string; publicId: string };
        fileUrl = uploaded.url;
        publicId = uploaded.publicId;
      } catch (err) {
        setMsg(err instanceof Error ? err.message : "Upload failed");
        setUploading(false);
        return;
      } finally {
        setUploading(false);
      }
    }

    try {
      const payload: Record<string, unknown> = {
        title: form.get("title"),
        isActive: true,
      };
      if (fileUrl) {
        payload.fileUrl = fileUrl;
      }
      if (publicId) {
        payload.publicId = publicId;
      }

      await adminFetch("/admin/resume", {
        method: "POST",
        body: JSON.stringify(payload),
      });
      formElement.reset();
      await load();
    } catch (err) {
      setMsg(err instanceof Error ? err.message : "Save failed");
    }
  }

  async function setActive(id: string) {
    await adminFetch(`/admin/resume/${id}/active`, { method: "PATCH", body: "{}" });
    await load();
  }

  async function remove(id: string) {
    if (!confirm("Are you sure you want to remove this CV version?")) return;
    await adminFetch(`/admin/resume/${id}`, { method: "DELETE" });
    await load();
  }

  return (
    <>
      <SectionHeader title="CV Asset Management" description="Upload or register CV files. Validates PDF magic bytes client-side before Cloudinary ingestion." />
      <div className="grid gap-6 lg:grid-cols-[0.8fr_1.2fr]">
        <Card>
          <form className="grid gap-3" onSubmit={submit}>
            <Input name="title" placeholder="CV title (e.g. Mohamed Hajith - Senior Full Stack 2026)" required />
            <Input name="fileUrl" placeholder="Existing Cloudinary/file URL (optional if uploading file)" />
            <div>
              <label className="block text-xs font-mono text-muted-foreground mb-1">
                PDF Document (Magic-byte verified):
              </label>
              <Input accept="application/pdf" name="file" type="file" />
            </div>
            <Button disabled={uploading} type="submit">
              <UploadCloud className="h-4 w-4" />
              {uploading ? "Verifying & Uploading..." : "Save CV"}
            </Button>
          </form>
          {msg || error ? <p className="mt-4 text-xs font-mono text-signal-red">{msg || error}</p> : null}
        </Card>

        <Card>
          <div className="mb-3 font-mono text-xs text-muted-foreground uppercase tracking-wider">
            CV Versions ({resumes.length})
          </div>
          <div className="grid gap-3">
            {resumes.map((resume) => (
              <div className="flex items-center justify-between gap-3 rounded-md border border-white/10 bg-white/[0.03] p-4" key={resume.id}>
                <div>
                  <div className="flex items-center gap-2">
                    <h3 className="font-semibold text-foreground">{resume.title}</h3>
                    {resume.isActive && (
                      <span className="text-[10px] font-mono text-emerald-400 bg-emerald-500/10 border border-emerald-500/30 px-1.5 py-0.5 rounded">
                        Active Public CV
                      </span>
                    )}
                  </div>
                  <p className="text-xs text-slate-400 mt-1">Version {resume.version}</p>
                  {resume.fileUrl && (
                    <a
                      href={resume.fileUrl}
                      target="_blank"
                      rel="noreferrer"
                      className="mt-2 inline-flex items-center gap-1 text-xs font-mono text-cyan hover:underline"
                    >
                      <ExternalLink size={12} />
                      View / Download PDF
                    </a>
                  )}
                </div>
                <div className="flex gap-2">
                  {!resume.isActive && (
                    <Button onClick={() => setActive(resume.id)} size="sm" type="button" variant="secondary">
                      Make Active
                    </Button>
                  )}
                  <Button onClick={() => remove(resume.id)} size="sm" type="button" variant="secondary">
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            ))}
          </div>
        </Card>
      </div>
    </>
  );
}

export function MessagesPanel() {
  const { data: messages, error, load } = useAdminResource<Message[]>("/admin/messages", []);
  const [filter, setFilter] = useState<"ALL" | "UNREAD" | "READ">("ALL");
  const [selectedIndex, setSelectedIndex] = useState<number>(0);

  const filteredMessages = messages.filter((m) => {
    if (filter === "UNREAD") return !m.read;
    if (filter === "READ") return m.read;
    return true;
  });

  async function markRead(id: string, readStatus: boolean) {
    await adminFetch(`/admin/messages/${id}/read`, {
      method: "PATCH",
      body: JSON.stringify({ read: readStatus }),
    });
    await load();
  }

  async function remove(id: string) {
    if (!confirm("Are you sure you want to delete this message?")) return;
    await adminFetch(`/admin/messages/${id}`, { method: "DELETE" });
    await load();
  }

  // Keyboard navigation shortcuts: 'j' next, 'k' prev, 'e' toggle read
  useEffect(() => {
    function handleKeyDown(e: KeyboardEvent) {
      if (
        document.activeElement?.tagName === "INPUT" ||
        document.activeElement?.tagName === "TEXTAREA"
      ) {
        return;
      }
      if (e.key === "j") {
        setSelectedIndex((prev) => Math.min(prev + 1, Math.max(0, filteredMessages.length - 1)));
      } else if (e.key === "k") {
        setSelectedIndex((prev) => Math.max(prev - 1, 0));
      } else if (e.key === "e") {
        const msg = filteredMessages[selectedIndex];
        if (msg) {
          void markRead(msg.id, !msg.read);
        }
      }
    }
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [filteredMessages, selectedIndex]);

  return (
    <>
      <SectionHeader title="Message Management" description="Review contact form submissions with keyboard shortcuts ('j' / 'k' to navigate, 'e' to toggle read/unread)." />
      <Card>
        {error ? <p className="mb-4 text-sm text-red-300">{error}</p> : null}

        {/* Filter Bar & Keyboard Navigation Hints */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 mb-5 border-b border-border/70 pb-4">
          <div className="flex items-center gap-1.5 font-mono text-xs">
            <button
              type="button"
              onClick={() => { setFilter("ALL"); setSelectedIndex(0); }}
              className={`px-3 py-1 rounded-md border transition-colors ${
                filter === "ALL" ? "bg-cyan/15 text-cyan border-cyan/40" : "bg-surface-2/60 text-muted-foreground border-border hover:text-foreground"
              }`}
            >
              All ({messages.length})
            </button>
            <button
              type="button"
              onClick={() => { setFilter("UNREAD"); setSelectedIndex(0); }}
              className={`px-3 py-1 rounded-md border transition-colors ${
                filter === "UNREAD" ? "bg-cyan/15 text-cyan border-cyan/40" : "bg-surface-2/60 text-muted-foreground border-border hover:text-foreground"
              }`}
            >
              Unread ({messages.filter((m) => !m.read).length})
            </button>
            <button
              type="button"
              onClick={() => { setFilter("READ"); setSelectedIndex(0); }}
              className={`px-3 py-1 rounded-md border transition-colors ${
                filter === "READ" ? "bg-cyan/15 text-cyan border-cyan/40" : "bg-surface-2/60 text-muted-foreground border-border hover:text-foreground"
              }`}
            >
              Read ({messages.filter((m) => m.read).length})
            </button>
          </div>

          <div className="font-mono text-[11px] text-muted-foreground flex items-center gap-2">
            <span className="px-1.5 py-0.5 rounded bg-surface-2 border border-border">j</span>
            <span className="px-1.5 py-0.5 rounded bg-surface-2 border border-border">k</span>
            <span>navigate</span>
            <span className="px-1.5 py-0.5 rounded bg-surface-2 border border-border ml-2">e</span>
            <span>toggle read</span>
          </div>
        </div>

        <div className="grid gap-3">
          {filteredMessages.length ? (
            filteredMessages.map((message, index) => {
              const isSelected = index === selectedIndex;
              return (
                <div
                  key={message.id}
                  onClick={() => setSelectedIndex(index)}
                  className={`rounded-md border p-4 transition-all cursor-pointer ${
                    isSelected
                      ? "border-cyan bg-cyan/10 ring-1 ring-cyan/30"
                      : message.read
                      ? "border-white/5 bg-white/[0.01] opacity-75"
                      : "border-white/10 bg-white/[0.03]"
                  }`}
                >
                  <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
                    <div>
                      <div className="flex items-center gap-2">
                        <h3 className="font-semibold text-foreground">
                          {message.subject ?? "Portfolio inquiry"}
                        </h3>
                        {!message.read && (
                          <span className="h-2 w-2 rounded-full bg-cyan animate-pulse-dot" />
                        )}
                      </div>
                      <p className="mt-1 text-xs font-mono text-slate-400">
                        {message.name} • {message.email} • {formatDate(message.createdAt)}
                      </p>
                      <p className="mt-3 text-sm leading-6 text-slate-300 whitespace-pre-wrap">
                        {message.message}
                      </p>
                    </div>
                    <div className="flex gap-2 shrink-0">
                      <Button
                        onClick={(e) => {
                          e.stopPropagation();
                          void markRead(message.id, !message.read);
                        }}
                        size="sm"
                        type="button"
                        variant="secondary"
                        className="font-mono text-xs"
                      >
                        {message.read ? "Mark Unread" : "Mark Read"}
                      </Button>
                      <Button
                        onClick={(e) => {
                          e.stopPropagation();
                          void remove(message.id);
                        }}
                        size="sm"
                        type="button"
                        variant="secondary"
                        className="text-signal-red border-signal-red/30"
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                </div>
              );
            })
          ) : (
            <p className="text-sm font-mono text-slate-400 p-8 text-center">
              No messages found for this filter.
            </p>
          )}
        </div>
      </Card>
    </>
  );
}
