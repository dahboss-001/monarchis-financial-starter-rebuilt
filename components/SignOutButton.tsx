"use client";

import { authClient } from "@/lib/auth/client";

export function SignOutButton() {
  return (
    <button
      type="button"
      className="navbtn outline"
      onClick={async () => {
        await authClient.signOut();
        window.location.assign("/auth");
      }}
    >
      Sign out
    </button>
  );
}
