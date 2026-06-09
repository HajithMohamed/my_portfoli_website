"use client";

import { FormEvent, useEffect, useState } from "react";
import { Check, Plus, RefreshCw, Trash2, UploadCloud } from "lucide-react";
import { AdminShell, useAdminToken } from "@/components/admin/admin-shell";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input, Textarea } from "@/components/ui/input";
import { adminFetch } from "@/lib/api";
import type { BlogPost, CvAsset, GithubSummary, Profile, Project, Skill } from "@/lib/types";
import { absoluteApiUrl, formatDate } from "@/lib/utils";

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
  const token = useAdminToken();
  const [data, setData] = useState<T>(fallback);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  async function load() {
    if (!token) return;
    setLoading(true);
    setError(null);
    try {
      setData(await adminFetch<T>(path, token));
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
  }, [token, path]);

  return { token, data, setData, error, loading, load };
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
  const token = useAdminToken();
  const [projects, setProjects] = useState<Project[]>([]);
  const [blogs, setBlogs] = useState<BlogPost[]>([]);
  const [skills, setSkills] = useState<Skill[]>([]);
  const [messages, setMessages] = useState<Message[]>([]);
  const [github, setGithub] = useState<GithubSummary | null>(null);
  const [suggestions, setSuggestions] = useState<Suggestion[]>([]);
  const [status, setStatus] = useState<string | null>(null);

  async function load() {
    if (!token) return;
    const [projectData, blogData, skillData, messageData, githubData, suggestionData] = await Promise.all([
      adminFetch<Project[]>("/admin/projects", token),
      adminFetch<BlogPost[]>("/admin/blogs", token),
      adminFetch<Skill[]>("/admin/skills", token),
      adminFetch<Message[]>("/admin/messages", token),
      adminFetch<GithubSummary | null>("/github/summary", token),
      adminFetch<Suggestion[]>("/admin/suggestions", token),
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
  }, [token]);

  async function syncGithub() {
    if (!token) return;
    setStatus("Syncing GitHub");
    await adminFetch("/admin/github/sync", token, { method: "POST", body: "{}" });
    await load();
    setStatus("GitHub sync complete");
  }

  async function handleSuggestion(id: string, action: "approve" | "reject") {
    if (!token) return;
    await adminFetch(`/admin/suggestions/${id}/${action}`, token, { method: "POST", body: "{}" });
    await load();
  }

  return (
    <AdminShell>
      <SectionHeader title="Portfolio Operating System" description="Content, GitHub intelligence, messages, and release readiness at a glance." />
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
    </AdminShell>
  );
}

export function ProfilePanel() {
  const { token, data: profile, error, loading, load } = useAdminResource<Profile | null>("/profile", null);

  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!token) return;
    const form = new FormData(event.currentTarget);
    await adminFetch<Profile>("/admin/profile", token, {
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
    <AdminShell>
      <SectionHeader title="Profile Management" description="Edit HZ Labs positioning, contact details, philosophy, social links, and currently exploring list." />
      <Card>
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
    </AdminShell>
  );
}

export function SkillsPanel() {
  const { token, data: skills, error, load } = useAdminResource<Skill[]>("/admin/skills", []);

  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!token) return;
    const form = new FormData(event.currentTarget);
    await adminFetch("/admin/skills", token, {
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
    if (!token) return;
    await adminFetch(`/admin/skills/${id}`, token, { method: "DELETE" });
    await load();
  }

  return (
    <AdminShell>
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
    </AdminShell>
  );
}

export function ProjectsPanel() {
  const { token, data: projects, error, load } = useAdminResource<Project[]>("/admin/projects", []);

  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!token) return;
    const form = new FormData(event.currentTarget);
    const title = String(form.get("title") ?? "");
    const caseStudy = ["Problem", "Solution", "Architecture", "Outcome"].map((heading) => ({
      heading,
      body: String(form.get(heading.toLowerCase()) ?? ""),
    }));
    await adminFetch("/admin/projects", token, {
      method: "POST",
      body: JSON.stringify({
        title,
        slug: String(form.get("slug") || title.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "")),
        description: form.get("description"),
        techStack: splitList(form.get("techStack")),
        githubUrl: form.get("githubUrl") || undefined,
        liveUrl: form.get("liveUrl") || undefined,
        category: form.get("category"),
        status: form.get("status"),
        featured: form.get("featured") === "on",
        caseStudy,
      }),
    });
    event.currentTarget.reset();
    await load();
  }

  async function remove(id: string) {
    if (!token) return;
    await adminFetch(`/admin/projects/${id}`, token, { method: "DELETE" });
    await load();
  }

  return (
    <AdminShell>
      <SectionHeader title="Projects Management" description="Create CMS-backed projects with tech stacks, links, feature flags, and case-study sections." />
      <div className="grid gap-6 xl:grid-cols-[0.85fr_1.15fr]">
        <Card>
          <form className="grid gap-3" onSubmit={submit}>
            <Input name="title" placeholder="Title" required />
            <Input name="slug" placeholder="slug-optional" />
            <Textarea name="description" placeholder="Description" required />
            <Input name="category" placeholder="Category" required />
            <Input name="techStack" placeholder="Tech stack comma separated" required />
            <Input name="githubUrl" placeholder="GitHub URL" />
            <Input name="liveUrl" placeholder="Live URL" />
            <select className="min-h-11 rounded-md border border-white/10 bg-slate-950 px-3 text-sm" defaultValue="ACTIVE" name="status">
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
              Featured
            </label>
            <Button type="submit">Create Project</Button>
          </form>
          {error ? <p className="mt-4 text-sm text-red-300">{error}</p> : null}
        </Card>
        <Card>
          <div className="grid gap-3">
            {projects.map((project) => (
              <div className="rounded-md border border-white/10 bg-white/[0.03] p-4" key={project.id}>
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <h3 className="font-semibold">{project.title}</h3>
                    <p className="mt-1 text-sm text-slate-400">{project.description}</p>
                  </div>
                  <Button onClick={() => remove(project.id)} size="sm" type="button" variant="secondary">
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            ))}
          </div>
        </Card>
      </div>
    </AdminShell>
  );
}

export function BlogPanel() {
  const { token, data: posts, error, load } = useAdminResource<BlogPost[]>("/admin/blogs", []);

  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!token) return;
    const form = new FormData(event.currentTarget);
    const title = String(form.get("title") ?? "");
    await adminFetch("/admin/blogs", token, {
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
    if (!token) return;
    await adminFetch(`/admin/blogs/${id}`, token, { method: "DELETE" });
    await load();
  }

  return (
    <AdminShell>
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
    </AdminShell>
  );
}

export function ResumePanel() {
  const { token, data: resumes, error, load } = useAdminResource<CvAsset[]>("/admin/resume", []);
  const [uploading, setUploading] = useState(false);

  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!token) return;
    const form = new FormData(event.currentTarget);
    const file = form.get("file");
    let fileUrl = String(form.get("fileUrl") ?? "");
    let publicId: string | undefined;

    if (file instanceof File && file.size > 0) {
      setUploading(true);
      const uploadForm = new FormData();
      uploadForm.set("file", file);
      const response = await fetch(absoluteApiUrl("/admin/uploads?folder=hz-labs/cv"), {
        method: "POST",
        headers: { Authorization: `Bearer ${token}` },
        body: uploadForm,
      });
      const uploaded = (await response.json()) as { url: string; publicId: string };
      fileUrl = uploaded.url;
      publicId = uploaded.publicId;
      setUploading(false);
    }

    await adminFetch("/admin/resume", token, {
      method: "POST",
      body: JSON.stringify({
        title: form.get("title"),
        fileUrl,
        publicId,
        isActive: true,
      }),
    });
    event.currentTarget.reset();
    await load();
  }

  async function setActive(id: string) {
    if (!token) return;
    await adminFetch(`/admin/resume/${id}/active`, token, { method: "PATCH", body: "{}" });
    await load();
  }

  async function remove(id: string) {
    if (!token) return;
    await adminFetch(`/admin/resume/${id}`, token, { method: "DELETE" });
    await load();
  }

  return (
    <AdminShell>
      <SectionHeader title="CV Management" description="Upload or register CV files. The homepage Download CV button points to the active latest CV." />
      <div className="grid gap-6 lg:grid-cols-[0.8fr_1.2fr]">
        <Card>
          <form className="grid gap-3" onSubmit={submit}>
            <Input name="title" placeholder="CV title" required />
            <Input name="fileUrl" placeholder="Existing Cloudinary/file URL" />
            <Input accept="application/pdf" name="file" type="file" />
            <Button disabled={uploading} type="submit">
              <UploadCloud className="h-4 w-4" />
              {uploading ? "Uploading" : "Save CV"}
            </Button>
          </form>
          {error ? <p className="mt-4 text-sm text-red-300">{error}</p> : null}
        </Card>
        <Card>
          <div className="grid gap-3">
            {resumes.map((resume) => (
              <div className="flex items-center justify-between gap-3 rounded-md border border-white/10 bg-white/[0.03] p-4" key={resume.id}>
                <div>
                  <h3 className="font-semibold">{resume.title}</h3>
                  <p className="text-sm text-slate-400">Version {resume.version} {resume.isActive ? "- Active" : ""}</p>
                </div>
                <div className="flex gap-2">
                  <Button onClick={() => setActive(resume.id)} size="sm" type="button" variant="secondary">Active</Button>
                  <Button onClick={() => remove(resume.id)} size="sm" type="button" variant="secondary">
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            ))}
          </div>
        </Card>
      </div>
    </AdminShell>
  );
}

export function MessagesPanel() {
  const { token, data: messages, error, load } = useAdminResource<Message[]>("/admin/messages", []);

  async function markRead(id: string) {
    if (!token) return;
    await adminFetch(`/admin/messages/${id}/read`, token, { method: "PATCH", body: "{}" });
    await load();
  }

  async function remove(id: string) {
    if (!token) return;
    await adminFetch(`/admin/messages/${id}`, token, { method: "DELETE" });
    await load();
  }

  return (
    <AdminShell>
      <SectionHeader title="Message Management" description="Review contact form submissions and mark outreach as handled." />
      <Card>
        {error ? <p className="mb-4 text-sm text-red-300">{error}</p> : null}
        <div className="grid gap-3">
          {messages.length ? (
            messages.map((message) => (
              <div className="rounded-md border border-white/10 bg-white/[0.03] p-4" key={message.id}>
                <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
                  <div>
                    <h3 className="font-semibold">{message.subject ?? "Portfolio inquiry"}</h3>
                    <p className="mt-1 text-sm text-slate-400">{message.name} - {message.email} - {formatDate(message.createdAt)}</p>
                    <p className="mt-3 text-sm leading-6 text-slate-300">{message.message}</p>
                  </div>
                  <div className="flex gap-2">
                    <Button onClick={() => markRead(message.id)} size="sm" type="button" variant="secondary">
                      {message.read ? "Read" : "Mark Read"}
                    </Button>
                    <Button onClick={() => remove(message.id)} size="sm" type="button" variant="secondary">
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </div>
            ))
          ) : (
            <p className="text-sm text-slate-400">No messages yet.</p>
          )}
        </div>
      </Card>
    </AdminShell>
  );
}
