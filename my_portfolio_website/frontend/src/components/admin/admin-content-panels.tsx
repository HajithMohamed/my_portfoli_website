"use client";

import { FormEvent, useEffect, useState } from "react";
import { Plus, Star, Trash2, UploadCloud } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input, Textarea } from "@/components/ui/input";
import { adminFetch, bffUrl } from "@/lib/api";
import type { Certificate, MediaAsset, Testimonial } from "@/lib/types";

function SectionHeader({ title, description }: { title: string; description: string }) {
  return (
    <div className="mb-6">
      <h1 className="font-display text-3xl font-semibold text-white">{title}</h1>
      <p className="mt-2 text-sm leading-6 text-slate-400">{description}</p>
    </div>
  );
}

function useList<T>(path: string) {
  const [data, setData] = useState<T[]>([]);
  const [error, setError] = useState<string | null>(null);

  async function load() {
    try {
      setData(await adminFetch<T[]>(path));
      setError(null);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Request failed");
    }
  }

  useEffect(() => {
    const id = window.setTimeout(() => void load(), 0);
    return () => window.clearTimeout(id);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [path]);

  return { data, error, load };
}

async function uploadImage(file: File, folder: string): Promise<{ url: string; publicId: string }> {
  const form = new FormData();
  form.set("file", file);
  const response = await fetch(bffUrl(`/admin/uploads?folder=${folder}`), {
    method: "POST",
    credentials: "include",
    body: form,
  });
  if (!response.ok) {
    throw new Error(await response.text());
  }
  return (await response.json()) as { url: string; publicId: string };
}

// ---- Media / photos ----------------------------------------------------------

export function MediaPanel() {
  const { data: media, error, load } = useList<MediaAsset>("/admin/media");
  const [uploading, setUploading] = useState(false);
  const [msg, setMsg] = useState<string | null>(null);

  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const form = new FormData(event.currentTarget);
    const file = form.get("file");
    if (!(file instanceof File) || file.size === 0) {
      setMsg("Choose an image first.");
      return;
    }
    setUploading(true);
    setMsg(null);
    try {
      const uploaded = await uploadImage(file, "hz-labs/photos");
      await adminFetch("/admin/media", {
        method: "POST",
        body: JSON.stringify({
          url: uploaded.url,
          publicId: uploaded.publicId,
          alt: form.get("alt") || "",
          category: form.get("category") || "gallery",
        }),
      });
      event.currentTarget.reset();
      await load();
    } catch (err) {
      setMsg(err instanceof Error ? err.message : "Upload failed");
    } finally {
      setUploading(false);
    }
  }

  async function remove(id: string) {
    await adminFetch(`/admin/media/${id}`, { method: "DELETE" });
    await load();
  }

  return (
    <>
      <SectionHeader title="Photos & Media" description="Upload personal photos for the gallery and about section. Stored on Cloudinary." />
      <div className="grid gap-6 lg:grid-cols-[0.8fr_1.2fr]">
        <Card>
          <form className="grid gap-3" onSubmit={submit}>
            <Input accept="image/*" name="file" type="file" required />
            <Input name="alt" placeholder="Alt text (description)" />
            <select className="min-h-11 rounded-md border border-white/10 bg-slate-950 px-3 text-sm" defaultValue="gallery" name="category">
              <option value="gallery">Gallery</option>
              <option value="about">About section</option>
            </select>
            <Button disabled={uploading} type="submit">
              <UploadCloud className="h-4 w-4" />
              {uploading ? "Uploading" : "Upload Photo"}
            </Button>
          </form>
          {msg ? <p className="mt-4 text-sm text-red-300">{msg}</p> : null}
          {error ? <p className="mt-2 text-sm text-red-300">{error}</p> : null}
        </Card>
        <Card>
          {media.length ? (
            <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
              {media.map((asset) => (
                <div className="group relative overflow-hidden rounded-lg border border-white/10" key={asset.id}>
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img alt={asset.alt} className="aspect-square w-full object-cover" src={asset.url} />
                  <span className="absolute left-1 top-1 rounded bg-black/60 px-1.5 py-0.5 text-[10px] text-slate-200">{asset.category}</span>
                  <button
                    className="absolute right-1 top-1 rounded bg-black/60 p-1 text-red-300 opacity-0 transition-opacity group-hover:opacity-100"
                    onClick={() => remove(asset.id)}
                    type="button"
                    aria-label="Delete"
                  >
                    <Trash2 className="h-3.5 w-3.5" />
                  </button>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-sm text-slate-400">No photos yet.</p>
          )}
        </Card>
      </div>
    </>
  );
}

// ---- Testimonials ------------------------------------------------------------

export function TestimonialsPanel() {
  const { data: items, error, load } = useList<Testimonial>("/admin/testimonials");

  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const form = new FormData(event.currentTarget);
    await adminFetch("/admin/testimonials", {
      method: "POST",
      body: JSON.stringify({
        author: form.get("author"),
        role: form.get("role") || undefined,
        company: form.get("company") || undefined,
        quote: form.get("quote"),
        project: form.get("project") || undefined,
        avatarUrl: form.get("avatarUrl") || undefined,
        rating: Number(form.get("rating") ?? 5),
        featured: form.get("featured") === "on",
      }),
    });
    event.currentTarget.reset();
    await load();
  }

  async function remove(id: string) {
    await adminFetch(`/admin/testimonials/${id}`, { method: "DELETE" });
    await load();
  }

  return (
    <>
      <SectionHeader title="Testimonials" description="Add genuine testimonials from collaborators. Only featured ones show on the public site; the section stays hidden when empty." />
      <div className="grid gap-6 lg:grid-cols-[0.9fr_1.1fr]">
        <Card>
          <form className="grid gap-3" onSubmit={submit}>
            <Input name="author" placeholder="Author name" required />
            <div className="grid grid-cols-2 gap-3">
              <Input name="role" placeholder="Role" />
              <Input name="company" placeholder="Company" />
            </div>
            <Textarea name="quote" placeholder="Quote" required />
            <Input name="project" placeholder="Related project (optional)" />
            <Input name="avatarUrl" placeholder="Avatar image URL (optional)" />
            <div className="flex items-center gap-4">
              <label className="flex items-center gap-2 text-sm text-slate-300">
                Rating
                <Input className="w-20" defaultValue={5} max={5} min={1} name="rating" type="number" />
              </label>
              <label className="flex items-center gap-2 text-sm text-slate-300">
                <input defaultChecked name="featured" type="checkbox" />
                Featured
              </label>
            </div>
            <Button type="submit">
              <Plus className="h-4 w-4" />
              Add Testimonial
            </Button>
          </form>
          {error ? <p className="mt-4 text-sm text-red-300">{error}</p> : null}
        </Card>
        <Card>
          <div className="grid gap-3">
            {items.length ? (
              items.map((item) => (
                <div className="rounded-md border border-white/10 bg-white/[0.03] p-4" key={item.id}>
                  <div className="flex items-start justify-between gap-3">
                    <div>
                      <div className="flex items-center gap-2 text-sm font-semibold text-white">
                        {item.author}
                        {item.featured ? <Star className="h-3.5 w-3.5 text-amber-300" /> : null}
                      </div>
                      <p className="mt-1 text-xs text-slate-500">{[item.role, item.company].filter(Boolean).join(" · ")}</p>
                      <p className="mt-2 text-sm italic leading-6 text-slate-300">&ldquo;{item.quote}&rdquo;</p>
                    </div>
                    <Button onClick={() => remove(item.id)} size="sm" type="button" variant="secondary">
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              ))
            ) : (
              <p className="text-sm text-slate-400">No testimonials yet.</p>
            )}
          </div>
        </Card>
      </div>
    </>
  );
}

// ---- Certificates & achievements ---------------------------------------------

export function CertificatesPanel() {
  const { data: items, error, load } = useList<Certificate>("/admin/certificates");
  const [uploading, setUploading] = useState(false);

  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const currentForm = event.currentTarget;
    const form = new FormData(currentForm);
    let imageUrl = String(form.get("imageUrl") ?? "");
    const file = form.get("file");
    if (file instanceof File && file.size > 0) {
      setUploading(true);
      try {
        imageUrl = (await uploadImage(file, "hz-labs/certificates")).url;
      } finally {
        setUploading(false);
      }
    }
    await adminFetch("/admin/certificates", {
      method: "POST",
      body: JSON.stringify({
        title: form.get("title"),
        issuer: form.get("issuer"),
        type: form.get("type") || "certification",
        issueDate: form.get("issueDate") || undefined,
        credentialUrl: form.get("credentialUrl") || undefined,
        imageUrl: imageUrl || undefined,
      }),
    });
    currentForm.reset();
    await load();
  }

  async function remove(id: string) {
    await adminFetch(`/admin/certificates/${id}`, { method: "DELETE" });
    await load();
  }

  return (
    <>
      <SectionHeader title="Certifications & Achievements" description="Add certifications and achievements. Shown in the Credentials section on the public site." />
      <div className="grid gap-6 lg:grid-cols-[0.9fr_1.1fr]">
        <Card>
          <form className="grid gap-3" onSubmit={submit}>
            <Input name="title" placeholder="Title" required />
            <Input name="issuer" placeholder="Issuer / organization" required />
            <div className="grid grid-cols-2 gap-3">
              <select className="min-h-11 rounded-md border border-white/10 bg-slate-950 px-3 text-sm" defaultValue="certification" name="type">
                <option value="certification">Certification</option>
                <option value="achievement">Achievement</option>
              </select>
              <Input name="issueDate" type="date" />
            </div>
            <Input name="credentialUrl" placeholder="Credential URL (optional)" />
            <Input accept="image/*" name="file" type="file" />
            <Input name="imageUrl" placeholder="…or image URL (optional)" />
            <Button disabled={uploading} type="submit">
              <Plus className="h-4 w-4" />
              {uploading ? "Uploading" : "Add Credential"}
            </Button>
          </form>
          {error ? <p className="mt-4 text-sm text-red-300">{error}</p> : null}
        </Card>
        <Card>
          <div className="grid gap-3">
            {items.length ? (
              items.map((item) => (
                <div className="flex items-center justify-between gap-3 rounded-md border border-white/10 bg-white/[0.03] p-4" key={item.id}>
                  <div>
                    <div className="text-sm font-semibold text-white">{item.title}</div>
                    <p className="text-xs text-slate-500">
                      {item.issuer} · <span className="capitalize">{item.type}</span>
                    </p>
                  </div>
                  <Button onClick={() => remove(item.id)} size="sm" type="button" variant="secondary">
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              ))
            ) : (
              <p className="text-sm text-slate-400">No credentials yet.</p>
            )}
          </div>
        </Card>
      </div>
    </>
  );
}
