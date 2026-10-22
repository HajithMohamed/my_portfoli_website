/**
 * Standardized Case Studies and Architectural Dossiers for Mohamed Hajith's Portfolio.
 * Structure per case study:
 * Problem → Your contribution → Architecture → Key technical decisions → Testing → Current status → Repository/Demo
 */
export type ProjectStory = {
  repository: string;
  title: string;
  goal: string;
  summary: string;
  technologies: string[];
  sourceUrl: string;
  reviewedAt: string;
  sections: { heading: string; body: string }[];
  blog: {
    title: string;
    slug: string;
    excerpt: string;
    content: string;
  };
  coverImage?: string;
};

export const projectStories: ProjectStory[] = [
  // 1. Saga Elite — Full-Stack E-Commerce Platform
  {
    repository: "Hz-Labs-studio/Saga-Elite-Web-project",
    title: "Saga Elite — Full-Stack E-Commerce Platform",
    goal: "Connect limited-edition fashion releases with inventory reservation, online and manual bank slip payments, and operational admin workflows.",
    summary: "Collaborative e-commerce application developed by a four-member team. Led application architecture, REST API design, authentication, event-driven notifications, and automated testing.",
    technologies: ["React", "Redux Toolkit", "Node.js", "Express", "MongoDB", "Socket.IO", "Playwright", "GitHub Actions"],
    coverImage: "/projects/saga-elite-cover.png",
    sourceUrl: "https://github.com/Hz-Labs-studio/Saga-Elite-Web-project",
    reviewedAt: "2026-10-22",
    sections: [
      {
        heading: "Problem",
        body: "Sri Lankan fashion brands running limited-stock 'drops' face unique operational challenges: severe inventory contention when drops launch, customers paying via offline bank deposit slips that require manual review, and operational staff requiring clear role boundaries so marketing cannot accidentally confirm payments.",
      },
      {
        heading: "Your contribution",
        body: "Acted as full-stack developer and four-person team lead. Spearheaded application architecture, authored core REST APIs, implemented JWT authentication with role-based access control, integrated Socket.IO for real-time stock/order events, implemented OCR-assisted receipt parsing for bank slips, and configured Playwright automated test suites.",
      },
      {
        heading: "Architecture",
        body: "React client with Redux Toolkit for state management, communicating with a Node.js and Express REST API gateway. MongoDB stores users, product catalogues, limited drops, orders, and review documents. Socket.IO manages bidirectional realtime notifications, with Docker ensuring consistent development environments.",
      },
      {
        heading: "Key technical decisions",
        body: "Decoupled initial order placement from payment verification: orders paying via bank slip transition to a pending-verification state with automated expiry windows, preventing unverified claims from indefinitely locking inventory. Split operational permissions into granular roles (product manager, order verifier, support) rather than a single super-admin.",
      },
      {
        heading: "Testing",
        body: "Automated end-to-end tests built with Playwright and Vitest verifying auth flows, cart calculations, order state transitions, and drop stock reservations, integrated into GitHub Actions for CI pull request checks.",
      },
      {
        heading: "Current status",
        body: "Deployed storefront with live staging environment and documented open-source codebase for university software engineering evaluation.",
      },
      {
        heading: "Repository/Demo",
        body: "Repository: https://github.com/Hz-Labs-studio/Saga-Elite-Web-project | Live Storefront: https://saga-elite.shop/",
      },
    ],
    blog: {
      title: "Saga Elite: connecting a fashion drop to the order behind it",
      slug: "saga-elite-fashion-drops-and-order-workflows",
      excerpt: "Project notes on limited-stock releases, payment confirmation, and the admin workflows behind a Sri Lankan fashion storefront.",
      content: `# A storefront built around releases
Saga Elite is a collaborative university group project for a Sri Lankan limited-edition fashion brand. Its public codebase implements drop-based releases with limited availability windows, real-time stock updates, and payment workflows.

# Payment confirmation connects customer and admin workflows
Online payments and manual bank deposit slips meet at a unified order-confirmation step. A manual payment needs evidence and verification before an order confirms. The key design relationship is the shared confirmation point: order notifications and inventory finalization follow verified confirmation rather than initial cart checkout.

# Operational permissions belong in the design
The admin architecture separates product, order, inventory, marketing, and support responsibilities. Restricted admin roles receive specific permissions, while privileged account management is reserved for super administrators.

# The stack supports both sides of the workflow
The system uses React, Redux Toolkit, Node.js, Express, MongoDB, Socket.IO, Playwright, and GitHub Actions CI. Docker coordinates the shared local development environment.`,
    },
  },

  // 2. BenchBook — Laboratory Resource Reservation System
  {
    repository: "HajithMohamed/Medical-Lab-Resource-Reservation-System",
    title: "BenchBook — Laboratory Resource Reservation System",
    goal: "Eliminate equipment double-booking and schedule maintenance downtime with database-enforced reservation constraints.",
    summary: "Database-driven laboratory resource reservation system built with Next.js, TypeScript, PostgreSQL, and Prisma. Features database-enforced booking constraints, maintenance workflows, and automated Vitest suites.",
    technologies: ["Next.js", "TypeScript", "PostgreSQL", "Prisma", "Vitest", "Tailwind CSS"],
    coverImage: "/projects/tech-bridge-cover.png",
    sourceUrl: "https://github.com/HajithMohamed/Medical-Lab-Resource-Reservation-System",
    reviewedAt: "2026-10-22",
    sections: [
      {
        heading: "Problem",
        body: "Medical laboratories and research facilities face severe scheduling contention for expensive analytical equipment (centrifuges, spectrophotometers, biosafety cabinets). Client-side scheduling checks regularly suffer from race conditions, leading to double-bookings, interrupted specimen analyses, and unscheduled maintenance clashes.",
      },
      {
        heading: "Your contribution",
        body: "Independently architected and implemented the entire reservation platform: relational PostgreSQL schema design, Prisma ORM queries and migrations, database-level exclusion constraint logic, maintenance blackout window state machines, and a comprehensive Vitest automated test suite.",
      },
      {
        heading: "Architecture",
        body: "Next.js App Router full-stack architecture with React Server Components, server actions for transactional mutations, Prisma ORM abstraction, and a relational PostgreSQL database engine with strict integrity constraints.",
      },
      {
        heading: "Key technical decisions",
        body: "Enforced non-overlapping reservation constraints directly in PostgreSQL rather than trusting application-level JavaScript validation. Scheduled maintenance blackout periods automatically conflict-check existing reservations and trigger notification alerts. Separated equipment availability records from user identity models to enable audit trail preservation.",
      },
      {
        heading: "Testing",
        body: "Comprehensive automated test suite written with Vitest verifying booking collision detection, edge-case timeslot overlaps, maintenance blackout overrides, and role-based access permissions.",
      },
      {
        heading: "Current status",
        body: "Completed database engineering project with full repository documentation, automated test suites, and database migration scripts.",
      },
      {
        heading: "Repository/Demo",
        body: "Repository: https://github.com/HajithMohamed/Medical-Lab-Resource-Reservation-System",
      },
    ],
    blog: {
      title: "BenchBook: database-enforced constraints in resource reservation",
      slug: "benchbook-laboratory-reservation-database-constraints",
      excerpt: "Why relying on application-level scheduling checks fails under concurrency, and how PostgreSQL constraints guarantee collision-free laboratory reservations.",
      content: `# Relational constraints over application checks
When two laboratory researchers reserve the same bench simultaneously, race conditions in standard web applications cause duplicate bookings. BenchBook solves this at the database layer.

# Exclusionary constraints prevent collision
By defining PostgreSQL temporal constraints and range types, conflicting bookings are rejected by the database engine itself, guaranteeing zero double-bookings regardless of concurrent request volume.

# Maintenance blackout periods
Equipment requires routine calibration and cleaning. BenchBook models maintenance as first-class scheduling blocks that automatically freeze reservation slots during active servicing windows.`,
    },
  },

  // 3. BloodBridge — Advanced Database Management System (ADBMS)
  {
    repository: "akalanka001/-BloodBridge--ADBMS",
    title: "BloodBridge — Advanced Database Management System",
    goal: "Model blood donation registries, regional blood bank inventory, and institutional transfer integrity with strict database transactions.",
    summary: "Collaborative academic prototype for blood donation and inventory management. Contributed database stored procedures, transaction safeguards, donor registration constraints, and CI verification via merged PR #7. Academic demonstration project, not clinical software.",
    technologies: ["PostgreSQL", "PL/pgSQL", "React", "Node.js", "Docker", "GitHub Actions"],
    coverImage: "/brand/project-blueprint.jpg",
    sourceUrl: "https://github.com/akalanka001/-BloodBridge--ADBMS",
    reviewedAt: "2026-10-22",
    sections: [
      {
        heading: "Problem",
        body: "Blood transfusion supply chains require uncompromising transactional consistency: blood unit status changes (tested, quarantined, cleared, transfused, discarded) and inter-facility institutional transfers must never result in duplicate units, orphaned records, or inaccurate regional supply levels.",
      },
      {
        heading: "Your contribution",
        body: "Contributed database architecture and integration through merged pull request #7 (pre-handoff architecture and database contract). Authored PL/pgSQL stored procedures, atomic transaction safeguards, donor eligibility validation rules, hospital authorization checks, regression tests, and GitHub Actions CI pipelines.",
      },
      {
        heading: "Architecture",
        body: "PostgreSQL relational database with custom PL/pgSQL procedures, Node.js and Express backend API layer, React user interface, containerized through Docker and Docker Compose.",
      },
      {
        heading: "Key technical decisions",
        body: "Encapsulated multi-table inventory movements inside atomic PL/pgSQL transactions to guarantee that blood unit deductions from donor centers and additions to hospital inventories commit together or rollback completely. Established explicit schema contracts before team handoff to prevent breaking changes across sub-modules.",
      },
      {
        heading: "Testing",
        body: "Database regression test suite validating transaction rollbacks on constraint violations, transfer idempotency, and automated build verification in GitHub Actions CI.",
      },
      {
        heading: "Current status",
        body: "Academic coursework prototype and database architecture demonstration. Explicitly labeled as an academic prototype, not clinical production software.",
      },
      {
        heading: "Repository/Demo",
        body: "Repository: https://github.com/akalanka001/-BloodBridge--ADBMS | Merged PR #7: https://github.com/akalanka001/-BloodBridge--ADBMS/pull/7",
      },
    ],
    blog: {
      title: "BloodBridge: atomic transactions and stored procedures in ADBMS",
      slug: "bloodbridge-advanced-database-procedures-and-transactions",
      excerpt: "How PL/pgSQL stored procedures and database contracts guarantee data integrity across collaborative academic prototypes.",
      content: `# Relational integrity in critical domain prototypes
In blood inventory systems, partial updates are catastrophic. If a blood unit transfer deducts from a regional bank but fails to register at the receiving clinic, units disappear from the system.

# Atomic transactions via PL/pgSQL
By encapsulating the transfer workflow within PL/pgSQL stored procedures, all inventory updates, eligibility verifications, and audit log entries execute inside an explicit atomic transaction boundary.

# Merged pre-handoff architecture
Contributing database-contract pull request #7 provided the team with structured migrations, procedure definitions, and regression tests that prevented downstream schema drift.`,
    },
  },

  // 4. HZ Labs — Portfolio and Content Management Platform
  {
    repository: "HajithMohamed/my_portfoli_website",
    title: "HZ Labs — Portfolio and Content Management Platform",
    goal: "Full-stack portfolio CMS, GitHub intelligence platform, and digital product studio platform for Mohamed Hajith.",
    summary: "Independently developed full-stack web application built with Next.js App Router, NestJS REST backend, Prisma, and PostgreSQL. Features authenticated administration, GitHub telemetry sync, and 90+ automated tests.",
    technologies: ["Next.js", "NestJS", "TypeScript", "Prisma", "PostgreSQL", "Vitest", "Tailwind CSS"],
    coverImage: "/brand/project-blueprint.jpg",
    sourceUrl: "https://github.com/HajithMohamed/my_portfoli_website",
    reviewedAt: "2026-10-22",
    sections: [
      {
        heading: "Problem",
        body: "Developer portfolios often rely on static templates or third-party platforms that fail to demonstrate actual full-stack engineering ability, verified repository metadata, authenticated CMS workflows, or robust automated testing.",
      },
      {
        heading: "Your contribution",
        body: "Independently architected, designed, and developed the entire application: Next.js 16 App Router frontend, NestJS backend API with Prisma ORM, JWT authentication with Argon2 password hashing, live GitHub public sync integration, and 90+ automated tests.",
      },
      {
        heading: "Architecture",
        body: "Next.js App Router client with SSR/ISR and Tailwind CSS; NestJS REST API microservice; Prisma ORM connected to PostgreSQL database; Cloudinary asset pipeline; GitHub API sync layer with resilient offline caching.",
      },
      {
        heading: "Key technical decisions",
        body: "Implemented a clean separation between public portfolio views and authenticated administration; designed graceful fallback data pipelines so the portfolio remains fast and fully functional even when external GitHub API rate-limits trigger; added comprehensive input validation with Zod and class-validator.",
      },
      {
        heading: "Testing",
        body: "90+ automated unit and integration tests across components, utility functions, API routes, and accessibility attributes using Vitest and React Testing Library.",
      },
      {
        heading: "Current status",
        body: "Live production platform deployed at hzlabs.studio with open-source repository documentation.",
      },
      {
        heading: "Repository/Demo",
        body: "Repository: https://github.com/HajithMohamed/my_portfoli_website | Live Website: https://www.hzlabs.studio/",
      },
    ],
    blog: {
      title: "Building an authenticated full-stack portfolio and CMS platform",
      slug: "building-authenticated-portfolio-cms-platform",
      excerpt: "How Next.js 16, NestJS, Prisma, and GitHub telemetry combine into a verified engineering showcase.",
      content: `# Beyond static portfolio websites
An engineering portfolio should itself be evidence of full-stack competence. HZ Labs is engineered as a complete production application with a NestJS REST API, Prisma ORM, and Next.js App Router.

# Authenticated CMS and GitHub sync
The administrative layer allows authorized management of project case studies, inquiry dispatches, and resume assets, while the public frontend syncs directly with verified GitHub repositories.

# Tested for resilience
With 90+ automated tests in Vitest, every component, route handler, and data-mapping utility is verified against edge cases and offline states.`,
    },
  },

  // 5. Shoe Bank — Footwear Business Management System
  {
    repository: "HajithMohamed/Footwear_Business_Management_System",
    title: "Shoe Bank — Footwear Business Management System",
    goal: "Help a Sri Lankan footwear wholesaler track inventory, import costs, credit sales, cheques, and the difference between profit and cash collected.",
    summary: "A mobile-first wholesale management ERP with landed-cost calculations, customer ledgers, sales, import clearance, and financial reporting built with PHP, MySQL, Tailwind CSS, Alpine.js, and Docker.",
    technologies: ["PHP", "MySQL", "Tailwind CSS", "Alpine.js", "Docker"],
    coverImage: "/projects/shoe-bank-cover.png",
    sourceUrl: "https://github.com/HajithMohamed/Footwear_Business_Management_System",
    reviewedAt: "2026-10-22",
    sections: [
      {
        heading: "Problem",
        body: "Wholesale footwear shops purchase stock in bulk, handle customs import clearance, sell on credit, and collect customer payments over months. Confusing invoiced sales with cash collected leads to severe cash-flow shortages when the next shipment arrives.",
      },
      {
        heading: "Your contribution",
        body: "Designed and implemented the complete wholesale management application: inventory tracking, landed-cost snapshots, credit sales, cheque clearing workflows, customer ledger replaying, and financial reports.",
      },
      {
        heading: "Architecture",
        body: "Lightweight custom PHP MVC architecture, MySQL/MariaDB relational database, Tailwind CSS with Alpine.js (zero-build frontend for low-cost shared hosting), and Docker Compose for development.",
      },
      {
        heading: "Key technical decisions",
        body: "Snapshotted landed costs onto invoices at sale time to prevent future import recalculations from distorting historical profit; separated credit sales from actual cash collected; replayed customer account history chronologically to match payments to existing invoices.",
      },
      {
        heading: "Testing",
        body: "Containerized end-to-end testing with Docker Compose, simulating multi-currency landed cost allocations, cheque bounces, and partial credit settlements.",
      },
      {
        heading: "Current status",
        body: "Working business system repository covering inventory, sales, customer ledgers, and financial reporting.",
      },
      {
        heading: "Repository/Demo",
        body: "Repository: https://github.com/HajithMohamed/Footwear_Business_Management_System",
      },
    ],
    blog: {
      title: "Shoe Bank: why profit and cash need separate views",
      slug: "shoe-bank-profit-cash-and-credit-sales",
      excerpt: "How the wholesale footwear project's documented rules handle landed cost, credit invoices, and cheque clearing without confusing sales with money received.",
      content: `# Start with the shop's actual question
Shoe Bank is a wholesale footwear management project. Its central distinction is between making a profitable sale and receiving its payment. A shop can sell on credit and still have little cash available to purchase the next shipment.

# Keep profit and collected cash separate
The profit calculation considers sales, cost of goods sold, and operating expenses. Credit sales belong to the day of sale, while cash only includes money actually received. Pending and bounced cheques stay outside collected cash.

# Preserve the cost of a sale
A cost snapshot is taken when an invoice is created. Recalculating an import shipment later does not rewrite recorded profit on past sales.`,
    },
  },

  // 6. TechBridge — Developer Collaboration Network
  {
    repository: "HajithMohamed/Tech_Bridge",
    title: "TechBridge — Developer Collaboration Network",
    goal: "Connect university software engineering teams with milestone evaluation, structured peer reviews, and mentor feedback.",
    summary: "A MERN-stack collaborative platform connecting undergraduate engineering projects with milestone tracking, repository links, and structured peer review workflows.",
    technologies: ["React", "Node.js", "Express", "MongoDB", "Tailwind CSS"],
    coverImage: "/projects/tech-bridge-cover.png",
    sourceUrl: "https://github.com/HajithMohamed/Tech_Bridge",
    reviewedAt: "2026-10-22",
    sections: [
      {
        heading: "Problem",
        body: "University software engineering students often lack structured platforms to submit progress milestones, receive peer code reviews, and track development iterations across group assignments.",
      },
      {
        heading: "Your contribution",
        body: "Developed full-stack features including project registration, user profile directories, milestone submission endpoints, and reviewer evaluation forms.",
      },
      {
        heading: "Architecture",
        body: "React client with responsive Tailwind CSS interface, Node.js and Express REST API gateway, and MongoDB database persistence.",
      },
      {
        heading: "Key technical decisions",
        body: "Structured review feedback schemas linking comments directly to specific milestone deliverables; implemented role-based permissions distinguishing students from evaluators.",
      },
      {
        heading: "Testing",
        body: "Component rendering tests and API endpoint validation using Postman.",
      },
      {
        heading: "Current status",
        body: "Open-source collaboration platform repository.",
      },
      {
        heading: "Repository/Demo",
        body: "Repository: https://github.com/HajithMohamed/Tech_Bridge",
      },
    ],
    blog: {
      title: "TechBridge: structuring peer review workflows for engineering students",
      slug: "techbridge-peer-review-milestones",
      excerpt: "Notes on building milestone evaluation and peer review tools for university software engineering teams.",
      content: `# Structured peer review in software education
TechBridge connects undergraduate developer teams with structured milestone evaluations. By anchoring review feedback directly to project milestones and repository commits, teams receive actionable technical feedback.`,
    },
  },

  // 7. University Library Management System
  {
    repository: "HajithMohamed/Library-Management-System",
    title: "University Library Management System",
    goal: "Bring book discovery, borrowing, returns, overdue fines, and library administration into a role-based university application.",
    summary: "A PHP MVC library system for students, faculty, and administrators, with borrowing records, book inventory, email verification, and Docker services.",
    technologies: ["PHP", "MySQL", "Bootstrap", "PHPMailer", "Docker"],
    coverImage: "/projects/university-library-cover.png",
    sourceUrl: "https://github.com/HajithMohamed/Library-Management-System",
    reviewedAt: "2026-10-22",
    sections: [
      {
        heading: "Problem",
        body: "Academic libraries require synchronized inventory tracking across student borrowing, faculty loans, overdue fine assessments, and book return workflows without inventory drift.",
      },
      {
        heading: "Your contribution",
        body: "Implemented PHP MVC controllers, database models, email OTP verification via PHPMailer, borrowing workflows, and Docker Compose development setup.",
      },
      {
        heading: "Architecture",
        body: "PHP MVC architecture, MySQL database, Bootstrap user interface, PHPMailer SMTP service, containerized with Docker and Nginx.",
      },
      {
        heading: "Key technical decisions",
        body: "Separated request controllers from database models and business service rules; automated overdue fine calculations based on due dates and return timestamps.",
      },
      {
        heading: "Testing",
        body: "Containerized development validation and manual end-to-end checkout/return testing.",
      },
      {
        heading: "Current status",
        body: "Open-source PHP MVC academic management project repository.",
      },
      {
        heading: "Repository/Demo",
        body: "Repository: https://github.com/HajithMohamed/Library-Management-System",
      },
    ],
    blog: {
      title: "University Library: following a book from search to return",
      slug: "university-library-search-borrow-return",
      excerpt: "Project notes on connecting catalogue availability, borrowing history, overdue fines, and role-based administration in a PHP MVC application.",
      content: `# Complete borrowing lifecycle
The University Library Management System coordinates discovery, circulation, and account records into one cohesive PHP application.

# Three records provide the foundation
Users, books, and borrowing transactions form the schema backbone. Automatic fine calculations ensure accountability for overdue loans.`,
    },
  },

  // 8. NEXTGEN Mobile Shop
  {
    repository: "HajithMohamed/NEXTGEN---Sri-Lankan-Mobile-Shop-eCommerce-Website",
    title: "NEXTGEN Mobile Shop",
    goal: "Connect a mobile shop storefront and shopping cart to product, customer, and order management.",
    summary: "A mobile-shop eCommerce project combining an HTML, CSS, JavaScript, and Bootstrap storefront with PHP and MySQL backend administration.",
    technologies: ["HTML", "CSS", "JavaScript", "PHP", "MySQL", "Bootstrap"],
    coverImage: "/projects/nextgen-mobile-cover.png",
    sourceUrl: "https://github.com/HajithMohamed/NEXTGEN---Sri-Lankan-Mobile-Shop-eCommerce-Website",
    reviewedAt: "2026-10-22",
    sections: [
      {
        heading: "Problem",
        body: "Mobile retail shops require responsive digital storefronts where customers can browse device specifications, compare models, and submit orders while administrators manage inventory.",
      },
      {
        heading: "Your contribution",
        body: "Built the responsive storefront, product filtering, shopping cart, and PHP/MySQL backend administrative order handling.",
      },
      {
        heading: "Architecture",
        body: "HTML, CSS, JavaScript, and Bootstrap frontend interface; PHP server backend; MySQL relational database.",
      },
      {
        heading: "Key technical decisions",
        body: "Created clean directory separation between customer storefront pages and administrative management portals; implemented password hashing for user accounts.",
      },
      {
        heading: "Testing",
        body: "Cross-device responsive layout testing and checkout flow validation.",
      },
      {
        heading: "Current status",
        body: "Completed eCommerce web development project repository.",
      },
      {
        heading: "Repository/Demo",
        body: "Repository: https://github.com/HajithMohamed/NEXTGEN---Sri-Lankan-Mobile-Shop-eCommerce-Website",
      },
    ],
    blog: {
      title: "NEXTGEN: connecting a mobile-shop storefront to its admin tools",
      slug: "nextgen-mobile-shop-storefront-and-admin",
      excerpt: "A look at the documented customer and administration workflows in a PHP and MySQL mobile-shop eCommerce project.",
      content: `# Connecting storefront with administration
NEXTGEN combines a customer-facing device catalogue with an administrative portal for inventory and order management.`,
    },
  },
];
