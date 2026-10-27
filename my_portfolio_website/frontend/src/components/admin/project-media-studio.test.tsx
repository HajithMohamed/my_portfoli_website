import { useState } from "react";
import {
  cleanup,
  fireEvent,
  render,
  screen,
  waitFor,
} from "@testing-library/react";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import type { ProjectMedia } from "@/lib/types";
import { ProjectMediaStudio } from "./project-media-studio";

vi.mock("@/lib/api", () => ({
  bffUrl: (path: string) => `/bff${path}`,
}));

const fetchMock = vi.fn();
const busy = vi.fn();
const existing: ProjectMedia = {
  url: "https://res.cloudinary.com/demo/image/upload/existing.jpg",
  alt: "Existing screenshot",
  type: "IMAGE",
  order: 0,
  caption: "Previously saved",
};

function Harness({ initialMedia = [] }: { initialMedia?: ProjectMedia[] }) {
  const [media, setMedia] = useState(initialMedia);
  const [cover, setCover] = useState("");
  return (
    <>
      <ProjectMediaStudio
        media={media}
        cover={cover}
        onChange={setMedia}
        onCover={setCover}
        onBusy={busy}
      />
      <output data-testid="saved-gallery">{JSON.stringify(media)}</output>
      <output data-testid="selected-cover">{cover}</output>
    </>
  );
}

function asset(name: string, video = false) {
  return {
    url: `https://res.cloudinary.com/demo/${video ? "video" : "image"}/upload/${name}.${video ? "mp4" : "jpg"}`,
    publicId: `hz-labs/projects/${name}`,
    resourceType: video ? "video" : "image",
    bytes: video ? 4096 : 1024,
    mimeType: video ? "video/mp4" : "image/jpeg",
    provider: "cloudinary",
    ...(video
      ? {
          posterUrl: `https://res.cloudinary.com/demo/video/upload/${name}.jpg`,
        }
      : {}),
  };
}

function success(uploaded: ReturnType<typeof asset>) {
  return { ok: true, json: async () => uploaded };
}

function gallery(): ProjectMedia[] {
  return JSON.parse(screen.getByTestId("saved-gallery").textContent ?? "[]");
}

function uploadedNames() {
  return fetchMock.mock.calls.map(([, options]) => {
    const file = (options.body as FormData).get("file") as File;
    return file.name;
  });
}

beforeEach(() => {
  fetchMock.mockReset();
  busy.mockReset();
  vi.stubGlobal("fetch", fetchMock);
  vi.stubGlobal(
    "URL",
    class extends URL {
      static createObjectURL = vi.fn(() => "blob:project-upload-preview");
      static revokeObjectURL = vi.fn();
    },
  );
});

afterEach(() => {
  cleanup();
  vi.unstubAllGlobals();
});

describe("Project photo and video uploads", () => {
  it("appends several selected photos and a video without losing existing media or Cloudinary metadata", async () => {
    const first = asset("overview");
    const second = asset("settings");
    const demo = asset("walkthrough", true);
    fetchMock
      .mockResolvedValueOnce(success(first))
      .mockResolvedValueOnce(success(second))
      .mockResolvedValueOnce(success(demo));
    render(<Harness initialMedia={[existing]} />);
    const picker = screen.getByLabelText("Upload project images or videos");
    expect((picker as HTMLInputElement).multiple).toBe(true);

    fireEvent.change(picker, {
      target: {
        files: [
          new File(["photo"], "overview.jpg", { type: "image/jpeg" }),
          new File(["photo"], "settings.jpg", { type: "image/jpeg" }),
          new File(["video"], "walkthrough.mp4", { type: "video/mp4" }),
        ],
      },
    });

    await waitFor(() => expect(gallery()).toHaveLength(4));
    expect(gallery()[0]).toEqual(existing);
    expect(gallery().slice(1)).toEqual(
      [
        {
          ...first,
          resourceType: undefined,
          alt: "overview",
          type: "IMAGE",
          order: 1,
        },
        {
          ...second,
          resourceType: undefined,
          alt: "settings",
          type: "IMAGE",
          order: 2,
        },
        {
          ...demo,
          resourceType: undefined,
          alt: "walkthrough",
          type: "VIDEO",
          order: 3,
        },
      ].map((media) =>
        Object.fromEntries(
          Object.entries(media).filter(([key]) => key !== "resourceType"),
        ),
      ),
    );
    expect(uploadedNames()).toEqual([
      "overview.jpg",
      "settings.jpg",
      "walkthrough.mp4",
    ]);
    for (const [url, options] of fetchMock.mock.calls) {
      expect(url).toBe("/bff/admin/uploads?folder=hz-labs/projects");
      expect(options).toMatchObject({ method: "POST", credentials: "include" });
    }
    expect(screen.getByTestId("selected-cover").textContent).toBe(first.url);
    expect(busy.mock.calls).toEqual([[true], [false]]);
    expect(URL.revokeObjectURL).toHaveBeenCalledTimes(3);
  });

  it("keeps successful uploads, continues after a failure, and retries only the failed file", async () => {
    fetchMock
      .mockResolvedValueOnce(success(asset("first")))
      .mockResolvedValueOnce({
        ok: false,
        status: 503,
        text: async () =>
          JSON.stringify({ message: "Cloudinary is temporarily unavailable" }),
      })
      .mockResolvedValueOnce(success(asset("demo", true)))
      .mockResolvedValueOnce(success(asset("second")));
    render(<Harness />);
    fireEvent.change(screen.getByLabelText("Upload project images or videos"), {
      target: {
        files: [
          new File(["photo"], "first.jpg", { type: "image/jpeg" }),
          new File(["photo"], "second.jpg", { type: "image/jpeg" }),
          new File(["video"], "demo.mp4", { type: "video/mp4" }),
        ],
      },
    });

    await waitFor(() => expect(gallery()).toHaveLength(2));
    expect(uploadedNames()).toEqual(["first.jpg", "second.jpg", "demo.mp4"]);
    expect(screen.getByRole("alert").textContent).toContain(
      "second.jpg: Cloudinary is temporarily unavailable",
    );
    expect(gallery().map(({ type }) => type)).toEqual(["IMAGE", "VIDEO"]);

    fireEvent.click(
      screen.getByRole("button", { name: "Retry failed uploads" }),
    );
    await waitFor(() => expect(gallery()).toHaveLength(3));
    expect(uploadedNames()).toEqual([
      "first.jpg",
      "second.jpg",
      "demo.mp4",
      "second.jpg",
    ]);
    expect(gallery().map(({ order }) => order)).toEqual([0, 1, 2]);
    expect(screen.queryByRole("alert")).toBeNull();
    expect(busy.mock.calls).toEqual([[true], [false], [true], [false]]);
  });

  it("skips unsupported and oversized files while still uploading valid selections", async () => {
    fetchMock.mockResolvedValueOnce(success(asset("valid")));
    const oversized = new File(["photo"], "large.jpg", { type: "image/jpeg" });
    Object.defineProperty(oversized, "size", { value: 10 * 1024 * 1024 + 1 });
    render(<Harness />);
    fireEvent.change(screen.getByLabelText("Upload project images or videos"), {
      target: {
        files: [
          new File(["pdf"], "notes.pdf", { type: "application/pdf" }),
          oversized,
          new File(["photo"], "valid.jpg", { type: "image/jpeg" }),
        ],
      },
    });

    await waitFor(() => expect(gallery()).toHaveLength(1));
    expect(uploadedNames()).toEqual(["valid.jpg"]);
    const errors = screen.getByRole("alert").textContent;
    expect(errors).toContain("Unsupported format: notes.pdf");
    expect(errors).toContain("large.jpg exceeds the 10 MB limit");
    expect(gallery()[0].url).toBe(asset("valid").url);
    expect(busy).toHaveBeenLastCalledWith(false);
  });
});
