import { useState } from 'react'
import { types, uid, pct, f, subScore, letter } from '../lib/calc.js'
export default function Marks({ data, setData, cur }) {
  const w = data.weights, T = types(w)
  const [subId, setSubId] = useState(''), [type, setType] = useState('Quiz'), [title, setTitle] = useState(''), [got, setGot] = useState(''), [max, setMax] = useState('10')
  const [name, setName] = useState(''), [cr, setCr] = useState('3')
  const sub = cur.subjects.find(s => s.id === subId) || cur.subjects[0]
  const upd = fn => setData(d => ({ ...d, sems: d.sems.map(m => m.id === cur.id ? fn(m) : m) }))
  const updSub = fn => upd(m => ({ ...m, subjects: m.subjects.map(s => s.id === sub.id ? fn(s) : s) }))
  const add = () => { if (!sub || got === '' || !+max) return; updSub(s => ({ ...s, items: [...s.items, { id: uid(), type, title: title || type, got: +got, max: +max }] })); setTitle(''); setGot('') }
  const addSub = () => { if (!name.trim()) return; const s = { id: uid(), name: name.trim(), credits: +cr || 3, att: { a: 0, t: 0 }, items: [] }; upd(m => ({ ...m, subjects: [...m.subjects, s] })); setSubId(s.id); setName('') }
  return (<div className="split">
    <aside className="card"><h3>{cur.name}</h3>
      <div className="list">{cur.subjects.map(s => <button key={s.id} className={'item' + (sub && s.id === sub.id ? ' on' : '')} onClick={() => setSubId(s.id)}><span>{s.name}</span><b>{letter(subScore(s, w))}</b></button>)}</div>
      <div className="stack"><input placeholder="New subject" value={name} onChange={e => setName(e.target.value)} onKeyDown={e => e.key === 'Enter' && addSub()} />
        <div className="row"><input type="number" min="1" value={cr} onChange={e => setCr(e.target.value)} aria-label="Credit hours" style={{ width: 70 }} /><button className="pri grow" onClick={addSub}>Add subject</button></div></div>
    </aside>
    {sub ? <div>
      <section className="card"><h3>Add a mark to {sub.name}</h3>
        <div className="chips">{T.map(t => <button key={t} className={'chip' + (t === type ? ' on' : '')} onClick={() => setType(t)}>{t}</button>)}</div>
        <div className="row" style={{ marginTop: 12 }}>
          <input className="grow" placeholder="Title, e.g. Quiz 3" value={title} onChange={e => setTitle(e.target.value)} />
          <input type="number" placeholder="Got" style={{ width: 88 }} value={got} onChange={e => setGot(e.target.value)} onKeyDown={e => e.key === 'Enter' && add()} />
          <span className="muted">out of</span>
          <input type="number" placeholder="Max" style={{ width: 88 }} value={max} onChange={e => setMax(e.target.value)} onKeyDown={e => e.key === 'Enter' && add()} />
          <button className="pri" onClick={add}>Add mark</button></div></section>
      <section className="card"><h3>Marks</h3>
        {sub.items.length ? <table><thead><tr><th>Type</th><th>Title</th><th>Score</th><th /></tr></thead><tbody>{sub.items.map(i => <tr key={i.id}><td><span className="tag">{i.type}</span></td><td>{i.title}</td><td>{i.got}/{i.max} <b>({f(pct(i))}%)</b></td>
          <td><button className="ghost" onClick={() => updSub(s => ({ ...s, items: s.items.filter(x => x.id !== i.id) }))}>Remove</button></td></tr>)}</tbody></table> : <p className="muted">No marks yet. Add your first quiz, assignment or exam above.</p>}</section>
      <section className="card"><h3>Attendance</h3>
        <div className="row">Attended <input type="number" style={{ width: 90 }} value={sub.att.a} onChange={e => updSub(s => ({ ...s, att: { ...s.att, a: +e.target.value } }))} /> of <input type="number" style={{ width: 90 }} value={sub.att.t} onChange={e => updSub(s => ({ ...s, att: { ...s.att, t: +e.target.value } }))} /> classes
          <b>{sub.att.t ? f((sub.att.a / sub.att.t) * 100) + '%' : ''}</b></div>
        <button className="ghost" onClick={() => { if (confirm('Delete ' + sub.name + '?')) { upd(m => ({ ...m, subjects: m.subjects.filter(s => s.id !== sub.id) })); setSubId('') } }}>Delete subject</button></section>
    </div> : <section className="card empty"><h3>No subjects yet</h3><p>Add a subject on the left to start entering marks.</p></section>}
  </div>)
}
