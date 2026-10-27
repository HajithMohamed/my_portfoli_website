"use client";

import { useRef, useState } from "react";
import Image from "next/image";
import { ArrowDown, ArrowUp, ImagePlus, Trash2 } from "lucide-react";
import { bffUrl } from "@/lib/api";
import type { ProjectMedia } from "@/lib/types";

type UploadedMedia = {
  url: string;
  publicId: string;
  resourceType: string;
  bytes: number;
  mimeType: string;
  provider: string;
  posterUrl?: string;
};

type FailedUpload = { file: File; message: string };

async function uploadError(response: Response) {
  const text = await response.text();
  try {
    const body = JSON.parse(text) as { message?: string | string[] };
    if (body.message)
      return Array.isArray(body.message)
        ? body.message.join(". ")
        : body.message;
  } catch {
    // A proxy may return plain text instead of an API error.
  }
  return `Upload failed (HTTP ${response.status}). Please try again.`;
}

export function ProjectMediaStudio({
  media,
  cover,
  onChange,
  onCover,
  onBusy,
  disabled = false,
}: {
  media: ProjectMedia[];
  cover: string;
  onChange: (media: ProjectMedia[]) => void;
  onCover: (url: string) => void;
  onBusy: (busy: boolean) => void;
  disabled?: boolean;
}) {
  const [upload, setUpload] = useState<{
    done: number;
    total: number;
    name: string;
  } | null>(null);
  const [failures, setFailures] = useState<FailedUpload[]>([]);
  const [message, setMessage] = useState<string | null>(null);
  const [localPreview, setLocalPreview] = useState<{
    url: string;
    video: boolean;
  } | null>(null);
  const dragIndex = useRef<number | null>(null);
  const picker = useRef<HTMLInputElement>(null);
  const uploadLock = useRef(false);
  const unavailable = disabled || Boolean(upload);

  function move(from: number, to: number) {
    if (unavailable || from < 0 || to < 0 || to >= media.length || from === to)
      return;
    const reordered = [...media];
    reordered.splice(to, 0, reordered.splice(from, 1)[0]);
    onChange(reordered.map((item, order) => ({ ...item, order })));
  }

  async function uploadFiles(files: File[]) {
    if (!files.length || disabled || uploadLock.current) return;
    uploadLock.current = true;
    setFailures([]);
    setMessage(null);
    onBusy(true);
    const added: ProjectMedia[] = [];
    const failed: FailedUpload[] = [];
    let previewUrl: string | undefined;
    try {
      for (let i = 0; i < files.length; i++) {
        const file = files[i];
        setUpload({ done: i, total: files.length, name: file.name });
        try {
          const video = file.type.startsWith("video/");
          if (
            !/^(image\/(png|jpeg|webp|gif)|video\/(mp4|webm))$/.test(file.type)
          )
            throw new Error(`Unsupported format: ${file.name}`);
          if (file.size > (video ? 60 : 10) * 1024 * 1024)
            throw new Error(
              `${file.name} exceeds the ${video ? 60 : 10} MB limit.`,
            );
          if (previewUrl) URL.revokeObjectURL(previewUrl);
          previewUrl = URL.createObjectURL(file);
          setLocalPreview({ url: previewUrl, video });
          const body = new FormData();
          body.set("file", file);
          const response = await fetch(
            bffUrl("/admin/uploads?folder=hz-labs/projects"),
            { method: "POST", credentials: "include", body },
          );
          if (!response.ok) throw new Error(await uploadError(response));
          const uploaded = (await response.json()) as UploadedMedia;
          if (!uploaded.url || !uploaded.publicId)
            throw new Error(
              "The upload did not return a saved asset. Please try again.",
            );
          added.push({
            url: uploaded.url,
            alt: file.name.replace(/\.[^.]+$/, "").replace(/[_-]+/g, " "),
            type: video ? "VIDEO" : "IMAGE",
            publicId: uploaded.publicId,
            provider: uploaded.provider,
            bytes: uploaded.bytes,
            mimeType: uploaded.mimeType,
            posterUrl: uploaded.posterUrl,
            order: media.length + added.length,
          });
        } catch (err) {
          failed.push({
            file,
            message:
              err instanceof Error
                ? err.message
                : "Upload failed. Please try again.",
          });
        } finally {
          if (previewUrl) URL.revokeObjectURL(previewUrl);
          previewUrl = undefined;
          setLocalPreview(null);
        }
      }
    } finally {
      if (added.length) {
        onChange([...media, ...added]);
        if (!cover) {
          const image = added.find((item) => item.type === "IMAGE");
          const coverUrl =
            image?.url ?? added.find((item) => item.posterUrl)?.posterUrl;
          if (coverUrl) onCover(coverUrl);
        }
        setMessage(
          `${added.length} ${added.length === 1 ? "file" : "files"} uploaded. Save to keep these photos and videos on the project.`,
        );
      }
      setFailures(failed);
      if (previewUrl) URL.revokeObjectURL(previewUrl);
      setLocalPreview(null);
      setUpload(null);
      uploadLock.current = false;
      onBusy(false);
      if (picker.current) picker.current.value = "";
    }
  }

  return (
    <section
      aria-labelledby="media-studio-title"
      aria-busy={Boolean(upload)}
      className="space-y-4 rounded-xl border border-border bg-surface-2 p-4"
    >
      <div>
        <h3 id="media-studio-title" className="font-semibold text-foreground">
          Photos & videos
        </h3>
        <p className="mt-1 text-sm leading-6 text-muted-foreground">
          Upload multiple photos and demo videos to Cloudinary. Choose a cover
          and arrange the gallery in the order you want visitors to see.
        </p>
      </div>
      <div
        onDragOver={(event) => event.preventDefault()}
        onDrop={(event) => {
          event.preventDefault();
          if (event.dataTransfer.files.length)
            void uploadFiles(Array.from(event.dataTransfer.files));
        }}
        className="rounded-lg border border-dashed border-border-strong p-4"
      >
        <button
          type="button"
          onClick={() => picker.current?.click()}
          disabled={unavailable}
          className="flex min-h-11 items-center gap-2 rounded-lg border border-border-strong bg-surface px-4 text-sm text-foreground focus-visible:outline-2 focus-visible:outline-offset-2 disabled:opacity-50"
        >
          <ImagePlus size={18} aria-hidden="true" /> Upload photos & videos
        </button>
        <input
          ref={picker}
          type="file"
          multiple
          accept="image/png,image/jpeg,image/webp,image/gif,video/mp4,video/webm"
          aria-label="Upload project images or videos"
          disabled={unavailable}
          tabIndex={-1}
          onChange={(event) =>
            void uploadFiles(Array.from(event.target.files ?? []))
          }
          className="sr-only"
        />
        <p className="mt-2 text-sm text-muted-foreground">
          Select several files at once or drop them here. PNG, JPG, WebP, GIF up
          to 10 MB each · MP4, WebM up to 60 MB each
        </p>
      </div>
      {upload && (
        <div role="status" className="space-y-2 text-sm">
          <p>
            Uploading {upload.done + 1} of {upload.total}: {upload.name}
          </p>
          <progress
            className="h-2 w-full accent-cyan"
            value={upload.done}
            max={upload.total}
            aria-label="Media upload progress"
          />
          {localPreview &&
            (localPreview.video ? (
              <video
                src={localPreview.url}
                muted
                preload="metadata"
                className="h-24 w-auto rounded"
              />
            ) : (
              <Image
                src={localPreview.url}
                width={144}
                height={96}
                unoptimized
                alt="Local upload preview"
                className="h-24 w-auto rounded"
              />
            ))}
        </div>
      )}
      {failures.length > 0 && (
        <div role="alert" className="space-y-2 text-sm text-signal-red">
          <p>
            {failures.length}{" "}
            {failures.length === 1 ? "file could" : "files could"} not be
            uploaded.
          </p>
          <ul className="list-inside list-disc break-words">
            {failures.map(({ file, message }, index) => (
              <li key={`${file.name}-${index}`}>
                {file.name}: {message}
              </li>
            ))}
          </ul>
          <button
            type="button"
            disabled={unavailable}
            onClick={() => void uploadFiles(failures.map(({ file }) => file))}
            className="min-h-11 underline disabled:opacity-50"
          >
            Retry failed uploads
          </button>
        </div>
      )}
      {message && (
        <p role="status" className="text-sm text-muted-foreground">
          {message}
        </p>
      )}
      {media.length === 0 && (
        <p className="text-sm text-muted-foreground">
          No photos or videos yet. You can add several files in one upload.
        </p>
      )}
      <div className="space-y-3">
        {media.map((item, index) => (
          <div
            key={`${item.url}-${index}`}
            draggable={!unavailable}
            onDragStart={() => {
              dragIndex.current = index;
            }}
            onDragOver={(event) => event.preventDefault()}
            onDrop={(event) => {
              event.preventDefault();
              event.stopPropagation();
              if (dragIndex.current !== null) move(dragIndex.current, index);
              dragIndex.current = null;
            }}
            className="space-y-3 rounded-lg border border-border bg-surface p-3"
          >
            <div className="flex flex-wrap items-start gap-3">
              {item.type === "VIDEO" ? (
                <video
                  src={item.url}
                  poster={item.posterUrl ?? undefined}
                  controls
                  preload="none"
                  playsInline
                  aria-label={item.alt || "Project video preview"}
                  className="h-24 w-36 rounded object-contain"
                />
              ) : (
                <Image
                  src={item.url}
                  width={144}
                  height={96}
                  unoptimized
                  alt={item.alt}
                  loading="lazy"
                  className="h-24 w-36 rounded object-cover"
                />
              )}
              <div className="min-w-0 flex-1 space-y-2">
                <p className="text-xs text-muted-foreground">
                  {item.type === "VIDEO" ? "Demo video" : "Screenshot"} ·{" "}
                  {index + 1}
                </p>
                {(item.type !== "VIDEO" || item.posterUrl) && (
                  <button
                    type="button"
                    disabled={unavailable}
                    onClick={() =>
                      onCover(
                        item.type === "VIDEO" ? item.posterUrl! : item.url,
                      )
                    }
                    className="min-h-11 text-sm text-cyan"
                  >
                    {cover ===
                    (item.type === "VIDEO" ? item.posterUrl : item.url)
                      ? "Cover image selected"
                      : item.type === "VIDEO"
                        ? "Use video poster as cover"
                        : "Use as cover"}
                  </button>
                )}
              </div>
              <div className="flex items-center gap-1">
                {[
                  { icon: ArrowUp, label: "Move media up", target: index - 1 },
                  {
                    icon: ArrowDown,
                    label: "Move media down",
                    target: index + 1,
                  },
                ].map(({ icon: Icon, label, target }) => (
                  <button
                    key={label}
                    type="button"
                    aria-label={label}
                    disabled={
                      unavailable || target < 0 || target >= media.length
                    }
                    onClick={() => move(index, target)}
                    className="grid h-11 w-11 place-items-center rounded border border-border disabled:opacity-30"
                  >
                    <Icon size={16} />
                  </button>
                ))}
                <button
                  type="button"
                  aria-label={`Remove media ${index + 1}`}
                  disabled={unavailable}
                  onClick={() => {
                    onChange(
                      media
                        .filter((_, i) => i !== index)
                        .map((asset, order) => ({ ...asset, order })),
                    );
                    if (cover === item.url || cover === item.posterUrl)
                      onCover("");
                  }}
                  className="grid h-11 w-11 place-items-center rounded border border-border text-signal-red"
                >
                  <Trash2 size={16} />
                </button>
              </div>
            </div>
            <label className="block text-sm text-muted-foreground">
              Alternative text
              <input
                value={item.alt}
                disabled={unavailable}
                onChange={(event) =>
                  onChange(
                    media.map((asset, i) =>
                      i === index
                        ? { ...asset, alt: event.target.value }
                        : asset,
                    ),
                  )
                }
                className="mt-1 min-h-10 w-full rounded border border-border bg-surface-2 px-3 text-sm text-foreground"
              />
            </label>
            <label className="block text-sm text-muted-foreground">
              Caption
              <input
                value={item.caption ?? ""}
                disabled={unavailable}
                onChange={(event) =>
                  onChange(
                    media.map((asset, i) =>
                      i === index
                        ? { ...asset, caption: event.target.value }
                        : asset,
                    ),
                  )
                }
                className="mt-1 min-h-10 w-full rounded border border-border bg-surface-2 px-3 text-sm text-foreground"
              />
            </label>
          </div>
        ))}
      </div>
      <p className="text-sm text-muted-foreground">
        Save the project to persist media changes. Removing an item detaches it
        from this gallery.
      </p>
    </section>
  );
}
