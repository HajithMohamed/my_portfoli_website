import { notFound } from "next/navigation";
import { TopBar } from "@/components/shell/top-bar";
import { CommandFooter } from "@/components/shell/command-footer";
import { getHomeData, getProject } from "@/lib/public-data";
import {
  projectCodename,
  projectHudStatus,
  projectYear,
} from "@/lib/project-presentation";
import { ProjectDossierView } from "@/components/projects/project-dossier-view";

type PageProps = {
  params: Promise<{ slug: string }>;
};

export async function generateMetadata({ params }: PageProps) {
  const { slug } = await params;
  const project = await getProject(slug);
  if (!project) {
    return {
      title: "Project Not Found | HZ Labs",
      description: "Technical architecture dossier by Mohamed Hajith.",
    };
  }

  const ogUrl = `/api/og?title=${encodeURIComponent(project.title)}&category=${encodeURIComponent(project.category || "Case Study")}&badge=DOSSIER&tech=${encodeURIComponent(project.techStack.slice(0, 4).join(","))}`;

  return {
    title: `${project.title} — Technical Dossier | HZ Labs`,
    description: project.description ?? "Technical architecture dossier by Mohamed Hajith.",
    openGraph: {
      title: `${project.title} — Technical Dossier | HZ Labs`,
      description: project.description,
      type: "article",
      images: [
        {
          url: ogUrl,
          width: 1200,
          height: 630,
          alt: `${project.title} Architecture Dossier`,
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      title: `${project.title} — Technical Dossier | HZ Labs`,
      description: project.description,
      images: [ogUrl],
    },
  };
}

export default async function ProjectDetailPage({ params }: PageProps) {
  const { slug } = await params;
  const [project, { profile, projects }] = await Promise.all([getProject(slug), getHomeData()]);

  if (!project) {
    notFound();
  }

  const status = projectHudStatus(project, false);
  const sections = project.caseStudy?.length ? project.caseStudy : [];
  
  const currentIndex = projects.findIndex((p) => p.slug === project.slug || p.dedupeKey === project.dedupeKey);
  const prevProject = currentIndex > 0 ? projects[currentIndex - 1] : projects[projects.length - 1];
  const nextProject = currentIndex < projects.length - 1 && currentIndex >= 0 ? projects[currentIndex + 1] : projects[0];

  // Suggest other projects excluding current
  const relatedProjects = projects
    .filter((p) => p.slug !== project.slug && p.dedupeKey !== project.dedupeKey)
    .slice(0, 2);

  return (
    <div className="relative min-h-screen">
      <TopBar location={profile.location} />
      <main className="relative z-10 pt-16 pb-24">
        <div className="container-responsive section-gap max-w-[1100px]">
          <ProjectDossierView
            project={project}
            status={status}
            codename={projectCodename(project)}
            year={projectYear(project)}
            sections={sections}
            relatedProjects={relatedProjects}
            prevProject={prevProject}
            nextProject={nextProject}
          />
        </div>
      </main>
      <CommandFooter profile={profile} />
    </div>
  );
}
