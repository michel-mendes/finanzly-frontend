import { createContext, useContext, useState , PropsWithChildren} from "react"

import {ILoginProps, IForgotPasswordProps, IRegisterProps, ILoginContextProps} from "../type-defs"

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