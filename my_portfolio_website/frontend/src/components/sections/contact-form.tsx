"use client";

import { useState } from "react";
import { Send } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input, Textarea } from "@/components/ui/input";
import { absoluteApiUrl } from "@/lib/utils";

export function ContactForm() {
  const [status, setStatus] = useState<"idle" | "sending" | "sent" | "error">("idle");

  async function submit(formData: FormData) {
    setStatus("sending");
    const payload = {
      name: String(formData.get("name") ?? ""),
      email: String(formData.get("email") ?? ""),
      subject: String(formData.get("subject") ?? "Portfolio inquiry"),
      message: String(formData.get("message") ?? ""),
    };

    try {
      const response = await fetch(absoluteApiUrl("/messages"), {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      setStatus(response.ok ? "sent" : "error");
    } catch {
      setStatus("error");
    }
  }

  return (
    <form action={submit} className="grid gap-3">
      <Input name="name" placeholder="Name" required />
      <Input name="email" type="email" placeholder="Email" required />
      <Input name="subject" placeholder="Subject" />
      <Textarea name="message" placeholder="Message" required />
      <Button className="w-full" disabled={status === "sending"} type="submit">
        <Send className="h-4 w-4" />
        {status === "sending" ? "Sending" : "Send Message"}
      </Button>
      {status === "sent" ? <p className="text-sm text-blue-200">Message stored. HZ Labs will follow up soon.</p> : null}
      {status === "error" ? <p className="text-sm text-red-300">Message could not be sent. Try email directly.</p> : null}
    </form>
  );
}
