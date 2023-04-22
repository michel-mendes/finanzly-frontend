import { Dispatch, SetStateAction } from "react"

import { ITransaction } from "../../services/types"
import { InputEdit } from "../InputEdit"

interface IFormTransactionCrudProps {
    transactionData: ITransaction | null;
    setTransactionData: Dispatch<SetStateAction<ITransaction | null>>;
}

function FormTransactionCRUD({transactionData, setTransactionData}: IFormTransactionCrudProps) {
    function handleInputChange(value: string | number, propName: keyof ITransaction) {
        setTransactionData({...transactionData, [propName]: value})
    }
    
    return (
        <form>
            <InputEdit
                fieldName="fromCategory"
                inputType="text"
                placeholder="Nome da categoria"
                value={transactionData?.fromCategory}
                onChange={(value) => {handleInputChange(value, "fromCategory")}}
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