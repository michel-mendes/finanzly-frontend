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
            <div className={styles.transactions_container}>

                <div className={styles.table_container}>
                    <table>
                        {/* Table header / columns */}
                        <thead>
                            <tr>
                                <th>Descrição</th>
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
                            <tr key={transaction.id}>

                                <td className={styles.description_cell}>
                                    <span>
                                        <img src={myCategory?.iconPath} alt="" style={{ width: "16px", height: "16px" }} />
                                        <span>{transaction.description}</span>
                                        {
                                            transaction.extraInfo && <span className={styles.extra_info}> ( {transaction.extraInfo} )</span>
                                        }
                                    </span>
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
        const wallet = walletsList.find(myWallet => { return (myWallet.id == loggedUser?.activeWalletId) })
        const { totalIncomes, totalExpenses } = sumTotalIncomesAndExpenses(transactionsList)

        return (
            <>
                <div className={styles.footer_transactions_counter}>
                    <span>Qtd transações: {transactionsList.length}</span>
                </div>

                <div className={styles.footer_total_values}>
                    <span>
                        <span>Total recebimentos</span>
                        <span>{wallet && wallet.currencySymbol} {totalIncomes.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</span>
                    </span>

                    <span>
                        <span>Total pagamentos</span>
                        <span>{wallet && wallet.currencySymbol} {totalExpenses.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</span>
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

export { TestsPage }