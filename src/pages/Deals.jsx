import { useState, useMemo } from 'react'
import { Plus, Search, Pencil, Trash2, X, Download } from 'lucide-react'
import { useApp } from '../context/AppContext'
import { STAGES } from '../data/sampleData'

const empty = { title: '', companyId: '', contactId: '', value: 0, stage: 'Qualification', probability: 20, ownerId: '', closeDate: '', notes: '' }

export default function Deals() {
  const { state, dispatch } = useApp()
  const [search, setSearch] = useState('')
  const [modal, setModal] = useState(null)
  const [form, setForm] = useState(empty)

  const filtered = useMemo(() => {
    const q = search.toLowerCase()
    return state.deals.filter(d => !search || d.title.toLowerCase().includes(q))
  }, [state.deals, search])

  const openAdd = () => {
    setForm({ ...empty, companyId: state.companies[0]?.id || '', ownerId: state.team[0]?.id || '', closeDate: new Date().toISOString().slice(0, 10) })
    setModal('add')
  }
  const openEdit = (d) => { setForm({ ...d }); setModal(d) }
  const close = () => setModal(null)

  const handleSubmit = (e) => {
    e.preventDefault()
    if (!form.title.trim()) return
    const payload = { ...form, value: Number(form.value), probability: Number(form.probability) }
    if (modal === 'add') dispatch({ type: 'ADD_DEAL', payload })
    else dispatch({ type: 'UPDATE_DEAL', payload })
    close()
  }

  const exportCSV = () => {
    const headers = ['Title', 'Value', 'Stage', 'Probability', 'Close Date']
    const rows = filtered.map(d => [d.title, d.value, d.stage, d.probability, d.closeDate])
    const csv = [headers, ...rows].map(r => r.map(c => `"${c}"`).join(',')).join('\n')
    const blob = new Blob([csv], { type: 'text/csv' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a'); a.href = url; a.download = 'deals.csv'; a.click()
    URL.revokeObjectURL(url)
  }

  return (
    <div>
      <div className="toolbar">
        <div className="search-wrap"><Search size={16} /><input className="search-input form-control" placeholder="Search deals..." value={search} onChange={e => setSearch(e.target.value)} /></div>
        <button className="btn btn-secondary" onClick={exportCSV}><Download size={16} /> Export CSV</button>
        <button className="btn btn-primary" onClick={openAdd}><Plus size={18} /> Add Deal</button>
      </div>
      <div className="card">
        <div className="table-wrap">
          <table>
            <thead><tr><th>Title</th><th>Company</th><th>Value</th><th>Stage</th><th>Prob.</th><th>Close Date</th><th>Owner</th><th>Actions</th></tr></thead>
            <tbody>
              {filtered.map(d => {
                const company = state.companies.find(c => c.id === d.companyId)
                const owner = state.team.find(t => t.id === d.ownerId)
                return (
                  <tr key={d.id}>
                    <td><strong>{d.title}</strong></td>
                    <td>{company?.name || '—'}</td>
                    <td>${d.value.toLocaleString()}</td>
                    <td><span className={`badge badge-${d.stage === 'Closed Won' ? 'success' : d.stage === 'Closed Lost' ? 'danger' : 'info'}`}>{d.stage}</span></td>
                    <td>{d.probability}%</td>
                    <td>{d.closeDate}</td>
                    <td>{owner?.name || '—'}</td>
                    <td>
                      <button className="btn-icon" onClick={() => openEdit(d)}><Pencil size={16} /></button>
                      <button className="btn-icon" onClick={() => { if (window.confirm('Delete?')) dispatch({ type: 'DELETE_DEAL', payload: d.id }) }}><Trash2 size={16} /></button>
                    </td>
                  </tr>
                )
              })}
            </tbody>
          </table>
        </div>
      </div>
      {modal && (
        <div className="modal-overlay" onClick={close}>
          <div className="modal" onClick={e => e.stopPropagation()}>
            <div className="modal-header">{modal === 'add' ? 'Add Deal' : 'Edit Deal'}<button className="btn-icon" onClick={close}><X size={20} /></button></div>
            <form onSubmit={handleSubmit}>
              <div className="modal-body">
                <div className="form-grid">
                  <div className="form-group"><label>Title</label><input className="form-control" value={form.title} onChange={e => setForm({ ...form, title: e.target.value })} required /></div>
                  <div className="form-group"><label>Company</label>
                    <select className="form-control" value={form.companyId} onChange={e => setForm({ ...form, companyId: e.target.value })}>
                      {state.companies.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
                    </select>
                  </div>
                  <div className="form-group"><label>Value ($)</label><input type="number" className="form-control" value={form.value} onChange={e => setForm({ ...form, value: e.target.value })} min={0} /></div>
                  <div className="form-group"><label>Stage</label>
                    <select className="form-control" value={form.stage} onChange={e => setForm({ ...form, stage: e.target.value })}>
                      {STAGES.map(s => <option key={s} value={s}>{s}</option>)}
                    </select>
                  </div>
                  <div className="form-group"><label>Probability %</label><input type="number" className="form-control" value={form.probability} onChange={e => setForm({ ...form, probability: e.target.value })} min={0} max={100} /></div>
                  <div className="form-group"><label>Close Date</label><input type="date" className="form-control" value={form.closeDate} onChange={e => setForm({ ...form, closeDate: e.target.value })} /></div>
                  <div className="form-group"><label>Owner</label>
                    <select className="form-control" value={form.ownerId} onChange={e => setForm({ ...form, ownerId: e.target.value })}>
                      {state.team.map(t => <option key={t.id} value={t.id}>{t.name}</option>)}
                    </select>
                  </div>
                  <div className="form-group" style={{ gridColumn: '1 / -1' }}><label>Notes</label><textarea className="form-control" value={form.notes} onChange={e => setForm({ ...form, notes: e.target.value })} /></div>
                </div>
              </div>
              <div className="modal-footer">
                <button type="button" className="btn btn-secondary" onClick={close}>Cancel</button>
                <button type="submit" className="btn btn-primary">Save</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  )
}
