import type { ReactNode } from "react";

export function EmptyState({ title, children }: { title: string; children?: ReactNode }) {
  return (
    <div className="card p-8 text-center" role="status">
      <h2 className="text-2xl">{title}</h2>
      {children ? <div className="mt-3 text-muted">{children}</div> : null}
    </div>
  );
}
