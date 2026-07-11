export type SocialLink = {
  id?: string;
  label: string;
  url: string;
  icon?: string | null;
  order?: number;
};

export type Profile = {
  id?: string;
  name: string;
  title: string;
  tagline: string;
  bio: string;
  philosophy: string;
  location: string;
  email: string;
  availabilityStatus: string;
  profileImageUrl?: string | null;
  currentlyExploring: string[];
  timeline?: Array<{ label: string; value: string }> | unknown;
  socialLinks: SocialLink[];
};

export type Skill = {
  id: string;
  name: string;
  category: string;
  proficiency: number;
  featured?: boolean;
  order?: number;
};

export type CaseStudySection = {
  heading: string;
  body: string;
  order?: number;
};

export type Project = {
  id: string;
  title: string;
  slug: string;
  description: string;
  techStack: string[];
  githubUrl?: string | null;
  liveUrl?: string | null;
  coverImage?: string | null;
  category: string;
  status: "DRAFT" | "ACTIVE" | "ARCHIVED";
  featured: boolean;
  outcome?: string | null;
  caseStudy?: CaseStudySection[];
  updatedAt?: string;
};

export type BlogPost = {
  id: string;
  title: string;
  slug: string;
  excerpt: string;
  content: string;
  coverImage?: string | null;
  status: "DRAFT" | "PUBLISHED";
  publishedAt?: string | null;
  tags?: Array<{ name: string; slug: string }>;
};

export type CvAsset = {
  id: string;
  title: string;
  fileUrl: string;
  version: number;
  isActive: boolean;
};

export type GithubSummary = {
  username: string;
  repositoryCount: number;
  commitCount: number;
  languages: Record<string, number> | string[];
  recentRepos: Array<{
    name: string;
    description?: string | null;
    url: string;
    language?: string | null;
    updatedAt?: string;
  }>;
  recentActivity: Array<{ type: string; repo?: string; createdAt: string }>;
  syncedAt?: string;
};

export type HomeData = {
  profile: Profile;
  skills: Skill[];
  projects: Project[];
  blogs: BlogPost[];
  resume: CvAsset | null;
  github: GithubSummary;
};
