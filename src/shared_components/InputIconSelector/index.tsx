import { useState } from "react"
import { RiArrowDropDownLine } from "react-icons/ri"
import styles from "./styles.module.css"

interface IInputProps {
    placeholder: string;
    fieldName: string;
}

function InputIconSelector(props: IInputProps) {
    const { placeholder, fieldName } = props
    const [iconPath, setIconPath] = useState("")

    const inputId = `input_${fieldName}`
    const selectedIcon = (iconPath == "") ? null : <img src="" alt="" id={inputId} />

    return (
        <>
            <label className={styles.input_container} htmlFor={inputId}>
                <span>{placeholder}</span>
                <i>{<RiArrowDropDownLine />}</i>

                {selectedIcon}
                <input type="text" name={fieldName} placeholder=" " value={iconPath} disabled />
            </label>
        </>
    )
}

export { InputIconSelector }