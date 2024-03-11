import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import './App.css'

// Contexts
import { useAuthContext, AuthContextProvider } from './contexts/Auth'

// Pages
import { DashboardPage } from './pages/Dashboard'
import { LoginPage } from './pages/Login'
import { WalletsPage } from './pages/Wallets'
import { CategoriesPage } from './pages/Categories'
import { TransactionsPage } from './pages/Transactions'
import { ImportTransactionsPage } from './pages/ImportTransactions'
import { ImportTransactionsListPage } from './pages/ImportTransactionsListPage'
import { UserProfilePage } from './pages/UserProfile'

// Shared Components
import { LoadingOverlay } from './components/LoadingPageOverlay'
import { AppSideMenu } from './components/AppSideMenu'

function App() {

  return (
    <BrowserRouter>
      <AuthContextProvider
        loadingUser={true}
        loggedUser={null}
        registerUser={() => { }}
        verifyUserToken={() => { }}
        loginUser={() => { }}
        logoutUser={() => { }}
        getLoggedUser={() => { }}
        setActiveWallet={() => { }}
        editUser={() => { }}
      >
        <AuthenticatedRoutes />
      </AuthContextProvider>
    </BrowserRouter>
  )

}

function AuthenticatedRoutes() {
  const { loggedUser, loadingUser } = useAuthContext()

  if (loadingUser) return <LoadingOverlay />

  return (
    <>
      {/* Show side menu if user is logged */}
      {
        loggedUser && <AppSideMenu />
      }

      {/* Define app routes */}
      <Routes>
        <Route path='/' element={<Navigate to="/login" />} />
        <Route path='/login' element={<LoginPage />} />
        <Route path='/dashboard' element={loggedUser ? <DashboardPage /> : <Navigate to="/login" />} />
        <Route path='/wallets' element={loggedUser ? <WalletsPage /> : <Navigate to="/login" />} />
        <Route path='/categories' element={loggedUser ? <CategoriesPage /> : <Navigate to="/login" />} />
        <Route path='/transactions' element={loggedUser ? <TransactionsPage /> : <Navigate to="/login" />} />
        <Route path='/import' element={loggedUser ? <ImportTransactionsPage /> : <Navigate to="/login" />} />
        <Route path='/import/transactions' element={loggedUser ? <ImportTransactionsListPage /> : <Navigate to="/login" />} />
        <Route path='/profile' element={loggedUser ? <UserProfilePage /> : <Navigate to="/login" />} />

        <Route path='/finanzly-frontend' element={<Navigate to="/login" />} />
        <Route path='*' element={<h1>Página não encontrada</h1>} />
      </Routes>
    </>
  )
}

export default App
