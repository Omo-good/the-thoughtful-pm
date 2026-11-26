import { redirect } from "next/navigation";
import { currentToken } from "@/lib/admin";

export default async function AdminIndex() {
  redirect((await currentToken()) ? "/admin/projects" : "/admin/login");
}
