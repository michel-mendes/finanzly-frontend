import moment from 'moment'
import { useEffect, useRef, useState } from 'react'

import { useAuthContext } from '../../contexts/Auth'
import { useCategories } from '../../hooks/useCategories'
import { useTransactions } from '../../hooks/useTransactions'

import checkIcon from "../../assets/check-green-icon.svg"
import downloadIcon from "../../assets/download_icon.svg"
import deleteIcon from "../../assets/delete.svg"

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

function ImportTransactionsListPage() {
    const { loggedUser } = useAuthContext()

    const { categoriesList } = useCategories()
    const { createTransaction } = useTransactions()
    const [transactionsList, setTransactionsList] = useState<IImportedTransaction[]>([])

    // Get inputs for validations
    const tableInputsList = {
        categoryInputs: useRef<Array<HTMLInputElement | null>>([]),
        dateInputs: useRef<Array<HTMLInputElement | null>>([]),
        descriptionInputs: useRef<Array<HTMLInputElement | null>>([]),
        extraInfoInputs: useRef<Array<HTMLInputElement | null>>([]),
        valueInputs: useRef<Array<HTMLInputElement | null>>([])
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
            const category = categoriesList.find(category => { if (category.categoryName == transaction.fromCategory) return category })

            return {
                ...transaction,
                fromCategory: category?.id,
                fromWallet: loggedUser?.activeWallet?.id,
                fromUser: loggedUser?.id
            }
        })

        for (const transaction of newList) {
            if (transaction.transactionAlreadyExists) continue

            const result = await createTransaction(transaction)
            insertedCount++

            if (!result) return
        }

        alert(`Foram importadas ${insertedCount} transações`)
    }

    // Updates the REF inputs everytime the transactions list is changed
    useEffect(() => {
        updateInputs(transactionsList)
    }, [transactionsList])


    useEffect(() => {
        const pendingImportTransactions = JSON.parse(localStorage.getItem(`import${loggedUser?.id}`) || "") || null;

        (pendingImportTransactions !== null) && setTransactionsList(pendingImportTransactions)
        document.title = "Importar transações Finanzly"
    }, [])

    return (
        <div className={styles.page_container}>

            <div className={styles.transactions_table}>

                <datalist id="categories">
                    {
                        categoriesList.map(category => {
                            return (
                                <option key={category.id} value={category.categoryName} label={(category.transactionType == "D") ? "Pagamento" : "Recebimento"} />
                            )
                        })
                    }
                </datalist>

                <div className={styles.table_header}>
                    <p className={styles.header_column_number}>#</p>
                    <p className={styles.header_column_date}>Data</p>
                    <p className={styles.header_column_description}>Descrição / Informações adicionais</p>
                    <p className={styles.header_column_value}>Valor</p>
                    <p className={styles.header_column_category}>Categoria</p>
                    <p className={styles.header_column_type}>Tipo transação</p>
                </div>

                <div className={styles.table_body}>
                    {
                        renderTransactionsList()
                    }
                </div>

                <div className={styles.table_footer}>
                    <div className={styles.backup_text_container}>
                        <img src={checkIcon} alt="Check icon" />
                        <p>Backup salvo...</p>
                    </div>

                    <div className={styles.send_transactions_button} onClick={handleSendImportsClick}>
                        <p>Finalizar importação</p>
                        <img src={downloadIcon} alt="Download icon" />
                    </div>
                </div>
            </div>

        </div>
    )


    // Inner components
    function renderTransactionsList() {

        return transactionsList.map((transaction, itemIndex) => {
            const transactionType = (transaction.transactionType == "D") ? "Pagamento" : "Recebimento"

            return (
                <div className={styles.table_row} key={`${transaction.csvImportId}_${itemIndex}`} transaction-type={transaction.transactionType} transaction-already-exists={`${transaction.transactionAlreadyExists}`}>
                    
                    {/* Existing transaction overlay */}
                    {
                        transaction.transactionAlreadyExists && (
                            <div className={styles.existing_transaction_overlay}>
                                <p>Transação já existente</p>
                            </div>
                        )
                    }

                    {/* Number column */}
                    <div className={styles.data_column_number}>
                        <p>{itemIndex + 1}</p>
                    </div>

                    {/* Date column */}
                    <div className={styles.data_column_date}>
                        <input
                            className={styles.input_date}
                            type="date"
                            value={moment(new Date(transaction.date)).format("YYYY-MM-DD") || ""}
                            onChange={(e) => { handleListEditChange("date", e.target.value, transaction) }}
                            ref={(element) => { tableInputsList.dateInputs.current[itemIndex] = element }}
                            transaction-already-exists={`${transaction.transactionAlreadyExists}`}
                        />
                    </div>

                    {/* Description / Extra info column */}
                    <div className={styles.data_column_description}>
                        <input
                            className={styles.input_description}
                            type="text"
                            value={transaction.description || ""}
                            onChange={(e) => { handleListEditChange("description", e.target.value, transaction) }}
                            ref={(element) => { tableInputsList.descriptionInputs.current[itemIndex] = element }}
                            transaction-already-exists={`${transaction.transactionAlreadyExists}`}
                        />

                        <input
                            type="text"
                            value={transaction.extraInfo || ""}
                            onChange={(e) => { handleListEditChange("extraInfo", e.target.value, transaction) }}
                            ref={(element) => { tableInputsList.extraInfoInputs.current[itemIndex] = element }}
                            transaction-already-exists={`${transaction.transactionAlreadyExists}`}
                        />
                    </div>

                    {/* Value column */}
                    <div className={styles.data_column_value}>
                        <input
                            className={styles.input_value}
                            type="number"
                            step="0.01" value={transaction.value || ""}
                            onChange={(e) => { handleListEditChange("value", e.target.value, transaction) }}
                            ref={(element) => { tableInputsList.valueInputs.current[itemIndex] = element }}
                            transaction-already-exists={`${transaction.transactionAlreadyExists}`}
                        />
                    </div>

                    {/* Category column */}
                    <div className={styles.data_column_category}>
                        <input
                            className={styles.input_category}
                            placeholder='Selecione a categoria'
                            type="text"
                            list='categories'
                            onChange={(e) => { handleListEditChange("fromCategory", e.target.value, transaction) }}
                            ref={(element) => { tableInputsList.categoryInputs.current[itemIndex] = element }}
                            transaction-already-exists={`${transaction.transactionAlreadyExists}`}
                        />
                    </div>

                    {/* Transaction type column */}
                    <div className={styles.data_column_type}>
                        <p>{transactionType}</p>
                        <img src={deleteIcon} alt="Delete icon" onClick={() => { handleDeleteClick(transaction) }}/>
                    </div>

                </div>
            )
        })
    }
}

export { ImportTransactionsListPage }

