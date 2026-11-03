import { useState, useEffect } from 'react'
import { DEFAULT_W, uid } from './calc.js'
const KEY = 'semester-analyzer-v2'
export const blank = () => ({
  sems: [{ id: uid(), name: 'Last semester', subjects: [] }, { id: uid(), name: 'This semester', subjects: [] }],
  weights: DEFAULT_W, goal: 80, tasks: [], study: []
})
export function useStore() {
  const [data, setData] = useState(() => { try { const d = JSON.parse(localStorage.getItem(KEY)); if (d?.sems?.length) return d } catch {} return blank() })
  useEffect(() => { try { localStorage.setItem(KEY, JSON.stringify(data)) } catch {} }, [data])
  return [data, setData]
}
