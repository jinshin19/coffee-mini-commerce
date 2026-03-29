import { ReactNode } from 'react';

export function StatCard({
  label,
  value,
  hint,
  tone = 'default',
  icon,
}: {
  label: string;
  value: string;
  hint: string;
  tone?: 'default' | 'warm' | 'danger' | 'success';
  icon: ReactNode;
}) {
  const toneClasses = {
    default: 'from-white to-oat',
    warm: 'from-crema to-white',
    danger: 'from-red-50 to-white',
    success: 'from-emerald-50 to-white',
  } as const;

  return (
    <div className={`admin-card bg-gradient-to-br ${toneClasses[tone]} p-6`}>
      <div className="flex items-start justify-between gap-4">
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.28em] text-mocha/50">{label}</p>
          <p className="mt-3 text-3xl font-semibold text-roast">{value}</p>
          <p className="mt-3 text-sm leading-6 text-mocha/75">{hint}</p>
        </div>
        <div className="grid h-12 w-12 shrink-0 place-items-center rounded-2xl bg-roast text-lg text-white shadow-soft">
          {icon}
        </div>
      </div>
    </div>
  );
}
