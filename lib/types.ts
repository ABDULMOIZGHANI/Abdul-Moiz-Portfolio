export type Filter = "web" | "product" | "dev";
export type VideoGroup = "AI video" | "Ad films" | "Reels";

export type Project = {
  id: string;
  slug: string;
  title: string;
  category: string;
  tags: string[];
  filters: Filter[];
  image: string;
  url: string;
  description: string;
  content: string;
  order: number;
  published: boolean;
};

export type Video = {
  id: string;
  group: VideoGroup;
  title: string;
  category: string;
  /** Google Drive file id — used when the video lives on Drive. */
  driveId: string;
  /** Self-hosted file, e.g. /videos/name.mp4 — used instead of Drive when set. */
  src?: string;
  poster?: string;
  /** Shown large at the top of the video page. */
  featured?: boolean;
  /** ISO 8601 duration (e.g. PT55S) and publish date, for Google's video results. */
  duration?: string;
  uploadDate?: string;
  description: string;
  order: number;
};

export type Experience = { when: string; company: string; role: string; current?: boolean };

export type Message = {
  id: string;
  name: string;
  email: string;
  budget: string;
  message: string;
  read: boolean;
  createdAt: string;
};

export const VIDEO_GROUPS: VideoGroup[] = ["AI video", "Ad films", "Reels"];
export const FILTERS: { key: Filter; label: string }[] = [
  { key: "web", label: "Websites" },
  { key: "product", label: "Product & apps" },
  { key: "dev", label: "Designed + built" },
];
