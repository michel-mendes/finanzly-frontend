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
            {
                transactionsList.map((transaction, index) => {
                    const category = categoriesList.find(item => { return (item.id == transaction.fromCategory) })

                    return (
                        <div key={transaction.id} onClick={() => {handleListItemClick(transaction)}}>
                            <p>Transação número: {index + 1}</p>
                            <p>Data: {new Date(transaction.date!).toLocaleDateString()}</p>
                            <p>Descrição: {transaction.description}</p>
                            <p>Valor: {transaction.value}</p>
                            <p>{category?.transactionType}</p>
                            <p>Descrição Upper: {transaction.description_Upper}</p>
                        </div>
                    )
                })
            }

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