export default function DemoBadge({ label = "DEMO MODE" }: { label?: string }) {
  return <span className="badge badge-demo">{label}</span>;
}
