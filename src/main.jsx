import React from 'react'
import ReactDOM from 'react-dom/client'
import { createBrowserRouter, RouterProvider } from 'react-router-dom'
import './index.css'

import Layout from './components/Layout'
import Home from './pages/Home'
import Settings from './pages/Settings'
import SettingsPlatform from './pages/SettingsPlatform'
import Monitoring from './pages/Monitoring'
import AnomalyAnalysis from './pages/AnomalyAnalysis'
import ErrorPage from './pages/ErrorPage'

const router = createBrowserRouter([
  {
    path: "/",
    element: <Layout />,
    errorElement: <ErrorPage />,
    children: [
      {
        index: true,
        element: <Home />
      },
      {
        path: "settings",
        element: <Settings />
      },
      {
        path: "settings/:platform",
        element: <SettingsPlatform />
      },
      {
        path: "monitoring",
        element: <Monitoring />
      },
      {
        path: "anomaly-analysis",
        element: <AnomalyAnalysis />
      }
    ]
  }
])

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <RouterProvider router={router} />
  </React.StrictMode>,
)