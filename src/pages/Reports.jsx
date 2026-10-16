import { useMemo } from 'react'
import { useApp } from '../context/AppContext'

export default function Reports() {
  const { state } = useApp()
  const stats = useMemo(() => {
    const won = state.deals.filter(d => d.stage === 'Closed Won')
    const lost = state.deals.filter(d => d.stage === 'Closed Lost')
    const open = state.deals.filter(d => !d.stage.startsWith('Closed'))
    const pipeline = open.reduce((s, d) => s + d.value, 0)
    const wonValue = won.reduce((s, d) => s + d.value, 0)
    const winRate = (won.length + lost.length) ? Math.round((won.length / (won.length + lost.length)) * 100) : 0
    return { pipeline, wonValue, winRate, openCount: open.length, wonCount: won.length, leadCount: state.leads.length }
  }, [state])

  return (
    <div>
      <div className="kpi-grid">
        <div className="kpi-card"><div className="kpi-label">Pipeline Value</div><div className="kpi-value">${stats.pipeline.toLocaleString()}</div></div>
        <div className="kpi-card"><div className="kpi-label">Won Revenue</div><div className="kpi-value">${stats.wonValue.toLocaleString()}</div></div>
        <div className="kpi-card"><div className="kpi-label">Win Rate</div><div className="kpi-value">{stats.winRate}%</div></div>
        <div className="kpi-card"><div className="kpi-label">Open Deals</div><div className="kpi-value">{stats.openCount}</div></div>
      </div>
      <div className="card">
        <div className="card-header">Summary</div>
        <div className="card-body">
          <p>Total leads: <strong>{stats.leadCount}</strong></p>
          <p>Won deals: <strong>{stats.wonCount}</strong></p>
          <p>Contacts: <strong>{state.contacts.length}</strong></p>
          <p>Companies: <strong>{state.companies.length}</strong></p>
        </div>
      </div>
    </div>
  )
}
