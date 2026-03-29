export function BrandLogo() {
  return (
    <div className="flex items-center gap-3">
      <div className="relative h-11 w-11 shrink-0 rounded-full bg-[conic-gradient(#2A1A14_0%,#5A3B2E_30%,#B48762_30%,#D6B394_50%,#2A1A14_50%,#5A3B2E_80%,#B48762_80%,#D6B394_100%)] shadow-soft">
        <span className="grid h-11 w-11 place-items-center rounded-full border border-white/15 bg-gradient-to-br from-latte to-mocha text-sm font-semibold shadow-glow text-white">
          JH
        </span>
      </div>
      <div>
        <p className="text-xs font-semibold uppercase tracking-[0.35em] text-latte">
          Jinshin19 Brew Reserve
        </p>
        <p className="mt-1 text-lg font-semibold text-roast">Admin Dashboard</p>
      </div>
    </div>
  );
}
