import { useEffect, useState } from "react"

// Configs
import { appConfigs } from "../../config/app-configs"

// Services
import { api } from "../helpers/apiCall"
import { handleError } from "../helpers/errorHandler"

// Interfaces
import { IWallet } from "../services/types"

// Hooks
import { useToastNotification } from "./useToastNotification"

// Custom decorator
import { decorateCustomHookFunction } from "../helpers/hookDecorator"


const {walletGetFromUserEndpoint, walletCreateEndpoint, walletUpdateEndpoint, walletDeleteEndpoint} = appConfigs

export function useWallets() {

    const {showErrorNotification} = useToastNotification()

    const [tempWallet, setTempWallet] = useState<IWallet | null>(null)
    const [walletsList, setWalletsList] = useState<IWallet[]>([])
    
    const [loadingWallets, setLoadingWallets] = useState(true)
    const [awaitingResponse, setAwaitingResponse] = useState(false)

    useEffect(() => {
        decoratedGetWalletsFromUser()
    }, [])

    async function getWalletsFromUser() {
        try {
            const wallets: Array<IWallet> = (await api.get(walletGetFromUserEndpoint)).data

            setWalletsList(wallets)
        } catch (error: any) {
            showErrorNotification( handleError(error).message )   
        }
    }

    async function createWallet(walletData: IWallet) {
        try {
            const createdWallet: IWallet = (await api.post(walletCreateEndpoint, walletData)).data

            setWalletsList([...walletsList, createdWallet])

            return true
        } catch (error: any) {
            showErrorNotification( handleError(error).message )
            return false
        }
    }

    async function updateWallet(walletId: string, walletData: IWallet) {
        try {
            // id, fromUser and actualBalance can't be sent
            // other properties are destructured in "newData"
            const { id, fromUser, actualBalance, ...newData } = walletData

            const updatedWallet: IWallet = (await api.put(`${walletUpdateEndpoint}${walletId}`, newData)).data

            const updatedWalletsList = walletsList.map(wallet => {
                return (wallet.id == updatedWallet.id) ? updatedWallet : wallet
            })

            setWalletsList(updatedWalletsList)

            return true
        } catch (error: any) {
            showErrorNotification( handleError(error).message )
            return false
        }
    }

    async function deleteWallet(walletId: string) {
        try {
            const deletedWallet: IWallet = (await api.delete(`${walletDeleteEndpoint}${walletId}`)).data

            const updatedWalletsList = walletsList.filter(wallet => {
                return (wallet.id !== deletedWallet.id)
            })

            setWalletsList(updatedWalletsList)

            return true
        } catch (error: any) {
            showErrorNotification( handleError(error).message )
            return false
        }
    }

    const decoratedGetWalletsFromUser = decorateCustomHookFunction(getWalletsFromUser, setLoadingWallets)
    const decoratedCreateWallet = decorateCustomHookFunction(createWallet, setAwaitingResponse)
    const decoratedUpdateWallet = decorateCustomHookFunction(updateWallet, setAwaitingResponse)
    const decoratedDeleteWallet = decorateCustomHookFunction(deleteWallet, setAwaitingResponse)

    return { 
        tempWallet,
        setTempWallet,
        walletsList,
        getWalletsFromUser: decoratedGetWalletsFromUser,
        createWallet: decoratedCreateWallet,
        updateWallet: decoratedUpdateWallet,
        deleteWallet: decoratedDeleteWallet,
        loadingWallets,
        awaitingResponse
    }
}