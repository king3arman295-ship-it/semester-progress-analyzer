import { subScore, neededInFinal, f, letter } from '../lib/calc.js'
import { Ring } from './Charts.jsx'
export default function Goals({ data, setData, cur }) {
  const w = data.weights, g = data.goal
  return (<>
    <section className="card"><h3>Your target</h3><div className="row">I want at least
      <input type="number" min="1" max="100" style={{ width: 90 }} value={g} onChange={e => setData(d => ({ ...d, goal: +e.target.value }))} />% in every subject.</div></section>
    <div className="subs">{cur.subjects.map(s => {
      const v = subScore(s, w), need = neededInFinal(s, w, g)
      const msg = v == null ? 'Add marks to see your position.' : need != null
        ? (need > 100 ? `Even 100% in the Final gives about ${(v * 0 + (v * (1 - w.Final / 100)) + w.Final).toFixed(0)}%. Consider a lower target or raising other marks.` : need <= 0 ? 'You already have enough to hit your target.' : `You need about ${need.toFixed(0)}% in the Final.`)
        : v >= g ? 'Target reached.' : `${(g - v).toFixed(1)} points short of your target.`
      return <div className="card sub" key={s.id}><Ring value={v} label={s.name} /><div><b>{s.name}</b><span className="muted small">Grade {letter(v)}</span><span className="small">{msg}</span></div></div>
    })}</div>
    {!cur.subjects.length && <p className="muted">Add subjects in Marks to set goals.</p>}
  </>)
}
