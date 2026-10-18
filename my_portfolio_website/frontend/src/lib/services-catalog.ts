import type { Project } from "./types";

export interface ServiceDefinition {
  id: string;
  slug: string;
  title: string;
  shortTitle: string;
  subtitle: string;
  description: string;
  color: "cyan" | "violet" | "amber" | "emerald" | "rose" | "purple";
  iconName: string;
  deliverables: string[];
  techStack: string[];
  relatedProjectSlugs: string[];
  wizardServiceId: "redesign" | "online-store" | "web-app" | "not-sure";
  keyBenefit: string;
}

export const SERVICES_CATALOG: ServiceDefinition[] = [
  {
    id: "web-saas",
    slug: "web-saas-platforms",
    title: "Web & SaaS platforms",
    shortTitle: "Web & SaaS",
    subtitle: "Production-ready web applications from first prototype to high-traffic scale.",
    description:
      "Custom full-stack web platforms and Software-as-a-Service applications engineered with modern reactive frameworks, modular component architectures, secure authentication, and scalable databases.",
    color: "cyan",
    iconName: "Globe",
    deliverables: [
      "Custom SaaS platforms & customer portals",
      "Progressive Web Apps (PWA) with offline support",
      "High-throughput reactive web architectures",
      "Automated CI/CD build pipelines and cloud hosting",
      "Clean TypeScript codebases designed for rapid feature iteration",
    ],
    techStack: ["Next.js", "React", "TypeScript", "Node.js", "Tailwind CSS", "PostgreSQL"],
    relatedProjectSlugs: ["hzlabs-studio", "saga-elite", "tech-bridge"],
    wizardServiceId: "web-app",
    keyBenefit: "Turn your business idea into a resilient, scalable web application that users love.",
  },
  {
    id: "mobile-apps",
    slug: "mobile-applications-flutter",
    title: "Mobile apps (Flutter)",
    shortTitle: "Mobile Apps",
    subtitle: "Cross-platform iOS & Android apps with clean architecture and native UX.",
    description:
      "Fluid, high-performance mobile applications built with Flutter and Dart delivering native 60fps experiences across both iOS and Android from a unified, maintainable codebase.",
    color: "violet",
    iconName: "Smartphone",
    deliverables: [
      "Cross-platform iOS & Android applications from one codebase",
      "Offline-first local caching and seamless cloud synchronization",
      "Native device integration (Camera, GPS, Biometrics, Bluetooth)",
      "Real-time push notifications and user engagement flows",
      "App Store & Google Play submission and release engineering",
    ],
    techStack: ["Flutter", "Dart", "Riverpod", "SQLite", "Firebase", "REST APIs"],
    relatedProjectSlugs: ["shoe-bank", "nextgen-mobile-shop"],
    wizardServiceId: "web-app",
    keyBenefit: "Deploy your product to both iOS and Android simultaneously without duplicate cost.",
  },
  {
    id: "ecommerce",
    slug: "ecommerce-platforms",
    title: "E-commerce",
    shortTitle: "E-Commerce",
    subtitle: "Custom carts, inventory, and order flows that convert from day one.",
    description:
      "Conversion-optimized e-commerce storefronts featuring tailored shopping journeys, drop-based releases, inventory reservation, multi-currency payment gateways, and automated customer notifications.",
    color: "amber",
    iconName: "ShoppingBag",
    deliverables: [
      "Custom shopping cart, checkout, and order fulfillment flows",
      "Drop-based & limited release inventory reservation systems",
      "Payment gateway integrations (Stripe, PayHere, Bank Slip Verification)",
      "Automated order dispatch notices and customer receipts",
      "Product variant catalogs with high-resolution media galleries",
    ],
    techStack: ["React", "Next.js", "Node.js", "Express", "MongoDB", "Tailwind CSS", "Redis"],
    relatedProjectSlugs: ["saga-elite", "shoe-bank", "nextgen-mobile-shop"],
    wizardServiceId: "online-store",
    keyBenefit: "Provide customers a frictionless shopping journey that increases order completion rates.",
  },
  {
    id: "backend-apis",
    slug: "backend-api-engineering",
    title: "Backend & APIs",
    shortTitle: "Backend & APIs",
    subtitle: "High-throughput APIs, event-driven systems, and database engineering that scales.",
    description:
      "Resilient server-side architectures, RESTful & GraphQL APIs, microservices, and database schemas built with strict validation, rate limiting, token security, and Docker containerization.",
    color: "emerald",
    iconName: "Server",
    deliverables: [
      "High-throughput RESTful and GraphQL API gateways",
      "Relational (PostgreSQL, MySQL) and NoSQL (MongoDB, Redis) data models",
      "Stateless JWT authentication, session handling, and RBAC security",
      "Event-driven background workers, queues, and webhook dispatchers",
      "Docker containerization, Nginx reverse proxying, and health telemetry",
    ],
    techStack: ["NestJS", "Node.js", "Express", "Spring Boot", "Prisma", "PostgreSQL", "Docker", "Redis"],
    relatedProjectSlugs: ["hzlabs-studio", "spring-boot-microservices", "shoe-bank"],
    wizardServiceId: "web-app",
    keyBenefit: "Power your frontend with rock-solid server logic that never drops a request.",
  },
  {
    id: "admin-dashboards",
    slug: "admin-dashboards-internal-tools",
    title: "Admin dashboards",
    shortTitle: "Admin Dashboards",
    subtitle: "Internal operations tools, analytics views, and clear, controllable workflows.",
    description:
      "Powerful, intuitive operational dashboards and management tools that transform complex operational data into actionable insights, administrative controls, and automated report generation.",
    color: "cyan",
    iconName: "LayoutDashboard",
    deliverables: [
      "Role-based administrative portals and access control tiers",
      "Real-time operational metrics, KPIs, and interactive visual charts",
      "Complete CRUD interfaces for products, inquiries, and users",
      "Financial ledger calculation, CSV/PDF exports, and audit logs",
      "Mobile-responsive administrative layouts for on-the-go management",
    ],
    techStack: ["Next.js", "React", "Tailwind CSS", "Prisma", "PostgreSQL", "Recharts"],
    relatedProjectSlugs: ["shoe-bank", "library-management-system"],
    wizardServiceId: "web-app",
    keyBenefit: "Streamline team workflows and gain instant clarity over daily business operations.",
  },
  {
    id: "ai-automation",
    slug: "ai-workflow-automation",
    title: "AI & automation",
    shortTitle: "AI & Automation",
    subtitle: "Intelligent workflows, voice interfaces, and automations to eliminate repetitive tasks.",
    description:
      "Integration of modern machine learning models, speech recognition interfaces, intelligent data extraction, and automated notification webhooks into web and enterprise workflows.",
    color: "rose",
    iconName: "Cpu",
    deliverables: [
      "Conversational Voice AI interfaces and low-latency speech pipelines",
      "Custom LLM API integrations (OpenAI, Claude) for summarization and search",
      "Document parsing, OCR, and automated structured data extraction",
      "Automated transactional messaging pipelines (Email, WhatsApp, SMS)",
      "Custom cron jobs, data scrapers, and task automation scripts",
    ],
    techStack: ["Python", "PyTorch", "FastAPI", "OpenAI / Claude APIs", "WebAudio", "Node.js"],
    relatedProjectSlugs: ["goyo-voice", "medical-lab-system"],
    wizardServiceId: "web-app",
    keyBenefit: "Automate hours of manual work and elevate your product with intelligent capabilities.",
  },
];

export function getAllServices(): ServiceDefinition[] {
  return SERVICES_CATALOG;
}

export function getServiceById(id: string): ServiceDefinition | undefined {
  return SERVICES_CATALOG.find((s) => s.id === id || s.slug === id);
}

export function getRelatedProjectsForService(
  service: ServiceDefinition,
  allProjects: Project[]
): Project[] {
  return allProjects.filter((p) => {
    const slugLower = p.slug.toLowerCase();
    return service.relatedProjectSlugs.some((relSlug) =>
      slugLower.includes(relSlug.toLowerCase()) || relSlug.toLowerCase().includes(slugLower)
    );
  });
}

export function buildServiceInquiryUrl(service: ServiceDefinition | string): string {
  const serviceId = typeof service === "string" ? service : service.id;
  return `/start-project?service=${encodeURIComponent(serviceId)}`;
}

