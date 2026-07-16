// Canonical technology registry. Each known technology maps to its Simple Icons
// slug (https://simpleicons.org) and official brand color, plus a category for
// grouping. Icons render from cdn.simpleicons.org; unknown techs fall back to a
// colored monogram so the section never shows a broken/generic placeholder.

export type TechCategory =
  | "Languages"
  | "Frontend"
  | "Backend"
  | "Databases"
  | "DevOps & Cloud"
  | "Tools";

export type TechMeta = { slug: string; color: string; category: TechCategory };

export const TECH_REGISTRY: Record<string, TechMeta> = {
  // Languages
  TypeScript: { slug: "typescript", color: "3178C6", category: "Languages" },
  JavaScript: { slug: "javascript", color: "F7DF1E", category: "Languages" },
  Python: { slug: "python", color: "3776AB", category: "Languages" },
  PHP: { slug: "php", color: "777BB4", category: "Languages" },
  Java: { slug: "openjdk", color: "437291", category: "Languages" },
  "C++": { slug: "cplusplus", color: "00599C", category: "Languages" },
  HTML: { slug: "html5", color: "E34F26", category: "Frontend" },
  CSS: { slug: "css", color: "663399", category: "Frontend" },
  Shell: { slug: "gnubash", color: "4EAA25", category: "Languages" },

  // Frontend
  React: { slug: "react", color: "61DAFB", category: "Frontend" },
  "Next.js": { slug: "nextdotjs", color: "FFFFFF", category: "Frontend" },
  Redux: { slug: "redux", color: "764ABC", category: "Frontend" },
  "Tailwind CSS": { slug: "tailwindcss", color: "06B6D4", category: "Frontend" },
  "Framer Motion": { slug: "framer", color: "0055FF", category: "Frontend" },
  "Three.js": { slug: "threedotjs", color: "FFFFFF", category: "Frontend" },

  // Backend
  "Node.js": { slug: "nodedotjs", color: "5FA04E", category: "Backend" },
  NestJS: { slug: "nestjs", color: "E0234E", category: "Backend" },
  Express: { slug: "express", color: "FFFFFF", category: "Backend" },
  GraphQL: { slug: "graphql", color: "E10098", category: "Backend" },
  Prisma: { slug: "prisma", color: "5A67D8", category: "Backend" },

  // Databases
  PostgreSQL: { slug: "postgresql", color: "4169E1", category: "Databases" },
  MongoDB: { slug: "mongodb", color: "47A248", category: "Databases" },
  MySQL: { slug: "mysql", color: "4479A1", category: "Databases" },
  Supabase: { slug: "supabase", color: "3FCF8E", category: "Databases" },

  // DevOps & Cloud
  Docker: { slug: "docker", color: "2496ED", category: "DevOps & Cloud" },
  Cloudinary: { slug: "cloudinary", color: "3448C5", category: "DevOps & Cloud" },
  Vercel: { slug: "vercel", color: "FFFFFF", category: "DevOps & Cloud" },
  Netlify: { slug: "netlify", color: "00C7B7", category: "DevOps & Cloud" },

  // Tools
  Git: { slug: "git", color: "F05032", category: "Tools" },
  GitHub: { slug: "github", color: "FFFFFF", category: "Tools" },
  Postman: { slug: "postman", color: "FF6C37", category: "Tools" },
  Figma: { slug: "figma", color: "F24E1E", category: "Tools" },
};

export const CATEGORY_ORDER: TechCategory[] = [
  "Languages",
  "Frontend",
  "Backend",
  "Databases",
  "DevOps & Cloud",
  "Tools",
];

export function lookupTech(name: string): TechMeta | undefined {
  return TECH_REGISTRY[name] ?? TECH_REGISTRY[titleize(name)];
}

/** Official Simple Icons CDN URL for a slug, tinted to the brand color. */
export function techIconUrl(meta: TechMeta): string {
  return `https://cdn.simpleicons.org/${meta.slug}/${meta.color}`;
}

function titleize(value: string): string {
  return value.replace(/[-_]+/g, " ").replace(/\b\w/g, (c) => c.toUpperCase());
}

/**
 * Given a list of raw tech names (from GitHub languages/topics + skills),
 * return only the registry-known ones grouped by category, de-duplicated.
 */
export function groupTechnologies(names: string[]): { category: TechCategory; items: { name: string; meta: TechMeta }[] }[] {
  const seen = new Set<string>();
  const byCategory = new Map<TechCategory, { name: string; meta: TechMeta }[]>();

  for (const name of names) {
    const meta = lookupTech(name);
    if (!meta || seen.has(name)) continue;
    seen.add(name);
    const list = byCategory.get(meta.category) ?? [];
    list.push({ name, meta });
    byCategory.set(meta.category, list);
  }

  return CATEGORY_ORDER.filter((category) => byCategory.has(category)).map((category) => ({
    category,
    items: byCategory.get(category)!,
  }));
}
