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
  createdAt?: string;
  repositoryFullName?: string;
  isCurrent?: boolean;
  isHosted?: boolean;
  isProductionReady?: boolean;
  readinessChecked?: boolean;
  readinessEvidence?: Array<{ kind: string; label: string; url: string }>;
  sourceUrl?: string;
  coverImageAlt?: string;
  coverImageKind?: "concept";
  dedupeKey?: string;
  relatedRepositories?: string[];
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
  sourceUrl?: string;
  author?: string;
  coverImageAlt?: string;
  tags?: Array<{ name: string; slug: string }>;
};

export type CvAsset = {
  id: string;
  title: string;
  fileUrl: string;
  version: number;
  isActive: boolean;
};

export type ContributionDay = { date: string; count: number; level: 0 | 1 | 2 | 3 | 4 };

export type CurrentRepositoryStatus = {
  name: string;
  fullName: string;
  url: string;
  description?: string | null;
  language?: string | null;
  languages?: string[];
  topics?: string[];
  defaultBranch?: string;
  updatedAt?: string | null;
  pushedAt?: string | null;
  homepage?: string | null;
  stars?: number;
  forks?: number;
  openIssues?: number;
  visibility?: string;
  isArchived?: boolean;
  latestCommit?: {
    sha: string;
    url: string;
    message: string;
    authoredAt?: string | null;
    author?: string | null;
  } | null;
  activityStatus?: "active" | "recent" | "quiet" | "stale" | "unknown" | "archived" | string;
  statusLabel?: string;
  statusTone?: "green" | "amber" | "cyan" | "red" | string;
};

export type ContributionData = {
  calendar?: { totalContributions: number; weeks: { days: ContributionDay[] }[] } | null;
  totalStars?: number;
  totalForks?: number;
  totalContributions?: number;
  technologies?: string[];
  followers?: number;
  following?: number;
  currentRepo?: CurrentRepositoryStatus | null;
  schemaVersion?: number;
  repositories?: PortfolioRepository[];
  stats?: PortfolioStats;
  provenance?: {
    sourceUrl: string;
    syncedAt: string;
    activityWindowDays: number;
    hostedDefinition: string;
    productionReadyDefinition: string;
    readinessComplete: boolean;
    languageRepositoriesSampled?: number;
  };
};

export type PortfolioStats = {
  publicRepositories: number;
  createdRepositories: number;
  activeRepositories: number;
  newRepositories: number;
  hostedProjects: number;
  productionReadyProjects: number;
};

export type PortfolioRepository = {
  name: string;
  fullName: string;
  url: string;
  description?: string | null;
  language?: string | null;
  topics?: string[];
  createdAt?: string;
  pushedAt?: string;
  updatedAt?: string;
  homepage?: string | null;
  liveUrl?: string | null;
  stars?: number;
  forks?: number;
  defaultBranch?: string;
  isArchived?: boolean;
  isHosted?: boolean;
  isProductionReady?: boolean;
  readinessChecked?: boolean;
  readinessEvidence?: Array<{ kind: string; label: string; url: string }>;
  goal?: string | null;
  goalSourceUrl?: string;
  latestRelease?: { tag: string; url: string; publishedAt: string } | null;
};

export type GithubSummary = {
  dataStatus?: "synced" | "cached" | "unavailable";
  username: string;
  repositoryCount: number;
  commitCount: number;
  languages: Record<string, number> | string[];
  recentRepos: Array<{
    name: string;
    fullName?: string;
    description?: string | null;
    url: string;
    language?: string | null;
    updatedAt?: string;
    stars?: number;
    forks?: number;
    topics?: string[];
  }>;
  recentActivity: Array<{ type: string; repo?: string; createdAt: string }>;
  contributionData?: ContributionData | null;
  currentRepo?: CurrentRepositoryStatus | null;
  syncedAt?: string;
};

export type Testimonial = {
  id: string;
  author: string;
  role?: string | null;
  company?: string | null;
  quote: string;
  avatarUrl?: string | null;
  project?: string | null;
  rating?: number;
  featured?: boolean;
  order?: number;
};

export type Certificate = {
  id: string;
  title: string;
  issuer: string;
  type: "certification" | "achievement" | string;
  issueDate?: string | null;
  credentialUrl?: string | null;
  imageUrl?: string | null;
  description?: string | null;
  courseUrl?: string | null;
  instructor?: string | null;
  instructorUrl?: string | null;
  studentUrl?: string | null;
  durationHours?: number | null;
  order?: number;
};

export type MediaAsset = {
  id: string;
  url: string;
  publicId?: string | null;
  alt: string;
  category: "profile" | "gallery" | "about" | string;
  featured?: boolean;
  order?: number;
};

export type HomeData = {
  profile: Profile;
  skills: Skill[];
  projects: Project[];
  blogs: BlogPost[];
  resume: CvAsset | null;
  github: GithubSummary;
  testimonials: Testimonial[];
  certificates: Certificate[];
  gallery: MediaAsset[];
};

export type RequestStatus =
  | "NEW"
  | "REVIEWING"
  | "PROPOSAL"
  | "APPROVED"
  | "IN_PROGRESS"
  | "COMPLETED"
  | "ARCHIVED";

export type RequestAttachment = {
  id: string;
  requestId: string;
  filename: string;
  url: string;
  sizeBytes?: number | null;
  contentType?: string | null;
  createdAt: string;
};

export type ProjectRequest = {
  id: string;
  referenceId: string;
  name: string;
  email: string;
  company?: string | null;
  projectType: string;
  timeline?: string | null;
  budget?: string | null;
  overview: string;
  deliverables: string[];
  preferredTech: string[];
  status: RequestStatus;
  internalNotes?: string | null;
  ipAddress?: string | null;
  userAgent?: string | null;
  honeypot?: string | null;
  durationSeconds?: number | null;
  createdAt: string;
  updatedAt: string;
  attachments?: RequestAttachment[];
  clientProjects?: Array<{ id: string; title: string }>;
};

export type ClientProjectStatus = "ACTIVE" | "ON_HOLD" | "COMPLETED" | "CANCELLED";
export type MilestoneStatus = "PENDING" | "IN_PROGRESS" | "COMPLETED";

export type Milestone = {
  id: string;
  projectId: string;
  title: string;
  description?: string | null;
  dueDate?: string | null;
  status: MilestoneStatus;
  order: number;
  createdAt: string;
  updatedAt: string;
};

export type ClientTask = {
  id: string;
  projectId: string;
  title: string;
  completed: boolean;
  dueDate?: string | null;
  order: number;
  createdAt: string;
  updatedAt: string;
};

export type ClientProject = {
  id: string;
  title: string;
  clientName: string;
  clientEmail: string;
  clientCompany?: string | null;
  status: ClientProjectStatus;
  budget?: string | null;
  startDate?: string | null;
  targetEndDate?: string | null;
  description?: string | null;
  notes?: string | null;
  requestId?: string | null;
  request?: { id: string; referenceId: string; name: string } | null;
  milestones: Milestone[];
  tasks: ClientTask[];
  createdAt: string;
  updatedAt: string;
};

export type SiteSettings = {
  id: string;
  defaultTheme: "jarvis" | "ember" | string;
  contactEnabled: boolean;
  requestsEnabled: boolean;
  maintenanceMode: boolean;
  updatedAt: string;
};
