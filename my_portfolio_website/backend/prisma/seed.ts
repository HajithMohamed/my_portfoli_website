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
    where: { slug: 'saga-elite' },
    update: {},
    create: {
      title: 'Saga Elite',
      slug: 'saga-elite',
      description:
        'A premium, highly interactive web platform featuring real-time data sync, advanced visualizations, and 3D experiences.',
      techStack: ['Next.js', 'Three.js', 'Framer Motion', 'Tailwind CSS'],
      githubUrl: 'https://github.com/HajithMohamed/saga-elite',
      liveUrl: 'https://saga-elite.dev',
      category: 'Interactive Platforms',
      status: 'ACTIVE',
      featured: true,
      coverImage: 'https://images.unsplash.com/photo-1518770660439-4636190af475?q=80&w=2000&auto=format&fit=crop',
      outcome:
        'Delivered a cutting-edge interactive experience with flawless 60fps performance and stunning visuals.',
      caseStudy: {
        create: [
          {
            heading: 'Problem',
            body: 'Users demand highly engaging, premium digital experiences that stand out from flat UI.',
            order: 1,
          },
          {
            heading: 'Solution',
            body: 'Built an immersive 3D-integrated frontend utilizing WebGL and physics-based animations.',
            order: 2,
          },
          {
            heading: 'Architecture',
            body: 'Next.js -> Three.js (R3F) -> Framer Motion -> Vercel Edge',
            order: 3,
          },
          {
            heading: 'Outcome',
            body: 'Increased user dwell time by 300% and established a premium brand identity.',
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
        'How HZ Labs approaches maintainable full-stack systems for real business workflows.',
      content:
        '# Building Operational Web Platforms\n\nGreat platforms start with clear workflows, durable data models, and interfaces that make daily work easier. HZ Labs focuses on systems that combine reliable APIs, thoughtful dashboards, and fast public experiences.',
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
