// Next Imports
import type { ReactNode } from "react";

export function SectionCard({
  title,
  description,
  action,
  children,
}: {
  title: string;
  description?: string;
  action?: ReactNode;
  children: ReactNode;
}) {
  return (
    <section className="admin-card p-6 sm:p-7">
      <div className="flex flex-col gap-4 border-b border-mocha/10 pb-5 md:flex-row md:items-center md:justify-between">
        <div>
          <h2 className="text-2xl font-semibold text-roast">{title}</h2>
          {description ? (
            <p className="mt-2 max-w-2xl text-sm leading-6 text-mocha/75">
              {description}
            </p>
          ) : null}
        </div>
        {action ? <div>{action}</div> : null}
      </div>
      <div className="pt-5">{children}</div>
    </section>
  );
}
