import Link from "next/link";
import { FILTERS, VIDEO_GROUPS, type Project, type Video } from "@/lib/types";
import { saveProject, saveVideo } from "../actions";

export function ProjectForm({ p }: { p?: Project | null }) {
  return (
    <form action={saveProject} className="aform">
      {p && <input type="hidden" name="id" value={p.id} />}
      <div className="two">
        <div className="field"><label htmlFor="title">Title</label><input id="title" name="title" className="input" required defaultValue={p?.title} /></div>
        <div className="field"><label htmlFor="slug">URL slug</label><input id="slug" name="slug" className="input" defaultValue={p?.slug} placeholder="auto from title" /><p className="hint">Page address: /work/<b>slug</b></p></div>
      </div>
      <div className="two">
        <div className="field"><label htmlFor="category">Category</label><input id="category" name="category" className="input" defaultValue={p?.category} placeholder="e.g. Real estate platform" /></div>
        <div className="field"><label htmlFor="tags">Tags</label><input id="tags" name="tags" className="input" defaultValue={p?.tags.join(", ")} placeholder="UI/UX, Webflow, SEO" /><p className="hint">Comma separated</p></div>
      </div>
      <div className="field"><label>Filters</label>
        <div className="checks">{FILTERS.map((f) => (
          <label key={f.key}><input type="checkbox" name="filters" value={f.key} defaultChecked={p?.filters.includes(f.key)} />{f.label}</label>
        ))}</div>
      </div>
      <div className="field"><label htmlFor="image">Image URL</label><input id="image" name="image" className="input"defaultValue={p?.image} placeholder="https://… or /images/project.webp" /><p className="hint">Put files in <code>public/images</code> and use /images/name.webp, or paste any image link.</p></div>
      <div className="field"><label htmlFor="url">Live site URL</label><input id="url" name="url" className="input" type="url" defaultValue={p?.url} placeholder="Leave empty for concept work" /></div>
      <div className="field"><label htmlFor="description">Short description</label><textarea id="description" name="description" className="input" style={{ minHeight: 80 }} defaultValue={p?.description} /><p className="hint">Shown on cards and used as the Google description.</p></div>
      <div className="field"><label htmlFor="content">Case study text</label><textarea id="content" name="content" className="input" style={{ minHeight: 200 }} defaultValue={p?.content} placeholder="The challenge, your process, the result… Separate paragraphs with a blank line." /></div>
      <div className="two">
        <div className="field"><label htmlFor="order">Order</label><input id="order" name="order" className="input" type="number" defaultValue={p?.order ?? 0} /></div>
        <div className="field"><label>&nbsp;</label><div className="checks"><label><input type="checkbox" name="published" defaultChecked={p?.published ?? true} />Published</label></div></div>
      </div>
      <div className="checks"><button className="btn pri" type="submit">Save project</button><Link className="btn" href="/admin">Cancel</Link></div>
    </form>
  );
}

export function VideoForm({ v }: { v?: Video | null }) {
  return (
    <form action={saveVideo} className="aform">
      {v && <input type="hidden" name="id" value={v.id} />}
      <div className="two">
        <div className="field"><label htmlFor="title">Title</label><input id="title" name="title" className="input" required defaultValue={v?.title} /></div>
        <div className="field"><label htmlFor="group">Group</label>
          <select id="group" name="group" className="input" defaultValue={v?.group ?? "AI video"}>{VIDEO_GROUPS.map((g) => <option key={g}>{g}</option>)}</select>
        </div>
      </div>
      <div className="two">
        <div className="field"><label htmlFor="category">Category</label><input id="category" name="category" className="input" defaultValue={v?.category} placeholder="e.g. Product ad" /></div>
        <div className="field"><label htmlFor="order">Order</label><input id="order" name="order" className="input" type="number" defaultValue={v?.order ?? 0} /></div>
      </div>
      <div className="field"><label htmlFor="driveId">Google Drive link or file ID</label><input id="driveId" name="driveId" className="input" required defaultValue={v?.driveId} placeholder="https://drive.google.com/file/d/…/view" /><p className="hint">Share the file as “Anyone with the link can view”.</p></div>
      <div className="field"><label htmlFor="description">Description</label><textarea id="description" name="description" className="input" style={{ minHeight: 80 }} defaultValue={v?.description} /></div>
      <div className="checks"><button className="btn pri" type="submit">Save video</button><Link className="btn" href="/admin">Cancel</Link></div>
    </form>
  );
}
