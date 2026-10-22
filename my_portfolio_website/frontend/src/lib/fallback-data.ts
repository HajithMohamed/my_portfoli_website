import type { Certificate, CvAsset, GithubSummary, MediaAsset, Profile, Skill, Testimonial } from './types';
import { PERSONAL_IDENTITY } from './identity';
import { projectsFromGithub, reviewedBlogPosts } from './portfolio-mapping';

export const fallbackProfile: Profile = {
  name: PERSONAL_IDENTITY.name,
  title: PERSONAL_IDENTITY.title,
  tagline: 'Full-Stack Web Applications · Secure REST APIs · Relational & NoSQL Database Systems',
  availabilityStatus: PERSONAL_IDENTITY.availability,
  bio: PERSONAL_IDENTITY.bio,
  philosophy: 'I build practical web applications, robust REST APIs, and database-driven business systems, focusing on clean architecture, automated testing, and relational database integrity.',
  location: PERSONAL_IDENTITY.location,
  email: PERSONAL_IDENTITY.email,
  profileImageUrl: PERSONAL_IDENTITY.portraitUrl,
  currentlyExploring: ['Python (Exploring)', 'Flutter (Exploring)', 'Dart (Exploring)', 'Microsoft Azure (Cloud)', 'Applied AI in Practical Systems'],
  timeline: [{ label: 'Education', value: PERSONAL_IDENTITY.education }],
  socialLinks: [
    { label: 'GitHub', url: PERSONAL_IDENTITY.githubUrl, icon: 'github' },
    { label: 'LinkedIn', url: PERSONAL_IDENTITY.linkedInUrl, icon: 'linkedin' },
  ],
};

export const fallbackSkills: Skill[] = [
  // Professional Project Experience (Strongest verified)
  'React|Frontend|92', 'Next.js|Frontend|90', 'TypeScript|Frontend|88',
  'JavaScript|Languages|90', 'Tailwind CSS|Frontend|90', 'Node.js|Backend|88',
  'Express|Backend|86', 'PHP|Backend|84', 'PostgreSQL|Database|88',
  'MySQL|Database|86', 'MongoDB|Database|84', 'Docker|Tools|82',
  'Git|Tools|90', 'GitHub|Tools|90',
  // Academic / Project Experience
  'Redux Toolkit|Frontend|84', 'NestJS|Backend|82', 'Spring Boot|Backend|78',
  'Java|Languages|80', 'Prisma|Database|84', 'PL/pgSQL|Database|82',
  'Socket.IO|Backend|82', 'Vitest|Testing|84', 'Playwright|Testing|82',
  'REST APIs|Backend|90', 'Postman|Tools|86', 'Azure|Cloud|75',
  // Exploring
  'Python|Exploring|70', 'Flutter|Exploring|70', 'Dart|Exploring|70',
].map((item, index) => {
  const [name, category, proficiency] = item.split('|');
  return { id: category + '-' + name, name, category, proficiency: Number(proficiency), featured: index < 12, order: index };
});

// The UI renders unavailable statistics as a dash, rather than pretending zero is live data.
export const fallbackGithub: GithubSummary = {
  username: PERSONAL_IDENTITY.githubUsername, repositoryCount:0, commitCount:0,
  languages:{}, currentRepo:null, recentRepos:[], recentActivity:[],
  contributionData:null, dataStatus:'unavailable',
};
export const fallbackProjects = projectsFromGithub(fallbackGithub);
export const fallbackBlogs = reviewedBlogPosts();
export const fallbackResume: CvAsset = {
  id: "mohamed-hajith-cv",
  title: "Mohamed Hajith - Full-Stack Developer CV",
  fileUrl: "/Mohamed_Hajith_CV.pdf",
  version: 1,
  isActive: true,
};
export const fallbackTestimonials: Testimonial[] = [];

export const fallbackCertificates: Certificate[] = [
  {
    id: "udemy-full-stack-web-development-bootcamp",
    title: "The Complete Full-Stack Web Development Bootcamp",
    issuer: "Udemy",
    type: "certification",
    issueDate: "2026-06-21T00:00:00.000Z",
    credentialUrl: "https://ude.my/UC-8df6ecc3-ffca-4dd1-aafa-c240922d4c5e",
    imageUrl: "/certificates/full-stack-web-development-bootcamp.jpg",
    description: "This certificate confirms that Mohamed Hajith successfully completed the entire course. Udemy validates completion based on the student finishing all course content; the listed length reflects the total video and article lecture time at the most recent completion.",
    courseUrl: "https://www.udemy.com/course/the-complete-web-development-bootcamp/",
    instructor: "Dr. Angela Yu, Developer and Lead Instructor",
    instructorUrl: "https://www.udemy.com/user/4b4368a3-b5c8-4529-aa65-2056ec31f37e/",
    studentUrl: "https://www.udemy.com/user/mohamed-hajith/",
    durationHours: 62,
    order: 1,
  },
];
export const fallbackGallery: MediaAsset[] = [];
