import type { Certificate, CvAsset, GithubSummary, MediaAsset, Profile, Skill, Testimonial } from './types';
import { PERSONAL_IDENTITY } from './identity';
import { projectsFromGithub, reviewedBlogPosts } from './portfolio-mapping';

export const fallbackProfile: Profile = {
  name: PERSONAL_IDENTITY.name, title: PERSONAL_IDENTITY.title,
  tagline: 'Full Stack Web Platforms • Flutter Mobile Apps • AI/ML Systems • Data Science',
  availabilityStatus: 'Available for internships and software engineering opportunities',
  bio: PERSONAL_IDENTITY.bio,
  philosophy: 'I build high-performance web platforms, cross-platform mobile apps, and intelligent data systems, documenting every breakthrough on GitHub.',
  location: PERSONAL_IDENTITY.location, email: '',
  currentlyExploring: ['Web Development', 'Mobile App Dev (Flutter)', 'AI / Machine Learning', 'Data Science & Analytics', 'System Design'],
  timeline: [{label:'Education',value:PERSONAL_IDENTITY.education}],
  socialLinks: [{label:'GitHub',url:PERSONAL_IDENTITY.githubUrl,icon:'github'}],
};

export const fallbackSkills: Skill[] = [
  // Web Development
  'React|Frontend|94', 'Next.js|Frontend|92', 'TypeScript|Frontend|90',
  'Tailwind CSS|Frontend|92', 'Redux Toolkit|Frontend|84',
  'Node.js|Backend|88', 'NestJS|Backend|84', 'Express|Backend|86',
  // Mobile App Development
  'Flutter|Mobile|90', 'Dart|Mobile|88', 'React Native|Mobile|82',
  // AI & Machine Learning
  'Python|AI/ML|92', 'Machine Learning|AI/ML|84', 'PyTorch|AI/ML|80', 'AI Integration|AI/ML|86',
  // Data Science
  'Data Science|Data Science|86', 'Pandas & NumPy|Data Science|85', 'PostgreSQL|Database|86', 'MongoDB|Database|84',
  // Tools & Cloud
  'Docker|Tools|80', 'Git|Tools|90', 'GitHub|Tools|92', 'Postman|Tools|88', 'Figma|Tools|78',
].map((item,index) => {
  const [name,category,proficiency] = item.split('|');
  return {id:category+'-'+name,name,category,proficiency:Number(proficiency),featured:index<10,order:index};
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
