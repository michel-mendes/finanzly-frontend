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

    useEffect(() => {
        async function fetchTransactions() {
            setLoadingTransactions(true)

            const transactions = await api.getAllTransactions()

            if ("error" in transactions) {
                alert(`Erro ao atualizar lista de transações:\n\n${transactions.error}`)
                console.log(transactions)
                return
            }

            setTransactionsList(transactions)
            setLoadingTransactions(false)
        }

        fetchTransactions()
    }, [])

    

    return { draftTransaction, setDraftTransaction, transactionsList, setTransactionsList, loadingTransactions, setLoadingTransactions }
}