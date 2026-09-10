import type { Certificate, CvAsset, GithubSummary, MediaAsset, Profile, Skill, Testimonial } from './types';
import { PERSONAL_IDENTITY } from './identity';
import { projectsFromGithub, reviewedBlogPosts } from './portfolio-mapping';

export const fallbackProfile: Profile = {
  name: PERSONAL_IDENTITY.name, title: PERSONAL_IDENTITY.title,
  tagline: 'Web applications, practical systems, and the work behind them',
  availabilityStatus: 'Available for internships and software engineering opportunities',
  bio: PERSONAL_IDENTITY.bio,
  philosophy: 'I build tools for real workflows and document my goals, decisions, and progress through my projects.',
  location: PERSONAL_IDENTITY.location, email: '',
  currentlyExploring: ['Full Stack Development', 'System Design', 'Docker'],
  timeline: [{label:'Education',value:PERSONAL_IDENTITY.education}],
  socialLinks: [{label:'GitHub',url:PERSONAL_IDENTITY.githubUrl,icon:'github'}],
};

export const fallbackSkills: Skill[] = [
  'React|Frontend|92', 'Next.js|Frontend|90', 'TypeScript|Frontend|88',
  'Redux Toolkit|Frontend|82', 'Tailwind CSS|Frontend|90', 'Node.js|Backend|88',
  'Express|Backend|84', 'NestJS|Backend|82', 'PHP|Backend|74', 'MongoDB|Database|82',
  'PostgreSQL|Database|84', 'MySQL|Database|78', 'Git|Tools|88', 'GitHub|Tools|88',
  'Docker|Tools|72', 'Postman|Tools|86', 'Figma|Tools|74',
].map((item,index) => {
  const [name,category,proficiency] = item.split('|');
  return {id:category+'-'+name,name,category,proficiency:Number(proficiency),featured:index<8,order:index};
});

// The UI renders unavailable statistics as a dash, rather than pretending zero is live data.
export const fallbackGithub: GithubSummary = {
  username: PERSONAL_IDENTITY.githubUsername, repositoryCount:0, commitCount:0,
  languages:{}, currentRepo:null, recentRepos:[], recentActivity:[],
  contributionData:null, dataStatus:'unavailable',
};
export const fallbackProjects = projectsFromGithub(fallbackGithub);
export const fallbackBlogs = reviewedBlogPosts();
export const fallbackResume: CvAsset | null = null;
export const fallbackTestimonials: Testimonial[] = [];
export const fallbackCertificates: Certificate[] = [];
export const fallbackGallery: MediaAsset[] = [];
