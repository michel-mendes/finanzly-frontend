import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App'
import './index.css'

// Auth context
import { AuthContextProvider } from './contexts/Auth'

ReactDOM.createRoot(document.getElementById('App') as HTMLElement).render(
  <React.StrictMode>
    <AuthContextProvider loadingUser={true} loggedUser={null} setLoggedUser={() => {}}>
      <App />
    </AuthContextProvider>
  </React.StrictMode>,
)
