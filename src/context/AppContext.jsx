import { createContext, useContext, useReducer, useEffect } from 'react'
import { initialData } from '../data/sampleData'

const AppContext = createContext()
const STORAGE_KEY = 'leadpilot_data_v1'

function loadState() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    if (raw) return JSON.parse(raw)
  } catch (e) {}
  return initialData
}
function saveState(state) {
  try { localStorage.setItem(STORAGE_KEY, JSON.stringify(state)) } catch (e) {}
}

function reducer(state, action) {
  let next = state
  switch (action.type) {
    case 'SET_THEME': next = { ...state, theme: action.payload }; break
    case 'ADD_LEAD': next = { ...state, leads: [...state.leads, { ...action.payload, id: Date.now().toString() }] }; break
    case 'UPDATE_LEAD': next = { ...state, leads: state.leads.map(l => l.id === action.payload.id ? { ...l, ...action.payload } : l) }; break
    case 'DELETE_LEAD': next = { ...state, leads: state.leads.filter(l => l.id !== action.payload) }; break
    case 'ADD_CONTACT': next = { ...state, contacts: [...state.contacts, { ...action.payload, id: Date.now().toString() }] }; break
    case 'UPDATE_CONTACT': next = { ...state, contacts: state.contacts.map(c => c.id === action.payload.id ? { ...c, ...action.payload } : c) }; break
    case 'DELETE_CONTACT': next = { ...state, contacts: state.contacts.filter(c => c.id !== action.payload) }; break
    case 'ADD_COMPANY': next = { ...state, companies: [...state.companies, { ...action.payload, id: Date.now().toString() }] }; break
    case 'UPDATE_COMPANY': next = { ...state, companies: state.companies.map(c => c.id === action.payload.id ? { ...c, ...action.payload } : c) }; break
    case 'DELETE_COMPANY': next = { ...state, companies: state.companies.filter(c => c.id !== action.payload) }; break
    case 'ADD_DEAL': next = { ...state, deals: [...state.deals, { ...action.payload, id: Date.now().toString() }] }; break
    case 'UPDATE_DEAL': next = { ...state, deals: state.deals.map(d => d.id === action.payload.id ? { ...d, ...action.payload } : d) }; break
    case 'DELETE_DEAL': next = { ...state, deals: state.deals.filter(d => d.id !== action.payload) }; break
    case 'MOVE_DEAL': next = { ...state, deals: state.deals.map(d => d.id === action.payload.id ? { ...d, stage: action.payload.stage } : d) }; break
    case 'ADD_TASK': next = { ...state, tasks: [...state.tasks, { ...action.payload, id: Date.now().toString() }] }; break
    case 'UPDATE_TASK': next = { ...state, tasks: state.tasks.map(t => t.id === action.payload.id ? { ...t, ...action.payload } : t) }; break
    case 'DELETE_TASK': next = { ...state, tasks: state.tasks.filter(t => t.id !== action.payload) }; break
    case 'RESET_DATA': next = initialData; break
    default: return state
  }
  saveState(next)
  return next
}

export function AppProvider({ children }) {
  const [state, dispatch] = useReducer(reducer, null, loadState)
  useEffect(() => { document.documentElement.setAttribute('data-theme', state.theme || 'light') }, [state.theme])
  return <AppContext.Provider value={{ state, dispatch }}>{children}</AppContext.Provider>
}
export function useApp() {
  const ctx = useContext(AppContext)
  if (!ctx) throw new Error('useApp must be used within AppProvider')
  return ctx
}
