import { useState } from 'react'
import { uid, daysLeft } from '../lib/calc.js'
const KINDS = ['Exam', 'Quiz', 'Assignment', 'Presentation', 'Lab']
export default function Planner({ data, setData, cur }) {
  const [title, setTitle] = useState(''), [date, setDate] = useState(''), [kind, setKind] = useState('Exam')
  const [ss, setSs] = useState(''), [min, setMin] = useState('60')
  const subs = cur.subjects.map(s => s.name), subject = ss || subs[0] || ''
  const tasks = [...data.tasks].sort((a, b) => a.done - b.done || a.date.localeCompare(b.date))
  const set = (k, fn) => setData(d => ({ ...d, [k]: fn(d[k]) }))
  const totals = subs.map(n => ({ n, m: data.study.filter(x => x.subject === n).reduce((a, x) => a + x.min, 0) }))
  const mx = Math.max(1, ...totals.map(t => t.m))
  return (<div className="two">
    <section className="card"><h3>Deadlines and exams</h3>
      <div className="row"><input className="grow" placeholder="What is due?" value={title} onChange={e => setTitle(e.target.value)} />
        <input type="date" value={date} onChange={e => setDate(e.target.value)} />
        <select value={kind} onChange={e => setKind(e.target.value)}>{KINDS.map(k => <option key={k}>{k}</option>)}</select>
        <button className="pri" onClick={() => { if (title && date) { set('tasks', t => [...t, { id: uid(), title, date, type: kind, done: false }]); setTitle('') } }}>Add</button></div>
      {tasks.length ? tasks.map(t => { const n = daysLeft(t.date); return (
        <div key={t.id} className={'task' + (t.done ? ' done' : '')}>
          <input type="checkbox" checked={t.done} onChange={() => set('tasks', a => a.map(x => x.id === t.id ? { ...x, done: !x.done } : x))} aria-label={'Done: ' + t.title} />
          <div className="grow"><b>{t.title}</b><span className="muted small">{t.type} · {t.date}</span></div>
          <span className={'due ' + (t.done ? '' : n < 0 ? 'down' : n <= 3 ? 'warn' : '')}>{t.done ? 'Done' : n < 0 ? Math.abs(n) + 'd overdue' : n === 0 ? 'Today' : n + 'd left'}</span>
          <button className="ghost" onClick={() => set('tasks', a => a.filter(x => x.id !== t.id))}>Remove</button></div>) }) : <p className="muted">Nothing planned. Add your next exam or deadline.</p>}
    </section>
    <section className="card"><h3>Study log</h3>
      {subs.length ? <><div className="row"><select value={subject} onChange={e => setSs(e.target.value)}>{subs.map(s => <option key={s}>{s}</option>)}</select>
        <input type="number" style={{ width: 90 }} value={min} onChange={e => setMin(e.target.value)} aria-label="Minutes" /><span className="muted">min</span>
        <button className="pri" onClick={() => +min > 0 && set('study', a => [...a, { id: uid(), subject: subject, min: +min, date: new Date().toISOString().slice(0, 10) }])}>Log session</button></div>
        {totals.map(t => <div className="cmp" key={t.n}><div className="lbl"><b>{t.n}</b><span>{(t.m / 60).toFixed(1)} h</span></div><div className="bar"><i style={{ width: (t.m / mx) * 100 + '%', background: 'var(--acc)' }} /></div></div>)}</>
        : <p className="muted">Add a subject in Marks first.</p>}
    </section></div>)
}
