import { useState, useMemo } from 'react'
import { Plus, Search, Pencil, Trash2, X } from 'lucide-react'
import { useApp } from '../context/AppContext'

const empty = { name: '', industry: '', website: '', size: '11-50', location: '' }

export default function Companies() {
  const { state, dispatch } = useApp()
  const [search, setSearch] = useState('')
  const [modal, setModal] = useState(null)
  const [form, setForm] = useState(empty)

  const filtered = useMemo(() => {
    const q = search.toLowerCase()
    return state.companies.filter(c => !search || c.name.toLowerCase().includes(q) || c.industry.toLowerCase().includes(q))
  }, [state.companies, search])

  const openAdd = () => { setForm(empty); setModal('add') }
  const openEdit = (c) => { setForm({ ...c }); setModal(c) }
  const close = () => setModal(null)

  const handleSubmit = (e) => {
    e.preventDefault()
    if (!form.name.trim()) return
    if (modal === 'add') dispatch({ type: 'ADD_COMPANY', payload: form })
    else dispatch({ type: 'UPDATE_COMPANY', payload: form })
    close()
  }

  return (
    <div>
      <div className="toolbar">
        <div className="search-wrap"><Search size={16} /><input className="search-input form-control" placeholder="Search..." value={search} onChange={e => setSearch(e.target.value)} /></div>
        <button className="btn btn-primary" onClick={openAdd}><Plus size={18} /> Add Company</button>
      </div>
      <div className="card">
        <div className="table-wrap">
          <table>
            <thead><tr><th>Name</th><th>Industry</th><th>Size</th><th>Location</th><th>Website</th><th>Actions</th></tr></thead>
            <tbody>
              {filtered.map(c => (
                <tr key={c.id}>
                  <td><strong>{c.name}</strong></td>
                  <td>{c.industry}</td>
                  <td>{c.size}</td>
                  <td>{c.location}</td>
                  <td>{c.website}</td>
                  <td>
                    <button className="btn-icon" onClick={() => openEdit(c)}><Pencil size={16} /></button>
                    <button className="btn-icon" onClick={() => { if (window.confirm('Delete?')) dispatch({ type: 'DELETE_COMPANY', payload: c.id }) }}><Trash2 size={16} /></button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
      {modal && (
        <div className="modal-overlay" onClick={close}>
          <div className="modal" onClick={e => e.stopPropagation()}>
            <div className="modal-header">{modal === 'add' ? 'Add Company' : 'Edit Company'}<button className="btn-icon" onClick={close}><X size={20} /></button></div>
            <form onSubmit={handleSubmit}>
              <div className="modal-body">
                <div className="form-grid">
                  <div className="form-group"><label>Name</label><input className="form-control" value={form.name} onChange={e => setForm({ ...form, name: e.target.value })} required /></div>
                  <div className="form-group"><label>Industry</label><input className="form-control" value={form.industry} onChange={e => setForm({ ...form, industry: e.target.value })} /></div>
                  <div className="form-group"><label>Website</label><input className="form-control" value={form.website} onChange={e => setForm({ ...form, website: e.target.value })} /></div>
                  <div className="form-group"><label>Size</label>
                    <select className="form-control" value={form.size} onChange={e => setForm({ ...form, size: e.target.value })}>
                      <option>1-10</option><option>11-50</option><option>51-200</option><option>201-500</option><option>501-1000</option><option>1000+</option>
                    </select>
                  </div>
                  <div className="form-group"><label>Location</label><input className="form-control" value={form.location} onChange={e => setForm({ ...form, location: e.target.value })} /></div>
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
