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

export function ProjectsPanel() {
  const { data: projects, error, load } = useAdminResource<Project[]>("/admin/projects", []);
  const [editingProject, setEditingProject] = useState<Project | null>(null);
  const [savingEdit, setSavingEdit] = useState(false);
  const [uploadingImage, setUploadingImage] = useState(false);
  const [editError, setEditError] = useState<string | null>(null);

  async function setVisibility(project: Project, visible: boolean) {
    await adminFetch(`/admin/projects/${project.id}`, {
      method: "PATCH",
      body: JSON.stringify({ status: visible ? "ACTIVE" : "DRAFT" }),
    });
    await load();
  }

  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const form = new FormData(event.currentTarget);
    const title = String(form.get("title") ?? "");
    let coverImage = String(form.get("coverImage") ?? "").trim() || undefined;
    const file = form.get("coverImageFile");
    if (file instanceof File && file.size > 0) {
      setUploadingImage(true);
      try {
        coverImage = (await uploadImage(file, "hz-labs/projects")).url;
      } finally {
        setUploadingImage(false);
      }
    }

    const caseStudy = ["Problem", "Solution", "Architecture", "Outcome"].map((heading) => ({
      heading,
      body: String(form.get(heading.toLowerCase()) ?? ""),
    }));
    await adminFetch("/admin/projects", {
      method: "POST",
      body: JSON.stringify({
        title,
        slug: String(form.get("slug") || title.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "")),
        description: form.get("description"),
        techStack: splitList(form.get("techStack")),
        githubUrl: form.get("githubUrl") || undefined,
        liveUrl: form.get("liveUrl") || undefined,
        coverImage,
        category: form.get("category"),
        status: form.get("status"),
        featured: form.get("featured") === "on",
        caseStudy,
      }),
    });
    event.currentTarget.reset();
    await load();
  }

  async function handleSaveEdit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!editingProject) return;
    setSavingEdit(true);
    setEditError(null);

    const form = new FormData(event.currentTarget);
    let coverImage = form.get("coverImage") ? String(form.get("coverImage")).trim() || undefined : undefined;
    const file = form.get("coverImageFile");
    if (file instanceof File && file.size > 0) {
      try {
        coverImage = (await uploadImage(file, "hz-labs/projects")).url;
      } catch (err) {
        setEditError(err instanceof Error ? err.message : "Failed to upload image");
        setSavingEdit(false);
        return;
      }
    }

    const updatedPayload = {
      title: String(form.get("title")),
      slug: String(form.get("slug")),
      description: String(form.get("description")),
      category: String(form.get("category")),
      techStack: splitList(form.get("techStack")),
      githubUrl: form.get("githubUrl") ? String(form.get("githubUrl")) : undefined,
      liveUrl: form.get("liveUrl") ? String(form.get("liveUrl")) : undefined,
      coverImage,
      status: String(form.get("status")),
      featured: form.get("featured") === "on",
      outcome: form.get("outcome") ? String(form.get("outcome")) : undefined,
    };

    try {
      await adminFetch(`/admin/projects/${editingProject.id}`, {
        method: "PATCH",
        body: JSON.stringify(updatedPayload),
      });
      setEditingProject(null);
      await load();
    } catch (err) {
      setEditError(err instanceof Error ? err.message : "Failed to update project");
    } finally {
      setSavingEdit(false);
    }
  }

  async function remove(id: string) {
    if (!confirm("Are you sure you want to delete this project?")) return;
    await adminFetch(`/admin/projects/${id}`, { method: "DELETE" });
    if (editingProject?.id === id) setEditingProject(null);
    await load();
  }

  return (
    <>
      <SectionHeader title="Projects Management" description="Manage the projects shown in the public catalogue. Mark a project as Featured to include it in the homepage showcase." />
      <div className="grid gap-6 xl:grid-cols-[0.85fr_1.15fr]">
        <Card>
          <div className="mb-4 font-mono text-xs uppercase tracking-wider text-cyan font-bold">
            Create New Project
          </div>
          <form className="grid gap-3" onSubmit={submit}>
            <Input name="title" placeholder="Title" required />
            <Input name="slug" placeholder="slug-optional" />
            <Textarea name="description" placeholder="Description" required />
            <Input name="category" placeholder="Category" required />
            <Input name="techStack" placeholder="Tech stack comma separated" required />
            <div className="space-y-1 rounded border border-white/10 bg-surface-2/40 p-3">
              <label className="text-[11px] font-mono text-cyan uppercase tracking-wider block">
                Cover Image (Upload or URL)
              </label>
              <Input accept="image/*" name="coverImageFile" type="file" />
              <Input name="coverImage" placeholder="Or paste image URL (Cloudinary / Unsplash)" />
            </div>
            <Input name="githubUrl" placeholder="GitHub URL" />
            <Input name="liveUrl" placeholder="Live URL" />
            <select className="min-h-11 rounded-md border border-white/10 bg-slate-950 px-3 text-sm text-foreground" defaultValue="ACTIVE" name="status">
              <option value="ACTIVE">Active</option>
              <option value="DRAFT">Draft</option>
              <option value="ARCHIVED">Archived</option>
            </select>
            <Textarea name="problem" placeholder="Problem" />
            <Textarea name="solution" placeholder="Solution" />
            <Textarea name="architecture" placeholder="Architecture" />
            <Textarea name="outcome" placeholder="Outcome" />
            <label className="flex items-center gap-2 text-sm text-slate-300">
              <input name="featured" type="checkbox" />
              Featured on Homepage Showcase
            </label>
            <Button disabled={uploadingImage} type="submit">
              {uploadingImage ? "Uploading Image..." : "Create Project"}
            </Button>
          </form>
          {error ? <p className="mt-4 text-sm text-red-300">{error}</p> : null}
        </Card>

        <Card>
          <div className="mb-4 font-mono text-xs uppercase tracking-wider text-muted-foreground">
            Existing Projects ({projects.length})
          </div>
          <div className="grid gap-3">
            {projects.map((project) => (
              <div
                className="rounded-md border border-white/10 bg-white/[0.03] p-4 transition-all hover:border-cyan/40"
                key={project.id}
              >
                <div className="flex items-start justify-between gap-3">
                  <div className="flex items-start gap-3 flex-1 min-w-0">
                    {project.coverImage ? (
                      <div className="h-16 w-24 shrink-0 overflow-hidden rounded border border-white/10 bg-slate-900">
                        {/* eslint-disable-next-line @next/next/no-img-element */}
                        <img src={project.coverImage} alt={project.title} className="h-full w-full object-cover" />
                      </div>
                    ) : (
                      <div className="flex h-16 w-24 shrink-0 items-center justify-center rounded border border-white/10 bg-white/5 font-mono text-[9px] text-slate-500">
                        No Cover
                      </div>
                    )}
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 flex-wrap">
                        <h3 className="font-semibold text-foreground truncate">{project.title}</h3>
                        {project.featured && (
                          <span className="flex items-center gap-0.5 text-[10px] font-mono text-amber-400 bg-amber-500/10 border border-amber-500/30 px-1.5 py-0.5 rounded">
                            <Star size={10} /> Featured
                          </span>
                        )}
                        <span className="text-[10px] font-mono text-muted-foreground bg-surface-2 px-1.5 py-0.5 rounded">
                          {project.category}
                        </span>
                      </div>
                      <p className="mt-1 text-sm text-slate-400 line-clamp-2">{project.description}</p>
                      <label className="mt-3 flex items-center gap-2 text-xs text-slate-300">
                        <input checked={project.status === "ACTIVE"} onChange={(event) => void setVisibility(project, event.target.checked)} type="checkbox" />
                        Show on projects page
                      </label>
                    </div>
                  </div>
                  <div className="flex items-center gap-2 shrink-0">
                    <Button
                      onClick={() => setEditingProject(project)}
                      size="sm"
                      type="button"
                      variant="secondary"
                      className="text-cyan hover:text-cyan border-cyan/30"
                    >
                      <Edit2 className="h-3.5 w-3.5 mr-1" />
                      Edit
                    </Button>
                    <Button onClick={() => remove(project.id)} size="sm" type="button" variant="secondary">
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </Card>
      </div>

      {/* Slide-over Drawer for Editing Project */}
      {editingProject && (
        <div className="fixed inset-0 z-50 bg-black/75 backdrop-blur-sm flex justify-end">
          <div className="w-full max-w-xl bg-surface border-l border-border h-full overflow-y-auto p-6 flex flex-col justify-between shadow-2xl">
            <div>
              <div className="flex items-center justify-between border-b border-border pb-3 mb-5">
                <div>
                  <span className="font-mono text-[10px] uppercase text-cyan tracking-wider">Drawer Editor</span>
                  <h2 className="text-xl font-bold font-display text-foreground">{editingProject.title}</h2>
                </div>
                <button
                  type="button"
                  onClick={() => setEditingProject(null)}
                  className="p-1.5 rounded-md hover:bg-surface-2 text-muted-foreground hover:text-foreground"
                >
                  <X size={18} />
                </button>
              </div>

              {editError && (
                <div className="mb-4 text-xs font-mono text-signal-red bg-signal-red/10 border border-signal-red/30 p-2.5 rounded">
                  {editError}
                </div>
              )}

              <form id="edit-project-form" onSubmit={handleSaveEdit} className="space-y-4 font-mono text-xs">
                <div>
                  <label className="block text-muted-foreground mb-1">Title</label>
                  <Input name="title" defaultValue={editingProject.title} required />
                </div>

                <div>
                  <label className="block text-muted-foreground mb-1">Slug</label>
                  <Input name="slug" defaultValue={editingProject.slug} required />
                </div>

                <div>
                  <label className="block text-muted-foreground mb-1">Description</label>
                  <Textarea name="description" defaultValue={editingProject.description} rows={3} required />
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-muted-foreground mb-1">Category</label>
                    <Input name="category" defaultValue={editingProject.category} required />
                  </div>
                  <div>
                    <label className="block text-muted-foreground mb-1">Status</label>
                    <select
                      name="status"
                      defaultValue={editingProject.status}
                      className="w-full h-10 rounded-md border border-border bg-surface-2 px-3 text-xs text-foreground"
                    >
                      <option value="ACTIVE">Active</option>
                      <option value="DRAFT">Draft</option>
                      <option value="ARCHIVED">Archived</option>
                    </select>
                  </div>
                </div>

                <div>
                  <label className="block text-muted-foreground mb-1">Tech Stack (comma separated)</label>
                  <Input name="techStack" defaultValue={editingProject.techStack?.join(", ")} required />
                </div>

                <div className="space-y-1 rounded border border-white/10 bg-surface-2/40 p-3">
                  <label className="block text-cyan text-[11px] font-mono uppercase tracking-wider mb-1">Cover Image (Upload or URL)</label>
                  <Input accept="image/*" name="coverImageFile" type="file" className="mb-2" />
                  <Input name="coverImage" defaultValue={editingProject.coverImage || ""} placeholder="https://res.cloudinary.com/..." />
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-muted-foreground mb-1">GitHub URL</label>
                    <Input name="githubUrl" defaultValue={editingProject.githubUrl || ""} placeholder="https://github.com/..." />
                  </div>
                  <div>
                    <label className="block text-muted-foreground mb-1">Live URL</label>
                    <Input name="liveUrl" defaultValue={editingProject.liveUrl || ""} placeholder="https://..." />
                  </div>
                </div>

                <div>
                  <label className="block text-muted-foreground mb-1">Project Outcome (Optional)</label>
                  <Input name="outcome" defaultValue={editingProject.outcome || ""} placeholder="Key results or impacts..." />
                </div>

                <label className="flex items-center gap-2 cursor-pointer pt-2">
                  <input
                    type="checkbox"
                    name="featured"
                    defaultChecked={editingProject.featured}
                    className="h-4 w-4 rounded border-border bg-surface text-cyan"
                  />
                  <span className="text-foreground">Featured on Home Showcase</span>
                </label>
              </form>
            </div>

            <div className="border-t border-border pt-4 mt-6 flex items-center justify-end gap-2">
              <Button
                type="button"
                variant="secondary"
                size="sm"
                onClick={() => setEditingProject(null)}
              >
                Cancel
              </Button>
              <Button
                form="edit-project-form"
                type="submit"
                disabled={savingEdit}
                size="sm"
                className="bg-cyan text-slate-950 hover:bg-cyan-soft font-semibold"
              >
                {savingEdit ? "Saving..." : "Save Project Changes"}
              </Button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}

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
