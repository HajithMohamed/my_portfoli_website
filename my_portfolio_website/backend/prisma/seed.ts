import { PrismaClient } from '@prisma/client';
import * as argon2 from 'argon2';

const prisma = new PrismaClient();

async function main() {
  const adminPassword = process.env.ADMIN_PASSWORD ?? 'HAzi@1915';
  const passwordHash = await argon2.hash(adminPassword);
  
  // Seed both personal and portal emails so admin access always works
  const adminEmails = [
    process.env.ADMIN_EMAIL ?? 'hanoufaatif@gmail.com',
    'ahammedlebbehajith@gmail.com',
  ];

  for (const email of adminEmails) {
    await prisma.adminUser.upsert({
      where: { email },
      update: {
        name: process.env.ADMIN_NAME ?? 'Mohamed Hajith',
        passwordHash,
        isActive: true,
      },
      create: {
        email,
        name: process.env.ADMIN_NAME ?? 'Mohamed Hajith',
        passwordHash,
      },
    });
  }

  const profile = await prisma.profile.upsert({
    where: { id: 'hz-labs-profile' },
    update: {
      name: 'Mohamed Hajith',
      title: 'Full-Stack Software Developer | Backend & Database Engineering',
      tagline: 'Practical Web Applications · REST APIs · Database-Driven Business Systems',
      bio: 'Third-year BICT (Hons) undergraduate at the University of Ruhuna. I build practical web applications, secure REST APIs, and database-driven business systems using React, Next.js, Node.js, and PostgreSQL.',
      philosophy:
        'I build practical web applications, robust REST APIs, and database-driven business systems, focusing on clean architecture, automated testing, and relational database integrity.',
      location: 'Batticaloa, Sri Lanka',
      email: 'ahammedlebbehajith@gmail.com',
      profileImageUrl: '/brand/mohamed-hajith-portrait.png',
      availabilityStatus:
        'Open to software engineering internships, junior development opportunities, and selected freelance projects.',
      currentlyExploring: [
        'Python (Exploring)',
        'Flutter (Exploring)',
        'Dart (Exploring)',
        'Microsoft Azure (Cloud)',
        'Applied AI in Practical Systems',
      ],
      timeline: [
        {
          label: 'Education',
          value: 'Third-year BICT (Hons) undergraduate, Faculty of Technology, University of Ruhuna (2023 - 2027)',
        },
        {
          label: 'Specialization',
          value: 'Full-Stack Web, Backend APIs, PostgreSQL & Database Engineering',
        },
        {
          label: 'Availability',
          value: 'Open to software engineering internships and junior development roles',
        },
      ],
    },
    create: {
      id: 'hz-labs-profile',
      name: 'Mohamed Hajith',
      title: 'Full-Stack Software Developer | Backend & Database Engineering',
      tagline: 'Practical Web Applications · REST APIs · Database-Driven Business Systems',
      bio: 'Third-year BICT (Hons) undergraduate at the University of Ruhuna. I build practical web applications, secure REST APIs, and database-driven business systems using React, Next.js, Node.js, and PostgreSQL.',
      philosophy:
        'I build practical web applications, robust REST APIs, and database-driven business systems, focusing on clean architecture, automated testing, and relational database integrity.',
      location: 'Batticaloa, Sri Lanka',
      email: 'ahammedlebbehajith@gmail.com',
      profileImageUrl: '/brand/mohamed-hajith-portrait.png',
      availabilityStatus:
        'Open to software engineering internships, junior development opportunities, and selected freelance projects.',
      currentlyExploring: [
        'Python (Exploring)',
        'Flutter (Exploring)',
        'Dart (Exploring)',
        'Microsoft Azure (Cloud)',
        'Applied AI in Practical Systems',
      ],
      timeline: [
        {
          label: 'Education',
          value: 'Third-year BICT (Hons) undergraduate, Faculty of Technology, University of Ruhuna (2023 - 2027)',
        },
        {
          label: 'Specialization',
          value: 'Full-Stack Web, Backend APIs, PostgreSQL & Database Engineering',
        },
        {
          label: 'Availability',
          value: 'Open to software engineering internships and junior development roles',
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
        url: 'https://www.linkedin.com/in/mohamed-hajith-b53559295',
        icon: 'linkedin',
        order: 2,
      },
      {
        profileId: profile.id,
        label: 'Email',
        url: 'mailto:ahammedlebbehajith@gmail.com',
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
      ['PostgreSQL', 'Database', 88],
      ['MySQL', 'Database', 82],
      ['MongoDB', 'Database', 82],
      ['Azure', 'Cloud', 75],
      ['Docker', 'Tools', 76],
      ['Git', 'Tools', 88],
      ['GitHub', 'Tools', 88],
      ['Postman', 'Tools', 86],
      ['Figma', 'Tools', 74],
      ['Python', 'Exploring', 70],
      ['Flutter', 'Exploring', 70],
      ['Dart', 'Exploring', 70],
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
      coverImage:
        'https://images.unsplash.com/photo-1518770660439-4636190af475?q=80&w=2000&auto=format&fit=crop',
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
        'How Mohamed Hajith approaches maintainable full-stack systems for real business workflows.',
      content:
        '# Building Operational Web Platforms\n\nGreat platforms start with clear workflows, durable data models, and interfaces that make daily work easier. Mohamed Hajith focuses on systems that combine reliable APIs, thoughtful dashboards, and fast public experiences.',
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
          description:
            'Configured current repository; live GitHub status sync is pending.',
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

  await prisma.certificate.upsert({
    where: { id: 'udemy-full-stack-web-development-bootcamp' },
    update: {},
    create: {
      id: 'udemy-full-stack-web-development-bootcamp',
      title: 'The Complete Full-Stack Web Development Bootcamp',
      issuer: 'Udemy',
      type: 'certification',
      issueDate: new Date('2026-06-21T00:00:00.000Z'),
      credentialUrl: 'https://ude.my/UC-8df6ecc3-ffca-4dd1-aafa-c240922d4c5e',
      imageUrl: '/certificates/full-stack-web-development-bootcamp.jpg',
      description:
        'This certificate confirms that Mohamed Hajith successfully completed the entire course. Udemy validates completion based on the student finishing all course content; the listed length reflects the total video and article lecture time at the most recent completion.',
      courseUrl:
        'https://www.udemy.com/course/the-complete-web-development-bootcamp/',
      instructor: 'Dr. Angela Yu, Developer and Lead Instructor',
      instructorUrl:
        'https://www.udemy.com/user/4b4368a3-b5c8-4529-aa65-2056ec31f37e/',
      studentUrl: 'https://www.udemy.com/user/mohamed-hajith/',
      durationHours: 62,
      order: 1,
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
