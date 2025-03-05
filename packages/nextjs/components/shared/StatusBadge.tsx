interface StatusBadgeProps {
  status: string;
  size?: "sm" | "md";
  className?: string;
}

export const StatusBadge = ({ status, size = "md", className = "" }: StatusBadgeProps) => {
  const getStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case "open":
        return "badge-info";
      case "in_progress":
      case "assigned":
        return "badge-warning";
      case "completed":
      case "verified":
        return "badge-success";
      case "cancelled":
        return "badge-error";
      default:
        return "badge-ghost";
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status.toLowerCase()) {
      case "open":
        return "fiber_new";
      case "in_progress":
      case "assigned":
        return "pending";
      case "completed":
      case "verified":
        return "check_circle";
      case "cancelled":
        return "cancel";
      default:
        return "help";
    }
  };

  return (
    <span className={`badge ${getStatusColor(status)} ${size === "sm" ? "badge-sm" : "badge-md"} gap-1 ${className}`}>
      <span className="text-xs material-icons">{getStatusIcon(status)}</span>
      {status.replace("_", " ")}
    </span>
  );
};