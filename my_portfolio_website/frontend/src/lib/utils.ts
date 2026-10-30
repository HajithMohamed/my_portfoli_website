import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function normalizeApiBaseUrl(
  rawUrl: string | undefined = process.env.NEXT_PUBLIC_API_URL,
): string {
  const trimmed = rawUrl?.trim();
  if (!trimmed) {
    return "http://localhost:4000";
  }
  const withScheme = /^[a-zA-Z][a-zA-Z\d+\-.]*:\/\//.test(trimmed)
    ? trimmed
    : trimmed.startsWith("localhost") || trimmed.startsWith("127.0.0.1")
      ? `http://${trimmed}`
      : `https://${trimmed}`;
  try {
    const parsed = new URL(withScheme);
    const cleanedPath = parsed.pathname.replace(/\/+$/, "");
    if (
      cleanedPath === "" ||
      cleanedPath === "/api" ||
      cleanedPath === "/bff"
    ) {
      return parsed.origin;
    }
    return `${parsed.origin}${cleanedPath}`;
  } catch {
    return trimmed.replace(/\/+$/, "");
  }
}

export function absoluteApiUrl(path: string) {
  const baseUrl = normalizeApiBaseUrl();
  return `${baseUrl}/${path.replace(/^\//, "")}`;
}

export function formatDate(value?: string | Date | null) {
  if (!value) {
    return "Draft";
  }
  return new Intl.DateTimeFormat("en", {
    month: "short",
    day: "numeric",
    year: "numeric",
  }).format(new Date(value));
}
