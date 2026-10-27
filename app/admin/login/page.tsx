import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { adminConfigured, isAdmin } from "@/lib/auth";
import LoginForm from "./LoginForm";

export const metadata: Metadata = { title: "Admin", robots: { index: false, follow: false } };
export const dynamic = "force-dynamic";

export default async function LoginPage() {
  if (await isAdmin()) redirect("/admin");
  return (
    <main className="login">
      <div className="box">
        <div className="wm" style={{ fontSize: 22 }}>abdulmoiz<span>.</span></div>
        <h1>Admin</h1>
        {adminConfigured() ? (
          <>
            <p>Sign in to edit projects, videos and read messages.</p>
            <LoginForm />
          </>
        ) : (
          <p>Admin is turned off. Set <code>ADMIN_PASSWORD</code> and <code>ADMIN_SECRET</code> in your environment variables, then restart the app.</p>
        )}
      </div>
    </main>
  );
}
