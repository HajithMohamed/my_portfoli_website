import type { BlogPost, CvAsset, GithubSummary, Profile, Project, Skill } from "./types";

export const fallbackProfile: Profile = {
  name: "Mohamed Hajith",
  title: "Independent Software Engineer",
  tagline: "Building Digital Products, Platforms, and Scalable Systems",
  availabilityStatus: "Available for internships and software engineering opportunities",
  bio: "Full Stack Developer building modern web platforms, booking systems, authentication infrastructure, e-commerce solutions, and business automation software.",
  philosophy:
    "I enjoy building software that solves real operational problems. Whether it's a booking platform, authentication system, or commerce solution, I focus on scalability, maintainability, security, and user experience.",
  location: "Sri Lanka",
  email: "hello@hzlabs.dev",
  currentlyExploring: ["NestJS Architecture", "System Design", "Docker", "Data Science", "AI Integration"],
  timeline: [
    { label: "Education", value: "Computer Science undergraduate" },
    { label: "Internship", value: "Available for software engineering opportunities" },
    { label: "Major Projects", value: "Commerce, booking, authentication, and admin systems" },
    { label: "Achievements", value: "Built multiple full-stack product foundations" },
  ],
  socialLinks: [
    { label: "GitHub", url: "https://github.com/HajithMohamed", icon: "github" },
    { label: "LinkedIn", url: "https://www.linkedin.com/", icon: "linkedin" },
    { label: "Email", url: "mailto:hello@hzlabs.dev", icon: "mail" },
  ],
};

export const fallbackSkills: Skill[] = [
  "React|Frontend|92",
  "Next.js|Frontend|90",
  "TypeScript|Frontend|88",
  "Redux Toolkit|Frontend|82",
  "Tailwind CSS|Frontend|90",
  "Node.js|Backend|88",
  "Express|Backend|84",
  "NestJS|Backend|82",
  "PHP|Backend|74",
  "MongoDB|Database|82",
  "PostgreSQL|Database|84",
  "MySQL|Database|78",
  "Git|Tools|88",
  "GitHub|Tools|88",
  "Docker|Tools|72",
  "Postman|Tools|86",
  "Figma|Tools|74",
].map((item, index) => {
  const [name, category, proficiency] = item.split("|");
  return {
    id: `${category}-${name}`,
    name,
    category,
    proficiency: Number(proficiency),
    featured: index < 8,
    order: index,
  };
});

export const fallbackProjects: Project[] = [
  {
    id: "commerce-platform",
    title: "Commerce Platform",
    slug: "commerce-platform",
    description:
      "A full-stack e-commerce foundation with catalog management, checkout-ready architecture, authentication, and admin workflows.",
    techStack: ["Next.js", "NestJS", "PostgreSQL", "JWT", "Cloudinary"],
    githubUrl: "https://github.com/HajithMohamed",
    liveUrl: "https://hzlabs.dev",
    category: "Commerce Platforms",
    status: "ACTIVE",
    featured: true,
    outcome: "Created a scalable storefront and operational dashboard pattern for product-led businesses.",
    caseStudy: [
      { heading: "Problem", body: "Small businesses need a flexible commerce stack that can grow without rebuilding core workflows." },
      { heading: "Solution", body: "Designed a modular frontend, API, database model, and admin layer that separates content, product data, and operations." },
      { heading: "Architecture", body: "Next.js -> NestJS API -> PostgreSQL -> JWT Authentication -> Cloudinary" },
      { heading: "Outcome", body: "A reusable commerce foundation for inventory, content, and customer journeys." },
    ],
  },
  {
    id: "booking-system",
    title: "Booking System",
    slug: "booking-system",
    description:
      "Scheduling, availability, secure admin workflows, and operational views for appointment-driven businesses.",
    techStack: ["React", "Node.js", "PostgreSQL", "REST APIs"],
    githubUrl: "https://github.com/HajithMohamed",
    category: "Booking Systems",
    status: "ACTIVE",
    featured: true,
  },
  {
    id: "auth-infrastructure",
    title: "Authentication Infrastructure",
    slug: "auth-infrastructure",
    description:
      "JWT auth, refresh-token rotation, role-based access, validation, and dashboard protection for product teams.",
    techStack: ["NestJS", "JWT", "Argon2", "Prisma"],
    githubUrl: "https://github.com/HajithMohamed",
    category: "Authentication Infrastructure",
    status: "ACTIVE",
    featured: true,
  },
];

export const fallbackBlogs: BlogPost[] = [
  {
    id: "building-operational-web-platforms",
    title: "Building Operational Web Platforms",
    slug: "building-operational-web-platforms",
    excerpt: "How HZ Labs approaches maintainable full-stack systems for real business workflows.",
    content:
      "# Building Operational Web Platforms\n\nGreat platforms start with clear workflows, durable data models, and interfaces that make daily work easier.",
    status: "PUBLISHED",
    publishedAt: new Date().toISOString(),
    tags: [
      { name: "Engineering", slug: "engineering" },
      { name: "Systems", slug: "systems" },
    ],
  },
];

export const fallbackResume: CvAsset | null = null;

export const fallbackGithub: GithubSummary = {
  username: "HajithMohamed",
  repositoryCount: 0,
  commitCount: 0,
  languages: ["TypeScript", "JavaScript", "PHP", "SQL"],
  recentRepos: fallbackProjects.map((project) => ({
    name: project.slug,
    description: project.description,
    url: project.githubUrl ?? "https://github.com/HajithMohamed",
    language: project.techStack[0],
  })),
  recentActivity: [],
};
