import { Navigate } from "react-router-dom"

// Icons
import walletIcon from "../../assets/wallet.png"

// Styles
import styles from "./styles.module.css"

// Components
import { LoginFlipCard as RegisterOrLoginCard } from "./components/FlipCard"
import { LoginContent, RegisterContent } from "./components/CardContents"

// Login context
import { LoginContextProvider } from "../../contexts/LoginContext"

// Auth context
import { useAuthContext } from "../../contexts/Auth"


function LoginPage() {
  const { loggedUser } = useAuthContext()

  if ( loggedUser ) return <Navigate to="/dashboard" />
 
  return (
    <LoginContextProvider>
      
      <div className={ styles.page_container }>
        <div className={ styles.login_content }>
          
        </div>

        <div className={ styles.login_box }>
          <div className={ styles.logo_container }>
            <img src={ walletIcon } alt="Image of a wallet" />
            <span>MyWallet App</span>
          </div>

          <RegisterOrLoginCard  frontContent={ <LoginContent /> } backContent={ <RegisterContent /> } />
          
        </div>
      </div>

    </LoginContextProvider>
  )
}

export { LoginPage }