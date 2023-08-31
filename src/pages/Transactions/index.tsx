import moment from "moment"
import { useEffect, useState, Dispatch, SetStateAction } from "react"
import { useNavigate } from "react-router-dom"
import { IoArrowBack } from "react-icons/io5"
import { RiArrowDropDownFill } from "react-icons/ri"
import { getFullDateName_PtBr, sortArrayOfObjects } from "../../helpers/helpers"

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

// Interfaces
import { ITransaction, IWallet } from "../../services/types"
interface IGroupedTransactions {
    [key: string]: ITransaction[]
}

import styles from "./styles.module.css"
import { FormTransactionCRUD } from "../../shared_components/FormTransactionCRUD"

function TransactionsPage() {
    const { loggedUser } = useAuthContext()
    const navigate = useNavigate()

    const { walletsList, setWalletsList } = useWallets()
    const { categoriesList } = useCategories()
    const {
        transactionsList,
        draftTransaction,
        setDraftTransaction,
        getTransactionsFromWallet,
        newTransaction,
        updateTransaction,
        deleteTransaction,
        clearTransactionsList
    } = useTransactions()

    const [groupedTransactions, setGroupedTransactions] = useState<IGroupedTransactions>({})

    const { isOpen, showModal, closeModal } = useModal()
    const [modalTitle, setModalTitle] = useState("")
    const [isEditing, setIsEditing] = useState(false)
    const [transactionValuesHasChanged, setTransactionValuesHasChanged] = useState(false)

    const [activeWallet, setActiveWallet] = useState<IWallet | null>(null)

    function handleNewTransactionClick() {
        setModalTitle("Nova transação")
        setIsEditing(false)
        setDraftTransaction({
            fromUser: loggedUser?.id,
            fromWallet: activeWallet?.id,
        })

        showModal()
    }

    function handleListItemClick(transaction: ITransaction) {
        setModalTitle("Alterando transação")
        setIsEditing(true)
        setDraftTransaction(transaction)

        showModal()
    }

    async function handleSaveButtonClick() {
        const success = (isEditing) ? await updateTransaction(draftTransaction!) : await newTransaction(draftTransaction!)

        if (success) {
            // alert("Transação adicionada com sucesso")
            updateWalletBalance(success.fromWallet!, success.currentWalletBalance!, walletsList, setWalletsList, setActiveWallet)
            closeModal()
        }
    }

    async function handleDeleteButtonClick(transaction: ITransaction) {
        const success = await deleteTransaction(transaction)

        if (success) {
            updateWalletBalance(success.fromWallet!, success.currentWalletBalance!, walletsList, setWalletsList, setActiveWallet)
            closeModal()
        }
    }

    useEffect(() => {

        (!activeWallet) ? clearTransactionsList() : getTransactionsFromWallet(activeWallet.id!)

    }, [activeWallet])
    
    useEffect(() => {
        const groups: IGroupedTransactions = {}
        const sortedTransactionsList = sortArrayOfObjects<ITransaction>(transactionsList, "date", false)

        sortedTransactionsList.forEach(transaction => {
            const date = String(transaction.date);

            (!groups[date]) ? groups[date] = [] : null

            groups[date].push(transaction)
        })

        setGroupedTransactions(groups)
    }, [transactionsList])

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

                    <button onClick={() => {navigate(`/import?wallet=${activeWallet?.id}`)}}>Importar extrato</button>
                    <button onClick={handleNewTransactionClick} disabled={activeWallet === null}>Nova transação</button>
                </div>
            </PageHeaderDesktop>

            <p>Transações</p>

            <ul className={styles.list}>
                {
                    Object.keys(groupedTransactions).map(groupName => {
                        const transactions = groupedTransactions[groupName]

                        const transactionDate = new Date( Number(groupName) )
                        const groupIncomes = transactions.map(transaction => { return transaction.creditValue }).reduce((actual, current, index) => { return Number(actual) + Number(current) }, 0)!
                        const groupOutcomes = transactions.map(transaction => { return transaction.debitValue }).reduce((actual, current, index) => { return Number(actual) + Number(current) }, 0)!
                        const groupBalance = groupIncomes - groupOutcomes
                        const balanceSignal = (groupBalance >= 0) ? "+" : ""

                        return (
                            <div key={groupName} className={styles.group_container}>
                                <div className={styles.group_header}>
                                    <div className={styles.date_container}>
                                        <span className={styles.day_number_container}>{transactionDate.getDate()}</span>
                                        <span>
                                            <span>{getFullDateName_PtBr(transactionDate).dayName}</span>
                                            <span>de {getFullDateName_PtBr(transactionDate).monthName} de {getFullDateName_PtBr(transactionDate).yearNumber}</span>
                                        </span>
                                    </div>

                                    {/* <div className={styles.date_balance_container}>
                                        <span>{balanceSignal}{groupBalance.toLocaleString(undefined, { maximumFractionDigits: 2, minimumFractionDigits: 2 })}</span>
                                    </div> */}
                                </div>

                                <div className={styles.group_body}>
                                    {
                                        groupedTransactions[groupName].map((transaction, index) => {
                                            const category = categoriesList.find(item => { return (item.id == transaction.fromCategory) })
                                            const operatorSignal = (category?.transactionType == "C") ? "+" : "-"

                                            return (
                                                <li key={transaction.id} className={styles.item}>
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

                                                    <div className={styles.item_content} onClick={() => {handleListItemClick(transaction)}}>
                                                        <div className={styles.item_icon}>
                                                            <img src={category?.iconPath} alt="" />
                                                        </div>

                                                        <div className={styles.item_data}>
                                                            <p>
                                                                <span className={styles.transaction_category_name}>{category?.categoryName}</span>
                                                                <span className={styles.transaction_value} transaction-type={category?.transactionType}>{operatorSignal}{activeWallet?.currencySymbol} {Number(transaction.value).toLocaleString(undefined, {maximumFractionDigits: 2, minimumFractionDigits: 2})}</span>
                                                            </p>

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
                modalTitle={modalTitle}
                modalButtons={{
                    saveButton: {
                        onClick: handleSaveButtonClick,
                        enabled: transactionValuesHasChanged
                    },
                    cancelButton: { onClick: closeModal },
                    deleteButton: {
                        onClick: () => { handleDeleteButtonClick(draftTransaction!) },
                        enabled: isEditing
                    }
                }}
            >
                <FormTransactionCRUD
                    transactionData={draftTransaction}
                    setTransactionData={setDraftTransaction}
                    setTransactionValuesHasChanged={setTransactionValuesHasChanged}
                    categoriesList={categoriesList}
                />
            </ModalSaveCancel>
        </div>
    )
}

function updateWalletBalance(walletId: string, newBalance: number, walletList: IWallet[], setWalletList: Dispatch<SetStateAction<IWallet[]>>, setActiveWalletList: Dispatch<SetStateAction<IWallet | null>>) {
    const wallet = walletList.find(item => {return item.id == walletId})
    wallet!.actualBalance = newBalance

    const newList = walletList.map(item => {
        return (item.id == wallet!.id) ? wallet! : item
    })

    setActiveWalletList(wallet!)
    setWalletList(newList)
}

export { TransactionsPage }