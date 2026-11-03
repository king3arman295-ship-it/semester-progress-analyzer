import { blank } from '../lib/store.js'
import { demo } from '../lib/demo.js'
import { DEFAULT_W, uid } from '../lib/calc.js'
export default function Settings({ data, setData, notify }) {
  const exp = () => { const a = document.createElement('a'); a.href = URL.createObjectURL(new Blob([JSON.stringify(data)], { type: 'application/json' })); a.download = 'semester-data.json'; a.click() }
  const imp = e => { const r = new FileReader(); r.onload = () => { try { const d = JSON.parse(r.result); if (!d.sems) throw 0; setData(d) } catch { alert('That file could not be read.') } }; e.target.files[0] && r.readAsText(e.target.files[0]) }
  return (<>
    <section className="card"><h3>Category weights</h3><p className="muted">How much each category counts toward a subject's score. Match your university's grading.</p>
      <div className="wts">{Object.keys(data.weights).map(k => <label key={k}>{k}<input type="number" min="0" value={data.weights[k]} onChange={e => setData(d => ({ ...d, weights: { ...d.weights, [k]: +e.target.value } }))} /></label>)}</div>
      <button className="ghost" onClick={() => setData(d => ({ ...d, weights: DEFAULT_W }))}>Reset weights</button></section>
    <section className="card"><h3>Semesters</h3>
      {data.sems.map(m => <div className="row" key={m.id}><input className="grow" value={m.name} onChange={e => setData(d => ({ ...d, sems: d.sems.map(x => x.id === m.id ? { ...x, name: e.target.value } : x) }))} />
        {data.sems.length > 2 && <button className="ghost" onClick={() => confirm('Delete ' + m.name + '?') && setData(d => ({ ...d, sems: d.sems.filter(x => x.id !== m.id) }))}>Delete</button>}</div>)}
      <button onClick={() => setData(d => ({ ...d, sems: [...d.sems, { id: uid(), name: 'Semester ' + (d.sems.length + 1), subjects: [] }] }))}>Add semester</button></section>
    <section className="card"><h3>Data</h3><div className="row"><button onClick={exp}>Export backup</button><label className="btn">Import backup<input type="file" accept=".json" hidden onChange={imp} /></label>
      <button onClick={() => confirm('Replace everything with sample data?') && setData(demo())}>Load sample data</button>
      <button className="ghost" onClick={() => confirm('Erase all data?') && setData(blank())}>Erase all</button></div></section>
  </>)
}
