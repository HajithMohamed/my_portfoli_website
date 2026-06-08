import { BookOpenText } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { ButtonLink } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { getHomeData } from "@/lib/api";
import { formatDate } from "@/lib/utils";

export const metadata = {
  title: "Blog",
  description: "Engineering notes and product thinking from HZ Labs.",
};

export default async function BlogPage() {
  const { blogs } = await getHomeData();

  return (
    <main className="min-h-screen bg-[#050816] px-4 py-12 text-slate-50 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-5xl">
        <ButtonLink href="/" variant="ghost">
          HZ Labs
        </ButtonLink>
        <div className="mt-12 max-w-3xl">
          <Badge>Blog</Badge>
          <h1 className="mt-5 font-display text-5xl font-semibold tracking-normal">Engineering notes and product thinking</h1>
        </div>
        <div className="mt-12 grid gap-5">
          {blogs.map((post) => (
            <Card key={post.id}>
              <div className="flex items-center gap-3 text-sm text-slate-500">
                <BookOpenText className="h-4 w-4 text-blue-300" />
                {formatDate(post.publishedAt)}
              </div>
              <h2 className="mt-4 text-2xl font-semibold">{post.title}</h2>
              <p className="mt-3 leading-7 text-slate-400">{post.excerpt}</p>
              <ButtonLink className="mt-6" href={`/blog/${post.slug}`} variant="secondary">
                Read article
              </ButtonLink>
            </Card>
          ))}
        </div>
      </div>
    </main>
  );
}
