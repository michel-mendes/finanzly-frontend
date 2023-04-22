import { useEffect, useState } from "react"
import { useNavigate } from "react-router-dom"
import { IoArrowBack } from "react-icons/io5"
import { RiArrowDropDownFill } from "react-icons/ri"

// Hooks
import { useWallets } from "../../hooks/useWallets"
import { useTransactions } from "../../hooks/useTransactions"

// Components
import { PageHeaderDesktop } from "../../shared_components/PageHeaderDesktop"
import { WalletSelector } from "./WalletSelector"

// Services
import { TransactionsApi } from "../../services/TransactionsApi"

// Interfaces
import { ITransaction, IWallet } from "../../services/types"

import styles from "./styles.module.css"

function TransactionsPage() {
    const navigate = useNavigate()

    const { walletsList } = useWallets()
    const { transactionsList } = useTransactions()
    
    const [activeWallet, setActiveWallet] = useState<IWallet | null>(null)

    // useEffect(() => {
    //     async function getWalletTransactions() {
    //         try {
    //             const transactions = await 
    //         } catch (error: any) {
    //             alert(`Erro ao atualizar lista de transações:\n\n${error}`)
    //         }
    //     }
    // }, [activeWallet])

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
                transactionsList.map(transaction => {
                    return (
                        <div key={transaction.id}>
                            <p>{transaction.description}</p>
                        </div>
                    )
                })
            }
        </div>
    )
}

export { TransactionsPage }