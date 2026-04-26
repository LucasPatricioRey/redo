"use server";

import { redirect } from "next/navigation";

import { signInAdmin } from "@/lib/admin-auth";

export async function signInAdminAction(formData: FormData) {
  const username = String(formData.get("username") || "");
  const password = String(formData.get("password") || "");

  const authenticated = await signInAdmin(username, password);

  if (!authenticated) {
    redirect("/admin-login?error=1");
  }

  redirect("/admin");
}
