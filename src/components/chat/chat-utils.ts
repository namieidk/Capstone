export function formatMessageTime(dateString: string): string {
  try {
    const d = new Date(dateString);
    if (Number.isNaN(d.getTime())) return "";
    const now = new Date();
    const isToday =
      d.getDate() === now.getDate() && d.getMonth() === now.getMonth() && d.getFullYear() === now.getFullYear();

    if (isToday) {
      return d.toLocaleTimeString([], { hour: "numeric", minute: "2-digit" });
    }
    return d.toLocaleDateString([], { month: "short", day: "numeric" });
  } catch {
    return "";
  }
}

export function getInitials(name: string): string {
  if (!name.trim()) return "VS";
  const parts = name.trim().split(" ");
  if (parts.length >= 2) {
    return (parts[0][0] + parts[1][0]).toUpperCase();
  }
  return name.slice(0, 2).toUpperCase();
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
