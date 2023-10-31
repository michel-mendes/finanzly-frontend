import { Dispatch, SetStateAction } from "react"

// Components
import { InputIconSelector } from "../InputIconSelector"
import { InputEdit } from "../InputEdit"
import { RadioBoxList } from "../RadioBoxList"
import { IconsContainer } from "../IconsContainer"
import { ModalSaveCancel } from "../Modal"
import { useModal } from "../../hooks/useModal"

import styles from "./styles.module.css"
import { ICategory } from "../../services/types"

interface IFormCategoryCrudProps {
    categoryData: ICategory | null;
    setCategoryData: Dispatch<SetStateAction<ICategory | null>>;
}

function FormCategoryCRUD({ categoryData, setCategoryData }: IFormCategoryCrudProps) {

    const { closeModal, isOpen, showModal } = useModal()
    
    function handleInputChange(value: string | number, propName: keyof ICategory) {
        if (!categoryData) return
        
        setCategoryData({ ...categoryData, [propName]: value })
    }

    return (
        <>
            <form className={styles.form}>
                <div>
                    <RadioBoxList
                        fieldName="transactionType"
                        selectedValue={categoryData?.transactionType!}
                        items={[{caption: "Entrada", value: "C"}, {caption: "Saída", value: "D"}]}
                        onChange={(value) => { handleInputChange(value, "transactionType") }}
                        required
                    />
                </div>

                <div>
                    <InputIconSelector iconType="categories" fieldName="iconPath" placeholder="Ícone" value={categoryData?.iconPath} onChange={(value) => { handleInputChange(value, "iconPath") }} />
                    <InputEdit
                        fieldName="categoryName"
                        inputType="text"
                        placeholder="Nome da carteira"
                        value={categoryData?.categoryName || ""}
                        onChange={(value) => { handleInputChange(value, "categoryName") }}
                    />
                </div>
            </form>
        </>
    )
}

export { FormCategoryCRUD }