import React, { useEffect, useState } from 'react'
import { useTransactions } from '../../hooks/useTransactions'
import { useAuthContext } from '../../contexts/Auth'

import styles from "./styles.module.css"
import { useCategories } from '../../hooks/useCategories'
import { useWallets } from '../../hooks/useWallets'
import { ITransaction } from '../../services/types'

function TestsPage() {
    const { loggedUser } = useAuthContext()
    const { walletsList } = useWallets()
    const { categoriesList } = useCategories()
    const { transactionsList, getTransactionsFromWallet } = useTransactions()
    const [startDate, setStartDate] = useState(new Date(Date.now()).toJSON().slice(0, 10))
    const [endDate, setEndDate] = useState(new Date(Date.now()).toJSON().slice(0, 10))

    return (
        <div className={styles.page_container}>
            <h2>Página de testes</h2>

            <div>
                <span>
                    <span>Data Inicial</span>
                    <input type="date" name="" id="" onChange={(value) => { setStartDate(value.currentTarget.value) }} value={startDate} />
                </span>

                <span>
                    <span>Data final</span>
                    <input type="date" name="" id="" onChange={(value) => { setEndDate(value.currentTarget.value) }} value={endDate} />
                </span>
                <br />
                <button onClick={() => { getTransactionsFromWallet(loggedUser!.activeWalletId, startDate, endDate) }}>Atualizar</button>
            </div>

            {/* Transactions table */}
            <div className={styles.table_container}>

                {/* Table header / columns */}
                <div className={styles.columns_row}>
                    <span>Descrição</span>
                    <span>Categoria</span>
                    <span>Data</span>
                    <span>Valor</span>
                </div>

                {/* Table body */}
                <div className={styles.table_body}>
                    {renderTableTransactions()}
                </div>

                {/* Table footer */}
                <div className={styles.table_footer}>
                    {renderTableFooter()}
                </div>

            </div>

        </div>
    )


    // Page helper functions
    function renderTableTransactions() {
        return (
            <>
                {
                    transactionsList.map(transaction => {
                        const wallet = walletsList.find(myWallet => { return (myWallet.id == transaction.fromWallet) })
                        const myCategory = categoriesList.find(category => { return (category.id == transaction.fromCategory) })

                        return (

                            // Transaction row
                            <div className={styles.row_container}>

                                <div key={transaction.id} className={styles.data_row}>

                                    <span>
                                        <img src={myCategory?.iconPath} alt="" style={{ width: "16px", height: "16px" }} />
                                        <span>{transaction.description}</span>
                                        {
                                            transaction.extraInfo && <span> [{transaction.extraInfo}]</span>
                                        }
                                    </span>
                                    <span>{myCategory?.categoryName}</span>
                                    <span>{new Date(transaction.date!).toLocaleDateString()}</span>
                                    <span category-type={myCategory?.transactionType}>
                                        <span>{wallet?.currencySymbol}</span>
                                        <span>{Number(transaction.value).toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</span>
                                    </span>

                                </div>

                            </div>
                        )
                    })
                }
            </>
        )
    }

    function renderTableFooter() {
        const wallet = walletsList.find(myWallet => { return (myWallet.id == loggedUser?.activeWalletId) })
        const { totalIncomes, totalExpenses } = sumTotalIncomesAndExpenses(transactionsList)

        return (
            <>
                <span>
                    <span># transações: {transactionsList.length}</span>
                </span>

                <span>
                    <span>Total recebimentos: {wallet && wallet.currencySymbol} {totalIncomes.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</span>
                    <span>Total pagamentos: {wallet && wallet.currencySymbol} {totalExpenses.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</span>
                </span>
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

export { TestsPage }