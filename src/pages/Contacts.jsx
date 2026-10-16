import { useState, useMemo } from 'react'
import { Plus, Search, Pencil, Trash2, X } from 'lucide-react'
import { useApp } from '../context/AppContext'

const empty = { name: '', email: '', phone: '', companyId: '', title: '', notes: '' }

export default function Contacts() {
  const { state, dispatch } = useApp()
  const [search, setSearch] = useState('')
  const [modal, setModal] = useState(null)
  const [form, setForm] = useState(empty)

  const filtered = useMemo(() => {
    const q = search.toLowerCase()
    return state.contacts.filter(c => !search || c.name.toLowerCase().includes(q) || c.email.toLowerCase().includes(q))
  }, [state.contacts, search])

  const openAdd = () => { setForm({ ...empty, companyId: state.companies[0]?.id || '' }); setModal('add') }
  const openEdit = (c) => { setForm({ ...c }); setModal(c) }
  const close = () => setModal(null)

  const handleSubmit = (e) => {
    e.preventDefault()
    if (!form.name.trim()) return
    if (modal === 'add') dispatch({ type: 'ADD_CONTACT', payload: form })
    else dispatch({ type: 'UPDATE_CONTACT', payload: form })
    close()
  }

  return (
    <div>
      <div className="toolbar">
        <div className="search-wrap"><Search size={16} /><input className="search-input form-control" placeholder="Search..." value={search} onChange={e => setSearch(e.target.value)} /></div>
        <button className="btn btn-primary" onClick={openAdd}><Plus size={18} /> Add Contact</button>
      </div>
      <div className="card">
        <div className="table-wrap">
          <table>
            <thead><tr><th>Name</th><th>Title</th><th>Email</th><th>Phone</th><th>Company</th><th>Actions</th></tr></thead>
            <tbody>
              {filtered.map(c => {
                const company = state.companies.find(co => co.id === c.companyId)
                return (
                  <tr key={c.id}>
                    <td><strong>{c.name}</strong></td>
                    <td>{c.title}</td>
                    <td>{c.email}</td>
                    <td>{c.phone}</td>
                    <td>{company?.name || '—'}</td>
                    <td>
                      <button className="btn-icon" onClick={() => openEdit(c)}><Pencil size={16} /></button>
                      <button className="btn-icon" onClick={() => { if (window.confirm('Delete?')) dispatch({ type: 'DELETE_CONTACT', payload: c.id }) }}><Trash2 size={16} /></button>
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
            <div className="modal-header">{modal === 'add' ? 'Add Contact' : 'Edit Contact'}<button className="btn-icon" onClick={close}><X size={20} /></button></div>
            <form onSubmit={handleSubmit}>
              <div className="modal-body">
                <div className="form-grid">
                  <div className="form-group"><label>Name</label><input className="form-control" value={form.name} onChange={e => setForm({ ...form, name: e.target.value })} required /></div>
                  <div className="form-group"><label>Title</label><input className="form-control" value={form.title} onChange={e => setForm({ ...form, title: e.target.value })} /></div>
                  <div className="form-group"><label>Email</label><input type="email" className="form-control" value={form.email} onChange={e => setForm({ ...form, email: e.target.value })} /></div>
                  <div className="form-group"><label>Phone</label><input className="form-control" value={form.phone} onChange={e => setForm({ ...form, phone: e.target.value })} /></div>
                  <div className="form-group"><label>Company</label>
                    <select className="form-control" value={form.companyId} onChange={e => setForm({ ...form, companyId: e.target.value })}>
                      {state.companies.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
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
