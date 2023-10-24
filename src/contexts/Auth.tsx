import { createContext, useContext } from "react";

// Types
import { IAuthContextProps } from "../type-defs";

// Hooks
import { useUsers } from "../hooks/useUsers";


const AuthContext = createContext<IAuthContextProps | null>(null)

function AuthContextProvider({ children  }: IAuthContextProps) {

    const {loadingUser, loggedUser, loginUser, logoutUser, getLoggedUser, setActiveWallet} = useUsers()

    return (
        <AuthContext.Provider value={{ loadingUser, loggedUser, loginUser, logoutUser, getLoggedUser, setActiveWallet }}>
            {children}
        </AuthContext.Provider>
    )
}

const useAuthContext = (): IAuthContextProps => {
    const contextValue = useContext(AuthContext)

    if (!contextValue) {
        throw new Error("'useAuthContext' must be use within an 'AuthContextProvider'")
    }

    return contextValue
}

export { useAuthContext, AuthContextProvider }