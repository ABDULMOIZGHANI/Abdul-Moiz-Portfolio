// Copies the built-in content (data/*.json) into MongoDB so it can be edited in /admin.
// Usage: npm run seed   (reads MONGODB_URI from .env.local)
// Safe to re-run: projects are matched by slug and videos by Drive id, so nothing is duplicated.
import { readFileSync } from "node:fs";
import mongoose from "mongoose";

const uri = process.env.MONGODB_URI;
if (!uri) {
  console.error("MONGODB_URI is not set. Add it to .env.local first.");
  process.exit(1);
}

const read = (f) => JSON.parse(readFileSync(new URL(`../data/${f}`, import.meta.url), "utf8"));
const projects = read("projects.json");
const videos = read("videos.json");

const Project = mongoose.model("Project", new mongoose.Schema({
  slug: { type: String, unique: true }, title: String, category: String, tags: [String], filters: [String],
  image: String, url: String, description: String, content: String, order: Number, published: Boolean,
}, { timestamps: true }));
const Video = mongoose.model("Video", new mongoose.Schema({
  group: String, title: String, category: String, driveId: String, src: String, poster: String,
  featured: Boolean, duration: String, uploadDate: String, description: String, order: Number,
}, { timestamps: true }));

await mongoose.connect(uri, { serverSelectionTimeoutMS: 10000 });
for (const p of projects) await Project.updateOne({ slug: p.slug }, { $setOnInsert: p }, { upsert: true });
for (const v of videos) await Video.updateOne(v.src ? { src: v.src } : { driveId: v.driveId }, { $setOnInsert: v }, { upsert: true });
console.log(`Seeded ${projects.length} projects and ${videos.length} videos (existing entries left untouched).`);
await mongoose.disconnect();
