import { Dispatch, SetStateAction, useState } from "react"

import { ICategory, ITransaction } from "../../services/types"
import { InputEdit } from "../InputEdit"
import { SearchDropDown } from "../SearchDropDown"

import styles from "./styles.module.css"

interface IFormTransactionCrudProps {
    transactionData: ITransaction | null;
    setTransactionData: Dispatch<SetStateAction<ITransaction | null>>;
    categoriesList: ICategory[];
}

function FormTransactionCRUD({transactionData, setTransactionData, categoriesList}: IFormTransactionCrudProps) {
    
    const [selectedCategoryName, setSelectedCategoryName] = useState("")
    
    function handleInputChange(value: string | number, propName: keyof ITransaction) {
        setTransactionData({...transactionData, [propName]: value})
    }
    
    return (
        <form className={styles.form}>
            {/* <InputEdit
                fieldName="fromCategory"
                inputType="text"
                placeholder="Nome da categoria"
                value={transactionData?.fromCategory}
                onChange={(value) => {handleInputChange(value, "fromCategory")}}
            /> */}

            <SearchDropDown
                fieldName="fromCategory"
                placeholder="Escolha a categoria"
                results={categoriesList}
                value={selectedCategoryName}
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
                value={transactionData?.date?.toString()}
                onChange={(value) => {handleInputChange(value, "date")}}
            />

            <InputEdit
                fieldName="description"
                inputType="text"
                placeholder="Descrição"
                value={transactionData?.description}
                onChange={(value) => {handleInputChange(value, "description")}}
            />

            <InputEdit
                fieldName="value"
                inputType="number"
                placeholder="Valor"
                value={transactionData?.value}
                onChange={(value) => {handleInputChange(value, "value")}}
            />

            <InputEdit
                fieldName="extraInfo"
                inputType="text"
                placeholder="Mais detalhes (opcional)"
                value={transactionData?.extraInfo}
                onChange={(value) => {handleInputChange(value, "extraInfo")}}
            />
        </form>
    )
}

export { FormTransactionCRUD }