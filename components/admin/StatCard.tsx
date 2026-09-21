export function StatCard({ label, value }: { label: string; value: number | string }) {
  return (
    <div className="border border-ink-400 p-6">
      <p className="font-sans text-xs uppercase tracking-widest text-ink-200">{label}</p>
      <p className="mt-3 font-serif text-3xl text-ink-50">{value}</p>
    </div>
  );
}
