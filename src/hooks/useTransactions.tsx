import { useState } from "react"
import moment from "moment"

// Services
import { api } from "../helpers/apiCall"
import { handleError } from "../helpers/errorHandler"

// Interfaces
import { ITransaction } from "../type-defs"

// Hooks
import { useToastNotification } from "./useToastNotification"

// Custom decorator
import { decorateCustomHookFunction } from "../helpers/hookDecorator"

// Configs
import { appConfigs } from "../../config/app-configs"


const {
    transactionGetFromWallet,
    transactionCreateEndpoint,
    transactionUpdateEndpoint,
    transactionDeleteEndpoint
} = appConfigs

export function useTransactions() {

    const {showErrorNotification} = useToastNotification()

    const [tempTransaction, setTempTransaction] = useState<ITransaction | null>(null)
    const [transactionsList, setTransactionsList] = useState<ITransaction[]>([])
    const [loadingTransactions, setLoadingTransactions] = useState(true)
    const [awaitingResponse, setAwaitingResponse] = useState(false)

    // Keeps the lastest value of wallet balance
    const [walletBalanceAfterLastTransaction, setWalletBalanceAfterLastTransaction] = useState(0)

    
    function clearList() {
        setTransactionsList([])
    }
    
    async function getTransactionsFromWallet(walletId: string, startDate: string = "", endDate: string = "") {
        try {
            startDate = (startDate.length > 0) ? `startDate=${startDate}&` : ""
            endDate = (endDate.length > 0) ? `endDate=${endDate}&` : ""
            const queryString = (startDate || endDate) ? `?${startDate}${endDate}` : ""
            
            const transactions: ITransaction[] = (await api.get(`${transactionGetFromWallet}${walletId}${queryString}`)).data

            setTransactionsList(transactions)
        } catch (error: any) {
            showErrorNotification(handleError(error).message)
        }
    }

    async function createTransaction(transactionData: ITransaction) {
        try {
            transactionData.date = moment(transactionData.date).startOf("day") as any //get timestamp
            const createdTransaction: ITransaction = (await api.post(transactionCreateEndpoint, transactionData)).data

            setTransactionsList([...transactionsList, createdTransaction])
            setWalletBalanceAfterLastTransaction(createdTransaction.currentWalletBalance!)
            return true
        } catch (error: any) {
            showErrorNotification( handleError(error).message )
            return false
        }
    }

    async function updateTransaction(transactionId: string, transactionData: ITransaction) {
        try {
            // id, fromUser and actualBalance can't be sent
            // other properties are destructured in "newData"
            const { id, fromUser, fromWallet, csvImportId, creditValue, debitValue, ...newData } = transactionData

            const updatedTransaction: ITransaction = (await api.put(`${transactionUpdateEndpoint}${transactionId}`, newData)).data

            const updatedTransactionsList = transactionsList.map(transaction => {
                return (transaction.id == updatedTransaction.id) ? updatedTransaction : transaction
            })

            setTransactionsList(updatedTransactionsList)
            setWalletBalanceAfterLastTransaction(updatedTransaction.currentWalletBalance!)
            return true
        } catch (error: any) {
            showErrorNotification( handleError(error).message )
            return false
        }
    }

    async function deleteTransaction(transactionId: string) {
        try {
            const deletedTransaction: ITransaction = (await api.delete(`${transactionDeleteEndpoint}${transactionId}`)).data

            const updatedTransactionsList = transactionsList.filter(transaction => {
                return transaction.id !== deletedTransaction.id
            })

            setTransactionsList(updatedTransactionsList)
            setWalletBalanceAfterLastTransaction(deletedTransaction.currentWalletBalance!)
            return true
        } catch (error: any) {
            showErrorNotification( handleError(error).message )
            return false
        }
    }

    const decoratedGetTransactionsFromWallet = decorateCustomHookFunction(getTransactionsFromWallet, setLoadingTransactions)
    const decoratedCreateTransaction = decorateCustomHookFunction(createTransaction, setAwaitingResponse)
    const decoratedUpdateTransaction = decorateCustomHookFunction(updateTransaction, setAwaitingResponse)
    const decoratedDeleteTransaction = decorateCustomHookFunction(deleteTransaction, setAwaitingResponse)

    return {
        tempTransaction, setTempTransaction,
        transactionsList, clearList,
        getTransactionsFromWallet: decoratedGetTransactionsFromWallet,
        createTransaction: decoratedCreateTransaction,
        updateTransaction: decoratedUpdateTransaction,
        deleteTransaction: decoratedDeleteTransaction,
        walletBalanceAfterLastTransaction,
        loadingTransactions,
        awaitingResponse
    }
}