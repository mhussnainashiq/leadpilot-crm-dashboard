import { useState } from 'react'
import { NavLink, Outlet, useLocation } from 'react-router-dom'
import { LayoutDashboard, UserPlus, Users, Building2, Kanban, Handshake, CheckSquare, BarChart3, UsersRound, Settings, Menu, X, Moon, Sun, Target } from 'lucide-react'
import { useApp } from '../context/AppContext'

const navItems = [
  { to: '/', icon: LayoutDashboard, label: 'Dashboard' },
  { to: '/leads', icon: UserPlus, label: 'Leads' },
  { to: '/contacts', icon: Users, label: 'Contacts' },
  { to: '/companies', icon: Building2, label: 'Companies' },
  { to: '/pipeline', icon: Kanban, label: 'Pipeline' },
  { to: '/deals', icon: Handshake, label: 'Deals' },
  { to: '/tasks', icon: CheckSquare, label: 'Tasks' },
  { to: '/reports', icon: BarChart3, label: 'Reports' },
  { to: '/team', icon: UsersRound, label: 'Team' },
  { to: '/settings', icon: Settings, label: 'Settings' },
]
const titles = { '/': 'Dashboard', '/leads': 'Leads', '/contacts': 'Contacts', '/companies': 'Companies', '/pipeline': 'Sales Pipeline', '/deals': 'Deals', '/tasks': 'Tasks & Follow-ups', '/reports': 'Sales Reports', '/team': 'Team Performance', '/settings': 'Settings' }

export default function Layout() {
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const { state, dispatch } = useApp()
  const location = useLocation()
  const title = titles[location.pathname] || 'LeadPilot'
  return (
    <div className="app-layout">
      <aside className={`sidebar ${sidebarOpen ? 'open' : ''}`}>
        <div className="sidebar-brand"><Target size={28} /><div>Lead<span>Pilot</span></div></div>
        <nav className="sidebar-nav">
          {navItems.map(item => (
            <NavLink key={item.to} to={item.to} end={item.to === '/'} className={({ isActive }) => `nav-item ${isActive ? 'active' : ''}`} onClick={() => setSidebarOpen(false)}>
              <item.icon size={20} />{item.label}
            </NavLink>
          ))}
        </nav>
      </aside>
      <div className="main-content">
        <header className="header">
          <div className="header-left">
            <button className="btn-icon menu-toggle" onClick={() => setSidebarOpen(!sidebarOpen)} aria-label="Menu">{sidebarOpen ? <X size={22} /> : <Menu size={22} />}</button>
            <h1 className="header-title">{title}</h1>
          </div>
          <div className="header-actions">
            <button className="btn-icon" onClick={() => dispatch({ type: 'SET_THEME', payload: state.theme === 'dark' ? 'light' : 'dark' })} aria-label="Theme">
              {state.theme === 'dark' ? <Sun size={20} /> : <Moon size={20} />}
            </button>
          </div>
        </header>
        <main className="page"><Outlet /></main>
      </div>
      {sidebarOpen && <div className="modal-overlay" style={{ zIndex: 90, background: 'rgba(0,0,0,0.3)' }} onClick={() => setSidebarOpen(false)} />}
    </div>
  )
}
