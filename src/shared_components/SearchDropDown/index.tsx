import React, { useState, useEffect, useRef, useCallback } from "react"
import { RiArrowDropDownFill } from "react-icons/ri"

import styles from "./styles.module.css"

interface ISearchDropDownProps<Type> {
    fieldName: string;
    placeholder: string;
    results?: Type[];
    renderItem(item: Type): JSX.Element;
    onChange?: React.ChangeEventHandler;
    onSelect?: (item: Type) => void;
    value?: string;
}

function SearchDropDown<Type extends object>({ results = [], renderItem, value, placeholder, fieldName, onChange, onSelect }: ISearchDropDownProps<Type>) {

    const [focusedIndex, setFocusedIndex] = useState(-1)
    const [showResults, setShowResults] = useState(false)
    const [defaultValue, setDefaultValue] = useState("")

    const resultContainer = useRef<HTMLDivElement>(null)

    function handleSelection(selectedIndex: number) {
        const selectedItem = results[selectedIndex]

        if (!selectedItem) { return resetSearchComplete() }

        if (onSelect) { onSelect(selectedItem) }

        resetSearchComplete()
    }

    const resetSearchComplete = useCallback(() => {
        setFocusedIndex(-1)
        setShowResults(false)
    }, [])

    function handleKeyDown(event: React.KeyboardEvent<HTMLLabelElement>) {
        const { key } = event
        let nextIndexCount = 0

        switch (key) {
            // Move down
            case "ArrowDown":
                nextIndexCount = (focusedIndex + 1) % results.length
                break
            // Move up
            case "ArrowUp":
                nextIndexCount = (focusedIndex + results.length - 1) % results.length
                break
            // Hide search results
            case "Escape":
                resetSearchComplete()
                break
            // Select the current item
            case "Enter":
                event.preventDefault()
                handleSelection(focusedIndex)
                break
        }

        setFocusedIndex(nextIndexCount)
    }

    type changeHandler = React.ChangeEventHandler<HTMLInputElement>

    const handleChange: changeHandler = (event) => {
        setDefaultValue(event.target.value)
        if (onChange) { onChange(event) }
    }

    useEffect(() => {
        if (!resultContainer.current) return

        resultContainer.current.scrollIntoView({
            block: "center"
        })
    }, [focusedIndex])

    // useEffect(() => {
    //     if (results.length > 0 && !showResults) setShowResults(true)

    //     if (results.length <= 0) setShowResults(false)
    // }, [results])

    useEffect(() => {
        if (value) setDefaultValue(value)
    }, [value])

    const inputId = `input_${fieldName}`

    return (
        <div className={styles.input_container}>
            <label htmlFor={inputId} tabIndex={1} onBlur={resetSearchComplete} onKeyDown={handleKeyDown}>
                <span>{placeholder}</span>

                <input
                    type="text"
                    name={fieldName}
                    id={inputId}
                    placeholder=" "
                    value={defaultValue}
                    onChange={handleChange}
                    autoComplete="off"
                    required
                />
            </label>

            <i className={styles.dropdown_button} onClick={() => { setShowResults(!showResults) }}>
                <RiArrowDropDownFill />
            </i>

            {/* Search reaults container */}
            {
                (!showResults) ? null : (
                    <div className={styles.results}>
                        {
                            results.map((result, index) => {
                                return (
                                    <div
                                        className={styles.result_item}
                                        key={index}
                                        onMouseDown={() => handleSelection(index)}
                                        ref={(index === focusedIndex) ? resultContainer : null}
                                        is-focused={index === focusedIndex ? "true" : "false"}
                                    >
                                        {
                                            renderItem(result)
                                        }
                                    </div>
                                )
                            })
                        }
                    </div>
                )
            }
        </div>
    )
}

export { SearchDropDown }