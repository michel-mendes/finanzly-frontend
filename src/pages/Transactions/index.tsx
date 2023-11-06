import { TransactionSearchBox } from './TransactionSearchBox'

import { useEffect, useState } from 'react'
import { useLocation } from 'react-router-dom'
import { useTransactions } from '../../hooks/useTransactions'
import { useAuthContext } from '../../contexts/Auth'
import moment from 'moment'

import styles from "./styles.module.css"
import { useCategories } from '../../hooks/useCategories'
import { useWallets } from '../../hooks/useWallets'
import { ITransaction } from '../../type-defs'

import { ITransactionsPageFilters, useTransactionEditorModalHookProps } from '../../type-defs'
import { sortArrayOfObjects } from '../../helpers/helpers'
import {CiImport} from "react-icons/ci"

import { useModal } from '../../hooks/useModal'
import { ModalSaveCancel } from '../../components/Modal'
import { FormTransactionCRUD } from '../../components/FormTransactionCRUD'

import { useToastNotification } from '../../hooks/useToastNotification'


function TransactionsPage() {
    // Route params
    const location = useLocation()
    const urlQuery = new URLSearchParams(location.search)

    const { loggedUser } = useAuthContext()
    const { walletsList, updateWalletBalance } = useWallets()
    const { categoriesList } = useCategories()
    const { transactionsList, getTransactionsFromWallet, clearList, updateTransaction, createTransaction, deleteTransaction, tempTransaction, setTempTransaction, walletBalanceAfterLastTransaction } = useTransactions()

    const transactionModal = useTransactionEditorModal({
        updateWalletBalance,
        categoriesList,
        tempTransaction,
        setTempTransaction,
        createTransaction,
        updateTransaction,
        deleteTransaction,
        walletBalanceAfterLastTransaction
    })
    
    const [searchFilters, setSearchFilters] = useState<ITransactionsPageFilters>( setInitialFilterValues() )
    
    const [filteredAndSortedTransactions, setFilteredAndSortedTransactions] = useState<Array<ITransaction>>([])

    
    // Filter and sort transactions everytime "transactionsList" and/or "searchFilters" changes
    useEffect(filterAndSortTransactions, [transactionsList, searchFilters])

    // Refreshes transactions list everytime the user changes the active wallet or search filters
    useEffect(refreshTransactionList, [searchFilters])

    return (
        <div className={styles.page_container}>

            {/* Transactions table */}
            <div className={styles.transactions_container}>

                <div className={styles.toolbar}>
                    <TransactionSearchBox
                        filters={searchFilters}
                        setFilters={setSearchFilters}
                        walletsList={walletsList}
                        onSearchButtonClick={() => {}}
                        customWidth={"80%"}
                    />

                    <button className='btn btn-normal' onClick={transactionModal.handleCreateNewTransaction}>Nova transação</button>
                </div>

                <div className={styles.table_container}>
                    <table>
                        {/* Table header / columns */}
                        <thead>
                            <tr>
                                <th colSpan={2}>Descrição</th>
                                <th>Categoria</th>
                                <th>Data</th>
                                <th>Valor</th>
                            </tr>
                        </thead>

                        <tbody>
                            {renderTableTransactions()}
                        </tbody>
                    </table>
                </div>

                <div className={styles.transactions_container_footer}>
                    {renderTableFooter()}
                </div>
            </div>

            {
                transactionModal.renderModalComponent()
            }

        </div>
    )


    // Page helper functions
    function filterAndSortTransactions() {
        const filteredTransactions = transactionsList.filter((transaction) => {
            const categoryName = categoriesList.find((category) => {return (category.id == transaction.fromCategory)})?.categoryName?.toUpperCase() || ""
            const description = transaction.description?.toUpperCase() || ""
            const extraInfo = transaction.extraInfo?.toUpperCase() || ""

            const searchText = searchFilters.text.toUpperCase()
            const searchCategory = searchFilters.category.toUpperCase()

            // Filter transactions that contains description, extraInfo and categoryName
            if ((description.includes(searchText) || extraInfo.includes(searchText)) && categoryName.includes(searchCategory)) {
                return transaction
            }
        })

        // Sort the list by date
        const sortedTransactions = sortArrayOfObjects<ITransaction>(filteredTransactions, "date", false)

        setFilteredAndSortedTransactions(sortedTransactions)
    }

    function setInitialFilterValues(): ITransactionsPageFilters {
        // Gets "startDate" and "endDate" from URL Query String OR sets to first and last day of current month
        const startDate = (urlQuery.get("startDate")) ? moment(urlQuery.get("startDate")).startOf('day').toDate() : moment(new Date).startOf("month").startOf('day').toDate()
        const endDate = (urlQuery.get("endDate")) ? moment(urlQuery.get("endDate")).startOf('day').toDate() : moment(new Date).endOf("month").startOf("day").toDate()
        const category = urlQuery.get("category") || ""
        const userActiveWallet = loggedUser?.activeWallet || null

        return { wallet: userActiveWallet, text: "", category, startDate, endDate }
    }

    function refreshTransactionList() {
        if (searchFilters.wallet) {
            const startDate = searchFilters.startDate.toISOString().slice(0, 10)
            const endDate = searchFilters.endDate.toISOString().slice(0, 10)
            const wallet = searchFilters.wallet.id!

            getTransactionsFromWallet(wallet, startDate, endDate)
        }
        else {
            clearList()
        }
    }

    function renderTableTransactions() {
        return (
            <>
                {
                    filteredAndSortedTransactions.map(transaction => {
                        const wallet = walletsList.find(myWallet => { return (myWallet.id == transaction.fromWallet) })
                        const myCategory = categoriesList.find(category => { return (category.id == transaction.fromCategory) })

                        return (

                            // Transaction row
                            <tr key={transaction.id} onClick={() => {transactionModal.handleEditExistingTransaction(transaction)}}>

                                <td className={styles.description_cell}>
                                    <span>
                                        <img src={myCategory?.iconPath} alt="" style={{ width: "16px", height: "16px" }} />
                                        <span>{transaction.description}</span>
                                        {
                                            transaction.extraInfo && <span className={styles.extra_info}> ( {transaction.extraInfo} )</span>
                                        }
                                    </span>
                                </td>

                                <td className={styles.imported_transaction_cell}>
                                    <span>{transaction.importedTransaction && <CiImport />}</span>
                                </td>
                                
                                <td className={styles.category_cell}>
                                    <span>{myCategory?.categoryName}</span>
                                </td>

                                <td className={styles.date_cell}>
                                    <span>{new Date(transaction.date!).toLocaleDateString()}</span>
                                </td>

                                <td className={styles.value_cell} category-type={myCategory?.transactionType}>
                                    <span>
                                        <span>{wallet?.currencySymbol}</span>
                                        <span>{Number(transaction.value).toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</span>
                                    </span>
                                </td>

                            </tr>
                        )
                    })
                }
            </>
        )
    }

    function renderTableFooter() {
        const wallet = loggedUser?.activeWallet
        const { totalIncomes, totalExpenses } = sumTotalIncomesAndExpenses(filteredAndSortedTransactions)

        return (
            <>
                <div className={styles.footer_transactions_counter}>
                    <span>Qtd transações: {filteredAndSortedTransactions.length}</span>
                </div>

                <div className={styles.footer_total_values}>
                    <span>
                        <span>Total recebimentos</span>
                        <span className={styles.total_incomes}>{wallet && wallet.currencySymbol} {Number(totalIncomes).toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</span>
                    </span>

                    <span>
                        <span>Total pagamentos</span>
                        <span className={styles.total_expenses}>{wallet && wallet.currencySymbol} {Number(totalExpenses).toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</span>
                    </span>
                </div>
            </>
        )
    }
}


// Helper functions
function sumTotalIncomesAndExpenses(transactionsList: Array<ITransaction>) {
    let totalIncomes = 0
    let totalExpenses = 0

    for (const transaction of transactionsList) {
        totalIncomes += Number(transaction.creditValue!)
        totalExpenses += Number(transaction.debitValue!)
    }

    return { totalIncomes, totalExpenses }
}

function useTransactionEditorModal({updateWalletBalance, categoriesList, tempTransaction, setTempTransaction, updateTransaction, createTransaction, deleteTransaction, walletBalanceAfterLastTransaction}: useTransactionEditorModalHookProps) {
    const { loggedUser } = useAuthContext()

    const {showSuccessNotification} = useToastNotification()
    
    const {isOpen, closeModal, showModal} = useModal()
    const [modalState, setModalState] = useState({
        title: "",
        isEditing: false,
        transactionValuesHasChanged: false
    })

    function handleCreateNewTransaction() {
        setModalState({
            ...modalState,
            title: "Nova transação",
            isEditing: false
        })

        setTempTransaction({
            fromUser: loggedUser?.id,
            fromWallet: loggedUser!.activeWallet?.id,
        })

        showModal()
    }

    function handleEditExistingTransaction(transaction: ITransaction) {
        setModalState({
            ...modalState,
            title: "Alterando transação",
            isEditing: true
        })

        setTempTransaction({ ...transaction })
        showModal()
    }
    
    async function handleModalSaveButtonClick() {
        const success = (modalState.isEditing) ? await updateTransaction(tempTransaction?.id!, tempTransaction!) : await createTransaction(tempTransaction!)

        if (success) {
            const successMessage = (modalState.isEditing) ? "Os dados da transação foram alterados" : "A transação foi adicionada à lista"

            showSuccessNotification(successMessage)
            updateWalletBalance(tempTransaction?.fromWallet!, walletBalanceAfterLastTransaction)
            setTempTransaction(null)
            closeModal()
        }
    }

    async function handleModalDeleteButtonClick(transaction: ITransaction) {
        const success = await deleteTransaction(transaction.id!)

        if (success) {
            showSuccessNotification("A transação foi removida")
            updateWalletBalance(tempTransaction?.fromWallet!, walletBalanceAfterLastTransaction)
            setTempTransaction(null)
            closeModal()
        }
    }

    function renderModalComponent() {
        return (
            <ModalSaveCancel
                isOpen={isOpen}
                modalTitle={modalState.title}
                modalButtons={{
                    saveButton: {
                        onClick: handleModalSaveButtonClick,
                        enabled: modalState.transactionValuesHasChanged
                    },
                    cancelButton: { onClick: closeModal },
                    deleteButton: {
                        onClick: () => { handleModalDeleteButtonClick(tempTransaction!) },
                        enabled: modalState.isEditing
                    }
                }}
            >
                <FormTransactionCRUD
                    transactionData={tempTransaction}
                    setTransactionData={setTempTransaction}
                    setTransactionValuesHasChanged={(value: boolean) => { setModalState({ ...modalState, transactionValuesHasChanged: value }) }}
                    categoriesList={categoriesList}
                />
            </ModalSaveCancel>
        )
    }

    return {isOpen, closeModal, showModal, modalState, setModalState, handleCreateNewTransaction, handleEditExistingTransaction, renderModalComponent}
}

export { TransactionsPage }