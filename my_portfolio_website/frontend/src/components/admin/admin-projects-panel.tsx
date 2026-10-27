"use client";

import Link from "next/link";
import {
  useCallback,
  useEffect,
  useRef,
  useState,
  type FormEvent,
} from "react";
import {
  ArrowDown,
  ArrowUp,
  ImagePlus,
  Pencil,
  Plus,
  RefreshCw,
  Trash2,
  X,
} from "lucide-react";
import { adminFetch } from "@/lib/api";
import { repositorySlug } from "@/lib/portfolio-mapping";
import type { Project } from "@/lib/types";
import { StudioProjectCard } from "@/components/projects/studio-project-card";
import { ProjectMediaStudio } from "./project-media-studio";
import { Button } from "@/components/ui/button";
import { Input, Textarea } from "@/components/ui/input";

const blankProject = (): Project => ({
  id: "",
  title: "",
  slug: "",
  description: "",
  category: "",
  techStack: [],
  status: "DRAFT",
  featured: false,
  showOnHomepage: false,
  showOnProjectsPage: true,
  homepageOrder: 0,
  media: [],
});
function errorMessage(error: unknown) {
  const message =
    error instanceof Error
      ? error.message
      : "Request failed. Please try again.";
  try {
    const body = JSON.parse(message) as { message?: string | string[] };
    return Array.isArray(body.message)
      ? body.message.join(". ")
      : body.message || message;
  } catch {
    return message;
  }
}

function ProjectEditor({
  project,
  onClose,
  onSaved,
  mediaOnly = false,
}: {
  project: Project;
  onClose: () => void;
  onSaved: () => Promise<void>;
  mediaOnly?: boolean;
}) {
  const [draft, setDraft] = useState<Project>(project);
  const [busy, setBusy] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const dialog = useRef<HTMLDialogElement>(null);
  const focus = useRef<HTMLElement | null>(null);
  useEffect(() => {
    const node = dialog.current;
    focus.current = document.activeElement as HTMLElement;
    const overflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    node?.showModal();
    return () => {
      node?.close();
      document.body.style.overflow = overflow;
      focus.current?.focus();
    };
  }, []);
  function field<K extends keyof Project>(key: K, value: Project[K]) {
    setDraft((current) => ({ ...current, [key]: value }));
  }

  async function save(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setBusy(true);
    setError(null);
    const payload = {
      title: draft.title.trim(),
      slug: draft.slug.trim() || repositorySlug(draft.title),
      description: draft.description.trim(),
      category: draft.category.trim(),
      techStack: draft.techStack,
      githubUrl: draft.githubUrl?.trim() || null,
      liveUrl: draft.liveUrl?.trim() || null,
      coverImage: draft.coverImage || null,
      status: draft.status,
      featured: Boolean(draft.showOnHomepage),
      showOnHomepage: Boolean(draft.showOnHomepage),
      showOnProjectsPage: Boolean(draft.showOnProjectsPage),
      homepageOrder: draft.homepageOrder ?? 0,
      media: (draft.media ?? []).map(
        ({
          url,
          alt,
          type,
          caption,
          posterUrl,
          publicId,
          provider,
          mimeType,
          bytes,
        }) => ({
          url,
          alt,
          type: type ?? "IMAGE",
          caption: caption || undefined,
          posterUrl: posterUrl || undefined,
          publicId: publicId || undefined,
          provider: provider || undefined,
          mimeType: mimeType || undefined,
          bytes: bytes ?? undefined,
        }),
      ),
      caseStudy: draft.caseStudy?.map(({ heading, body }) => ({
        heading,
        body,
      })),
    };
    try {
      await adminFetch(
        project.id ? `/admin/projects/${project.id}` : "/admin/projects",
        {
          method: project.id ? "PATCH" : "POST",
          body: JSON.stringify(
            mediaOnly
              ? { media: payload.media, coverImage: payload.coverImage }
              : payload,
          ),
        },
      );
      await onSaved();
      onClose();
    } catch (err) {
      setError(errorMessage(err));
    } finally {
      setBusy(false);
    }
  }

  return (
    <dialog
      data-lenis-prevent
      ref={dialog}
      aria-labelledby="project-editor-title"
      onCancel={(event) => {
        event.preventDefault();
        if (!busy && !uploading) onClose();
      }}
      className="fixed inset-0 m-auto max-h-[94dvh] w-[min(1100px,96vw)] max-w-[96vw] overflow-y-auto rounded-2xl border border-border bg-surface p-0 text-foreground backdrop:bg-black/85"
    >
      <div className="sticky top-0 z-10 flex items-center justify-between gap-4 border-b border-border bg-surface px-6 py-4">
        <div>
          <p className="text-xs text-muted-foreground">
            HZ Labs / Project studio
          </p>
          <h2 id="project-editor-title" className="mt-1 text-xl font-semibold">
            {mediaOnly
              ? `${project.title} · Photos & videos`
              : project.id
                ? "Edit project"
                : "Create project"}
          </h2>
        </div>
        <button
          type="button"
          aria-label="Close project editor"
          disabled={busy || uploading}
          onClick={onClose}
          className="grid h-11 w-11 place-items-center rounded-lg border border-border disabled:opacity-40"
        >
          <X size={20} />
        </button>
      </div>
      <form
        onSubmit={save}
        className="grid gap-6 p-4 sm:p-6 lg:grid-cols-[1.2fr_1fr]"
      >
        <div className="min-w-0 space-y-4">
          {!mediaOnly && (
            <>
              <label className="block text-sm">
                Project title
                <Input
                  value={draft.title}
                  onChange={(event) => field("title", event.target.value)}
                  required
                  name="title"
                  className="mt-1"
                />
              </label>
              <div className="grid gap-4 sm:grid-cols-2">
                <label className="block text-sm">
                  Slug
                  <Input
                    value={draft.slug}
                    onChange={(event) => field("slug", event.target.value)}
                    name="slug"
                    pattern="[a-z0-9]+(-[a-z0-9]+)*"
                    placeholder="Generated from title"
                    className="mt-1"
                  />
                </label>
                <label className="block text-sm">
                  Category
                  <Input
                    value={draft.category}
                    onChange={(event) => field("category", event.target.value)}
                    required
                    name="category"
                    className="mt-1"
                  />
                </label>
              </div>
              <label className="block text-sm">
                Description
                <Textarea
                  value={draft.description}
                  onChange={(event) => field("description", event.target.value)}
                  required
                  name="description"
                  rows={4}
                  className="mt-1"
                />
              </label>
              <label className="block text-sm">
                Technologies (comma separated)
                <Input
                  defaultValue={draft.techStack.join(", ")}
                  onChange={(event) =>
                    field(
                      "techStack",
                      event.target.value
                        .split(",")
                        .map((item) => item.trim())
                        .filter(Boolean),
                    )
                  }
                  name="techStack"
                  className="mt-1"
                />
              </label>
              <label className="block text-sm">
                GitHub URL
                <Input
                  value={draft.githubUrl ?? ""}
                  onChange={(event) => field("githubUrl", event.target.value)}
                  type="url"
                  name="githubUrl"
                  className="mt-1"
                />
              </label>
              <label className="block text-sm">
                Live demo URL
                <Input
                  value={draft.liveUrl ?? ""}
                  onChange={(event) => field("liveUrl", event.target.value)}
                  type="url"
                  name="liveUrl"
                  className="mt-1"
                />
              </label>
              <div className="grid gap-4 sm:grid-cols-2">
                <label className="block text-sm">
                  Publication status
                  <select
                    name="status"
                    value={draft.status}
                    onChange={(event) =>
                      field("status", event.target.value as Project["status"])
                    }
                    className="mt-1 min-h-11 w-full rounded-lg border border-border bg-surface-2 px-3"
                  >
                    <option value="DRAFT">Draft / Held</option>
                    <option value="ACTIVE">Published</option>
                    <option value="ARCHIVED">Archived</option>
                  </select>
                </label>
                <label className="block text-sm">
                  Homepage order
                  <Input
                    type="number"
                    min={0}
                    value={draft.homepageOrder ?? 0}
                    onChange={(event) =>
                      field(
                        "homepageOrder",
                        Math.max(0, Number(event.target.value)),
                      )
                    }
                    className="mt-1"
                  />
                </label>
              </div>
              <div className="flex flex-wrap gap-4 text-sm">
                <label className="flex min-h-11 items-center gap-2">
                  <input
                    type="checkbox"
                    name="showOnHomepage"
                    checked={draft.showOnHomepage ?? draft.featured}
                    onChange={(event) => {
                      field("showOnHomepage", event.target.checked);
                      field("featured", event.target.checked);
                    }}
                  />{" "}
                  Show on Home
                </label>
                <label className="flex min-h-11 items-center gap-2">
                  <input
                    type="checkbox"
                    name="showOnProjectsPage"
                    checked={draft.showOnProjectsPage ?? true}
                    onChange={(event) =>
                      field("showOnProjectsPage", event.target.checked)
                    }
                  />{" "}
                  Show on Projects
                </label>
              </div>
              <p className="text-xs leading-5 text-muted-foreground">
                Draft and archived projects stay private. Publishing and page
                placement are separate; holding a project preserves its media
                and chosen placement.
              </p>
            </>
          )}
          <ProjectMediaStudio
            media={draft.media ?? []}
            cover={draft.coverImage ?? ""}
            onChange={(value) => field("media", value)}
            onCover={(value) => field("coverImage", value)}
            onBusy={setUploading}
            disabled={busy}
          />
          {!mediaOnly && (
            <section className="space-y-3">
              <h3 className="text-sm font-semibold">Case study</h3>
              {(draft.caseStudy ?? []).map((section, index) => (
                <div
                  key={index}
                  className="space-y-2 rounded-lg border border-border p-3"
                >
                  <Input
                    aria-label={`Section ${index + 1} heading`}
                    value={section.heading}
                    onChange={(event) =>
                      field(
                        "caseStudy",
                        draft.caseStudy?.map((item, i) =>
                          i === index
                            ? { ...item, heading: event.target.value }
                            : item,
                        ),
                      )
                    }
                  />
                  <Textarea
                    aria-label={`Section ${index + 1} body`}
                    rows={4}
                    value={section.body}
                    onChange={(event) =>
                      field(
                        "caseStudy",
                        draft.caseStudy?.map((item, i) =>
                          i === index
                            ? { ...item, body: event.target.value }
                            : item,
                        ),
                      )
                    }
                  />
                  <button
                    type="button"
                    className="min-h-11 text-xs text-signal-red"
                    onClick={() =>
                      field(
                        "caseStudy",
                        draft.caseStudy?.filter((_, i) => i !== index),
                      )
                    }
                  >
                    Remove section
                  </button>
                </div>
              ))}
              <button
                type="button"
                onClick={() =>
                  field("caseStudy", [
                    ...(draft.caseStudy ?? []),
                    { heading: "", body: "" },
                  ])
                }
                className="min-h-11 text-sm text-cyan"
              >
                Add case study section
              </button>
            </section>
          )}
          {error && (
            <p role="alert" className="text-sm text-signal-red">
              {error}
            </p>
          )}
          <div className="flex gap-3 border-t border-border pt-4">
            <Button type="submit" disabled={busy || uploading}>
              {busy
                ? "Saving…"
                : mediaOnly
                  ? "Save media"
                  : project.id
                    ? "Save project"
                    : "Create draft"}
            </Button>
            <Button
              type="button"
              variant="secondary"
              disabled={busy || uploading}
              onClick={onClose}
            >
              Cancel
            </Button>
          </div>
        </div>
        <aside className="min-w-0">
          <div className="sticky top-24 space-y-3">
            <h3 className="text-sm font-semibold">Card preview</h3>
            <p className="text-xs text-muted-foreground">
              Unsaved preview ·{" "}
              {draft.status === "ACTIVE"
                ? "Published when saved"
                : "Private draft"}
            </p>
            <StudioProjectCard
              project={{
                ...draft,
                slug: draft.slug || repositorySlug(draft.title),
                title: draft.title || "Untitled project",
              }}
            />
          </div>
        </aside>
      </form>
    </dialog>
  );
}

export function ProjectsPanel() {
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [message, setMessage] = useState<string | null>(null);
  const [editing, setEditing] = useState<Project | null>(null);
  const [mediaOnly, setMediaOnly] = useState(false);
  const [query, setQuery] = useState("");
  const load = useCallback(async () => {
    try {
      const data = await adminFetch<Project[]>("/admin/projects");
      setProjects(
        data
          .slice()
          .sort((a, b) => (a.homepageOrder ?? 0) - (b.homepageOrder ?? 0)),
      );
      setError(null);
    } catch (err) {
      setError(errorMessage(err));
    } finally {
      setLoading(false);
    }
  }, []);
  useEffect(() => {
    const timer = window.setTimeout(() => void load(), 0);
    return () => window.clearTimeout(timer);
  }, [load]);
  async function update(project: Project, fields: Partial<Project>) {
    setBusy(true);
    setMessage(null);
    try {
      await adminFetch(`/admin/projects/${project.id}`, {
        method: "PATCH",
        body: JSON.stringify(fields),
      });
      await load();
      setMessage(`Saved ${project.title}.`);
    } catch (err) {
      setError(errorMessage(err));
    } finally {
      setBusy(false);
    }
  }
  async function reorder(index: number, delta: number) {
    const list = [...projects];
    const target = index + delta;
    if (target < 0 || target >= list.length) return;
    [list[index], list[target]] = [list[target], list[index]];
    setBusy(true);
    try {
      await adminFetch("/admin/projects/reorder", {
        method: "POST",
        body: JSON.stringify({ ids: list.map((item) => item.id) }),
      });
      await load();
      setMessage("Project order saved.");
    } catch (err) {
      setError(errorMessage(err));
    } finally {
      setBusy(false);
    }
  }
  async function remove(project: Project) {
    if (
      !window.confirm(
        `Delete ${project.title}? This removes its saved project record and gallery references.`,
      )
    )
      return;
    setBusy(true);
    try {
      await adminFetch(`/admin/projects/${project.id}`, { method: "DELETE" });
      await load();
      setMessage("Project deleted.");
    } catch (err) {
      setError(errorMessage(err));
    } finally {
      setBusy(false);
    }
  }
  const visible = projects.filter((project) =>
    `${project.title} ${project.description} ${project.category} ${project.techStack.join(" ")}`
      .toLowerCase()
      .includes(query.toLowerCase()),
  );
  return (
    <div className="space-y-6">
      <header className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-semibold text-foreground">Projects</h1>
          <p className="mt-1 text-sm text-muted-foreground">
            HZ Labs · Publishing, page placement, and project media
          </p>
        </div>
        <div className="flex gap-2">
          <Button
            type="button"
            variant="secondary"
            disabled={busy || loading}
            onClick={() => void load()}
            aria-label="Refresh projects"
          >
            <RefreshCw size={15} />
          </Button>
          <Button
            type="button"
            onClick={() => {
              setMediaOnly(false);
              setEditing(blankProject());
            }}
          >
            <Plus size={16} /> New project
          </Button>
        </div>
      </header>
      <dl className="grid grid-cols-2 gap-4 rounded-xl border border-border bg-surface p-5 sm:grid-cols-4">
        {[
          { label: "Projects", count: projects.length },
          {
            label: "Published",
            count: projects.filter((item) => item.status === "ACTIVE").length,
          },
          {
            label: "On homepage",
            count: projects.filter(
              (item) =>
                item.status === "ACTIVE" &&
                (item.showOnHomepage ?? item.featured),
            ).length,
          },
          {
            label: "Draft / held",
            count: projects.filter((item) => item.status === "DRAFT").length,
          },
        ].map((item) => (
          <div key={item.label}>
            <dt className="text-xs text-muted-foreground">{item.label}</dt>
            <dd className="mt-2 text-2xl tabular-nums text-foreground">
              {item.count}
            </dd>
          </div>
        ))}
      </dl>
      {error && (
        <div
          role="alert"
          className="rounded-lg border border-signal-red/30 p-3 text-sm text-signal-red"
        >
          {error}{" "}
          <button onClick={() => void load()} className="ml-2 underline">
            Retry
          </button>
        </div>
      )}
      {message && (
        <p role="status" className="text-sm text-signal-green">
          {message}
        </p>
      )}
      <div className="flex flex-wrap items-center justify-between gap-3">
        <label className="w-full max-w-md text-xs text-muted-foreground">
          Search projects
          <Input
            value={query}
            onChange={(event) => setQuery(event.target.value)}
            placeholder="Title, category, or technology"
            className="mt-1"
          />
        </label>
        <Link
          href="/admin/github"
          className="text-sm text-cyan hover:underline"
        >
          GitHub imports & review queue →
        </Link>
      </div>
      {loading ? (
        <p role="status" className="py-6 text-sm text-muted-foreground">
          Loading saved projects…
        </p>
      ) : (
        <div className="overflow-x-auto rounded-xl border border-border bg-surface">
          <table className="w-full min-w-[740px] text-left text-sm">
            <caption className="sr-only">
              Project publishing and placement controls
            </caption>
            <thead className="text-xs text-muted-foreground">
              <tr>
                {[
                  "Project",
                  "Publication",
                  "Home",
                  "Projects",
                  "Order",
                  "Actions",
                ].map((label) => (
                  <th key={label} scope="col" className="p-4 font-normal">
                    {label}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {visible.map((project) => {
                const index = projects.findIndex(
                  (item) => item.id === project.id,
                );
                return (
                  <tr key={project.id} className="border-t border-border">
                    <td className="max-w-[330px] p-4">
                      <strong className="block font-medium text-foreground">
                        {project.title}
                      </strong>
                      <span className="mt-1 block text-xs text-muted-foreground">
                        {project.category} · {project.media?.length ?? 0} media
                      </span>
                      <button
                        type="button"
                        aria-label={`Manage photos and videos for ${project.title}`}
                        disabled={busy}
                        onClick={() => {
                          setMediaOnly(true);
                          setEditing(project);
                        }}
                        className="mt-1 flex min-h-11 items-center gap-2 text-sm text-foreground underline-offset-4 hover:underline focus-visible:outline-2 focus-visible:outline-offset-2 disabled:opacity-50"
                      >
                        <ImagePlus size={16} aria-hidden="true" /> Photos &
                        videos
                      </button>
                      {project.updatedAt && (
                        <time
                          className="mt-1 block text-xs text-muted-foreground"
                          dateTime={project.updatedAt}
                        >
                          Updated{" "}
                          {new Date(project.updatedAt).toLocaleDateString()}
                        </time>
                      )}
                    </td>
                    <td className="p-4">
                      <button
                        type="button"
                        disabled={busy}
                        onClick={() =>
                          void update(project, {
                            status:
                              project.status === "ACTIVE" ? "DRAFT" : "ACTIVE",
                          })
                        }
                        className={`min-h-11 rounded-lg border border-border px-3 text-xs ${project.status === "ACTIVE" ? "text-signal-green" : "text-muted-foreground"}`}
                      >
                        {project.status === "ACTIVE"
                          ? "Published · Hold"
                          : project.status === "ARCHIVED"
                            ? "Archived · Publish"
                            : "Draft · Publish"}
                      </button>
                    </td>
                    <td className="p-4">
                      <input
                        type="checkbox"
                        aria-label={`Show ${project.title} on Home`}
                        disabled={busy}
                        checked={project.showOnHomepage ?? project.featured}
                        onChange={(event) =>
                          void update(project, {
                            showOnHomepage: event.target.checked,
                            featured: event.target.checked,
                          })
                        }
                        className="h-5 w-5 accent-cyan"
                      />
                    </td>
                    <td className="p-4">
                      <input
                        type="checkbox"
                        aria-label={`Show ${project.title} on Projects`}
                        disabled={busy}
                        checked={project.showOnProjectsPage ?? true}
                        onChange={(event) =>
                          void update(project, {
                            showOnProjectsPage: event.target.checked,
                          })
                        }
                        className="h-5 w-5 accent-cyan"
                      />
                    </td>
                    <td className="p-4">
                      <div className="flex">
                        <button
                          type="button"
                          disabled={busy || index === 0}
                          aria-label={`Move ${project.title} up`}
                          onClick={() => void reorder(index, -1)}
                          className="grid h-11 w-11 place-items-center disabled:opacity-30"
                        >
                          <ArrowUp size={16} />
                        </button>
                        <button
                          type="button"
                          disabled={busy || index === projects.length - 1}
                          aria-label={`Move ${project.title} down`}
                          onClick={() => void reorder(index, 1)}
                          className="grid h-11 w-11 place-items-center disabled:opacity-30"
                        >
                          <ArrowDown size={16} />
                        </button>
                      </div>
                    </td>
                    <td className="p-4">
                      <div className="flex">
                        <button
                          type="button"
                          aria-label={`Edit ${project.title}`}
                          onClick={() => {
                            setMediaOnly(false);
                            setEditing({
                              ...project,
                              showOnHomepage:
                                project.showOnHomepage ?? project.featured,
                              showOnProjectsPage:
                                project.showOnProjectsPage ?? true,
                            });
                          }}
                          className="grid h-11 w-11 place-items-center"
                        >
                          <Pencil size={16} />
                        </button>
                        <button
                          type="button"
                          disabled={busy}
                          aria-label={`Delete ${project.title}`}
                          onClick={() => void remove(project)}
                          className="grid h-11 w-11 place-items-center text-signal-red"
                        >
                          <Trash2 size={16} />
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
          {visible.length === 0 && (
            <p className="p-8 text-center text-sm text-muted-foreground">
              {projects.length
                ? "No projects match this search."
                : "No saved projects. Create a draft or review GitHub imports."}
            </p>
          )}
        </div>
      )}
      {editing && (
        <ProjectEditor
          project={editing}
          mediaOnly={mediaOnly}
          onClose={() => setEditing(null)}
          onSaved={async () => {
            await load();
            setMessage("Project saved successfully.");
          }}
        />
      )}
    </div>
  );
}
