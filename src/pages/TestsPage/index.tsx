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
            <br />
            <br />
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

            <div className={styles.table_container}>

                {/* Transactions table */}
                <table>

                    <thead>
                        <tr>
                            <th><span>#</span></th>
                            <th>Descrição</th>
                            <th>Categoria</th>
                            <th>Data</th>
                            <th colSpan={2}>Valor</th>
                        </tr>
                    </thead>

                    <tbody>
                        {renderTableTransactions()}
                    </tbody>

                    <tfoot>
                        {renderTableFooter()}
                    </tfoot>
                </table>

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
                            <tr key={transaction.id} transaction-type={myCategory?.transactionType}>
                                <td>
                                    <img className={styles.transaction_icon} src={myCategory?.iconPath} alt="" />
                                </td>

                                <td>
                                    <span>{transaction.description}</span>
                                    {
                                        transaction.extraInfo && (
                                            <>
                                                <br />
                                                <span>&emsp;&emsp;</span><span>{transaction.extraInfo}</span>
                                            </>
                                        )
                                    }
                                </td>

                                <td>
                                    <span>{myCategory && myCategory.categoryName}</span>
                                </td>

                                <td>
                                    <span>{new Date(transaction.date!).toLocaleDateString()}</span>
                                </td>

                                <td>
                                    {wallet?.currencySymbol}
                                </td>

                                <td>
                                    <span>{Number(transaction.value).toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</span>
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
            <tr>
                <td colSpan={2}>
                    <span># transações: {transactionsList.length}</span>
                </td>
                <td colSpan={4}>
                    <span>
                        <span>Total recebimentos: {wallet && wallet.currencySymbol} {totalIncomes.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</span>
                        <span>Total pagamentos: {wallet && wallet.currencySymbol} {totalExpenses.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</span>
                    </span>
                </td>
            </tr>
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