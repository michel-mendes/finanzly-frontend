import React, { useState, useRef } from 'react'
import { useNavigate } from 'react-router-dom'
import { IoArrowBack } from 'react-icons/io5'
import moment from 'moment'

import { PageHeaderDesktop } from '../../shared_components/PageHeaderDesktop'

import styles from "./styles.module.css"
import axios from 'axios'
import { ICategory } from '../../services/types'
import { useCategories } from '../../hooks/useCategories'

interface IImportedTransaction {
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
    const {categoriesList} = useCategories()

    const [transactionsList, setTransactionsList] = useState<IImportedTransaction[]>([])

    const [selectedBank, setSelectedBank] = useState("n/a")
    const fileSelectInput = useRef<HTMLInputElement>(null)

    function handleImportBtnClick() {
        if (!fileSelectInput.current) return

        if (selectedBank == "n/a") {
            alert("Selecione uma instituição para configurar a importação")
            fileSelectInput.current?.focus()
            return
        }

        fileSelectInput.current?.click()
    }

    async function sendCsvFile() {
        if (!fileSelectInput.current?.files![0]) return

        const formData = new FormData()
        formData.append("walletId", "TesteID")
        formData.append("bank", selectedBank)
        formData.append("csvFile", fileSelectInput.current.files[0])

        const resp = await axios.post("http://localhost:3000/api/upload", formData, { withCredentials: true })

        setTransactionsList(resp.data)

        fileSelectInput.current.value = ""
    }

    function handleListEditChange(fieldName: keyof IImportedTransaction, value: string | number, transaction: IImportedTransaction) {

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
                            <input type="file" ref={fileSelectInput} onChange={sendCsvFile} hidden />
                        </div>

                        <button onClick={handleImportBtnClick}>Inciar importação</button>
                    </div>
                </div>
            </PageHeaderDesktop>

            <section className={styles.import_container}>
                {
                    (transactionsList.length < 1) ? null : (
                        <table className={styles.table}>
                            <datalist id="categories">
                                {
                                    categoriesList.map(category => {
                                        return (
                                            <option value={category.categoryName} label={(category.transactionType == "D") ? "Despesa" : "Receita"} />
                                        )
                                    })
                                }
                            </datalist>

                            <thead>
                                <tr>
                                    <td><p>#</p></td>
                                    <td><p>Data</p></td>
                                    <td><p>Descrição</p></td>
                                    <td><p>Valor</p></td>
                                    <td><p>Categoria</p></td>
                                    <td><p>Tipo</p></td>
                                </tr>
                            </thead>

                            <tbody>
                                {
                                    transactionsList.map((transaction, itemIndex) => {
                                        const transactionType = (transaction.transactionType == "D") ? "Despesa" : "Receita"

                                        return (
                                            <tr key={transaction.csvImportId} transaction-type={transaction.transactionType}>
                                                <td>
                                                    <span style={{fontSize: "7px"}}>#</span>
                                                    <span>{itemIndex + 1}</span>
                                                </td>
                                                <td>
                                                    <input
                                                        className={styles.input_date}
                                                        type="date"
                                                        value={moment(new Date(transaction.date)).format("YYYY-MM-DD") || ""}
                                                        onChange={(e) => { handleListEditChange("date", e.target.value, transaction) }}
                                                    />
                                                </td>
                                                <td>
                                                    <input
                                                        className={styles.input_description}
                                                        type="text"
                                                        value={transaction.description || ""}
                                                        onChange={(e) => { handleListEditChange("description", e.target.value, transaction) }}
                                                    />
                                                </td>
                                                <td>
                                                    <input
                                                        className={styles.input_value}
                                                        type="number"
                                                        step="0.01" value={transaction.value || ""}
                                                        onChange={(e) => { handleListEditChange("value", e.target.value, transaction) }}
                                                    />
                                                </td>
                                                <td>
                                                    <input 
                                                        className={styles.input_category}
                                                        type="text"
                                                        list='categories'
                                                    />
                                                </td>
                                                <td>
                                                    <span>{transactionType}</span>
                                                </td>
                                            </tr>
                                        )
                                    })
                                }
                            </tbody>
                        </table>
                    )
                }
            </section>
        </div>
    )
}

export { ImportTransactionsPage }