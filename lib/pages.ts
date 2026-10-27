// Site page list, kept free of server imports so client components (Layers panel) can use it
// without pulling the database code into the browser bundle.
export type PageKey = "home" | "work" | "video" | "contact";

export const PAGES: { key: PageKey; href: string; label: string; icon: "move" | "frame" | "play" | "comment" }[] = [
  { key: "home", href: "/", label: "Home", icon: "move" },
  { key: "work", href: "/work", label: "UI/UX & Web", icon: "frame" },
  { key: "video", href: "/video", label: "Video editing", icon: "play" },
  { key: "contact", href: "/contact", label: "Contact", icon: "comment" },
];
