import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App'
import './index.css'

// Auth context
import { ToastNotificationContextProvider } from './contexts/ToastNotificationContext'

ReactDOM.createRoot(document.getElementById('App') as HTMLElement).render(
  <React.StrictMode>
    <ToastNotificationContextProvider>
      <App />
    </ToastNotificationContextProvider>
  </React.StrictMode>,
)
