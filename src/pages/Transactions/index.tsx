import { useEffect, useState, Dispatch, SetStateAction, useRef } from "react"
import { useNavigate, useLocation } from "react-router-dom"
import { IoArrowBack } from "react-icons/io5"
import { getFullDateName_PtBr, sortArrayOfObjects } from "../../helpers/helpers"
import moment from "moment"

// Authentication context
import { useAuthContext } from "../../contexts/Auth"

// Hooks
import { useWallets } from "../../hooks/useWallets"
import { useCategories } from "../../hooks/useCategories"
import { useTransactions } from "../../hooks/useTransactions"
import { useModal } from "../../hooks/useModal"

// Components
import { PageHeaderDesktop } from "../../shared_components/PageHeaderDesktop"
import { WalletSelector } from "./WalletSelector"
import { ModalSaveCancel } from "../../shared_components/Modal"
import { FormTransactionCRUD } from "../../shared_components/FormTransactionCRUD"
import { LoadingOverlay } from "../../shared_components/LoadingPageOverlay"

// Interfaces
import { ITransaction, IWallet } from "../../services/types"
interface IGroupedTransactions {
    [key: string]: ITransaction[]
}
interface ITransactionsPageFilters {
    text: string,
    category: string,
    startDate: string,
    endDate: string
}

import styles from "./styles.module.css"



function TransactionsPage() {
    // Route params
    const location = useLocation()
    const urlQuery = new URLSearchParams(location.search)

    // Get user data
    const { loggedUser } = useAuthContext()
    const navigate = useNavigate()

    // CRUD Hooks
    const { walletsList, setWalletsList } = useWallets()
    const { categoriesList } = useCategories()
    const {
        loadingTransactions,
        transactionsList,
        draftTransaction,
        setDraftTransaction,
        getTransactionsFromWallet,
        newTransaction,
        updateTransaction,
        deleteTransaction,
        clearTransactionsList } = useTransactions()

    
    // The list to be rendered in the page
    const [groupedTransactions, setGroupedTransactions] = useState<IGroupedTransactions>({})
    
    // Wallet list where the user can swap active wallets
    const [activeWallet, setActiveWallet] = useState<IWallet | null>(null)

    // Search filters
    const [filters, setFilters] = useState<ITransactionsPageFilters>({
        text: "",
        category: urlQuery.get("category") || "",
        startDate: "",
        endDate: ""
    })

    // Previous dates filters observers, used in order to get date changes by user
    const refStartDate = useRef(filters.startDate)
    const refEndDate = useRef(filters.endDate)

    // Get the filters inputs
    const refFilterDescriptionInput = useRef<HTMLInputElement>(null)
    const refFilterCategoryInput = useRef<HTMLInputElement>(null)
    const refFilterStartDateInput = useRef<HTMLInputElement>(null)
    const refFilterEndDateInput = useRef<HTMLInputElement>(null)

    // CRUD Modal management
    const { isOpen, showModal, closeModal } = useModal()
    const [modalState, setModalState] = useState({
        title: "",
        isEditing: false,
        transactionValuesHasChanged: false
    })



    // Sets the filters values on page load
    useEffect(setInitialFilterValues, [])

    // Sort and group transactions based in the filters changes
    useEffect(sortAndGroupTransactionsList, [transactionsList, filters])

    // Clear or render the list everytime the conditions changes. The conditions are "selected wallet", "start date" and "end date"
    useEffect(refreshTransactionList, [activeWallet, filters])

    return (
        <div className={styles.page_container}>

            <PageHeaderDesktop>
                <div className={styles.header_content}>
                    <div className={styles.left_toolbar}>
                        <i onClick={() => { navigate("/dashboard") }}><IoArrowBack /></i>

                        <WalletSelector
                            walletsList={walletsList}
                            selectedWallet={activeWallet}
                            setSelectedWallet={setActiveWallet}
                        />
                    </div>

                    <button onClick={() => { navigate(`/import?wallet=${activeWallet?.id}`) }}>Importar extrato</button>
                    <button onClick={handleNewTransactionClick} disabled={activeWallet === null}>Nova transação</button>
                </div>
            </PageHeaderDesktop>

            <p>Transações</p>
            <div>
                <input type="text" name="" id="" ref={refFilterDescriptionInput} placeholder="Encontre pela descrição" /><br />
                <input type="text" name="" id="" ref={refFilterCategoryInput} placeholder="Encontre pela categoria" /><br />
                <input type="date" name="" id="" ref={refFilterStartDateInput} />
                <input type="date" name="" id="" ref={refFilterEndDateInput} />
                <button onClick={() => {
                    setFilters({
                        text: refFilterDescriptionInput.current?.value || "",
                        category: refFilterCategoryInput.current?.value || "",
                        startDate: refFilterStartDateInput.current?.value || "",
                        endDate: refFilterEndDateInput.current?.value || ""
                    })
                }}
                >Atualizar</button>
            </div>

            {/* Transactions list */}
            <ul className={styles.list}>
                {
                    (loadingTransactions) ? (<LoadingOverlay />) : Object.keys(groupedTransactions).map(groupName => {
                        const transactionDate = new Date(Number(groupName))

                        /*
                        // Group balance value
                        const transactions = groupedTransactions[groupName]
                        const groupIncomes = transactions.map(transaction => { return transaction.creditValue }).reduce((actual, current, index) => { return Number(actual) + Number(current) }, 0)!
                        const groupOutcomes = transactions.map(transaction => { return transaction.debitValue }).reduce((actual, current, index) => { return Number(actual) + Number(current) }, 0)!
                        const groupBalance = groupIncomes - groupOutcomes
                        const balanceSignal = (groupBalance >= 0) ? "+" : ""
                        */

                        return (
                            <div key={groupName} className={styles.group_container}>

                                {/* Group container */}
                                <div className={styles.group_header}>

                                    {/* Date container, here will be shown the group date */}
                                    <div className={styles.date_container}>
                                        <span className={styles.day_number_container}>{transactionDate.getDate()}</span>
                                        <span>
                                            <span>{getFullDateName_PtBr(transactionDate).dayName}</span>
                                            <span>de {getFullDateName_PtBr(transactionDate).monthName} de {getFullDateName_PtBr(transactionDate).yearNumber}</span>
                                        </span>
                                    </div>

                                    {/*
                                    
                                    //Group balance value container
                                    <div className={styles.date_balance_container}>
                                        <span>{balanceSignal}{groupBalance.toLocaleString(undefined, { maximumFractionDigits: 2, minimumFractionDigits: 2 })}</span>
                                    </div>

                                    */}
                                </div>

                                {/* Group body, here will be shown the group transactions */}
                                <div className={styles.group_body}>
                                    {
                                        groupedTransactions[groupName].map((transaction, index) => {
                                            const category = categoriesList.find(item => { return (item.id == transaction.fromCategory) })
                                            const operatorSignal = (category?.transactionType == "C") ? "+" : "-"

                                            return (

                                                // List item
                                                <li key={transaction.id} className={styles.item}>

                                                    {/* Transaction type signal "-" or "+" */}
                                                    <div className={styles.signal_container}>
                                                        <span>
                                                            <i></i>
                                                            <i has-border={(index > 0) ? "true" : "false"}></i>
                                                        </span>

                                                        <span transaction-type={category?.transactionType}>{operatorSignal}</span>

                                                        <span>
                                                            <i></i>
                                                            <i has-border={(index < groupedTransactions[groupName].length - 1) ? "true" : "false"}></i>
                                                        </span>
                                                    </div>


                                                    {/* Transaction data */}
                                                    <div className={styles.item_content} onClick={() => { handleListItemClick(transaction) }}>

                                                        {/* Category icon */}
                                                        <div className={styles.item_icon}>
                                                            <img src={category?.iconPath} alt="" />
                                                        </div>

                                                        <div className={styles.item_data}>

                                                            {/* Category name and transaction value */}
                                                            <p>
                                                                <span className={styles.transaction_category_name}>{category?.categoryName}</span>
                                                                <span className={styles.transaction_value} transaction-type={category?.transactionType}>{operatorSignal}{activeWallet?.currencySymbol} {Number(transaction.value).toLocaleString(undefined, { maximumFractionDigits: 2, minimumFractionDigits: 2 })}</span>
                                                            </p>

                                                            {/* Description and extraInfo (extraInfo only if exists) */}
                                                            <p className={styles.transaction_description}>{transaction.description}</p>
                                                            {
                                                                (!transaction.extraInfo) ? null : (
                                                                    <p className={styles.transaction_extra_info}>{transaction.extraInfo}</p>
                                                                )
                                                            }
                                                        </div>

                                                    </div>
                                                </li>
                                            )
                                        })
                                    }
                                </div>
                            </div>
                        )
                    })
                }
            </ul>

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
                        onClick: () => { handleModalDeleteButtonClick(draftTransaction!) },
                        enabled: modalState.isEditing
                    }
                }}
            >
                <FormTransactionCRUD
                    transactionData={draftTransaction}
                    setTransactionData={setDraftTransaction}
                    setTransactionValuesHasChanged={(value: boolean) => { setModalState({ ...modalState, transactionValuesHasChanged: value }) }}
                    categoriesList={categoriesList}
                />
            </ModalSaveCancel>
        </div>
    )


    // Transactions page helper functions
    function setInitialFilterValues() {
        const tempStartDate = urlQuery.get("startDate") || moment(new Date).startOf("month").toJSON().slice(0, 10)
        const tempEndDate = urlQuery.get("endDate") || moment(new Date).endOf("month").startOf("day").toJSON().slice(0, 10)

        setFilters({ ...filters, startDate: tempStartDate, endDate: tempEndDate })

        if (refFilterCategoryInput.current) {
            refFilterCategoryInput.current.value = urlQuery.get("category") || ""
        }

        if (refFilterStartDateInput.current && refFilterEndDateInput.current) {
            refFilterStartDateInput.current.value = tempStartDate
            refFilterEndDateInput.current.value = tempEndDate
        }
    }

    function sortAndGroupTransactionsList() {
        const groups: IGroupedTransactions = {}

        // Filter the list according to the search params
        const filteredTransactions = transactionsList.filter(transaction => {
            const categoryName = categoriesList.find(category => { return (category.id == transaction.fromCategory) })?.categoryName?.toUpperCase() || ""
            const description = transaction.description?.toUpperCase() || ""
            const extraInfo = transaction.extraInfo?.toUpperCase() || ""
            const query = filters.text.toUpperCase()
            const categoryQuery = filters.category.toUpperCase()

            if ((description.includes(query) || extraInfo.includes(query)) &&
                (categoryName.includes(categoryQuery))) return transaction
        })

        // Sort the list by date
        const sortedTransactionsList = sortArrayOfObjects<ITransaction>(filteredTransactions, "date", false)

        // Group the list by date
        sortedTransactionsList.forEach(transaction => {
            const date = String(transaction.date);

            (!groups[date]) ? groups[date] = [] : null

            groups[date].push(transaction)
        })

        setGroupedTransactions(groups)
    }

    function refreshTransactionList() {
        if (activeWallet) {
            const prevStartDate = refStartDate.current
            const prevEndDate = refEndDate.current

            refStartDate.current = filters.startDate
            refEndDate.current = filters.endDate

            if (prevStartDate !== filters.startDate || prevEndDate !== filters.endDate) {
                getTransactionsFromWallet(activeWallet.id!, filters.startDate, filters.endDate)
            }

        } else {
            clearTransactionsList()
        }
    }

    function updateWalletBalance(walletId: string, newBalance: number) {
        const wallet = walletsList.find(item => { return item.id == walletId })
        wallet!.actualBalance = newBalance

        const newList = walletsList.map(item => {
            return (item.id == wallet!.id) ? wallet! : item
        })

        setActiveWallet(wallet!)
        setWalletsList(newList)
    }

    function handleNewTransactionClick() {
        setModalState({
            ...modalState,
            title: "Nova transação",
            isEditing: false
        })

        setDraftTransaction({
            fromUser: loggedUser?.id,
            fromWallet: activeWallet?.id,
        })

        showModal()
    }

    function handleListItemClick(transaction: ITransaction) {
        setModalState({
            ...modalState,
            title: "Alterando transação",
            isEditing: true
        })

        setDraftTransaction({ ...transaction })

        showModal()
    }

    async function handleModalSaveButtonClick() {
        const success = (modalState.isEditing) ? await updateTransaction(draftTransaction!) : await newTransaction(draftTransaction!)

        if (success) {
            // alert("Transação adicionada com sucesso")
            updateWalletBalance(success.fromWallet!, success.currentWalletBalance!)
            closeModal()
        }
    }

    async function handleModalDeleteButtonClick(transaction: ITransaction) {
        const success = await deleteTransaction(transaction)

        if (success) {
            // alert("Transação excluída com sucesso")
            updateWalletBalance(success.fromWallet!, success.currentWalletBalance!)
            closeModal()
        }
    }
}

export { TransactionsPage }