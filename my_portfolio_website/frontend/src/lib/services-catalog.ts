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
    subtitle: "Production-ready web applications with clean architecture and reactive UI.",
    description:
      "Custom full-stack web platforms and Software-as-a-Service applications engineered with modern reactive frameworks, modular component architectures, secure authentication, and scalable databases.",
    color: "cyan",
    iconName: "Globe",
    deliverables: [
      "Custom SaaS platforms & customer portals",
      "Progressive Web Apps (PWA) with responsive design",
      "Robust full-stack reactive web architectures",
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
    title: "Mobile apps (In Development)",
    shortTitle: "Mobile Apps",
    subtitle: "Mobile-first responsive platforms, Progressive Web Apps, and cross-platform UI exploration.",
    description:
      "Responsive cross-platform web platforms, Progressive Web Apps (PWA), and mobile user interfaces engineered with modern frameworks, with active development and exploration in Flutter and Dart.",
    color: "violet",
    iconName: "Smartphone",
    deliverables: [
      "Progressive Web Apps (PWA) with responsive mobile layouts",
      "Touch-friendly interfaces verified down to 320px viewports",
      "Clean client-server REST API contracts for mobile clients",
      "Offline-first local caching and responsive UI design",
      "Cross-platform mobile UI prototypes (active development with Flutter)",
    ],
    techStack: ["Flutter (Exploring)", "Dart", "Next.js", "PWA", "Tailwind CSS", "REST APIs"],
    relatedProjectSlugs: ["nextgen-mobile-shop"],
    wizardServiceId: "web-app",
    keyBenefit: "Deliver seamless, mobile-optimized experiences to your users across every screen size.",
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
    techStack: ["React", "Next.js", "Node.js", "Express", "MongoDB", "Tailwind CSS"],
    relatedProjectSlugs: ["saga-elite", "nextgen-mobile-shop"],
    wizardServiceId: "online-store",
    keyBenefit: "Provide customers a frictionless shopping journey that increases order completion rates.",
  },
  {
    id: "backend-apis",
    slug: "backend-api-engineering",
    title: "Backend & APIs",
    shortTitle: "Backend & APIs",
    subtitle: "Reliable APIs, relational database engineering, and secure microservices.",
    description:
      "Resilient server-side architectures, RESTful APIs, microservices, and database schemas built with strict validation, rate limiting, token security, and Docker containerization.",
    color: "emerald",
    iconName: "Server",
    deliverables: [
      "High-reliability RESTful API endpoints and gateways",
      "Relational (PostgreSQL, MySQL) and NoSQL (MongoDB) data models",
      "Stateless JWT authentication, session handling, and RBAC security",
      "Event-driven background workers, queues, and webhook dispatchers",
      "Docker containerization, Nginx reverse proxying, and health telemetry",
    ],
    techStack: ["Node.js", "Express", "NestJS", "Spring Boot", "Prisma", "PostgreSQL", "MySQL", "Docker"],
    relatedProjectSlugs: ["saga-elite", "medical-lab-system", "shoe-bank", "hzlabs-studio"],
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
      "Intuitive operational dashboards and management tools that transform complex operational data into actionable insights, administrative controls, and automated report generation.",
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
    subtitle: "Applied AI integrations, OCR processing, and task automations.",
    description:
      "Integration of modern LLM APIs, OCR document extraction, and automated notification webhooks into web applications and operational workflows.",
    color: "rose",
    iconName: "Cpu",
    deliverables: [
      "Custom LLM API integrations (OpenAI, Claude) for search and summarization",
      "Document parsing, OCR, and automated structured data extraction",
      "Automated transactional messaging pipelines (Email, WhatsApp notifications)",
      "Custom cron jobs, data processing scripts, and background task workers",
    ],
    techStack: ["OpenAI / Claude APIs", "Node.js", "Python", "Tesseract OCR", "REST APIs"],
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

