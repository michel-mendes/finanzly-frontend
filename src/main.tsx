import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App'
import './index.css'

// Auth context
import { AuthContextProvider } from './contexts/Auth'
import { ToastNotificationContextProvider } from './contexts/ToastNotificationContext'

ReactDOM.createRoot(document.getElementById('App') as HTMLElement).render(
  <React.StrictMode>
    <ToastNotificationContextProvider>
      <AuthContextProvider
        loadingUser={true}
        loggedUser={null}
        loginUser={() => { }}
        logoutUser={() => { }}
        getLoggedUser={() => { }}
        setActiveWallet={() => { }}
        editUser={() => { }}
      >
        <App />
      </AuthContextProvider>
    </ToastNotificationContextProvider>
  </React.StrictMode>,
)
