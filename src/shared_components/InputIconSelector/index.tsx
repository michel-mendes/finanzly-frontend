import { useState } from "react"
import { RiArrowDropDownLine } from "react-icons/ri"

import { ModalSaveCancel } from "../Modal";
import { useModal } from "../../hooks/useModal";
import { IconsContainer } from "../IconsContainer";

import styles from "./styles.module.css"

interface IInputProps {
    placeholder: string;
    fieldName: string;
    value?: string;
    onChange?: (value: string) => void;
}

function InputIconSelector(props: IInputProps) {
    const { placeholder, fieldName, value, onChange } = props

    const { closeModal, isOpen, showModal } = useModal()
    const [selectedOnModal, setSelectedOnModal] = useState("")

    const inputId = `input_${fieldName}`
    const selectedIcon = (value == "") ? null : <img src={value} alt="" id={inputId} />

    function handleOkClick() {
        (!onChange) ? null : onChange(selectedOnModal)

        closeModal()
    }

    return (
        <>
            <label className={styles.input_container} htmlFor={inputId} onClick={showModal}>
                <span>{placeholder}</span>
                <i>{<RiArrowDropDownLine />}</i>

                {/* Display selected icon image */}
                {selectedIcon}
                <input type="text" name={fieldName} placeholder=" " value={value} hidden />
            </label>

            <ModalSaveCancel isOpen={isOpen} modalTitle="Selecione um ícone" modalButtons={{
                cancelButton: { onClick: closeModal },
                okButton: { onClick: handleOkClick }
            }}>
                <IconsContainer selectedIcon={selectedOnModal} setSelectedIcon={setSelectedOnModal} />
            </ModalSaveCancel>
        </>
    )
}

export { InputIconSelector }