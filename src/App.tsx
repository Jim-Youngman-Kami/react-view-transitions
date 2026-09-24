import { Link, NavLink, Outlet } from 'react-router'
import { ViewTransition } from 'react'
import { SpeedControl } from './components/SpeedControl'
import './App.css'

const TABS = [
  { to: '/', label: 'Simple', end: true },
  { to: '/gallery', label: 'Gallery', end: false },
  { to: '/how-it-works', label: 'How it works', end: false },
  { to: '/mechanics', label: 'Mechanics', end: false },
]

export default function App() {
  return (
    <div className="app">
      <nav className="tabs">
        {TABS.map((tab) => (
          <NavLink
            key={tab.to}
            to={tab.to}
            end={tab.end}
            className={({ isActive }) => (isActive ? 'tab tab--active' : 'tab')}
          >
            {({ isActive }) => (
              <>
                {/* One shared name, so the pill slides between tabs rather than
                    disappearing and reappearing. */}
                {isActive && (
                  <ViewTransition name="tab-pill">
                    <span className="tab__pill" />
                  </ViewTransition>
                )}
                <span className="tab__label">{tab.label}</span>
              </>
            )}
          </NavLink>
        ))}
        <Link to="/present" className="tab tab--present">
          <span className="tab__label">Present ▸</span>
        </Link>
      </nav>

      <Outlet />

      <SpeedControl />
    </div>
  )
}
