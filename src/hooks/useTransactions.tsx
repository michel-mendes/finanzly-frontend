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

    async function getTransactionsFromWallet(walletId: string, startDate: string = "", endDate: string = "") {
        setLoadingTransactions(true)

        const walletTransactions = await api.getTransactionsFromWallet(walletId, startDate, endDate)

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

    async function newTransaction(data: ITransaction): Promise<ITransaction | null> {
        const newTransaction = await api.createTransaction(data)

        if ("error" in newTransaction) {
            alert(`Erro ao inserir nova transação:\n\n${newTransaction.error}`)
            return null
        }

        setTransactionsList([...transactionsList, newTransaction])
        return newTransaction
    }

    async function updateTransaction(data: ITransaction): Promise<ITransaction | null> {
        const updatedTransaction = await api.updateTransaction(data.id!, data)

        if ("error" in updatedTransaction) {
            alert(`Erro ao editar transação:\n\n${updatedTransaction.error}`)
            return null
        }

        const updatedTransactionsList = transactionsList.map(transaction => {
            return (transaction.id == updatedTransaction.id) ? updatedTransaction : transaction
        })

        setTransactionsList(updatedTransactionsList)        
        return updatedTransaction
    }

    async function deleteTransaction(transaction: ITransaction): Promise<ITransaction | null> {
        const deletedTransaction = await api.deleteTransaction(transaction.id!)

        if ("error" in deletedTransaction) {
            alert(`Erro ao deletar transação:\n\n${deletedTransaction.error}`)
            return null
        }

        const updatedTransactionsList = transactionsList.filter(transaction => {
            return (transaction.id !== deletedTransaction.id)
        })

        setTransactionsList(updatedTransactionsList)
        return deletedTransaction
    }

    return {
        draftTransaction, setDraftTransaction,
        transactionsList, setTransactionsList,
        loadingTransactions, setLoadingTransactions,
        
        getTransactionsFromWallet,
        newTransaction,
        updateTransaction,
        deleteTransaction,
        clearTransactionsList
    }
}