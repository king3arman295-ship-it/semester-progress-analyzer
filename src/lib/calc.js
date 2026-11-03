export const DEFAULT_W = { Quiz: 10, Assignment: 10, Presentation: 10, Lab: 5, Midterm: 25, Final: 40 }
export const uid = () => Math.random().toString(36).slice(2, 9)
export const avg = a => (a.length ? a.reduce((x, y) => x + y, 0) / a.length : null)
export const pct = i => (i.got / i.max) * 100
export const types = w => Object.keys(w)
export const catAvg = (s, t) => avg(s.items.filter(i => i.type === t).map(pct))
export const subScore = (s, w) => {
  let n = 0, d = 0
  types(w).forEach(t => { const a = catAvg(s, t); if (a != null) { n += a * w[t]; d += w[t] } })
  return d ? n / d : null
}
export const semScore = (m, w) => {
  let n = 0, d = 0
  m.subjects.forEach(s => { const v = subScore(s, w); if (v != null) { n += v * s.credits; d += s.credits } })
  return d ? n / d : null
}
export const semCat = (m, t) => avg(m.subjects.flatMap(s => s.items.filter(i => i.type === t).map(pct)))
export const semAtt = m => {
  const a = m.subjects.reduce((x, s) => x + s.att.a, 0), t = m.subjects.reduce((x, s) => x + s.att.t, 0)
  return t ? (a / t) * 100 : null
}
export const gp = p => p == null ? null : p >= 85 ? 4 : p >= 80 ? 3.67 : p >= 75 ? 3.33 : p >= 70 ? 3 : p >= 65 ? 2.67 : p >= 60 ? 2.33 : p >= 55 ? 2 : p >= 50 ? 1 : 0
export const letter = p => p == null ? '–' : p >= 85 ? 'A' : p >= 80 ? 'A-' : p >= 75 ? 'B+' : p >= 70 ? 'B' : p >= 65 ? 'B-' : p >= 60 ? 'C+' : p >= 55 ? 'C' : p >= 50 ? 'D' : 'F'
export const f = v => (v == null ? '–' : v.toFixed(1))
export const sgn = v => (v > 0 ? '+' : '') + v.toFixed(1)
export const tone = v => (v > 0.05 ? 'up' : v < -0.05 ? 'down' : 'flat')
export const arrow = v => (v > 0.05 ? '▲' : v < -0.05 ? '▼' : '■')
export const daysLeft = d => Math.ceil((new Date(d + 'T00:00:00') - new Date(new Date().toDateString())) / 864e5)
// % needed in the Final to reach `goal` overall in a subject (null if no Final weight or Final already entered)
export const neededInFinal = (s, w, goal) => {
  if (!w.Final || catAvg(s, 'Final') != null) return null
  let n = 0, d = 0
  types(w).forEach(t => { if (t !== 'Final') { const a = catAvg(s, t); if (a != null) { n += a * w[t]; d += w[t] } } })
  return (goal * (d + w.Final) - n) / w.Final
}
