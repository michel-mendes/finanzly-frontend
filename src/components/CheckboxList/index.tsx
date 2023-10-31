import React, { useState, ChangeEventHandler } from 'react'
import styles from "./styles.module.css"

interface IRadioValuesProps {
    value: string;
    caption: string;
}

interface IRadioBoxProps {
    fieldName: string;
    selectedValue: string;
    items: IRadioValuesProps[];
    handleOnChange?: any;
}

function RadioBoxList({ items, fieldName, handleOnChange, selectedValue }: IRadioBoxProps) {

    return (
        <div className={styles.container}>

            <ul className={styles.ks_cboxtags}>
                {
                    items.map((item, index) => {
                        const radioButtonId = `radioButton_${item.value}_${index}`

                        return (
                            <li key={index}>
                                <input type="radio" name={fieldName} id={radioButtonId} value={item.value} onChange={() => { handleOnChange ? handleOnChange(item) : null }} checked={item.value == selectedValue} />
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