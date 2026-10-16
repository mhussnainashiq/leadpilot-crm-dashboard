import { useApp } from '../context/AppContext'

export default function Team() {
  const { state } = useApp()
  return (
    <div>
      <div className="card">
        <div className="table-wrap">
          <table>
            <thead><tr><th>Name</th><th>Role</th><th>Email</th><th>Target</th><th>Closed</th><th>Progress</th></tr></thead>
            <tbody>
              {state.team.map(t => (
                <tr key={t.id}>
                  <td><strong>{t.name}</strong></td>
                  <td>{t.role}</td>
                  <td>{t.email}</td>
                  <td>${t.target.toLocaleString()}</td>
                  <td>${t.closed.toLocaleString()}</td>
                  <td>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                      <div style={{ flex: 1, height: 8, background: 'var(--bg)', borderRadius: 4, overflow: 'hidden' }}>
                        <div style={{ width: `${Math.min(100, (t.closed / t.target) * 100)}%`, height: '100%', background: 'var(--primary)' }} />
                      </div>
                      <span>{Math.round((t.closed / t.target) * 100)}%</span>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}
