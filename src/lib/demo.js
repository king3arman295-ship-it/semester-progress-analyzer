import { DEFAULT_W, uid } from './calc.js'
const it = (type, title, got, max) => ({ id: uid(), type, title, got, max })
const s = (name, credits, a, t, items) => ({ id: uid(), name, credits, att: { a, t }, items })
const day = n => new Date(Date.now() + n * 864e5).toISOString().slice(0, 10)
export const demo = () => ({
  weights: DEFAULT_W, goal: 80,
  sems: [
    { id: uid(), name: 'Semester 1', subjects: [
      s('Calculus', 4, 30, 40, [it('Quiz', 'Q1', 6, 10), it('Quiz', 'Q2', 7, 10), it('Assignment', 'A1', 8, 10), it('Midterm', 'Mid', 55, 100), it('Final', 'Final', 62, 100)]),
      s('Physics', 3, 28, 36, [it('Quiz', 'Q1', 8, 10), it('Lab', 'L1', 9, 10), it('Presentation', 'P1', 7, 10), it('Midterm', 'Mid', 70, 100), it('Final', 'Final', 68, 100)]),
      s('English', 2, 20, 24, [it('Assignment', 'Essay', 7, 10), it('Presentation', 'Talk', 8, 10), it('Final', 'Final', 74, 100)]) ] },
    { id: uid(), name: 'Semester 2', subjects: [
      s('Calculus', 4, 36, 40, [it('Quiz', 'Q1', 8, 10), it('Quiz', 'Q2', 9, 10), it('Assignment', 'A1', 9, 10), it('Midterm', 'Mid', 72, 100)]),
      s('Physics', 3, 30, 36, [it('Quiz', 'Q1', 7, 10), it('Lab', 'L1', 9, 10), it('Presentation', 'P1', 9, 10), it('Midterm', 'Mid', 66, 100)]),
      s('English', 2, 18, 24, [it('Assignment', 'Essay', 6, 10), it('Presentation', 'Talk', 8, 10)]) ] }
  ],
  tasks: [
    { id: uid(), title: 'Calculus final', date: day(12), type: 'Exam', done: false },
    { id: uid(), title: 'Physics lab report', date: day(4), type: 'Assignment', done: false },
    { id: uid(), title: 'English presentation', date: day(7), type: 'Presentation', done: false }
  ],
  study: [{ id: uid(), subject: 'Calculus', min: 90, date: day(-1) }, { id: uid(), subject: 'Physics', min: 60, date: day(-2) }, { id: uid(), subject: 'Calculus', min: 45, date: day(-3) }]
})
