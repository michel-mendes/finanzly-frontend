import { Dispatch, SetStateAction, useEffect, useState } from "react"
import moment from "moment"

import { ICategory, ITransaction } from "../../services/types"
import { InputEdit } from "../InputEdit"
import { SearchDropDown } from "../SearchDropDown"

import styles from "./styles.module.css"

interface IFormTransactionCrudProps {
    transactionData: ITransaction | null;
    setTransactionData: Dispatch<SetStateAction<ITransaction | null>>;
    setTransactionValuesHasChanged?: (value: boolean) => void;
    categoriesList: ICategory[];
}

function FormTransactionCRUD({ transactionData, setTransactionData, setTransactionValuesHasChanged, categoriesList }: IFormTransactionCrudProps) {

    const defaultCategory = categoriesList.find(category => { return category.id == transactionData?.fromCategory })
    const [selectedCategoryName, setSelectedCategoryName] = useState(defaultCategory?.categoryName || "")
    const [initialTransactionValues, setInitialTransactionValues] = useState<ITransaction>(transactionData!)

    function handleInputChange(value: string | number, propName: keyof ITransaction) {
        setTransactionData({ ...transactionData, [propName]: value })
    }

    useEffect(() => {
        transactionData!.date = (transactionData?.date) ? moment(transactionData.date).format("YYYY-MM-DD") : moment(Date.now()).format("YYYY-MM-DD")

        setInitialTransactionValues(transactionData!)
        setTransactionValuesHasChanged ? setTransactionValuesHasChanged(false) : null
    }, [])

    useEffect(() => {

        // If "setTransactionValuesHasChanged" useState function is setted
        if (setTransactionValuesHasChanged) {
            const initialValues = JSON.stringify(initialTransactionValues)
            const actualValues = JSON.stringify(transactionData)
            const hasChanged = initialValues != actualValues

            setTransactionValuesHasChanged(hasChanged)
        }

    }, [transactionData])

    return (
        <form className={styles.form}>

            <div className={styles.field_row}>
                <span className={styles.column_name}>Categoria</span>

                <div className={styles.column_value}>
                    <SearchDropDown
                        fieldName="fromCategory"
                        placeholder="Escolha a categoria"
                        results={categoriesList}
                        value={selectedCategoryName || ""}
                        renderItem={(item) => <><span>{item.categoryName}</span><span>{(item.transactionType == "C") ? "Recebimentos" : "Pagamentos"}</span></>}
                        onSelect={(item) => {
                            handleInputChange(item.id!, "fromCategory")
                            setSelectedCategoryName(item.categoryName!)
                        }}
                        searcheableProperty="categoryName"
                    />
                </div>
            </div>

            <div className={styles.field_row}>
                <span className={styles.column_name}>Data</span>

                <div className={styles.column_value}>
                    <InputEdit
                        fieldName="date"
                        inputType="date"
                        placeholder="Data"
                        value={moment(transactionData?.date).format("YYYY-MM-DD") || ""}
                        onChange={(value) => { handleInputChange(value, "date") }}
                    />
                </div>
            </div>

            <div className={styles.field_row}>
                <span className={styles.column_name}>Descrição</span>

                <div className={styles.column_value}>
                    <InputEdit
                        fieldName="description"
                        inputType="text"
                        placeholder="Descrição"
                        value={transactionData?.description || ""}
                        onChange={(value) => { handleInputChange(value, "description") }}
                    />
                </div>
            </div>

            <div className={styles.field_row}>
                <span className={styles.column_name}>Detalhes adicionais</span>

                <div className={styles.column_value}>
                    <InputEdit
                        fieldName="extraInfo"
                        inputType="text"
                        placeholder="Mais detalhes (opcional)"
                        value={transactionData?.extraInfo || ""}
                        onChange={(value) => { handleInputChange(value, "extraInfo") }}
                    />
                </div>
            </div>
            
            <div className={styles.field_row}>
                <span className={styles.column_name}>Valor</span>

                <div className={styles.column_value}>
                    <InputEdit
                        fieldName="value"
                        inputType="number"
                        placeholder="Valor"
                        value={transactionData?.value || ""}
                        onChange={(value) => { handleInputChange(value, "value") }}
                    />
                </div>
            </div>

        </form>
    )
}

export { FormTransactionCRUD }