import React from 'react'
import { Outlet, Link, useLocation } from 'react-router-dom'

export default function Layout() {
  const location = useLocation()
  
  return (
    <div className="layout">
      <header className="header">
        <h1>ネットワーク監視ツール</h1>
      </header>
      <nav className="nav">
        <ul className="nav-links">
          <li>
            <Link 
              to="/" 
              className={location.pathname === '/' ? 'active' : ''}
            >
              ホーム
            </Link>
          </li>
          <li>
            <Link 
              to="/settings" 
              className={location.pathname.startsWith('/settings') ? 'active' : ''}
            >
              設定
            </Link>
          </li>
          <li>
            <Link 
              to="/monitoring" 
              className={location.pathname === '/monitoring' ? 'active' : ''}
            >
              モニタリング
            </Link>
          </li>
          <li>
            <Link 
              to="/anomaly-analysis" 
              className={location.pathname === '/anomaly-analysis' ? 'active' : ''}
            >
              異常値分析
            </Link>
          </li>

        </ul>
      </nav>
      <main className="main">
        <Outlet />
      </main>
    </div>
  )
}