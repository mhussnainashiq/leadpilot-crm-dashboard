import { useState } from 'react'
import { useApp } from '../context/AppContext'
import { STAGES } from '../data/sampleData'
const openStages = STAGES.filter(s => !s.startsWith('Closed'))
export default function Pipeline() {
  const { state, dispatch } = useApp()
  const [dragId, setDragId] = useState(null)
  const onDragStart = (e, id) => { setDragId(id); e.dataTransfer.effectAllowed = 'move' }
  const onDragOver = (e) => { e.preventDefault(); e.dataTransfer.dropEffect = 'move' }
  const onDrop = (e, stage) => {
    e.preventDefault()
    if (dragId) { dispatch({ type: 'MOVE_DEAL', payload: { id: dragId, stage } }); setDragId(null) }
  }
  return (
    <div>
      <p style={{ marginBottom: 16, color: 'var(--text-muted)' }}>Drag deals between stages to update the pipeline.</p>
      <div className="pipeline-board">
        {openStages.map(stage => {
          const stageDeals = state.deals.filter(d => d.stage === stage)
          const total = stageDeals.reduce((s, d) => s + d.value, 0)
          return (
            <div key={stage} className="pipeline-col" onDragOver={onDragOver} onDrop={(e) => onDrop(e, stage)}>
              <div className="pipeline-col-header"><span>{stage}</span><span style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>${total.toLocaleString()}</span></div>
              <div className="pipeline-col-body">
                {stageDeals.map(d => {
                  const company = state.companies.find(c => c.id === d.companyId)
                  return (
                    <div key={d.id} className="deal-card" draggable onDragStart={(e) => onDragStart(e, d.id)}>
                      <h4>{d.title}</h4>
                      <div className="meta">{company?.name || '—'}</div>
                      <div className="meta" style={{ marginTop: 4, fontWeight: 600, color: 'var(--primary)' }}>${d.value.toLocaleString()} · {d.probability}%</div>
                    </div>
                  )
                })}
                {stageDeals.length === 0 && <div style={{ textAlign: 'center', color: 'var(--text-muted)', fontSize: '0.85rem', padding: 20 }}>Drop deals here</div>}
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}
