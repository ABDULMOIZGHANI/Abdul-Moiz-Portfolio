// Small inline icon set (stroke icons, 24×24), so the site needs no icon library.
type P = { className?: string };
const base = { viewBox: "0 0 24 24", fill: "none", stroke: "currentColor", strokeWidth: 1.8, strokeLinecap: "round" as const, strokeLinejoin: "round" as const };

export const FrameIcon = ({ className = "i" }: P) => (<svg className={className} {...base}><path d="M8 3v18M16 3v18M3 8h18M3 16h18" /></svg>);
export const MoveIcon = ({ className = "i" }: P) => (<svg className={className} {...base}><path d="M5 3l14 8-6 2-3 6z" /></svg>);
export const ComponentIcon = ({ className = "i" }: P) => (<svg className={className} {...base}><path d="M12 3l4 4-4 4-4-4zM12 13l4 4-4 4-4-4zM7 8l4 4-4 4-4-4zM17 8l4 4-4 4-4-4z" /></svg>);
export const PlayIcon = ({ className = "i" }: P) => (<svg className={className} {...base}><path d="M7 5l12 7-12 7z" /></svg>);
export const CommentIcon = ({ className = "i" }: P) => (<svg className={className} {...base}><path d="M4 5h16v11H9l-5 4z" /></svg>);
export const HistoryIcon = ({ className = "i" }: P) => (<svg className={className} {...base}><path d="M3 12a9 9 0 1 0 3-6.7L3 8M3 3v5h5M12 7v5l3 2" /></svg>);
export const CheckIcon = ({ className = "i" }: P) => (<svg className={className} {...base} strokeWidth={2}><path d="M5 12l5 5 9-10" /></svg>);
export const MoonIcon = ({ className = "i" }: P) => (<svg className={className} {...base}><path d="M12 3a9 9 0 1 0 9 9 7 7 0 0 1-9-9z" /></svg>);
export const PenIcon = ({ className = "i" }: P) => (<svg className={className} {...base}><path d="M12 19l7-7 3 3-7 7-3-3z" /><path d="M18 13l-1.5-7.5L2 2l3.5 14.5L13 18l5-5z" /><path d="M2 2l7.6 7.6" /><circle cx="11" cy="11" r="2" /></svg>);
export const CodeIcon = ({ className = "i" }: P) => (<svg className={className} {...base}><path d="M16 18l6-6-6-6M8 6l-6 6 6 6" /></svg>);
export const VideoIcon = ({ className = "i" }: P) => (<svg className={className} {...base}><rect x="2" y="5" width="15" height="14" rx="2" /><path d="M17 10l5-3v10l-5-3" /></svg>);
export const CapIcon = ({ className = "i" }: P) => (<svg className={className} {...base}><path d="M2 9l10-5 10 5-10 5z" /><path d="M6 11v5c3 2 9 2 12 0v-5" /></svg>);
export const ArrowUpRight = ({ className = "", size = 12 }: P & { size?: number }) => (<svg className={className} width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2.2}><path d="M7 17 17 7M8 7h9v9" /></svg>);
export const PageIcon = ({ name }: { name: "move" | "frame" | "play" | "comment" }) =>
  name === "move" ? <MoveIcon /> : name === "play" ? <PlayIcon /> : name === "comment" ? <CommentIcon /> : <FrameIcon />;
export const PlaySolid =() => (<svg viewBox="0 0 24 24" fill="currentColor"><path d="M6 4l14 8-14 8z" /></svg>);
