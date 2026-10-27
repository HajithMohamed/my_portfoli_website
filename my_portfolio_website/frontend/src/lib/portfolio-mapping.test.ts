import { describe, expect, it } from "vitest";
import { projectsFromGithub } from "./portfolio-mapping";
import type { GithubSummary, Project } from "./types";

const github = {
  recentRepos: [],
  contributionData: {
    repositories: [
      {
        fullName: "owner/new-repo",
        name: "new-repo",
        url: "https://github.com/owner/new-repo",
      },
    ],
  },
} as unknown as GithubSummary;
const project = (id: string, fields: Partial<Project> = {}): Project => ({
  id,
  title: id,
  slug: id,
  description: "Reviewed",
  techStack: ["PHP"],
  category: "Software",
  status: "ACTIVE",
  featured: false,
  ...fields,
});
describe("CMS authority over public projects", () => {
  it("does not publish discovered repositories or static case studies without approval", () => {
    expect(projectsFromGithub(github, [])).toEqual([]);
    expect(
      projectsFromGithub(github, [
        project("new-repo", {
          status: "DRAFT",
          githubUrl: "https://github.com/owner/new-repo",
        }),
      ]),
    ).toEqual([]);
  });
  it("preserves editorial data and media and uses saved order", () => {
    const media = [
      {
        url: "/projects/shoe-bank-cover.png",
        alt: "Reviewed screenshot",
        type: "IMAGE" as const,
      },
    ];
    const projects = projectsFromGithub(github, [
      project("later", { homepageOrder: 2 }),
      project("first", {
        homepageOrder: 1,
        media,
        showOnHomepage: false,
        showOnProjectsPage: true,
      }),
    ]);
    expect(projects.map((item) => item.id)).toEqual(["first", "later"]);
    expect(projects[0]).toMatchObject({
      media,
      showOnHomepage: false,
      showOnProjectsPage: true,
      description: "Reviewed",
      techStack: ["PHP"],
    });
  });

  it("does not restore a manually cleared cover or case study from static stories", () => {
    const result = projectsFromGithub(github, [project("saga-elite", { githubUrl: "https://github.com/HajithMohamed/Saga-Elite-Web-project", coverImage: null, caseStudy: [] })]);
    expect(result[0].coverImage).toBeNull();
    expect(result[0].caseStudy).toEqual([]);
  });
});
