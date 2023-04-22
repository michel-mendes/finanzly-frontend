import { useEffect, useState } from "react"

// Services
import { WalletsApi } from "../services/WalletsApi"

// Interfaces
import { IWallet } from "../services/types"

export function useWallets() {
    const api = new WalletsApi()

    const [draftWallet, useDraftWallet] = useState<IWallet | null>(null)
    const [walletsList, setWalletsList] = useState<IWallet[]>([])
    const [loadingWallets, setLoadingWallets] = useState(true)

    useEffect(() => {
        async function fetchData() {
            setLoadingWallets(true)

            const wallets = await api.getWalletsFromUser()

            if ("error" in wallets) {
                alert(`Erro ao atualizar lista de carteiras:\n\n${wallets.error}`)
                console.log(wallets)
                return
            }

            setWalletsList(wallets)
            setLoadingWallets(false)
        }

        fetchData()
    }, [])

    return { draftWallet, useDraftWallet, walletsList, setWalletsList, loadingWallets, setLoadingWallets }
}