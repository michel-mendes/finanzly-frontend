import axios from "axios";
import { PropsWithChildren, createContext, useContext, useEffect, useState } from "react";

import { appConfigs } from "../../config/app-configs";

interface IAuthenticatedUser {
    id: string;
    firstName: string;
    role: string;
}

interface IAuthContextProps extends PropsWithChildren {
    loggedUser: IAuthenticatedUser | null
    loadingUser: boolean
    setLoggedUser: Function
}

const { getUserLoggedEndpoint } = appConfigs

const AuthContext = createContext< IAuthContextProps | null >( null )

function AuthContextProvider( {children}: IAuthContextProps ) {

    const [ loggedUser, setLoggedUser ] = useState< IAuthenticatedUser | null >( null )
    const [ loadingUser, setLoadingUser ] = useState( true )

    useEffect(() => {
        async function getLoggedInUser() {
            try {
                setLoadingUser(true)
                const user = (await axios.get(getUserLoggedEndpoint, {withCredentials: true})).data
        
                setLoggedUser( user )
                setLoadingUser( false )
            } catch (error: any) {
                setLoggedUser( null )
                setLoadingUser( false )
            }
        }

        getLoggedInUser()

    }, [])
    
    return (
        <AuthContext.Provider value={ { loggedUser, loadingUser, setLoggedUser } }>
            { children }
        </AuthContext.Provider>
    )
}

const useAuthContext = (): IAuthContextProps => {
    const contextValue = useContext( AuthContext )

    if ( !contextValue ) {
        throw new Error( "'useAuthContext' must be use within an 'AuthContextProvider'" )
    }

    return contextValue
}

export { useAuthContext, AuthContextProvider }