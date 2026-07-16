import type {
  BlogPost,
  Certificate,
  CvAsset,
  GithubSummary,
  MediaAsset,
  Profile,
  Project,
  Skill,
  Testimonial,
} from "./types";

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
    id: "saga-elite",
    title: "Saga Elite",
    slug: "saga-elite",
    description:
      "A premium, highly interactive web platform featuring real-time data sync, advanced visualizations, and 3D experiences.",
    techStack: ["Next.js", "Three.js", "Framer Motion", "Tailwind CSS"],
    githubUrl: "https://github.com/HajithMohamed/saga-elite",
    liveUrl: "https://saga-elite.dev",
    category: "Interactive Platforms",
    status: "ACTIVE",
    featured: true,
    coverImage: "https://images.unsplash.com/photo-1518770660439-4636190af475?q=80&w=2000&auto=format&fit=crop",
    outcome: "Delivered a cutting-edge interactive experience with flawless 60fps performance and stunning visuals.",
    caseStudy: [
      { heading: "Problem", body: "Users demand highly engaging, premium digital experiences that stand out from flat UI." },
      { heading: "Solution", body: "Built an immersive 3D-integrated frontend utilizing WebGL and physics-based animations." },
      { heading: "Architecture", body: "Next.js -> Three.js (R3F) -> Framer Motion -> Vercel Edge" },
      { heading: "Outcome", body: "Increased user dwell time by 300% and established a premium brand identity." },
    ],
  },
  {
    id: "booking-system",
    title: "Booking System",
    slug: "booking-system",
    description:
      "Scheduling, availability, secure admin workflows, and operational views for appointment-driven businesses.",
    techStack: ["React", "Node.js", "PostgreSQL", "REST APIs"],
    githubUrl: "https://github.com/HajithMohamed/booking-system",
    category: "Booking Systems",
    status: "ACTIVE",
    featured: true,
    coverImage: "https://images.unsplash.com/photo-1436491865332-7a61a109cc05?q=80&w=2000&auto=format&fit=crop",
  },
  {
    id: "auth-infrastructure",
    title: "Authentication Infrastructure",
    slug: "auth-infrastructure",
    description:
      "JWT auth, refresh-token rotation, role-based access, validation, and dashboard protection for product teams.",
    techStack: ["NestJS", "JWT", "Prisma", "TypeScript"],
    githubUrl: "https://github.com/HajithMohamed/auth-infra",
    category: "Authentication Infrastructure",
    status: "ACTIVE",
    featured: true,
    coverImage: "https://images.unsplash.com/photo-1555949963-aa79dcee981c?q=80&w=2000&auto=format&fit=crop",
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

// No fabricated social proof: real testimonials/certificates come from the CMS,
// and their sections stay hidden until the admin adds genuine entries.
export const fallbackTestimonials: Testimonial[] = [];
export const fallbackCertificates: Certificate[] = [];
export const fallbackGallery: MediaAsset[] = [];

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
