import { Ring, Trend, Compare } from './Charts.jsx'
import { types, semScore, semCat, semAtt, subScore, gp, letter, f, sgn, tone, arrow } from '../lib/calc.js'
export default function Overview({ data, cur, prev, go }) {
  const w = data.weights, cs = semScore(cur, w), ps = semScore(prev, w), same = cur.id === prev.id
  const d = cs != null && ps != null && !same ? cs - ps : null, ca = semAtt(cur), pa = semAtt(prev)
  if (cs == null) return (<section className="card empty"><h2>Let's get your first numbers in</h2><p>Add a subject and a few marks, or explore with sample data.</p>
    <div className="row"><button className="pri" onClick={() => go('marks')}>Add marks</button><button onClick={() => go('settings')}>Load sample data</button></div></section>)
  const cats = types(w).map(t => ({ label: t, cur: semCat(cur, t), prev: semCat(prev, t) })).filter(r => r.cur != null || r.prev != null)
  const both = cats.filter(r => r.cur != null && r.prev != null), tips = []
  if (both.length) {
    const sorted = [...both].sort((a, b) => (b.cur - b.prev) - (a.cur - a.prev)), best = sorted[0], worst = sorted[sorted.length - 1]
    if (best.cur > best.prev) tips.push(`${best.label}s improved most: ${sgn(best.cur - best.prev)} points. Keep that routine.`)
    if (worst.cur < worst.prev) tips.push(`${worst.label}s dropped ${Math.abs(worst.cur - worst.prev).toFixed(1)} points. Fix this first.`)
  }
  const low = cats.filter(r => r.cur != null).sort((a, b) => a.cur - b.cur)[0]
  if (low) tips.push(`Your weakest category is ${low.label}s at ${f(low.cur)}%.`)
  if (ca != null && ca < 75) tips.push(`Attendance is ${f(ca)}%. Many schools set the minimum at 75%.`)
  if (ca != null && pa != null && ca < pa - 3) tips.push('Attendance fell since last semester, and missed classes often show up in quiz marks.')
  const weak = cur.subjects.map(s => ({ n: s.name, v: subScore(s, w) })).filter(x => x.v != null && x.v < 60)[0]
  if (weak) tips.push(`${weak.n} is below 60%. Block extra study time for it this week.`)
  const trend = data.sems.map(m => ({ label: m.name, value: semScore(m, w) }))
  return (<>
    <section className={'hero ' + (d == null ? 'flat' : tone(d))}>
      <div><p className="kicker">{cur.name} compared with {prev.name}</p>
        <h2>{d == null ? (same ? 'Choose a different semester to compare' : 'Add marks to both semesters to compare') : d > 0.05 ? `Up ${sgn(d)} points` : d < -0.05 ? `Down ${Math.abs(d).toFixed(1)} points` : 'Holding steady'}</h2>
        <p>{d == null ? `Current score ${f(cs)}%.` : d > 0.05 ? `You moved from ${f(ps)}% to ${f(cs)}%. Nice progress.` : d < -0.05 ? `You moved from ${f(ps)}% to ${f(cs)}%. The category bars below show where it slipped.` : `${f(ps)}% before, ${f(cs)}% now.`}</p></div>
      <div className="big">{d == null ? letter(cs) : arrow(d)}<small>{d == null ? 'grade' : ''}</small></div>
    </section>
    <div className="stats">
      <div className="stat"><span>Overall</span><b>{f(cs)}%</b><em>Grade {letter(cs)}</em></div>
      <div className="stat"><span>Approx. GPA</span><b>{gp(cs).toFixed(2)}</b><em>{ps != null && !same ? `${sgn(gp(cs) - gp(ps))} vs before` : 'out of 4.0'}</em></div>
      <div className="stat"><span>Attendance</span><b>{f(ca)}%</b><em className={pa != null && ca != null ? tone(ca - pa) : ''}>{pa != null && ca != null && !same ? sgn(ca - pa) + ' pts' : ' '}</em></div>
      <div className="stat"><span>Goal {data.goal}%</span><b className={cs >= data.goal ? 'up' : ''}>{cs >= data.goal ? 'On track' : (data.goal - cs).toFixed(1) + ' to go'}</b><em>Change in Goals tab</em></div>
    </div>
    <div className="two">
      <section className="card"><h3>Score by semester</h3><Trend points={trend} goal={data.goal} /><p className="muted small">Dashed line is your goal.</p></section>
      <section className="card"><h3>By category</h3><Compare rows={cats} prevName={prev.name} curName={cur.name} /></section>
    </div>
    <section className="card"><h3>Subjects</h3>
      <div className="subs">{cur.subjects.map(s => {
        const p = prev.subjects.find(x => x.name.toLowerCase() === s.name.toLowerCase()), v = subScore(s, w), pv = p ? subScore(p, w) : null, dv = v != null && pv != null ? v - pv : null
        return (<div className="sub" key={s.id}><Ring value={v} label={s.name} />
          <div><b>{s.name}</b><span className="muted small">{s.credits} credits</span>
            <span className={'chg ' + (dv == null ? 'flat' : tone(dv))}>{dv == null ? 'No earlier data' : `${arrow(dv)} ${sgn(dv)} vs ${f(pv)}`}</span></div></div>)
      })}</div></section>
    <section className="card"><h3>What to do next</h3>{tips.length ? <ul className="tips">{tips.map((t, i) => <li key={i}>{t}</li>)}</ul> : <p className="muted">Add more marks to get specific tips.</p>}</section>
  </>)
}
