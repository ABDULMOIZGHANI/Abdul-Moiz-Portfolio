import type { Metadata } from "next";
import Link from "next/link";
import { redirect } from "next/navigation";
import { isAdmin } from "@/lib/auth";
import { hasDb } from "@/lib/db";
import ThemeToggle from "@/components/ThemeToggle";
import { logout } from "../actions";

export const metadata: Metadata = { title: "Admin", robots: { index: false, follow: false } };
export const dynamic = "force-dynamic";

export default async function AdminLayout({ children }: { children: React.ReactNode }) {
  if (!(await isAdmin())) redirect("/admin/login");
  return (
    <>
      <header className="tb">
        <div className="tb-l">
          <Link className="wm" href="/admin">abdulmoiz<span>.</span></Link>
          <span className="sep" />
          <span className="crumb">Admin / <b>Dashboard</b></span>
        </div>
        <div className="tb-r">
          <a className="sbtn" href="/" target="_blank" rel="noopener">View site ↗</a>
          <ThemeToggle />
          <form action={logout}><button className="sbtn" type="submit">Sign out</button></form>
        </div>
      </header>
      <main className="admin">
        <div className="admin-in">
          {!hasDb && (
            <div className="notice">
              <b>No database connected.</b> The public site is running on the built-in content in <code>/data</code>.
              Add <code>MONGODB_URI</code> to your environment variables, restart, then run <code>npm run seed</code> to copy that content into MongoDB so you can edit it here.
            </div>
          )}
          {children}
        </div>
      </main>
    </>
  );
}
