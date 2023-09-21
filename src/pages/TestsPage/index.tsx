import React, { useEffect, useState } from 'react'
import { useTransactions } from '../../hooks/useTransactions'
import { useAuthContext } from '../../contexts/Auth'

import styles from "./styles.module.css"
import { useCategories } from '../../hooks/useCategories'

function TestsPage() {
    const { loggedUser } = useAuthContext()
    const { transactionsList, getTransactionsFromWallet } = useTransactions()
    const { categoriesList } = useCategories()
    const [startDate, setStartDate] = useState( new Date(Date.now()).toJSON().slice(0, 10) )
    const [endDate, setEndDate] = useState( new Date(Date.now()).toJSON().slice(0, 10) )
    
    return (
        <div className={styles.page_container}>
            <br />
            <br />
            <h2>Página de testes</h2>

            <div>
                <span>
                    <span>Data Inicial</span>
                    <input type="date" name="" id="" onChange={(value) => {setStartDate(value.currentTarget.value)}} value={startDate} />
                </span>

                <span>
                    <span>Data final</span>
                    <input type="date" name="" id="" onChange={(value) => {setEndDate(value.currentTarget.value)}} value={endDate} />
                </span>
                <br />
                <button onClick={() => {getTransactionsFromWallet(loggedUser!.activeWalletId, startDate, endDate)}}>Atualizar</button>
            </div>

            {/* Transactions table */}
            <table style={{width: "95%", border: "black 1px solid"}}>
                <thead>
                    <tr>
                        <td><span> </span></td>
                        <td>Descrição</td>
                        <td>Categoria</td>
                        <td>Data</td>
                        <td>Valor</td>
                    </tr>
                </thead>

                <tbody>
                    {
                        transactionsList.map(transaction => {
                            const myCategory = categoriesList.find(category => {return (category.id == transaction.fromCategory)})

                            return (
                                <tr itemID={transaction.id}>
                                    <td>
                                        <img src={myCategory?.iconPath} alt="" style={{width: "16px", height: "16px"}} />
                                    </td>

                                    <td style={{display: "flex", flexDirection: "row", justifyContent: "left", alignItems: "center", gap: "8px"}}>
                                        <span>{transaction.description}</span>
                                    </td>

                                    <td>
                                        <span>{myCategory && myCategory.categoryName}</span>
                                    </td>

                                    <td>
                                        <span>{new Date(transaction.date!).toLocaleDateString()}</span>
                                    </td>
                                    
                                    <td>
                                        <span>{Number(transaction.value).toLocaleString(undefined, {minimumFractionDigits: 2, maximumFractionDigits: 2})}</span>
                                    </td>
                                </tr>
                            )
                        })
                    }
                </tbody>
            </table>
        </div>
    )
}

export { TestsPage }