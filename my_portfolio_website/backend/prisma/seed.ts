import { PrismaClient } from '@prisma/client';
import * as argon2 from 'argon2';

const prisma = new PrismaClient();

async function main() {
  const email = process.env.ADMIN_EMAIL ?? 'admin@hzlabs.dev';
  const password = process.env.ADMIN_PASSWORD ?? 'ChangeMe123!';

  await prisma.adminUser.upsert({
    where: { email },
    update: {
      name: process.env.ADMIN_NAME ?? 'Mohamed Hajith',
      passwordHash: await argon2.hash(password),
      isActive: true,
    },
    create: {
      email,
      name: process.env.ADMIN_NAME ?? 'Mohamed Hajith',
      passwordHash: await argon2.hash(password),
    },
  });

  const profile = await prisma.profile.upsert({
    where: { id: 'hz-labs-profile' },
    update: {
      name: 'Mohamed Hajith',
      title: 'Independent Software Engineer',
      tagline: 'Building Digital Products, Platforms, and Scalable Systems',
      bio: 'Full Stack Developer building modern web platforms, booking systems, authentication infrastructure, e-commerce solutions, and business automation software.',
      philosophy:
        'I enjoy building software that solves real operational problems. Whether it is a booking platform, authentication system, or commerce solution, I focus on scalability, maintainability, security, and user experience.',
      location: 'Sri Lanka',
      email: 'hello@hzlabs.dev',
      availabilityStatus:
        'Available for internships and software engineering opportunities',
      currentlyExploring: [
        'NestJS Architecture',
        'System Design',
        'Docker',
        'Data Science',
        'AI Integration',
      ],
      timeline: [
        { label: 'Education', value: 'Computer Science undergraduate' },
        {
          label: 'Major Projects',
          value: 'Commerce, booking, authentication, and admin systems',
        },
        {
          label: 'Focus',
          value: 'Modern full-stack platforms and product engineering',
        },
      ],
    },
    create: {
      id: 'hz-labs-profile',
      name: 'Mohamed Hajith',
      title: 'Independent Software Engineer',
      tagline: 'Building Digital Products, Platforms, and Scalable Systems',
      bio: 'Full Stack Developer building modern web platforms, booking systems, authentication infrastructure, e-commerce solutions, and business automation software.',
      philosophy:
        'I enjoy building software that solves real operational problems. Whether it is a booking platform, authentication system, or commerce solution, I focus on scalability, maintainability, security, and user experience.',
      location: 'Sri Lanka',
      email: 'hello@hzlabs.dev',
      availabilityStatus:
        'Available for internships and software engineering opportunities',
      currentlyExploring: [
        'NestJS Architecture',
        'System Design',
        'Docker',
        'Data Science',
        'AI Integration',
      ],
      timeline: [
        { label: 'Education', value: 'Computer Science undergraduate' },
        {
          label: 'Major Projects',
          value: 'Commerce, booking, authentication, and admin systems',
        },
        {
          label: 'Focus',
          value: 'Modern full-stack platforms and product engineering',
        },
      ],
    },
  });

  await prisma.socialLink.createMany({
    data: [
      {
        profileId: profile.id,
        label: 'GitHub',
        url: 'https://github.com/HajithMohamed',
        icon: 'github',
        order: 1,
      },
      {
        profileId: profile.id,
        label: 'LinkedIn',
        url: 'https://www.linkedin.com/',
        icon: 'linkedin',
        order: 2,
      },
      {
        profileId: profile.id,
        label: 'Email',
        url: 'mailto:hello@hzlabs.dev',
        icon: 'mail',
        order: 3,
      },
    ],
    skipDuplicates: true,
  });

  await prisma.skill.createMany({
    data: [
      ['React', 'Frontend', 92],
      ['Next.js', 'Frontend', 90],
      ['TypeScript', 'Frontend', 88],
      ['Redux Toolkit', 'Frontend', 82],
      ['Tailwind CSS', 'Frontend', 90],
      ['Node.js', 'Backend', 88],
      ['Express', 'Backend', 84],
      ['NestJS', 'Backend', 82],
      ['PHP', 'Backend', 74],
      ['MongoDB', 'Database', 82],
      ['PostgreSQL', 'Database', 84],
      ['MySQL', 'Database', 78],
      ['Git', 'Tools', 88],
      ['GitHub', 'Tools', 88],
      ['Docker', 'Tools', 72],
      ['Postman', 'Tools', 86],
      ['Figma', 'Tools', 74],
    ].map(([name, category, proficiency], index) => ({
      name: String(name),
      category: String(category),
      proficiency: Number(proficiency),
      featured: index < 8,
      order: index + 1,
    })),
    skipDuplicates: true,
  });

  await prisma.project.upsert({
    where: { slug: 'shoe-bank-mernstack' },
    update: {},
    create: {
      title: 'Shoe Bank MERN Stack',
      slug: 'shoe-bank-mernstack',
      description:
        'A MERN-stack shoe banking and commerce platform with product workflows, account logic, and admin-ready foundations.',
      techStack: ['React', 'Node.js', 'Express', 'MongoDB'],
      githubUrl: 'https://github.com/HajithMohamed/SHOE_Bank_Mrnstack',
      category: 'MERN Commerce',
      status: 'ACTIVE',
      featured: true,
      coverImage: 'https://images.unsplash.com/photo-1518770660439-4636190af475?q=80&w=2000&auto=format&fit=crop',
      outcome:
        'Current working repository connected through the live GitHub telemetry layer.',
      caseStudy: {
        create: [
          {
            heading: 'Problem',
            body: 'Shoe commerce workflows need clear product handling, reliable account flows, and maintainable MERN architecture.',
            order: 1,
          },
          {
            heading: 'Solution',
            body: 'Built a focused MERN-stack foundation with React UI, Node/Express services, and MongoDB persistence.',
            order: 2,
          },
          {
            heading: 'Architecture',
            body: 'React -> Node.js -> Express -> MongoDB',
            order: 3,
          },
          {
            heading: 'Outcome',
            body: 'The project is now treated as the portfolio current GitHub focus.',
            order: 4,
          },
        ],
      },
    },
  });

  await prisma.blogPost.upsert({
    where: { slug: 'building-operational-web-platforms' },
    update: {},
    create: {
      title: 'Building Operational Web Platforms',
      slug: 'building-operational-web-platforms',
      excerpt:
        'How Hertz Labs approaches maintainable full-stack systems for real business workflows.',
      content:
        '# Building Operational Web Platforms\n\nGreat platforms start with clear workflows, durable data models, and interfaces that make daily work easier. Hertz Labs focuses on systems that combine reliable APIs, thoughtful dashboards, and fast public experiences.',
      status: 'PUBLISHED',
      publishedAt: new Date(),
      tags: {
        connectOrCreate: [
          {
            where: { slug: 'engineering' },
            create: { name: 'Engineering', slug: 'engineering' },
          },
          {
            where: { slug: 'systems' },
            create: { name: 'Systems', slug: 'systems' },
          },
        ],
      },
    },
  });

  await prisma.githubSnapshot.create({
    data: {
      username: 'HajithMohamed',
      repositoryCount: 0,
      commitCount: 0,
      languages: ['TypeScript', 'JavaScript', 'PHP', 'SQL'],
      recentRepos: [],
      recentActivity: [],
      contributionData: {
        currentRepo: {
          name: 'SHOE_Bank_Mrnstack',
          fullName: 'HajithMohamed/SHOE_Bank_Mrnstack',
          url: 'https://github.com/HajithMohamed/SHOE_Bank_Mrnstack',
          description: 'Configured current repository; live GitHub status sync is pending.',
          language: null,
          languages: [],
          topics: [],
          defaultBranch: 'main',
          updatedAt: null,
          pushedAt: null,
          homepage: null,
          stars: 0,
          forks: 0,
          openIssues: 0,
          visibility: 'public',
          isArchived: false,
          latestCommit: null,
          activityStatus: 'unknown',
          statusLabel: 'awaiting sync',
          statusTone: 'cyan',
        },
      },
    },
  });
}

main()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async (error) => {
    console.error(error);
    await prisma.$disconnect();
    process.exit(1);
  });
