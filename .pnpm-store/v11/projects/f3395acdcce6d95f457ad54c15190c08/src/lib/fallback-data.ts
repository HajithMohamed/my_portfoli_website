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
    id: "shoe-bank-mernstack",
    title: "Shoe Bank MERN Stack",
    slug: "shoe-bank-mernstack",
    description:
      "A MERN-stack shoe banking and commerce platform with product workflows, account logic, and admin-ready foundations.",
    techStack: ["React", "Node.js", "Express", "MongoDB"],
    githubUrl: "https://github.com/HajithMohamed/SHOE_Bank_Mrnstack",
    category: "MERN Commerce",
    status: "ACTIVE",
    featured: true,
    coverImage: "https://images.unsplash.com/photo-1518770660439-4636190af475?q=80&w=2000&auto=format&fit=crop",
    outcome: "Current working repository connected through the live GitHub telemetry layer.",
    caseStudy: [
      { heading: "Problem", body: "Shoe commerce workflows need clear product handling, reliable account flows, and maintainable MERN architecture." },
      { heading: "Solution", body: "Built a focused MERN-stack foundation with React UI, Node/Express services, and MongoDB persistence." },
      { heading: "Architecture", body: "React -> Node.js -> Express -> MongoDB" },
      { heading: "Outcome", body: "The project is now treated as the portfolio's current GitHub focus." },
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
    excerpt: "How Hertz Labs approaches maintainable full-stack systems for real business workflows.",
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
  currentRepo: {
    name: "SHOE_Bank_Mrnstack",
    fullName: "HajithMohamed/SHOE_Bank_Mrnstack",
    url: "https://github.com/HajithMohamed/SHOE_Bank_Mrnstack",
    description: "Configured current repository; live GitHub status sync is pending.",
    language: null,
    languages: [],
    topics: [],
    defaultBranch: "main",
    updatedAt: null,
    pushedAt: null,
    homepage: null,
    stars: 0,
    forks: 0,
    openIssues: 0,
    visibility: "public",
    isArchived: false,
    latestCommit: null,
    activityStatus: "unknown",
    statusLabel: "awaiting sync",
    statusTone: "cyan",
  },
  recentRepos: [
    {
      name: "SHOE_Bank_Mrnstack",
      fullName: "HajithMohamed/SHOE_Bank_Mrnstack",
      description: "Current MERN stack shoe-bank repository synced from GitHub.",
      url: "https://github.com/HajithMohamed/SHOE_Bank_Mrnstack",
      language: "JavaScript",
    },
  ],
  recentActivity: [],
  contributionData: {
    currentRepo: {
      name: "SHOE_Bank_Mrnstack",
      fullName: "HajithMohamed/SHOE_Bank_Mrnstack",
      url: "https://github.com/HajithMohamed/SHOE_Bank_Mrnstack",
      description: "Configured current repository; live GitHub status sync is pending.",
      language: null,
      languages: [],
      topics: [],
      defaultBranch: "main",
      updatedAt: null,
      pushedAt: null,
      homepage: null,
      stars: 0,
      forks: 0,
      openIssues: 0,
      visibility: "public",
      isArchived: false,
      latestCommit: null,
      activityStatus: "unknown",
      statusLabel: "awaiting sync",
      statusTone: "cyan",
    },
  },
};
