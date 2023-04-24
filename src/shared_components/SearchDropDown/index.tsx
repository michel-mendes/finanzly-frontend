import React, { useState, useEffect, useRef, useCallback } from "react"
import { RiArrowDropDownFill } from "react-icons/ri"

import styles from "./styles.module.css"

interface ISearchDropDownProps<Type> {
    results?:               Type[];
    renderItem(item: Type): JSX.Element;
    onChange?:              React.ChangeEventHandler;
    onSelect?:              (item: Type) => void;
    value?:                 string;
}

function SearchDropDown<Type extends object>({results = [], renderItem, value, onChange, onSelect}: ISearchDropDownProps<Type>) {
    
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

    function handleKeyDown(event: React.KeyboardEvent<HTMLDivElement>) {
        const {key} = event
        let nextIndexCount = 0

        switch(key) {
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

    useEffect(() => {
        if (results.length > 0 && !showResults) setShowResults(true)

        if (results.length <= 0) setShowResults(false)
    }, [results])

    useEffect(() => {
        if (value) setDefaultValue(value)
    }, [value])

       
    return (
        <div className={styles.container}>
            <div tabIndex={1} onBlur={resetSearchComplete} onKeyDown={handleKeyDown} className="relative" >
                <input
                    value={defaultValue}
                    onChange={handleChange}
                    type="text"
                    className=""
                    placeholder="Faça sua pesquisa..."
                />
                
                <i onClick={() => {setShowResults(!showResults)}} className={styles.dropdown_button}><RiArrowDropDownFill/></i>

                {/* Search reaults container */}
                {
                    (!showResults) ? null : (
                        <div className={styles.results}>
                            {
                                results.map((result, index) => {
                                    return (
                                        <div
                                            key={index}
                                            onMouseDown={() => handleSelection(index)}
                                            ref={(index === focusedIndex) ? resultContainer : null}
                                            style={{
                                                backgroundColor: (index === focusedIndex) ? "rgba(0, 0, 0, 0.1)" : ""
                                            }}
                                            className=""
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
        </div>
    )
}

export { SearchDropDown }