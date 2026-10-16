import { useMemo } from 'react'
import { DollarSign, Target, TrendingUp, AlertCircle } from 'lucide-react'
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts'
import { useApp } from '../context/AppContext'
import { STAGES } from '../data/sampleData'
const COLORS = ['#7c3aed', '#059669', '#d97706', '#dc2626', '#3b82f6', '#ec4899']
export default function Dashboard() {
  const { state } = useApp()
  const { deals, leads, tasks, team } = state
  const stats = useMemo(() => {
    const openDeals = deals.filter(d => !d.stage.startsWith('Closed'))
    const pipelineValue = openDeals.reduce((s, d) => s + d.value, 0)
    const won = deals.filter(d => d.stage === 'Closed Won')
    const lost = deals.filter(d => d.stage === 'Closed Lost')
    const winRate = (won.length + lost.length) ? Math.round((won.length / (won.length + lost.length)) * 100) : 0
    const overdue = tasks.filter(t => t.status === 'overdue' || (t.status === 'pending' && t.dueDate < new Date().toISOString().slice(0, 10))).length
    return { pipelineValue, winRate, overdue, openCount: openDeals.length }
  }, [deals, leads, tasks])
  const stageData = STAGES.filter(s => !s.startsWith('Closed')).map(s => ({ name: s, value: deals.filter(d => d.stage === s).reduce((sum, d) => sum + d.value, 0) }))
  const sourceData = useMemo(() => {
    const map = {}
    leads.forEach(l => { map[l.source] = (map[l.source] || 0) + 1 })
    return Object.entries(map).map(([name, value]) => ({ name, value }))
  }, [leads])
  return (
    <div>
      <div className="kpi-grid">
        <div className="kpi-card"><div className="kpi-icon" style={{background:'rgba(124,58,237,0.15)',color:'var(--primary)'}}><DollarSign size={22} /></div><div className="kpi-label">Pipeline Value</div><div className="kpi-value">${stats.pipelineValue.toLocaleString()}</div></div>
        <div className="kpi-card"><div className="kpi-icon green"><TrendingUp size={22} /></div><div className="kpi-label">Win Rate</div><div className="kpi-value">{stats.winRate}%</div></div>
        <div className="kpi-card"><div className="kpi-icon orange"><Target size={22} /></div><div className="kpi-label">Open Deals</div><div className="kpi-value">{stats.openCount}</div></div>
        <div className="kpi-card"><div className="kpi-icon red"><AlertCircle size={22} /></div><div className="kpi-label">Overdue Tasks</div><div className="kpi-value">{stats.overdue}</div></div>
      </div>
      <div className="chart-grid">
        <div className="card"><div className="card-header">Pipeline by Stage</div><div className="card-body" style={{ height: 260 }}>
          <ResponsiveContainer width="100%" height="100%"><BarChart data={stageData}><CartesianGrid strokeDasharray="3 3" stroke="var(--border)" /><XAxis dataKey="name" stroke="var(--text-muted)" fontSize={11} /><YAxis stroke="var(--text-muted)" fontSize={12} /><Tooltip contentStyle={{ background: 'var(--bg-card)', border: '1px solid var(--border)', borderRadius: 8 }} /><Bar dataKey="value" fill="#7c3aed" radius={[6, 6, 0, 0]} /></BarChart></ResponsiveContainer>
        </div></div>
        <div className="card"><div className="card-header">Leads by Source</div><div className="card-body" style={{ height: 260 }}>
          <ResponsiveContainer width="100%" height="100%"><PieChart><Pie data={sourceData} dataKey="value" nameKey="name" cx="50%" cy="50%" outerRadius={90} label>{sourceData.map((_, i) => <Cell key={i} fill={COLORS[i % COLORS.length]} />)}</Pie><Tooltip contentStyle={{ background: 'var(--bg-card)', border: '1px solid var(--border)', borderRadius: 8 }} /></PieChart></ResponsiveContainer>
        </div></div>
      </div>
      <div className="card"><div className="card-header">Team Snapshot</div><div className="table-wrap"><table><thead><tr><th>Name</th><th>Role</th><th>Target</th><th>Closed</th><th>Progress</th></tr></thead><tbody>
        {team.map(t => (<tr key={t.id}><td><strong>{t.name}</strong></td><td>{t.role}</td><td>${t.target.toLocaleString()}</td><td>${t.closed.toLocaleString()}</td><td>{Math.round((t.closed / t.target) * 100)}%</td></tr>))}
      </tbody></table></div></div>
    </div>
  )
}
