import Link from "next/link";
import { hasDb } from "@/lib/db";
import { adminMessages, adminProjects, adminVideos } from "@/lib/content";
import { deleteMessage, deleteProject, deleteVideo, toggleRead } from "../actions";
import ConfirmButton from "./ConfirmButton";

const notes: Record<string, string> = {
  project: "Project saved — the public site has been updated.",
  video: "Video saved — the public site has been updated.",
};

export default async function Dashboard({ searchParams }: { searchParams: Promise<{ saved?: string; deleted?: string }> }) {
  const sp = await searchParams;
  if (!hasDb) return <p className="lead">Connect MongoDB to manage content and read messages.</p>;

  let error = "";
  let [messages, projects, videos]: [Awaited<ReturnType<typeof adminMessages>>, Awaited<ReturnType<typeof adminProjects>>, Awaited<ReturnType<typeof adminVideos>>] = [[], [], []];
  try {
    [messages, projects, videos] = await Promise.all([adminMessages(), adminProjects(), adminVideos()]);
  } catch (err) {
    console.error("[admin] database error", err);
    error = "Couldn't reach MongoDB. Check MONGODB_URI and that your server's IP is allowed in Atlas → Network Access.";
  }
  const unread = messages.filter((m) => !m.read).length;

  return (
    <>
      <h1>Dashboard</h1>
      <p className="lead">{unread ? `${unread} new message${unread > 1 ? "s" : ""}.` : "You're all caught up."}</p>
      {error && <div className="notice"><b>Database error.</b> {error}</div>}
      {sp.saved && notes[sp.saved] && <div className="notice">{notes[sp.saved]}</div>}
      {sp.deleted && <div className="notice">Deleted.</div>}

      {/* Messages */}
      <section className="acard">
        <div className="acard-h"><h2>Messages</h2><span>{messages.length} total</span></div>
        {messages.length === 0 ? <div className="empty">No messages yet. Enquiries from the contact form appear here.</div> : messages.map((m) => (
          <div key={m.id} className={`msg${m.read ? "" : " unread"}`}>
            <div className="msg-h">
              <div><b>{m.name}</b> · <a href={`mailto:${m.email}?subject=${encodeURIComponent("Re: your project")}`}>{m.email}</a>{m.budget && <> · <span className="badge-s">{m.budget}</span></>}</div>
              <span className="mono" style={{ color: "var(--ink-3)" }}>{new Date(m.createdAt).toLocaleString("en-GB", { timeZone: "Asia/Karachi", dateStyle: "medium", timeStyle: "short" })}{!m.read && <> · <span className="badge-s new">New</span></>}</span>
            </div>
            <p>{m.message}</p>
            <div className="actions">
              <a className="sbtn pri" href={`mailto:${m.email}?subject=${encodeURIComponent("Re: your project")}`}>Reply</a>
              <form action={toggleRead}><input type="hidden" name="id" value={m.id} /><input type="hidden" name="read" value={m.read ? "0" : "1"} /><button className="sbtn">{m.read ? "Mark unread" : "Mark read"}</button></form>
              <form action={deleteMessage}><input type="hidden" name="id" value={m.id} /><ConfirmButton message="Delete this message?">Delete</ConfirmButton></form>
            </div>
          </div>
        ))}
      </section>

      {/* Projects */}
      <section className="acard">
        <div className="acard-h"><h2>Projects</h2><Link className="sbtn pri" href="/admin/projects/new">+ New project</Link></div>
        {projects.length === 0 ? <div className="empty">No projects in the database — the site is showing the built-in ones. Run <code>npm run seed</code> to import them.</div> : (
          <div className="table-wrap"><table className="table">
            <thead><tr><th></th><th>Title</th><th>Category</th><th>Status</th><th>Order</th><th></th></tr></thead>
            <tbody>{projects.map((p) => (
              <tr key={p.id}>
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <td>{p.image && <img className="thumb" src={p.image} alt="" />}</td>
                <td><b>{p.title}</b><div className="mono" style={{ color: "var(--ink-3)" }}>/work/{p.slug}</div></td>
                <td>{p.category}</td>
                <td>{p.published ? <span className="badge-s ok">Published</span> : <span className="badge-s">Draft</span>}</td>
                <td>{p.order}</td>
                <td><div className="actions">
                  <a className="sbtn" href={`/work/${p.slug}`} target="_blank" rel="noopener">View</a>
                  <Link className="sbtn" href={`/admin/projects/${p.id}`}>Edit</Link>
                  <form action={deleteProject}><input type="hidden" name="id" value={p.id} /><ConfirmButton message={`Delete “${p.title}”?`}>Delete</ConfirmButton></form>
                </div></td>
              </tr>
            ))}</tbody>
          </table></div>
        )}
      </section>

      {/* Videos */}
      <section className="acard">
        <div className="acard-h"><h2>Videos</h2><Link className="sbtn pri" href="/admin/videos/new">+ New video</Link></div>
        {videos.length === 0 ? <div className="empty">No videos in the database — the site is showing the built-in ones.</div> : (
          <div className="table-wrap"><table className="table">
            <thead><tr><th>Title</th><th>Group</th><th>Category</th><th>Order</th><th></th></tr></thead>
            <tbody>{videos.map((v) => (
              <tr key={v.id}>
                <td><b>{v.title}</b></td><td>{v.group}</td><td>{v.category}</td><td>{v.order}</td>
                <td><div className="actions">
                  <a className="sbtn" href={v.src || `https://drive.google.com/file/d/${v.driveId}/view`} target="_blank" rel="noopener">Open</a>
                  <Link className="sbtn" href={`/admin/videos/${v.id}`}>Edit</Link>
                  <form action={deleteVideo}><input type="hidden" name="id" value={v.id} /><ConfirmButton message={`Delete “${v.title}”?`}>Delete</ConfirmButton></form>
                </div></td>
              </tr>
            ))}</tbody>
          </table></div>
        )}
      </section>
    </>
  );
}
