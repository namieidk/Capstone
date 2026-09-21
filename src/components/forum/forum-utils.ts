import type { ForumAuthor, ForumComment, ForumPost } from "@/lib/api/forum";

export function getAuthorName(author?: ForumAuthor | null): string {
  if (!author) return "Scholar";
  if (author.name?.trim() && author.name !== "undefined undefined") {
    return author.name.trim();
  }
  const first = author.first_name && author.first_name !== "undefined" ? author.first_name.trim() : "";
  const last = author.last_name && author.last_name !== "undefined" ? author.last_name.trim() : "";
  const fullName = `${first} ${last}`.trim();
  if (fullName && fullName !== "undefined undefined") {
    return fullName;
  }
  if (author.email && author.email !== "undefined") {
    return author.email.split("@")[0];
  }
  return "Scholar";
}

export function getAuthorEmail(author?: ForumAuthor | null): string {
  if (!author?.email || author.email === "undefined") return "";
  return author.email;
}

export function getInitials(name: string): string {
  if (!name?.trim() || name === "undefined undefined") return "VS";
  const parts = name.trim().split(" ").filter(Boolean);
  if (parts.length >= 2) {
    return (parts[0][0] + parts[1][0]).toUpperCase();
  }
  return name.slice(0, 2).toUpperCase();
}

export function formatTime(dateString: string): string {
  try {
    const d = new Date(dateString);
    if (Number.isNaN(d.getTime())) return "";
    const now = new Date();
    const diffMs = now.getTime() - d.getTime();
    const diffMins = Math.floor(diffMs / 60000);
    if (diffMins < 2) return "Just now";
    if (diffMins < 60) return `${diffMins}m ago`;
    const diffHours = Math.floor(diffMins / 60);
    if (diffHours < 24) return `${diffHours}h ago`;
    return d.toLocaleDateString([], { month: "short", day: "numeric" });
  } catch {
    return "";
  }
}

export function getRoleBadgeVariant(role?: string): {
  className: string;
  label: string;
} {
  switch (role?.toUpperCase()) {
    case "ADMIN":
      return {
        className: "bg-emerald-50 text-emerald-700 border-emerald-200",
        label: "Admin",
      };
    case "COORDINATOR":
      return {
        className: "bg-blue-50 text-blue-700 border-blue-200",
        label: "Coordinator",
      };
    case "GRANTOR":
      return {
        className: "bg-purple-50 text-purple-700 border-purple-200",
        label: "Grantor",
      };
    default:
      return {
        className: "bg-amber-50 text-amber-800 border-amber-200",
        label: "Scholar",
      };
  }
}

export function dedupePosts(list: ForumPost[]): ForumPost[] {
  const map = new Map<number, ForumPost>();
  for (const post of list) {
    if (post && typeof post.post_id === "number") {
      map.set(post.post_id, post);
    }
  }
  return Array.from(map.values());
}

export function dedupeComments(list: ForumComment[]): ForumComment[] {
  const map = new Map<number, ForumComment>();
  for (const c of list) {
    if (c && typeof c.comment_id === "number") {
      map.set(c.comment_id, c);
    }
  }
  return Array.from(map.values());
}
