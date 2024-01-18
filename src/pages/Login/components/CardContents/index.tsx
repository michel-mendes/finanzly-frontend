import { FormEvent } from "react"
import { AxiosError } from "axios"

// Components
import { LoginFlipCard as ForgotOrLoginCard } from "../../components/FlipCard"
import { AlertBox } from "../../../../components/AlertBox"
import { CustomButton } from "../../../../components/CustomButton"

// Icons
import { FiMail, FiUser } from "react-icons/fi"
import { TfiLock } from "react-icons/tfi"

// Stylesheets
import inputStyles from "./InputStyles.module.css"
import styles from "./styles.module.css"

// Login context
import { useLoginContext } from "../../../../contexts/LoginContext"
import { useAuthContext } from "../../../../contexts/Auth"

interface IFlipCardContentProps {
  handleFlip?: Function
}

export {
  LoginContent,
  RegisterContent
}

function LoginContent({ handleFlip }: IFlipCardContentProps) {
  return (
    <>
      <ForgotOrLoginCard frontContent={<FormContent />} backContent={<ForgotPasswordContent />} />

      <div className={styles.create_account_container}>
        <CustomButton caption="Ainda não tenho uma conta" captionAlignment="center" handleClick={() => { handleFlip!() }} />
      </div>
    </>
  )
}

function RegisterContent({ handleFlip }: IFlipCardContentProps) {
  return (
    <>
      <span className={styles.new_account_header}>Informe os dados abaixo para criar sua conta</span>

      <form action="" method="post">

        <label className={inputStyles.input_container} htmlFor="inputRegisterFirstName">
          <span>nome</span>
          <span><FiUser /></span>
          <input type="text" name="" id="inputRegisterFirstName" placeholder=" " required />
        </label>

        <label className={inputStyles.input_container} htmlFor="inputRegisterEmail">
          <span>e-mail</span>
          <span><FiMail /></span>
          <input type="email" name="" id="inputRegisterEmail" placeholder=" " required />
        </label>

        <label className={inputStyles.input_container} htmlFor="inputRegisterPassword">
          <span>senha</span>
          <span><TfiLock /></span>
          <span></span>
          <input type="password" name="" id="inputRegisterPassword" placeholder=" " required />
        </label>

        <div className={styles.create_account_button_container}>
          <button className="btn btn-info">CRIAR CONTA</button>
        </div>

      </form>

      <div>
        <span>Você já tem uma conta?</span>
        <br />
        <span className="link" onClick={() => { handleFlip!() }}>FAÇA O LOGIN</span>
      </div>
    </>
  )
}

function FormContent({ handleFlip }: IFlipCardContentProps) {
  const { loginData, setLoginData, loginError, setLoginError,  } = useLoginContext().props!
  const {loginUser } = useAuthContext()

  // Helper function
  async function handleLoginFormSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()

    try {
      loginUser({...loginData})
      
      // const response = await axios.post(loginUrl, loginData, { withCredentials: true })
  
      setLoginError(null)
      // setLoggedUser!( response.data )
    } catch (error: any) {
      setLoginError(getErrorMessage(error))
    }
  }

  return (
    <>
      <span>Faça o login e comece a monitorar cada movimentação de suas contas</span>

      <form action="" method="post" className={styles.form_login} onSubmit={(e) => { handleLoginFormSubmit(e) }}>

        <label className={inputStyles.input_container} htmlFor="inputEmail">
          <span>e-mail</span>
          <span><FiMail /></span>
          <input type="email" name="" id="inputEmail" placeholder=" " onChange={(e) => { setLoginData({ ...loginData, email: e.target.value }) }} required />
        </label>

        <label className={inputStyles.input_container} htmlFor="inputPassword">
          <span>senha</span>
          <span><TfiLock /></span>
          <span></span>
          <input type="password" name="" id="inputPassword" placeholder=" " onChange={(e) => { setLoginData({ ...loginData, password: e.target.value }) }} required />
        </label>

        <div className={styles.forgot_password_container}>
          <span className="link" onClick={() => { handleFlip!(true) }}><TfiLock /> Esqueci minha senha</span>
        </div>

        {
          loginError ? <AlertBox alertMessage={loginError} alertType="error" onCloseButtonClick={() => { setLoginError(null) }}/> : null
        }

        <div className={styles.login_button_container}>
          <CustomButton caption="ENTRAR" captionAlignment="center" icon="" handleClick={(event) => { event.stopPropagation() }} />
        </div>

      </form>
    </>
  )
}

function ForgotPasswordContent({ handleFlip }: IFlipCardContentProps) {
  return (
    <>
      <form action="" className={styles.form_forgot_password}>
        <div>
          <span>Esqueceu sua senha?</span>
          <span>informe seu e-mail abaixo abaixo para resetar sua senha</span>
        </div>

        <label className={inputStyles.input_container} htmlFor="inputEmailForgotPassword">
          <span>e-mail</span>
          <span><FiMail /></span>
          <input type="email" name="" id="inputEmailForgotPassword" placeholder=" " required />
        </label>

        <div className={styles.reset_password_container}>
          <button className="btn btn-info">RESETAR SENHA</button>
        </div>
      </form>

      <div className={styles.go_back_login_container}>
        <span className="link" onClick={() => { handleFlip!(false) }}>VOLTAR PARA LOGIN</span>
      </div>
    </>
  )
}

// Helper functions
function getErrorMessage(error: any): string {
  
  if (error instanceof AxiosError) {
    return getBackendErrors(error)
  } else {
    return error.message
  }

}

function getBackendErrors(error: AxiosError<any>): string {

  const backendValidationErrorArray = ( ( error.response ) && error.response.data ) ? error.response.data.errors : null
  const backendGenericError =         ( ( error.response ) && error.response.data ) ? error.response.data.message : null

  if (backendValidationErrorArray)  { return Object.values(backendValidationErrorArray[0])[0] as string }
  else if (backendGenericError)     { return backendGenericError }
  else                              { return "Oops... Something went wrong, please try again later."}
  // else { return error.message }

}