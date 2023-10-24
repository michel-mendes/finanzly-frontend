import moment from 'moment'
import { useEffect, useRef, useState, createRef } from 'react'
import { IoArrowBack } from 'react-icons/io5'
import { TiDelete } from 'react-icons/ti'
import { useNavigate } from 'react-router-dom'

import { PageHeaderDesktop } from '../../shared_components/PageHeaderDesktop'

import axios from 'axios'
import { useAuthContext } from '../../contexts/Auth'
import { useCategories } from '../../hooks/useCategories'
import { useTransactions } from '../../hooks/useTransactions'
import styles from "./styles.module.css"


interface IImportedTransaction {
    fromCategory: string;
    fromWallet: string;
    fromUser: string;
    date: number;
    description: string;
    extraInfo: string,
    value: number;
    transactionType: string;
    csvImportId: string;
    transactionAlreadyExists: boolean;
}

function ImportTransactionsPage() {
    const navigate = useNavigate()

    const {loggedUser} = useAuthContext()
    const [selectedBank, setSelectedBank] = useState("n/a")
    const [activeWallet, setActiveWallet] = useState("")
    const { categoriesList } = useCategories()
    const {newTransaction} = useTransactions()
    const [transactionsList, setTransactionsList] = useState<IImportedTransaction[]>([])

    // Get inputs for validations
    const fileSelectInput = useRef<HTMLInputElement>(null)
    const tableInputsList = {
        categoryInputs: useRef<Array<HTMLInputElement | null>>([]),
        dateInputs: useRef<Array<HTMLInputElement | null>>([]),
        descriptionInputs: useRef<Array<HTMLInputElement | null>>([]),
        extraInfoInputs: useRef<Array<HTMLInputElement | null>>([]),
        valueInputs: useRef<Array<HTMLInputElement | null>>([])
    }

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
        formData.append("walletId", loggedUser!.activeWallet?.id!)
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

    function handleDeleteClick(transaction: IImportedTransaction) {
        const newList = transactionsList.filter(item => {
            return (item.csvImportId !== transaction.csvImportId)
        })

        setTransactionsList(newList)
    }

    function updateInputs(newTransactions: IImportedTransaction[]) {
        tableInputsList.dateInputs.current = newTransactions.map((_, index) => { return tableInputsList.dateInputs.current[index] })
        tableInputsList.descriptionInputs.current = newTransactions.map((_, index) => { return tableInputsList.descriptionInputs.current[index] })
        tableInputsList.extraInfoInputs.current = newTransactions.map((_, index) => { return tableInputsList.extraInfoInputs.current[index] })
        tableInputsList.valueInputs.current = newTransactions.map((_, index) => { return tableInputsList.valueInputs.current[index] })
        tableInputsList.categoryInputs.current = newTransactions.map((_, index) => { return tableInputsList.categoryInputs.current[index] })
    }

    function checkListValidity(): boolean {
        const categoriesNames = categoriesList.map(category => { return category.categoryName })

        // Check date inputs
        for (const dateInput of tableInputsList.dateInputs.current) {
            const transactionAlreadyExists = dateInput?.getAttribute("transaction-already-exists") === "true"
            
            if (transactionAlreadyExists) continue

            const transactionDate = new Date(dateInput!.value)

            if (transactionDate > new Date()) {
                dateInput?.setCustomValidity("Informe uma data menor ou igual a data atual")
                dateInput?.reportValidity()
                return false
            }
        }

        // check description inputs
        for (const descriptionInput of tableInputsList.descriptionInputs.current) {
            const transactionAlreadyExists = descriptionInput?.getAttribute("transaction-already-exists") === "true"
            
            if (transactionAlreadyExists) continue

            if (descriptionInput?.value == "") {
                descriptionInput?.setCustomValidity("Informe uma descrição válida")
                descriptionInput?.reportValidity()
                return false
            }
        }

        for (const valueInput of tableInputsList.valueInputs.current) {
            const transactionAlreadyExists = valueInput?.getAttribute("transaction-already-exists") === "true"
            
            if (transactionAlreadyExists) continue

            const value = parseFloat(valueInput!.value)

            if (value < 0 || valueInput?.value == "") {
                valueInput?.setCustomValidity("Informe um valor maior ou igual a zero")
                valueInput?.reportValidity()
                return false
            }
        }

        // Check category inputs
        for (const categoryInput of tableInputsList.categoryInputs.current) {
            const transactionAlreadyExists = categoryInput?.getAttribute("transaction-already-exists") === "true"
            
            if (transactionAlreadyExists) continue

            if (!categoriesNames.includes(categoryInput?.value)) {
                categoryInput!.value = ""
                categoryInput!.setCustomValidity("Informe uma categoria válida")
                categoryInput!.reportValidity()
                return false
            }
        }

        return true
    }

    async function handleSendImportsClick() {
        let insertedCount = 0

        if (!checkListValidity()) return

        const newList = transactionsList.map(transaction => {
            const category = categoriesList.find(category => {if (category.categoryName == transaction.fromCategory) return category})

            return {
                ...transaction,
                fromCategory: category?.id,
                fromWallet: activeWallet,
                fromUser: loggedUser?.id
            }
        })
        
        for (const transaction of newList) {
            if (transaction.transactionAlreadyExists) continue

            const result = await newTransaction(transaction)
            insertedCount++

            if (!result) return
        }

        alert(`Foram importadas ${insertedCount} transações`)
    }

    // Updates the REF inputs everytime the transactions list is changed
    useEffect(() => {
        updateInputs(transactionsList)
    }, [transactionsList])
    
    // Get the query string "wallet" on page load
    useEffect(() => {
        const queryString = new URLSearchParams(window.location.search)
        setActiveWallet(queryString.get("wallet") || "")
    }, [])

    return (
        <div className={styles.page_container}>
            <PageHeaderDesktop>
                <div className={styles.header_content}>
                    <i onClick={() => { navigate("/transactions") }}>{<IoArrowBack />}</i>

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

                        <>
                            <datalist id="categories">
                                {
                                    categoriesList.map(category => {
                                        return (
                                            <option key={category.id} value={category.categoryName} label={(category.transactionType == "D") ? "Pagamento" : "Recebimento"} />
                                        )
                                    })
                                }
                            </datalist>

                            <table className={styles.table}>
                                <thead>
                                    <tr>
                                        <td><p>#</p></td>
                                        <td><p>Data</p></td>
                                        <td><p>Descrição</p></td>
                                        <td><p>Detalhes extras</p></td>
                                        <td><p>Valor</p></td>
                                        <td><p>Categoria</p></td>
                                        <td><p>Tipo</p></td>
                                        <td></td>
                                    </tr>
                                </thead>

                                <tbody>
                                    {
                                        transactionsList.map((transaction, itemIndex) => {
                                            const transactionType = (transaction.transactionType == "D") ? "Pagamento" : "Recebimento"

                                            return (
                                                <tr key={`${transaction.csvImportId}_${itemIndex}`} transaction-type={transaction.transactionType} transaction-already-exists={`${transaction.transactionAlreadyExists}`}>
                                                    <td>
                                                        <span style={{ fontSize: "7px" }}>#</span>
                                                        <span>{itemIndex + 1}</span>
                                                    </td>
                                                    <td>
                                                        <input
                                                            className={styles.input_date}
                                                            type="date"
                                                            value={moment(new Date(transaction.date)).format("YYYY-MM-DD") || ""}
                                                            onChange={(e) => { handleListEditChange("date", e.target.value, transaction) }}
                                                            ref={(element) => { tableInputsList.dateInputs.current[itemIndex] = element }}
                                                            transaction-already-exists={`${transaction.transactionAlreadyExists}`}
                                                        />
                                                    </td>
                                                    <td>
                                                        <input
                                                            className={styles.input_description}
                                                            type="text"
                                                            value={transaction.description || ""}
                                                            onChange={(e) => { handleListEditChange("description", e.target.value, transaction) }}
                                                            ref={(element) => { tableInputsList.descriptionInputs.current[itemIndex] = element }}
                                                            transaction-already-exists={`${transaction.transactionAlreadyExists}`}
                                                        />
                                                    </td>
                                                    <td>
                                                        <input
                                                            // className={styles.input_description}
                                                            type="text"
                                                            value={transaction.extraInfo || ""}
                                                            onChange={(e) => { handleListEditChange("extraInfo", e.target.value, transaction) }}
                                                            ref={(element) => { tableInputsList.extraInfoInputs.current[itemIndex] = element }}
                                                            transaction-already-exists={`${transaction.transactionAlreadyExists}`}
                                                        />
                                                    </td>
                                                    <td>
                                                        <input
                                                            className={styles.input_value}
                                                            type="number"
                                                            step="0.01" value={transaction.value || ""}
                                                            onChange={(e) => { handleListEditChange("value", e.target.value, transaction) }}
                                                            ref={(element) => { tableInputsList.valueInputs.current[itemIndex] = element }}
                                                            transaction-already-exists={`${transaction.transactionAlreadyExists}`}
                                                        />
                                                    </td>
                                                    <td>
                                                        <input
                                                            className={styles.input_category}
                                                            type="text"
                                                            list='categories'
                                                            onChange={(e) => { handleListEditChange("fromCategory", e.target.value, transaction) }}
                                                            ref={(element) => { tableInputsList.categoryInputs.current[itemIndex] = element }}
                                                            transaction-already-exists={`${transaction.transactionAlreadyExists}`}
                                                        />
                                                    </td>
                                                    <td>
                                                        <span>{transactionType}</span>
                                                    </td>
                                                    <td>
                                                        <i onClick={() => { handleDeleteClick(transaction) }}><TiDelete /></i>
                                                    </td>
                                                </tr>
                                            )
                                        })
                                    }
                                </tbody>
                            </table>
                        </>

                    )
                }
            </section>

            {
                (transactionsList.length < 1) ? null : (
                    <footer>
                        <button onClick={handleSendImportsClick}>Importar todas</button>
                    </footer>
                )
            }
        </div>
    )
}

export { ImportTransactionsPage }

