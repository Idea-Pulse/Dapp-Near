interface EmptyStateProps {
  icon?: string;
  title: string;
  description: string;
  actionLabel?: string;
  onAction?: () => void;
}

export const EmptyState = ({ icon = "search", title, description, actionLabel, onAction }: EmptyStateProps) => {
  return (
    <div className="py-8 text-center rounded-lg sm:py-10 bg-base-200/50">
      <span className="mb-3 text-5xl material-icons text-primary/50">{icon}</span>
      <h3 className="mb-2 text-xl font-bold sm:text-2xl">{title}</h3>
      <p className="mb-5 text-sm opacity-80 sm:text-base">{description}</p>
      {actionLabel && onAction && (
        <button onClick={onAction} className="gap-2 btn btn-primary btn-md sm:btn-lg">
          <span className="text-base material-icons">add</span>
          {actionLabel}
        </button>
      )}
    </div>
  );
};