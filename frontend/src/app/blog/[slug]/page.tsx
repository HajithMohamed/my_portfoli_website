import { notFound } from "next/navigation";
import { Badge } from "@/components/ui/badge";
import { ButtonLink } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { getBlogPost } from "@/lib/api";
import { formatDate } from "@/lib/utils";

type PageProps = {
  params: Promise<{ slug: string }>;
};

export async function generateMetadata({ params }: PageProps) {
  const { slug } = await params;
  const post = await getBlogPost(slug);
  return {
    title: post?.title ?? "Blog",
    description: post?.excerpt ?? "HZ Labs engineering article.",
  };
}

export default async function BlogPostPage({ params }: PageProps) {
  const { slug } = await params;
  const post = await getBlogPost(slug);

  if (!post) {
    notFound();
  }

  const lines = post.content.split("\n").filter(Boolean);

  return (
    <main className="min-h-screen bg-[#050816] px-4 py-12 text-slate-50 sm:px-6 lg:px-8">
      <article className="mx-auto max-w-3xl">
        <ButtonLink href="/blog" variant="ghost">
          Blog
        </ButtonLink>
        <header className="mt-12">
          <Badge>{formatDate(post.publishedAt)}</Badge>
          <h1 className="mt-5 font-display text-5xl font-semibold tracking-normal">{post.title}</h1>
          <p className="mt-5 text-lg leading-8 text-slate-400">{post.excerpt}</p>
        </header>
        <Card className="mt-10 space-y-5">
          {lines.map((line, index) =>
            line.startsWith("#") ? (
              <h2 className="font-display text-2xl font-semibold text-white" key={index}>
                {line.replace(/^#+\s*/, "")}
              </h2>
            ) : (
              <p className="leading-8 text-slate-300" key={index}>
                {line}
              </p>
            ),
          )}
        </Card>
      </article>
    </main>
  );
}
