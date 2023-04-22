import { createContext, useContext, useState , PropsWithChildren} from "react"

interface ILoginProps {
    email:      string
    password:   string
}

interface IForgotPasswordProps {
    email: string
}

interface IRegisterProps {
    firstName:  string
    email:      string
    password:   string
}

interface ILoginContextProps extends PropsWithChildren {
    props?: {
        loginData:              ILoginProps
        loginError:             string | null
        setLoginData:           Function
        setLoginError:          Function

        forgotPasswordData:     IForgotPasswordProps
        forgotPasswordError:    string | null
        setForgotPasswordData:  Function
        setForgotPasswordError: Function

        registerData:           IRegisterProps
        registerError:          string | null
        setRegisterData:        Function
        setRegisterError:       Function
    }
}

const LoginContext = createContext< ILoginContextProps | null >( null )

function LoginContextProvider( { children }: ILoginContextProps ) {
    
    // Context states
    const [ loginData, setLoginData ]                       = useState< ILoginProps >({email: "", password: ""})
    const [ forgotPasswordData, setForgotPasswordData ]     = useState< IForgotPasswordProps >({email: ""})
    const [ registerData, setRegisterData ]                 = useState< IRegisterProps >({firstName: "", email: "", password: ""})
    const [ loginError, setLoginError ]                     = useState< string | null >( null )
    const [ forgotPasswordError, setForgotPasswordError ]   = useState< string | null >( null )
    const [ registerError, setRegisterError ]               = useState< string | null >( null )

    return (
        <LoginContext.Provider value={
            { props: {
                loginData, loginError, setLoginData, setLoginError,
                forgotPasswordData, forgotPasswordError, setForgotPasswordData, setForgotPasswordError,
                registerData, registerError, setRegisterData, setRegisterError
            } }
        }>
            { children }
        </LoginContext.Provider>
    )
}

const useLoginContext = (): ILoginContextProps => {
    const contextValue = useContext( LoginContext )

    if ( !contextValue ) {
        throw new Error( "'useLoginContext' must be used within a 'LoginContextProvider'" )
    }

    return contextValue
}

export { useLoginContext, LoginContextProvider}