import { useEffect, useState } from "react"
import { useNavigate } from "react-router-dom"
import { IoArrowBack } from "react-icons/io5"
import { RiArrowDropDownFill } from "react-icons/ri"

// Hooks
import { useWallets } from "../../hooks/useWallets"
import { useCategories } from "../../hooks/useCategories"
import { useTransactions } from "../../hooks/useTransactions"

// Components
import { PageHeaderDesktop } from "../../shared_components/PageHeaderDesktop"
import { WalletSelector } from "./WalletSelector"

// Interfaces
import { ITransaction, IWallet } from "../../services/types"

import styles from "./styles.module.css"

function TransactionsPage() {
    const navigate = useNavigate()

    const { walletsList } = useWallets()
    const { categoriesList } = useCategories()
    const { transactionsList, getTransactionsFromWallet, clearTransactionsList } = useTransactions()
    
    const [activeWallet, setActiveWallet] = useState<IWallet | null>(null)

    useEffect(() => {
        
        (!activeWallet) ? clearTransactionsList() : getTransactionsFromWallet(activeWallet.id!)

    }, [activeWallet])

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

                    <button>Nova transação</button>
                </div>
            </PageHeaderDesktop>

            <p>Carteiras</p>
            {
                walletsList.map(wallet => {
                    return (
                        <div key={wallet.id}>
                            <p>{wallet.walletName}</p>
                        </div>
                    )
                })
            }

            <p>Transações</p>
            {
                transactionsList.map((transaction, index) => {
                    const category = categoriesList.find(item => { return (item.id == transaction.fromCategory) })

                    return (
                        <div key={transaction.id}>
                            <p>Transação número: {index + 1}</p>
                            <p>Data: {new Date(transaction.date!).toLocaleDateString()}</p>
                            <p>Descrição: {transaction.description}</p>
                            <p>Valor: {transaction.value}</p>
                            <p>{category?.transactionType}</p>
                        </div>
                    )
                })
            }
        </div>
    )
}

export { TransactionsPage }