import React, { useEffect, useState } from 'react'
import { useTransactions } from '../../hooks/useTransactions'
import { useAuthContext } from '../../contexts/Auth'

function TestsPage() {
    const { loggedUser } = useAuthContext()
    const { transactionsList, getTransactionsFromWallet } = useTransactions()
    const [startDate, setStartDate] = useState( new Date(Date.now()).toJSON().slice(0, 10) )
    const [endDate, setEndDate] = useState( new Date(Date.now()).toJSON().slice(0, 10) )
    
    return (
        <div>
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

            <table>
                <thead>
                    <tr>
                        <td>Data</td>
                        <td>Descrição</td>
                        <td>Valor</td>
                    </tr>
                </thead>

                <tbody>
                    {
                        transactionsList.map(item => {
                            return (
                                <tr itemID={item.id}>
                                    <td>{new Date(item.date!).toLocaleDateString()}</td>
                                    <td>{item.description}</td>
                                    <td>{item.value}</td>
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