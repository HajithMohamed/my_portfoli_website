"use client";

import dynamic from "next/dynamic";
import type { Profile, Skill, Project, GithubSummary, CvAsset } from "@/lib/types";

const RecruiterModePanel = dynamic(
  () => import("@/components/sections/recruiter-mode").then((m) => ({ default: m.RecruiterMode })),
  { ssr: false }
);

interface Props {
  profile: Profile;
  skills: Skill[];
  projects: Project[];
  github: GithubSummary;
  resume: CvAsset | null;
}

export function RecruiterModeClient(props: Props) {
  return <RecruiterModePanel {...props} />;
}
