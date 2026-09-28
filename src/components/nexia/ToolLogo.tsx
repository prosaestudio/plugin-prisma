import { cn } from "@/lib/utils";

const SLUGS: Record<string, string> = {
  chatgpt: "openai",
  openai: "openai",
  "gpt-4": "openai",
  claude: "anthropic",
  anthropic: "anthropic",
  gemini: "googlegemini",
  "google gemini": "googlegemini",
  copilot: "githubcopilot",
  "microsoft copilot": "githubcopilot",
  "github copilot": "githubcopilot",
  github: "github",
  notion: "notion",
  "notion ai": "notion",
  figma: "figma",
  cursor: "cursor",
  linear: "linear",
  jira: "jira",
  slack: "slack",
  zoom: "zoom",
  miro: "miro",
  perplexity: "perplexity",
  word: "microsoftword",
  "microsoft word": "microsoftword",
  excel: "microsoftexcel",
  "microsoft excel": "microsoftexcel",
  powerpoint: "microsoftpowerpoint",
  "microsoft powerpoint": "microsoftpowerpoint",
  outlook: "microsoftoutlook",
  "microsoft outlook": "microsoftoutlook",
  teams: "microsoftteams",
  "microsoft teams": "microsoftteams",
  onenote: "microsoftonenote",
  "microsoft onenote": "microsoftonenote",
  onedrive: "microsoftonedrive",
  "microsoft onedrive": "microsoftonedrive",
  sharepoint: "microsoftsharepoint",
  "microsoft sharepoint": "microsoftsharepoint",
  python: "python",
};

// Simple Icons removed Microsoft + OpenAI product icons due to trademark — use icons8 fallback
const OVERRIDES: Record<string, string> = {
  openai: "https://img.icons8.com/color/96/chatgpt.png",
  anthropic: "https://claude.ai/favicon.ico",
  microsoftword: "https://img.icons8.com/color/96/microsoft-word-2019.png",
  microsoftexcel: "https://img.icons8.com/color/96/microsoft-excel-2019.png",
  microsoftpowerpoint: "https://img.icons8.com/color/96/microsoft-powerpoint-2019.png",
  microsoftoutlook: "https://img.icons8.com/color/96/microsoft-outlook-2019.png",
  microsoftteams: "https://img.icons8.com/color/96/microsoft-teams.png",
  microsoftonenote: "https://img.icons8.com/color/96/microsoft-onenote-2019.png",
  microsoftonedrive: "https://img.icons8.com/color/96/microsoft-onedrive-2019.png",
  microsoftsharepoint: "https://img.icons8.com/color/96/microsoft-sharepoint-2019.png",
};

export function logoUrl(name: string): string | null {
  const slug = SLUGS[name.trim().toLowerCase()];
  if (!slug) return null;
  return OVERRIDES[slug] ?? `https://cdn.simpleicons.org/${slug}`;
}

export function ToolLogo({ name, size = 16, className }: { name: string; size?: number; className?: string }) {
  const url = logoUrl(name);
  if (!url) {
    return (
      <span
        className={cn("inline-flex items-center justify-center rounded bg-muted text-[9px] font-semibold text-muted-foreground", className)}
        style={{ width: size, height: size }}
      >
        {name.slice(0, 1).toUpperCase()}
      </span>
    );
  }
  return (
    <img
      src={url}
      alt={name}
      width={size}
      height={size}
      loading="lazy"
      className={cn("inline-block object-contain", className)}
      style={{ width: size, height: size }}
    />
  );
}

export function ToolBadge({ name, size = 14 }: { name: string; size?: number }) {
  return (
    <span className="inline-flex items-center gap-1.5 text-[10px] px-2 py-0.5 rounded-md bg-muted">
      <ToolLogo name={name} size={size} />
      <span>{name}</span>
    </span>
  );
}
