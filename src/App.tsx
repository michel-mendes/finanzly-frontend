import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import './App.css'

// Contexts
import { useAuthContext } from './contexts/Auth'

// Pages
import { DashboardPage } from './pages/Dashboard'
import { LoginPage } from './pages/Login'
import { WalletsPage } from './pages/Wallets'
import { CategoriesPage } from './pages/Categories'
import { TransactionsPage } from './pages/Transactions'
import { ImportTransactionsPage } from './pages/ImportTransactions'
import { TestsPage } from './pages/TestsPage'

// Shared Components
import { LoadingOverlay } from './shared_components/LoadingPageOverlay'
import { FloatingTopNavigationBar } from './shared_components/FloatingTopNavigationBar'

function App() {

  const { loggedUser, loadingUser } = useAuthContext()

  if (loadingUser) {
    return <LoadingOverlay />
  }

  return (
    <>
      <BrowserRouter>

        {
          !loggedUser ? null : <FloatingTopNavigationBar />
        }

        <Routes>
          <Route path='/' element={<Navigate to="/login" />} />
          <Route path='/login' element={<LoginPage />} />
          <Route path='/dashboard' element={loggedUser ? <DashboardPage /> : <Navigate to="/login" />} />
          <Route path='/wallets' element={loggedUser ? <WalletsPage /> : <Navigate to="/login" />} />
          <Route path='/categories' element={loggedUser ? <CategoriesPage /> : <Navigate to="/login" />} />
          <Route path='/transactions' element={loggedUser ? <TransactionsPage /> : <Navigate to="/login" />} />
          <Route path='/import' element={loggedUser ? <ImportTransactionsPage /> : <Navigate to="/login" />} />
          <Route path='/testes' element={loggedUser ? <TestsPage /> : <Navigate to="/login" />} />
          <Route path='*' element={<><h1>Página não encontrada <br /> Usuário está logado: {loggedUser ? "SIM" : "NAO"}</h1><br></br><h2>Dados do usuário:</h2><pre>{JSON.stringify(loggedUser, undefined, 4)}</pre></>} />
        </Routes>
      </BrowserRouter>
    </>
  )

}

export default App
