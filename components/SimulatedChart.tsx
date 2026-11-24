const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];

// Fixed illustrative series for a hypothetical $10,000 demo portfolio.
const simulated = [10000, 9980, 10040, 10110, 10060, 10150, 10210, 10190, 10260, 10300, 10280, 10340];

// Steady path at the 2.5% p.a. target, for comparison only.
const targetPath = simulated.map((_, i) => Math.round(10000 * Math.pow(1.025, i / 12)));

const W = 720;
const H = 260;
const PAD = { top: 24, right: 18, bottom: 34, left: 52 };

function points(series: number[], min: number, max: number): string {
  const iw = W - PAD.left - PAD.right;
  const ih = H - PAD.top - PAD.bottom;
  return series
    .map((v, i) => {
      const x = PAD.left + (i / (series.length - 1)) * iw;
      const y = PAD.top + (1 - (v - min) / (max - min)) * ih;
      return `${x.toFixed(1)},${y.toFixed(1)}`;
    })
    .join(" ");
}

export default function SimulatedChart() {
  const all = [...simulated, ...targetPath];
  const min = Math.min(...all) - 40;
  const max = Math.max(...all) + 40;
  const line = points(simulated, min, max);
  const target = points(targetPath, min, max);
  const area = `${PAD.left},${H - PAD.bottom} ${line} ${W - PAD.right},${H - PAD.bottom}`;
  const ticks = [min + 40, (min + max) / 2, max - 40].map((v) => Math.round(v / 10) * 10);

  return (
    <div className="simchart">
      <svg viewBox={`0 0 ${W} ${H}`} role="img" aria-label="Simulated portfolio performance chart">
        <defs>
          <linearGradient id="simfill" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#c8a45b" stopOpacity="0.35" />
            <stop offset="100%" stopColor="#c8a45b" stopOpacity="0.02" />
          </linearGradient>
        </defs>
        {ticks.map((t) => {
          const y = PAD.top + (1 - (t - min) / (max - min)) * (H - PAD.top - PAD.bottom);
          return (
            <g key={t}>
              <line x1={PAD.left} x2={W - PAD.right} y1={y} y2={y} stroke="rgba(255,255,255,0.08)" />
              <text x={PAD.left - 8} y={y + 4} textAnchor="end" fill="#8d9aa7" fontSize="10">
                ${t.toLocaleString()}
              </text>
            </g>
          );
        })}
        {months.map((m, i) => {
          if (i % 2 !== 0) return null;
          const x = PAD.left + (i / (months.length - 1)) * (W - PAD.left - PAD.right);
          return (
            <text key={m} x={x} y={H - 12} textAnchor="middle" fill="#8d9aa7" fontSize="10">
              {m}
            </text>
          );
        })}
        <polygon points={area} fill="url(#simfill)" />
        <polyline points={target} fill="none" stroke="#6b7c8d" strokeWidth="1.5" strokeDasharray="5 5" />
        <polyline points={line} fill="none" stroke="#c8a45b" strokeWidth="2.5" strokeLinejoin="round" />
      </svg>
      <div className="simchart-legend">
        <span><i className="dot dot-gold" /> Simulated portfolio value</span>
        <span><i className="dot dot-dash" /> 2.5% p.a. target path</span>
      </div>
    </div>
  );
}
