import { f } from '../lib/calc.js'
export function Ring({ value, size = 84, label }) {
  const r = size / 2 - 7, c = 2 * Math.PI * r, v = Math.max(0, Math.min(100, value ?? 0))
  const col = v >= 80 ? 'var(--up)' : v >= 60 ? 'var(--acc)' : 'var(--down)'
  return (
    <svg width={size} height={size} role="img" aria-label={`${label || 'Score'} ${f(value)} percent`}>
      <circle cx={size / 2} cy={size / 2} r={r} fill="none" stroke="var(--line)" strokeWidth="8" />
      <circle cx={size / 2} cy={size / 2} r={r} fill="none" stroke={col} strokeWidth="8" strokeLinecap="round"
        strokeDasharray={c} strokeDashoffset={c * (1 - v / 100)} transform={`rotate(-90 ${size / 2} ${size / 2})`} />
      <text x="50%" y="53%" textAnchor="middle" dominantBaseline="middle" fontFamily="Sora" fontWeight="700" fontSize={size / 4.2} fill="var(--ink)">{value == null ? '–' : Math.round(value)}</text>
    </svg>
  )
}
export function Trend({ points, goal }) {
  const W = 560, H = 190, P = 30, ok = points.filter(p => p.value != null)
  if (!ok.length) return <p className="muted">Add marks to see your trend.</p>
  const lo = Math.min(40, ...ok.map(p => p.value) , goal ?? 100) - 5, hi = 100
  const x = i => P + (points.length === 1 ? (W - 2 * P) / 2 : (i * (W - 2 * P)) / (points.length - 1))
  const y = v => H - P - ((v - lo) / (hi - lo)) * (H - 2 * P)
  const path = points.map((p, i) => p.value == null ? null : `${x(i)},${y(p.value)}`).filter(Boolean).join(' ')
  return (
    <svg viewBox={`0 0 ${W} ${H}`} width="100%" role="img" aria-label="Semester score trend">
      {[50, 70, 90].map(g => <g key={g}><line x1={P} x2={W - P} y1={y(g)} y2={y(g)} stroke="var(--line)" /><text x={4} y={y(g) + 4} fontSize="11" fill="var(--mut)">{g}</text></g>)}
      {goal != null && <line x1={P} x2={W - P} y1={y(goal)} y2={y(goal)} stroke="var(--amb)" strokeDasharray="5 4" strokeWidth="1.5" />}
      <polyline points={path} fill="none" stroke="var(--acc)" strokeWidth="3" strokeLinejoin="round" />
      {points.map((p, i) => p.value != null && <g key={i}><circle cx={x(i)} cy={y(p.value)} r="5" fill="#fff" stroke="var(--acc)" strokeWidth="3" />
        <text x={x(i)} y={y(p.value) - 12} textAnchor="middle" fontSize="12" fontWeight="700" fill="var(--ink)">{f(p.value)}</text>
        <text x={x(i)} y={H - 6} textAnchor="middle" fontSize="11" fill="var(--mut)">{p.label.length > 12 ? p.label.slice(0, 11) + '…' : p.label}</text></g>)}
    </svg>
  )
}
export function Compare({ rows, prevName, curName }) {
  return (<>
    <div className="legend"><span><i style={{ background: '#aab4c8' }} />{prevName}</span><span><i style={{ background: 'var(--acc)' }} />{curName}</span></div>
    {rows.map(r => (
      <div key={r.label} className="cmp">
        <div className="lbl"><b>{r.label}</b><span>{f(r.prev)} → <b>{f(r.cur)}</b></span></div>
        <div className="bar"><i style={{ width: (r.prev || 0) + '%', background: '#aab4c8' }} /></div>
        <div className="bar"><i style={{ width: (r.cur || 0) + '%', background: 'var(--acc)' }} /></div>
      </div>))}
  </>)
}
