import { Dispatch, SetStateAction, useEffect, useState } from "react"
import moment from "moment"

import { ICategory, ITransaction } from "../../services/types"
import { InputEdit } from "../InputEdit"
import { SearchDropDown } from "../SearchDropDown"

import styles from "./styles.module.css"

interface IFormTransactionCrudProps {
    transactionData: ITransaction | null;
    setTransactionData: Dispatch<SetStateAction<ITransaction | null>>;
    setTransactionValuesHasChanged?: Dispatch<SetStateAction<boolean>>;
    categoriesList: ICategory[];
}

function FormTransactionCRUD({transactionData, setTransactionData, setTransactionValuesHasChanged, categoriesList}: IFormTransactionCrudProps) {
    
    const defaultCategory = categoriesList.find(category => {return category.id == transactionData?.fromCategory})
    const [selectedCategoryName, setSelectedCategoryName] = useState(defaultCategory?.categoryName || "")
    const [initialTransactionValues, setInitialTransactionValues] = useState<ITransaction>(transactionData!)
    
    function handleInputChange(value: string | number, propName: keyof ITransaction) {
        setTransactionData({...transactionData, [propName]: value})
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
            
            <SearchDropDown
                fieldName="fromCategory"
                placeholder="Escolha a categoria"
                results={categoriesList}
                value={selectedCategoryName || ""}
                renderItem={(item) => <p><span>{item.categoryName}</span><span>{(item.transactionType == "C") ? "Receita" : "Despesa"}</span></p>}
                onSelect={(item) => {
                    handleInputChange(item.id!, "fromCategory")
                    setSelectedCategoryName(item.categoryName!)
                }}
            />

            <InputEdit
                fieldName="date"
                inputType="date"
                placeholder="Data"
                value={moment(transactionData?.date).format("YYYY-MM-DD") || ""}
                onChange={(value) => {handleInputChange(value, "date")}}
            />

            <InputEdit
                fieldName="description"
                inputType="text"
                placeholder="Descrição"
                value={transactionData?.description || ""}
                onChange={(value) => {handleInputChange(value, "description")}}
            />

            <InputEdit
                fieldName="value"
                inputType="number"
                placeholder="Valor"
                value={transactionData?.value || ""}
                onChange={(value) => {handleInputChange(value, "value")}}
            />

            <InputEdit
                fieldName="extraInfo"
                inputType="text"
                placeholder="Mais detalhes (opcional)"
                value={transactionData?.extraInfo || ""}
                onChange={(value) => {handleInputChange(value, "extraInfo")}}
            />

        </form>
    )
}

export { FormTransactionCRUD }