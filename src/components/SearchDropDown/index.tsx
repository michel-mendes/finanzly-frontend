import React, { useState, useEffect, useRef, useCallback, CSSProperties } from "react"
import { RiArrowDropDownFill } from "react-icons/ri"
import { AiOutlineSearch } from "react-icons/ai";
import { RiEqualizerLine } from "react-icons/ri";
import { RiArrowDownSLine } from "react-icons/ri";

import styles from "./styles.module.css"

interface ISearchDropDownProps<Type> {
    fieldName: string;
    placeholder: string;
    results?: Type[];
    renderItem(item: Type): JSX.Element;
    onChange?: React.ChangeEventHandler;
    onSelect?: (item: Type) => void;
    value?: string;
    dropdownPxWidth?: number;
    searcheableProperty: keyof Type;
}

    function SearchDropDown<Type extends object>({ results = [], renderItem, value, placeholder, fieldName, onChange, onSelect, dropdownPxWidth, searcheableProperty }: ISearchDropDownProps<Type>) {

    const [focusedIndex, setFocusedIndex] = useState(-1)
    const [showDropDown, setShowDropDown] = useState(false)
    const [defaultValue, setDefaultValue] = useState("")

    const [searchText, setSearchText] = useState("")

    const resultContainer = useRef<HTMLDivElement>(null)

    const dropdownStyleValue: CSSProperties = (dropdownPxWidth) ? {minWidth: dropdownPxWidth} : {}

    function handleSelection(selected: Type) {
        const selectedItem = results.find(item => {return item == selected})

        if (!selectedItem) { return resetSearchComplete() }

        if (onSelect) { onSelect(selectedItem) }

        resetSearchComplete()
    }

    const resetSearchComplete = useCallback(() => {
        setFocusedIndex(-1)
        setShowDropDown(false)
    }, [])

    function toggleShowPopup() {
        setShowDropDown(prevStateValue => { return !prevStateValue })
    }

    function handleKeyDown(event: React.KeyboardEvent<HTMLInputElement>) {
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
                // handleSelection(focusedIndex)
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
        <div className={styles.container}>
            {/* <div tabIndex={0} onBlur={resetSearchComplete}> */}
            <div tabIndex={0} className={styles.placeholder_container} onClick={toggleShowPopup}>
                {
                    !defaultValue && (<span>{placeholder}</span>)
                }

                <span>{defaultValue}</span>

                <div className={styles.dropdown_arrow}>
                    <RiArrowDownSLine />
                </div>
            </div>

            {/* Search reaults container */}
            {
                showDropDown && (
                    <div className={styles.dropdown_container} style={dropdownStyleValue}>

                        <div className={styles.search_bar_container}>
                            <div className={styles.button}>
                                <AiOutlineSearch />
                            </div>

                            <input
                                type="text"
                                onChange={(event) => { setSearchText(event.currentTarget.value) }}
                                onKeyDown={handleKeyDown}
                                value={searchText}
                                autoFocus
                            />
                        </div>

                        <div className={styles.results_container}>
                            {
                                results.filter((item) => {
                                    if ((item[searcheableProperty] as string).toUpperCase().includes(searchText.toUpperCase())) {
                                        return item
                                    }
                                })
                                    .map((result, index) => {
                                        const iAmFocused = index == focusedIndex
                                        const focusedStyle: CSSProperties = (iAmFocused) ? {fontWeight: "bold", backgroundColor: "#f2f7f2"} : {}
                                        return (
                                            <div
                                                key={index}
                                                style={focusedStyle}
                                                onMouseDown={() => handleSelection(result)}
                                                ref={(index === focusedIndex) ? resultContainer : null}
                                                is-focused={index === focusedIndex ? "true" : "false"}
                                                className={styles.dropdown_item}
                                            >
                                                {
                                                    renderItem(result)
                                                }
                                            </div>
                                        )
                                    })
                            }
                        </div>

                        <div className={styles.results_counter_container}>
                            <span>{results.length} itens</span>
                        </div>
                    </div>
                )
            }
        </div>
    )
}

export { SearchDropDown }