import { useState } from 'react'
import { Plus, X } from 'lucide-react'
import { useApp } from '../context/AppContext'

export default function Tasks() {
  const { state, dispatch } = useApp()
  const [modal, setModal] = useState(false)
  const [form, setForm] = useState({ title: '', dueDate: '', priority: 'medium', assignedTo: '', relatedTo: '' })

  const toggleStatus = (t) => {
    const next = t.status === 'completed' ? 'pending' : 'completed'
    dispatch({ type: 'UPDATE_TASK', payload: { ...t, status: next } })
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    if (!form.title.trim()) return
    dispatch({
      type: 'ADD_TASK',
      payload: { ...form, status: 'pending', assignedTo: form.assignedTo || state.team[0]?.id }
    })
    setModal(false)
    setForm({ title: '', dueDate: '', priority: 'medium', assignedTo: '', relatedTo: '' })
  }

  const today = new Date().toISOString().slice(0, 10)

  return (
    <div>
      <div className="toolbar">
        <button className="btn btn-primary" onClick={() => setModal(true)}><Plus size={18} /> Add Task</button>
      </div>
      <div className="card">
        <div className="table-wrap">
          <table>
            <thead><tr><th>Title</th><th>Due Date</th><th>Priority</th><th>Status</th><th>Assigned</th><th>Actions</th></tr></thead>
            <tbody>
              {state.tasks.map(t => {
                const owner = state.team.find(m => m.id === t.assignedTo)
                const isOverdue = t.status !== 'completed' && t.dueDate < today
                return (
                  <tr key={t.id}>
                    <td><strong>{t.title}</strong></td>
                    <td style={{ color: isOverdue ? 'var(--danger)' : undefined }}>{t.dueDate}{isOverdue ? ' (overdue)' : ''}</td>
                    <td><span className={`badge badge-${t.priority === 'high' ? 'danger' : t.priority === 'medium' ? 'warning' : 'muted'}`}>{t.priority}</span></td>
                    <td><span className={`badge badge-${t.status === 'completed' ? 'success' : isOverdue ? 'danger' : 'info'}`}>{t.status}</span></td>
                    <td>{owner?.name || '—'}</td>
                    <td>
                      <button className="btn btn-sm btn-secondary" onClick={() => toggleStatus(t)}>
                        {t.status === 'completed' ? 'Reopen' : 'Complete'}
                      </button>
                    </td>
                  </tr>
                )
              })}
            </tbody>
          </table>
        </div>
      </div>
      {modal && (
        <div className="modal-overlay" onClick={() => setModal(false)}>
          <div className="modal" onClick={e => e.stopPropagation()}>
            <div className="modal-header">Add Task <button className="btn-icon" onClick={() => setModal(false)}><X size={20} /></button></div>
            <form onSubmit={handleSubmit}>
              <div className="modal-body">
                <div className="form-grid">
                  <div className="form-group" style={{ gridColumn: '1 / -1' }}><label>Title</label><input className="form-control" value={form.title} onChange={e => setForm({ ...form, title: e.target.value })} required /></div>
                  <div className="form-group"><label>Due Date</label><input type="date" className="form-control" value={form.dueDate} onChange={e => setForm({ ...form, dueDate: e.target.value })} /></div>
                  <div className="form-group"><label>Priority</label>
                    <select className="form-control" value={form.priority} onChange={e => setForm({ ...form, priority: e.target.value })}>
                      <option value="high">High</option><option value="medium">Medium</option><option value="low">Low</option>
                    </select>
                  </div>
                  <div className="form-group"><label>Assigned To</label>
                    <select className="form-control" value={form.assignedTo} onChange={e => setForm({ ...form, assignedTo: e.target.value })}>
                      {state.team.map(t => <option key={t.id} value={t.id}>{t.name}</option>)}
                    </select>
                  </div>
                </div>
              </div>
              <div className="modal-footer">
                <button type="button" className="btn btn-secondary" onClick={() => setModal(false)}>Cancel</button>
                <button type="submit" className="btn btn-primary">Add</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  )
}
