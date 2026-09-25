"use client";

import { ChangeEvent, FormEvent, useEffect, useState } from "react";
import { Check, Edit2, ExternalLink, Plus, RefreshCw, Star, Trash2, UploadCloud, X } from "lucide-react";
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

function SectionHeader({ title, description }: { title: string; description: string }) {
  return (
    <div className="mb-6">
      <h1 className="font-display text-3xl font-semibold text-white">{title}</h1>
      <p className="mt-2 text-sm leading-6 text-slate-400">{description}</p>
    </div>
  );
}

export function DashboardPanel() {
  const [projects, setProjects] = useState<Project[]>([]);
  const [blogs, setBlogs] = useState<BlogPost[]>([]);
  const [skills, setSkills] = useState<Skill[]>([]);
  const [messages, setMessages] = useState<Message[]>([]);
  const [github, setGithub] = useState<GithubSummary | null>(null);
  const [suggestions, setSuggestions] = useState<Suggestion[]>([]);
  const [status, setStatus] = useState<string | null>(null);

  async function load() {
    const [projectData, blogData, skillData, messageData, githubData, suggestionData] = await Promise.all([
      adminFetch<Project[]>("/admin/projects"),
      adminFetch<BlogPost[]>("/admin/blogs"),
      adminFetch<Skill[]>("/admin/skills"),
      adminFetch<Message[]>("/admin/messages"),
      adminFetch<GithubSummary | null>("/github/summary"),
      adminFetch<Suggestion[]>("/admin/suggestions"),
    ]);
    setProjects(projectData);
    setBlogs(blogData);
    setSkills(skillData);
    setMessages(messageData);
    setGithub(githubData);
    setSuggestions(suggestionData);
  }

  useEffect(() => {
    const timeoutId = window.setTimeout(() => void load(), 0);
    return () => window.clearTimeout(timeoutId);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  async function syncGithub() {
    setStatus("Syncing GitHub...");
    try {
      await adminFetch("/admin/github/sync", { method: "POST", body: "{}" });
      await load();
      setStatus("GitHub sync complete");
    } catch (error) {
      console.error("GitHub sync failed:", error);
      setStatus(
        `GitHub sync failed: ${error instanceof Error ? error.message : "Internal error"}`,
      );
    }
  }

  async function handleSuggestion(id: string, action: "approve" | "reject") {
    try {
      await adminFetch(`/admin/suggestions/${id}/${action}`, { method: "POST", body: "{}" });
      await load();
    } catch (error) {
      console.error(`Failed to ${action} suggestion:`, error);
      setStatus(
        `Failed to ${action} suggestion: ${error instanceof Error ? error.message : "Internal error"}`,
      );
    }
  }

  return (
    <>
      <SectionHeader title="Portfolio Operating System" description="Traffic, content, GitHub intelligence, and messages at a glance." />
      <AnalyticsOverview />
      <h2 className="mb-4 mt-10 text-lg font-semibold text-white">Content</h2>
      <div className="grid gap-4 md:grid-cols-4">
        {[
          ["Projects", projects.length],
          ["Blog Posts", blogs.length],
          ["Skills", skills.length],
          ["Unread", messages.filter((message) => !message.read).length],
        ].map(([label, value]) => (
          <Card key={label}>
            <div className="text-3xl font-semibold text-white">{value}</div>
            <div className="mt-1 text-sm text-slate-400">{label}</div>
          </Card>
        ))}
      </div>
      <div className="mt-6 grid gap-6 lg:grid-cols-2">
        <Card>
          <div className="flex items-center justify-between gap-4">
            <div>
              <h2 className="text-xl font-semibold">GitHub Sync</h2>
              <p className="mt-1 text-sm text-slate-400">
                {github ? `${github.repositoryCount} repos, last synced ${formatDate(github.syncedAt)}` : "No snapshot yet"}
              </p>
            </div>
            <Button onClick={syncGithub} type="button">
              <RefreshCw className="h-4 w-4" />
              Sync
            </Button>
          </div>
          {status ? <p className="mt-4 text-sm text-blue-200">{status}</p> : null}
        </Card>
        <Card>
          <h2 className="text-xl font-semibold">Pending Suggestions</h2>
          <div className="mt-4 grid gap-3">
            {suggestions.filter((suggestion) => suggestion.status === "PENDING").length ? (
              suggestions
                .filter((suggestion) => suggestion.status === "PENDING")
                .map((suggestion) => (
                  <div className="rounded-md border border-white/10 bg-white/[0.03] p-3" key={suggestion.id}>
                    <div className="text-sm font-medium text-white">{suggestion.title}</div>
                    <div className="mt-3 flex gap-2">
                      <Button onClick={() => handleSuggestion(suggestion.id, "approve")} size="sm" type="button">
                        <Check className="h-4 w-4" />
                        Approve
                      </Button>
                      <Button onClick={() => handleSuggestion(suggestion.id, "reject")} size="sm" type="button" variant="secondary">
                        Reject
                      </Button>
                    </div>
                  </div>
                ))
            ) : (
              <p className="text-sm text-slate-400">No pending suggestions.</p>
            )}
          </div>
        </Card>
      </div>
    </>
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

  async function remove(id: string) {
    await adminFetch(`/admin/skills/${id}`, { method: "DELETE" });
    await load();
  }

  return (
    <>
      <SectionHeader title="Skills Management" description="Add, reorder, feature, and remove technology skills shown on the public portfolio." />
      <div className="grid gap-6 lg:grid-cols-[0.8fr_1.2fr]">
        <Card>
          <form className="grid gap-3" onSubmit={submit}>
            <Input name="name" placeholder="Skill name" required />
            <Input name="category" placeholder="Category" required />
            <Input defaultValue={80} max={100} min={0} name="proficiency" placeholder="Proficiency" type="number" />
            <label className="flex items-center gap-2 text-sm text-slate-300">
              <input name="featured" type="checkbox" />
              Featured
            </label>
            <Button type="submit">
              <Plus className="h-4 w-4" />
              Add Skill
            </Button>
          </form>
          {error ? <p className="mt-4 text-sm text-red-300">{error}</p> : null}
        </Card>
        <Card>
          <div className="grid gap-2">
            {skills.map((skill) => (
              <div className="flex items-center justify-between gap-3 rounded-md border border-white/10 bg-white/[0.03] p-3" key={skill.id}>
                <div>
                  <div className="text-sm font-medium">{skill.name}</div>
                  <div className="text-xs text-slate-500">{skill.category} - {skill.proficiency}%</div>
                </div>
                <Button onClick={() => remove(skill.id)} size="sm" type="button" variant="secondary">
                  <Trash2 className="h-4 w-4" />
                </Button>
              </div>
            ))}
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
