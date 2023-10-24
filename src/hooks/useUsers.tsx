import { useEffect, useState } from "react";
import { appConfigs } from "../../config/app-configs";

// Decorator
import {decorateCustomHookFunction} from "../helpers/hookDecorator"

// Types
import { IAuthenticatedUser, ILoginProps } from "../type-defs";

// Services
import { api } from "../helpers/apiCall";

const {
    userLoginEnpoint,
    userLogoutEnpoint,
    getUserLoggedEndpoint,
    userSetActiveWalletEndpoint
} = appConfigs


export function useUsers() {

    const [loggedUser, setLoggedUser] = useState<IAuthenticatedUser | null>(null)
    const [loadingUser, setLoadingUser] = useState(true)

    useEffect(() => {
        decoratedGetLoggedUser()
    }, [])

    async function loginUser({email, password}: ILoginProps) {        
        try {
            const user: IAuthenticatedUser = (await api.post(userLoginEnpoint, { email, password })).data

            setLoggedUser(user)
        } catch (error: any) {
            alert(`Erro durante login\n${error}`)
        }
    }

    async function logoutUser() {
        try {
            await api.post(userLogoutEnpoint)

            setLoggedUser(null)
        } catch (error) {
            alert(`Erro durante logout\n${error}`)
        }
    }

    async function getLoggedUser() {
        try {
            const user: IAuthenticatedUser = (await api.get(getUserLoggedEndpoint)).data

            setLoggedUser(user)
        } catch (error: any) {
            alert(`Erro ao solicitar dados do usuário logado\n${error}`)
        }
    }

    async function setActiveWallet(walletId: string) {
        try {
            const user: IAuthenticatedUser = (await api.post(userSetActiveWalletEndpoint, { activeWallet: walletId })).data

            setLoggedUser(user)
        } catch (error: any) {
            alert(`Erro ao definir carteira ativa para ${loggedUser?.firstName}\n${error}`)
        }
    }

    const decoratedGetLoggedUser = decorateCustomHookFunction(getLoggedUser, setLoadingUser)

    return {
        loadingUser,
        loggedUser,
        loginUser,
        logoutUser,
        getLoggedUser: decoratedGetLoggedUser,
        setActiveWallet
    }
}