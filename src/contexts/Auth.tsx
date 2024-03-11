import { createContext, useContext, useEffect } from "react";
import { useSearchParams } from "react-router-dom";

// Types
import { IAuthContextProps } from "../type-defs";

// Hooks
import { useUsers } from "../hooks/useUsers";

const AuthContext = createContext<IAuthContextProps | null>(null)

function AuthContextProvider({ children  }: IAuthContextProps) {

    const queryParams = useSearchParams()[0]
    const {loadingUser, loggedUser, registerUser, verifyUserToken, loginUser, logoutUser, getLoggedUser, setActiveWallet, editUser} = useUsers()

    useEffect(() => {
        const userVerificationToken = queryParams.get("token")

        if (userVerificationToken) {
            verifyUserToken(userVerificationToken)
        }
    }, [queryParams])

    return (
        <AuthContext.Provider value={{ loadingUser, loggedUser, registerUser, verifyUserToken, loginUser, logoutUser, getLoggedUser, setActiveWallet, editUser }}>
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