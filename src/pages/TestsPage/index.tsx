import { DateRangePicker } from './DateRangePicker'
import { TransactionSearchBox } from './TransactionSearchBox'

import React, { useEffect, useState } from 'react'
import { useLocation } from 'react-router-dom'
import { useTransactions } from '../../hooks/useTransactions'
import { useAuthContext } from '../../contexts/Auth'

import styles from "./styles.module.css"
import { useCategories } from '../../hooks/useCategories'
import { useWallets } from '../../hooks/useWallets'
import { ITransaction } from '../../services/types'

import { ITransactionsPageFilters } from '../../prop-defs'

function TestsPage() {
// Route params
    const location = useLocation()
    const urlQuery = new URLSearchParams(location.search)

    const { loggedUser } = useAuthContext()
    const { walletsList } = useWallets()
    const { categoriesList } = useCategories()
    const { transactionsList, getTransactionsFromWallet } = useTransactions()

    const [searchFilters, setSearchFilters] = useState<ITransactionsPageFilters>({
        text: "",
        category: urlQuery.get("category") || "",
        startDate: new Date(Date.now()),
        endDate: new Date(Date.now())
    })

    return (
        <div className={styles.page_container}>
            <h2>Página de testes</h2>

            <div>
                <button onClick={() => { getTransactionsFromWallet(loggedUser!.activeWalletId, searchFilters.startDate.toISOString().slice(0, 10), searchFilters.endDate.toISOString().slice(0, 10)) }}>Atualizar</button>
            </div>

            {/* Transactions table */}
            <div className={styles.transactions_container}>

                <div>
                    {/* <DateRangePicker dateRange={dateRange} setDateRange={setDateRange}/> */}
                    <TransactionSearchBox filters={searchFilters} setFilters={setSearchFilters} />
                </div>

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