import { redirect } from "next/navigation";

export default function InternalIndex() {
  redirect("/_internal/dashboard");
}
