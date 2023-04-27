import { useEffect, useState } from "react"
import { useNavigate } from "react-router-dom"
import { IoArrowBack } from "react-icons/io5"
import { RiArrowDropDownFill } from "react-icons/ri"

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
    const {loggedUser} = useAuthContext()
    const navigate = useNavigate()

    const { walletsList } = useWallets()
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
    const [isEditing, setIsEditing] = useState(false)
    
    const [activeWallet, setActiveWallet] = useState<IWallet | null>(null)

    useEffect(() => {
        
        (!activeWallet) ? clearTransactionsList() : getTransactionsFromWallet(activeWallet.id!)

    }, [activeWallet])

    function handleNewTransactionClick() {
        setIsEditing(false)
        setDraftTransaction({
            fromUser: loggedUser?.id,
            fromWallet: activeWallet?.id,
        })

        showModal()
    }

    function handleListItemClick(transaction: ITransaction) {
        setIsEditing(true)
        setDraftTransaction(transaction)

        showModal()
    }
    
    async function handleSaveButtonClick() {
        const success = (isEditing) ? await updateTransaction(draftTransaction!) : await newTransaction(draftTransaction!)

        if (success) {
            alert("Transação adicionada com sucesso")
            closeModal()
        }
    }

    async function handleDeleteButtonClick(transaction: ITransaction) {
        const success = await deleteTransaction(transaction)

        if (success) {
            alert("Transação removida com sucesso")
            closeModal()
        }
    }

    useEffect(() => {
        const groups: IGroupedTransactions = {}

        transactionsList.forEach(transaction => {
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

                    <button onClick={handleNewTransactionClick} disabled={activeWallet === null}>Nova transação</button>
                </div>
            </PageHeaderDesktop>

            <p>Transações</p>

            <ul className={styles.list}>
                {
                    Object.keys(groupedTransactions).map(groupName => (
                        <div key={groupName} className={styles.group_container}>
                            <span>Data: {new Date(groupName).toLocaleDateString()}, Qtde transações: {groupedTransactions[groupName].length}</span>

                            {
                                groupedTransactions[groupName].map((transaction, index) => {
                                    const category = categoriesList.find(item => { return (item.id == transaction.fromCategory) })

                                    return (
                                        <li key={transaction.id}>
                                            <span>Descrição: {transaction.description}</span>
                                            <span>Valor: {transaction.value}</span>
                                            <span>{category?.transactionType == "C" ? "Receita" : "Despesa"}</span>
                                            <span>Descrição Upper: {transaction.description_Upper}</span>
                                        </li>
                                    )
                                })
                            }
                        </div>
                    ))
                }
            </ul>

            <ModalSaveCancel
                isOpen={isOpen}
                modalTitle="Nova transação" 
                modalButtons={{
                    saveButton: {onClick: handleSaveButtonClick},
                    cancelButton: {onClick: closeModal},
                    deleteButton: {
                        onClick: () => {handleDeleteButtonClick(draftTransaction!)},
                        enabled: isEditing
                    }
                }}
            >
                <FormTransactionCRUD transactionData={draftTransaction} setTransactionData={setDraftTransaction} categoriesList={categoriesList}/>
            </ModalSaveCancel>
        </div>
    )
}

export { TransactionsPage }