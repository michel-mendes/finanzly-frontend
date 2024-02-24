import { CSSProperties, HTMLInputTypeAttribute, RefObject } from "react"
import styles from "./styles.module.css"

interface IInputProps {
    inputType: HTMLInputTypeAttribute;
    placeholder: string;
    fieldName: string;
    value?: string | number;
    autocomplete?: boolean;
    widthInPixels?: number;
    refObject?: RefObject<HTMLInputElement>;
    onChange?: (value: string | number) => void,
}

function InputEdit(props: IInputProps) {
    const { placeholder, fieldName, widthInPixels, inputType, value, autocomplete, refObject: referenceObject, onChange } = props

    const inputId = `input_${fieldName}`
    const inlineStyle: CSSProperties = (!widthInPixels) ? {} : { width: widthInPixels }

    return (
        <label className={styles.input_container} htmlFor={inputId}>
            <input
                type={inputType}
                name={fieldName}
                id={inputId}
                placeholder={placeholder}
                style={inlineStyle}
                value={value}
                onChange={(!onChange) ? undefined : (event) => {
                    onChange(event.target.value)
                }}
                autoComplete={autocomplete ? "on" : "off"}
                ref={referenceObject}
                required
            />
        </label>
    )
}

export { InputEdit }