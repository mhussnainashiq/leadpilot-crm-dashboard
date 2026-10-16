import { useState, useMemo } from 'react'
import { Plus, Search, Pencil, Trash2, X, Download } from 'lucide-react'
import { useApp } from '../context/AppContext'
const empty = { name: '', company: '', email: '', phone: '', source: 'Website', priority: 'medium', status: 'new', assignedTo: '', value: 0, notes: '' }
export default function Leads() {
  const { state, dispatch } = useApp()
  const [search, setSearch] = useState('')
  const [filter, setFilter] = useState('all')
  const [modal, setModal] = useState(null)
  const [form, setForm] = useState(empty)
  const [error, setError] = useState('')
  const filtered = useMemo(() => state.leads.filter(l => {
    const q = search.toLowerCase()
    const match = !search || l.name.toLowerCase().includes(q) || l.company.toLowerCase().includes(q) || l.email.toLowerCase().includes(q)
    return match && (filter === 'all' || l.status === filter)
  }), [state.leads, search, filter])
  const openAdd = () => { setForm({ ...empty, assignedTo: state.team[0]?.id || '' }); setError(''); setModal('add') }
  const openEdit = (l) => { setForm({ ...l }); setError(''); setModal(l) }
  const close = () => setModal(null)
  const handleSubmit = (e) => {
    e.preventDefault()
    if (!form.name.trim()) { setError('Name is required'); return }
    const payload = { ...form, value: Number(form.value), createdAt: form.createdAt || new Date().toISOString().slice(0, 10) }
    if (modal === 'add') dispatch({ type: 'ADD_LEAD', payload })
    else dispatch({ type: 'UPDATE_LEAD', payload })
    close()
  }
  const exportCSV = () => {
    const headers = ['Name', 'Company', 'Email', 'Phone', 'Source', 'Priority', 'Status', 'Value']
    const rows = filtered.map(l => [l.name, l.company, l.email, l.phone, l.source, l.priority, l.status, l.value])
    const csv = [headers, ...rows].map(r => r.map(c => `"${c}"`).join(',')).join('\n')
    const blob = new Blob([csv], { type: 'text/csv' })
    const a = document.createElement('a'); a.href = URL.createObjectURL(blob); a.download = 'leads.csv'; a.click()
  }
  return (
    <div>
      <div className="toolbar">
        <div className="search-wrap"><Search size={16} /><input className="search-input form-control" placeholder="Search leads..." value={search} onChange={e => setSearch(e.target.value)} /></div>
        <select className="form-control" style={{ width: 140 }} value={filter} onChange={e => setFilter(e.target.value)}>
          <option value="all">All Status</option><option value="new">New</option><option value="contacted">Contacted</option><option value="qualified">Qualified</option>
        </select>
        <button className="btn btn-secondary" onClick={exportCSV}><Download size={16} /> Export CSV</button>
        <button className="btn btn-primary" onClick={openAdd}><Plus size={18} /> Add Lead</button>
      </div>
      <div className="card"><div className="table-wrap"><table>
        <thead><tr><th>Name</th><th>Company</th><th>Source</th><th>Priority</th><th>Status</th><th>Value</th><th>Assigned</th><th>Actions</th></tr></thead>
        <tbody>
          {filtered.length === 0 ? <tr><td colSpan={8} className="empty-state">No leads found</td></tr> : filtered.map(l => {
            const owner = state.team.find(t => t.id === l.assignedTo)
            return (
              <tr key={l.id}>
                <td><strong>{l.name}</strong></td><td>{l.company}</td><td>{l.source}</td>
                <td><span className={`badge badge-${l.priority === 'high' ? 'danger' : l.priority === 'medium' ? 'warning' : 'muted'}`}>{l.priority}</span></td>
                <td><span className="badge badge-info">{l.status}</span></td>
                <td>${l.value.toLocaleString()}</td><td>{owner?.name || '—'}</td>
                <td>
                  <button className="btn-icon" onClick={() => openEdit(l)}><Pencil size={16} /></button>
                  <button className="btn-icon" onClick={() => { if (window.confirm('Delete?')) dispatch({ type: 'DELETE_LEAD', payload: l.id }) }}><Trash2 size={16} /></button>
                </td>
              </tr>
            )
          })}
        </tbody>
      </table></div></div>
      {modal && (
        <div className="modal-overlay" onClick={close}>
          <div className="modal" onClick={e => e.stopPropagation()}>
            <div className="modal-header">{modal === 'add' ? 'Add Lead' : 'Edit Lead'}<button className="btn-icon" onClick={close}><X size={20} /></button></div>
            <form onSubmit={handleSubmit}><div className="modal-body">
              {error && <div className="alert alert-error">{error}</div>}
              <div className="form-grid">
                <div className="form-group"><label>Name *</label><input className="form-control" value={form.name} onChange={e => setForm({ ...form, name: e.target.value })} required /></div>
                <div className="form-group"><label>Company</label><input className="form-control" value={form.company} onChange={e => setForm({ ...form, company: e.target.value })} /></div>
                <div className="form-group"><label>Email</label><input type="email" className="form-control" value={form.email} onChange={e => setForm({ ...form, email: e.target.value })} /></div>
                <div className="form-group"><label>Phone</label><input className="form-control" value={form.phone} onChange={e => setForm({ ...form, phone: e.target.value })} /></div>
                <div className="form-group"><label>Source</label><select className="form-control" value={form.source} onChange={e => setForm({ ...form, source: e.target.value })}><option>Website</option><option>Referral</option><option>LinkedIn</option><option>Cold Call</option><option>Trade Show</option></select></div>
                <div className="form-group"><label>Priority</label><select className="form-control" value={form.priority} onChange={e => setForm({ ...form, priority: e.target.value })}><option value="high">High</option><option value="medium">Medium</option><option value="low">Low</option></select></div>
                <div className="form-group"><label>Status</label><select className="form-control" value={form.status} onChange={e => setForm({ ...form, status: e.target.value })}><option value="new">New</option><option value="contacted">Contacted</option><option value="qualified">Qualified</option></select></div>
                <div className="form-group"><label>Assigned To</label><select className="form-control" value={form.assignedTo} onChange={e => setForm({ ...form, assignedTo: e.target.value })}>{state.team.map(t => <option key={t.id} value={t.id}>{t.name}</option>)}</select></div>
                <div className="form-group"><label>Est. Value ($)</label><input type="number" className="form-control" value={form.value} onChange={e => setForm({ ...form, value: e.target.value })} min={0} /></div>
                <div className="form-group" style={{ gridColumn: '1 / -1' }}><label>Notes</label><textarea className="form-control" value={form.notes} onChange={e => setForm({ ...form, notes: e.target.value })} /></div>
              </div>
            </div>
            <div className="modal-footer"><button type="button" className="btn btn-secondary" onClick={close}>Cancel</button><button type="submit" className="btn btn-primary">Save</button></div>
            </form>
          </div>
        </div>
      )}
    </div>
  )
}
