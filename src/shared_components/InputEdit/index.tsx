import { CSSProperties, HTMLInputTypeAttribute } from "react"
import styles from "./styles.module.css"

interface IInputProps {
    placeholder: string;
    fieldName: string;
    value?: string | number
    onChange?: (value: string | number) => void,
    widthInPixels?: number;
    inputType: HTMLInputTypeAttribute;
}

function InputEdit(props: IInputProps) {
    const { placeholder, fieldName, widthInPixels, inputType, value, onChange } = props

    const inputId = `input_${fieldName}`
    const inlineStyle: CSSProperties = (!widthInPixels) ? {} : {width: widthInPixels}

    return (
        <>
            <label className={styles.input_container} htmlFor={inputId}>
                <span>{placeholder}</span>
                
                <input
                    type={inputType}
                    name={fieldName}
                    id={inputId}
                    placeholder=" "
                    style={inlineStyle}
                    value={ value }
                    onChange={ (!onChange) ? undefined : (event) => {
                        onChange( event.target.value )
                    } }
                    required
                />
            </label>
        </>
    )
}

export { InputEdit }