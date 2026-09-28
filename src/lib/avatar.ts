// Deterministic profile photo URL from a name/id.
export function avatarFor(seed: string): string {
  let hash = 0;
  for (let i = 0; i < seed.length; i++) hash = (hash * 31 + seed.charCodeAt(i)) >>> 0;
  const idx = (hash % 70) + 1; // pravatar supports img=1..70
  return `https://i.pravatar.cc/160?img=${idx}`;
}

export function initialsFromName(name: string): string {
  return name
    .split(/\s+/)
    .filter(Boolean)
    .slice(0, 2)
    .map((p) => p[0]?.toUpperCase())
    .join("");
}
