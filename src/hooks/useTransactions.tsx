import { useEffect, useState } from "react"

// Services
import { TransactionsApi } from "../services/TransactionsApi"

// Interfaces
import { ITransaction } from "../services/types"

export function useTransactions() {
    const api = new TransactionsApi()

    const [draftTransaction, setDraftTransaction] = useState<ITransaction | null>(null)
    const [transactionsList, setTransactionsList] = useState<ITransaction[]>([])
    const [loadingTransactions, setLoadingTransactions] = useState(true)

    async function getTransactionsFromWallet(walletId: string) {
        setLoadingTransactions(true)
        
        const walletTransactions = await api.getTransactionsFromWallet(walletId)

        if ("error" in walletTransactions) {
            alert(`Erro ao atualizar transções da carteira:\n\n${walletTransactions.error}`)
            return
        }

        setTransactionsList(walletTransactions)
        setLoadingTransactions(false)
    }

    function clearTransactionsList() {
        setTransactionsList([])
    }

    return {
        draftTransaction, setDraftTransaction,
        transactionsList, setTransactionsList,
        loadingTransactions, setLoadingTransactions,
        
        getTransactionsFromWallet,
        clearTransactionsList
    }
}