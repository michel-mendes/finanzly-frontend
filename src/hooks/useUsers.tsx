import { useEffect, useState } from "react";
import { appConfigs } from "../../config/app-configs";

// Decorator
import { decorateCustomHookFunction } from "../helpers/hookDecorator"

// Components
import { useToastNotification } from "./useToastNotification";

// Types
import { IAuthenticatedUser, ILoginProps } from "../type-defs";

// Services
import { api } from "../helpers/apiCall";

// Error handler
import { handleError } from "../helpers/errorHandler";

const {
    userEditEndpoint,
    userLoginEnpoint,
    userLogoutEnpoint,
    getUserLoggedEndpoint,
    userSetActiveWalletEndpoint
} = appConfigs


export function useUsers() {

    const { showErrorNotification, showSuccessNotification } = useToastNotification()

    const [loggedUser, setLoggedUser] = useState<IAuthenticatedUser | null>(null)
    const [loadingUser, setLoadingUser] = useState(true)

    useEffect(() => {
        decoratedGetLoggedUser()
    }, [])

    async function editUser(userData: IAuthenticatedUser) {
        try {
            const {firstName, lastName, firstDayOfMonth} = userData

            // Send changes to server
            await api.put(`${userEditEndpoint}${loggedUser?.id}`, {firstName, lastName, firstDayOfMonth})

            showSuccessNotification("Dados atualizados com suceso")

            setLoggedUser({...loggedUser, firstName, lastName, firstDayOfMonth})
        } catch (error: any) {
            showErrorNotification( handleError(error).message )
        }
    }
    
    async function loginUser({ email, password }: ILoginProps) {
        try {
            const user: IAuthenticatedUser = (await api.post(userLoginEnpoint, { email, password })).data

            showSuccessNotification(`Bem vindo(a), ${user.firstName}`)

            setLoggedUser(user)
        } catch (error: any) {
            showErrorNotification( handleError(error).message )
        }
    }

    async function logoutUser() {
        try {
            await api.post(userLogoutEnpoint)

            setLoggedUser(null)
        } catch (error) {
            showErrorNotification( handleError(error).message )
        }
    }

    // Silent error handling
    async function getLoggedUser() {
        try {
            const user: IAuthenticatedUser = (await api.get(getUserLoggedEndpoint)).data

            setLoggedUser(user)
        } catch (error: any) {
            return
        }
    }

    // Silent error handling
    async function setActiveWallet(walletId: string) {
        try {
            const user: IAuthenticatedUser = (await api.post(userSetActiveWalletEndpoint, { activeWallet: walletId })).data

            setLoggedUser(user)
        } catch (error: any) {
            return
        }
    }

    const decoratedGetLoggedUser = decorateCustomHookFunction(getLoggedUser, setLoadingUser)

    return {
        loadingUser,
        loggedUser,
        loginUser,
        logoutUser,
        getLoggedUser: decoratedGetLoggedUser,
        editUser,
        setActiveWallet
    }
}