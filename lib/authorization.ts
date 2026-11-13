import { auth } from "@/lib/auth/server";

export async function getCurrentSessionUser() {
  const { data, error } = await auth.getSession();
  if (error || !data?.user) {
    return { user: null, error: "Unauthorized" as const };
  }

  return { user: data.user, error: null };
}

export function isAdminEmail(email: string | null | undefined) {
  const admins = (process.env.ADMIN_EMAILS || "")
    .split(",")
    .map((entry) => entry.trim().toLowerCase())
    .filter(Boolean);

  return Boolean(email && admins.includes(email.toLowerCase()));
}

export async function requireAdminSession() {
  const session = await getCurrentSessionUser();
  if (!session.user) {
    return { ok: false, status: 401 as const, message: "Unauthorized" };
  }

  if (!isAdminEmail(session.user.email)) {
    return { ok: false, status: 403 as const, message: "Admin access required" };
  }

  return { ok: true, status: 200 as const, user: session.user };
}
