import { useState } from 'react'
import { useStore } from './lib/store.js'
import Overview from './components/Overview.jsx'
import Marks from './components/Marks.jsx'
import Planner from './components/Planner.jsx'
import Goals from './components/Goals.jsx'
import Settings from './components/Settings.jsx'
const TABS = [['overview', 'Overview', '◐'], ['marks', 'Marks', '✎'], ['planner', 'Planner', '◷'], ['goals', 'Goals', '◎'], ['settings', 'Settings', '⚙']]
export default function App() {
  const [data, setData] = useStore()
  const [tab, setTab] = useState('overview'), [ci, setCi] = useState(null), [pi, setPi] = useState(null)
  const n = data.sems.length
  const cur = data.sems[ci ?? n - 1] || data.sems[n - 1], prev = data.sems[pi ?? Math.max(n - 2, 0)] || data.sems[0]
  const P = { data, setData, cur, prev, go: setTab }
  return (<div className="app">
    <aside className="side"><div className="brand">Semester<br />Analyzer</div>
      <nav>{TABS.map(([k, l, i]) => <button key={k} className={tab === k ? 'on' : ''} onClick={() => setTab(k)}><span aria-hidden>{i}</span>{l}</button>)}</nav></aside>
    <main>
      <header className="top"><h1>{TABS.find(t => t[0] === tab)[1]}</h1>
        <div className="pick"><label>This semester<select value={data.sems.indexOf(cur)} onChange={e => setCi(+e.target.value)}>{data.sems.map((s, i) => <option key={s.id} value={i}>{s.name}</option>)}</select></label>
          <label>Compare with<select value={data.sems.indexOf(prev)} onChange={e => setPi(+e.target.value)}>{data.sems.map((s, i) => <option key={s.id} value={i}>{s.name}</option>)}</select></label></div></header>
      {tab === 'overview' && <Overview {...P} />}{tab === 'marks' && <Marks {...P} />}{tab === 'planner' && <Planner {...P} />}{tab === 'goals' && <Goals {...P} />}{tab === 'settings' && <Settings {...P} />}
    </main></div>)
}
