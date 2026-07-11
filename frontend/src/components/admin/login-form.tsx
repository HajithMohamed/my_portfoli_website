"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { LockKeyhole } from "lucide-react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { notifyAuthChanged } from "@/components/admin/admin-shell";
import { absoluteApiUrl } from "@/lib/utils";

const loginSchema = z.object({
  email: z.string().email(),
  password: z.string().min(8),
});

type LoginFormValues = z.infer<typeof loginSchema>;

export function LoginForm() {
  const router = useRouter();
  const [error, setError] = useState<string | null>(null);
  const { register, handleSubmit, formState } = useForm<LoginFormValues>({
    resolver: zodResolver(loginSchema),
    defaultValues: { email: "admin@hzlabs.dev", password: "" },
  });

  async function submit(values: LoginFormValues) {
    setError(null);
    const response = await fetch(absoluteApiUrl("/auth/login"), {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(values),
    });
    if (!response.ok) {
      setError("Login failed. Check the env-seeded admin credentials.");
      return;
    }
    const data = (await response.json()) as { accessToken: string; refreshToken: string };
    localStorage.setItem("hz_access_token", data.accessToken);
    localStorage.setItem("hz_refresh_token", data.refreshToken);
    notifyAuthChanged();
    router.push("/admin/dashboard");
  }

  return (
    <main className="flex min-h-screen items-center justify-center bg-[#050816] px-4 text-slate-50">
      <Card className="w-full max-w-md">
        <LockKeyhole className="h-8 w-8 text-blue-300" />
        <h1 className="mt-5 font-display text-3xl font-semibold">HZ Labs Admin</h1>
        <p className="mt-2 text-sm leading-6 text-slate-400">Protected CMS, CV, GitHub sync, and content management.</p>
        <form className="mt-7 grid gap-4" onSubmit={handleSubmit(submit)}>
          <Input placeholder="Email" type="email" {...register("email")} />
          <Input placeholder="Password" type="password" {...register("password")} />
          <Button disabled={formState.isSubmitting} type="submit">
            {formState.isSubmitting ? "Signing in" : "Login"}
          </Button>
          {error ? <p className="text-sm text-red-300">{error}</p> : null}
        </form>
      </Card>
    </main>
  );
}
