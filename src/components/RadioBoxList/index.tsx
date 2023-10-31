import styles from "./styles.module.css"

interface IRadioValuesProps {
    value: string;
    caption: string;
}

interface IRadioBoxProps {
    fieldName: string;
    selectedValue?: string;
    items: IRadioValuesProps[];
    required: boolean;
    onChange?: (value: string | number) => void;
}

function RadioBoxList({ items, fieldName, onChange, selectedValue, required }: IRadioBoxProps) {

    return (
        <div className={styles.container}>

            <ul className={styles.ks_cboxtags}>
                {
                    items.map((item, index) => {
                        const radioButtonId = `radioButton_${item.value}_${index}`

                        return (
                            <li key={index}>
                                <input
                                    type="radio"
                                    name={fieldName}
                                    id={radioButtonId}
                                    value={item.value}
                                    onChange={ !onChange ? undefined : (event) => {
                                        onChange(event.target.value)
                                    }}
                                    checked={item.value == selectedValue}
                                    required={required}
                                    hidden
                                />
                                <label htmlFor={radioButtonId}>{item.caption}</label>
                            </li>
                        )
                    })
                }
            </ul>

        </div>
    )
}

export { RadioBoxList }