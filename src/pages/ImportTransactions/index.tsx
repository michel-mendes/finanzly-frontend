import React, { useState, useRef } from 'react'
import { useNavigate } from 'react-router-dom'
import { IoArrowBack } from 'react-icons/io5'
import moment from 'moment'

import { PageHeaderDesktop } from '../../shared_components/PageHeaderDesktop'

import styles from "./styles.module.css"
import axios from 'axios'

interface IImportedTransactions {
    fromCategory: string;
    fromWallet: string;
    fromUser: string;
    date: Date;
    description: string;
    value: number;
    transactionType: string;
    csvImportId: string;
    transactionAlreadyExists: boolean;
}

function ImportTransactionsPage() {
    const navigate = useNavigate()

    const [transactionsList, setTransactionsList] = useState<IImportedTransactions[]>([])

    const [selectedBank, setSelectedBank] = useState("n/a")
    const selectFileInput = useRef<HTMLInputElement>(null)

    function handleImportBtnClick() {
        if (!selectFileInput.current) return

        if (selectedBank == "n/a") {
            alert("Selecione uma instituição para configurar a importação")
            selectFileInput.current?.focus()
            return
        }

        selectFileInput.current?.click()
    }

    async function sendCsvFile() {
        if (!selectFileInput.current?.files![0]) return

        const formData = new FormData()
        formData.append("walletId", "TesteID")
        formData.append("bank", selectedBank)
        formData.append("csvFile", selectFileInput.current.files[0])

        const resp = await axios.post("http://localhost:3000/api/upload", formData, { withCredentials: true })

        setTransactionsList(resp.data)

        selectFileInput.current.value = ""
    }

    function handleListEditChange(fieldName: keyof IImportedTransactions, value: string | number, transaction: IImportedTransactions) {

        if (fieldName == "date") {
            value = moment(value).startOf("day").toDate().toISOString()
        }

        setTransactionsList((prevTransactionsList) => {

            return prevTransactionsList.map(prevTransaction => {
                return (prevTransaction.csvImportId == transaction.csvImportId)
                    ? { ...prevTransaction, [fieldName]: value }
                    : prevTransaction
            })

        })

    }

    return (
        <div className={styles.page_container}>
            <PageHeaderDesktop>
                <div className={styles.header_content}>
                    <i onClick={() => { navigate("/dashboard") }}>{<IoArrowBack />}</i>

                    <div className={styles.button_container}>
                        <div className={styles.select}>
                            <select onChange={(e) => { setSelectedBank(e.target.value) }} value={selectedBank || ""}>
                                <option value="n/a">Selecione uma instituição bancária</option>
                                <option value="bb">Banco do Brasil</option>
                                <option value="cef">Caixa Econômica Federal</option>
                                <option value="inter-mobile">Banco Inter App</option>
                                <option value="inter-web">Banco Inter Web</option>
                            </select>
                            <div className={styles.select_arrow}></div>
                            <input type="file" ref={selectFileInput} onChange={sendCsvFile} hidden />
                        </div>

                        <button onClick={handleImportBtnClick}>Inciar importação</button>
                    </div>
                </div>
            </PageHeaderDesktop>

            <section>
                {
                    (transactionsList.length < 0) ? null : (
                        <ul>
                            {
                                transactionsList.map(transaction => {
                                    return (
                                        <li key={transaction.csvImportId}>
                                            <input type="date" value={moment(new Date(transaction.date)).format("YYYY-MM-DD") || ""} onChange={(e) => { handleListEditChange("date", e.target.value, transaction) }} />
                                            <input type="text" value={transaction.description || ""} onChange={(e) => { handleListEditChange("description", e.target.value, transaction) }} />
                                            <input type="number" value={transaction.value || ""} onChange={(e) => { handleListEditChange("value", e.target.value, transaction) }} />
                                        </li>
                                    )
                                })
                            }
                        </ul>
                    )
                }
            </section>
        </div>
    )
}

export { ImportTransactionsPage }