import React, { useState, useEffect, useRef, useCallback, CSSProperties } from "react"

import dropDownArrow from "../../assets/dropDown-arrow.svg"
import zoomIcon from "../../assets/zoom-icon.svg"

import styles from "./styles.module.css"

interface ISearchDropDownProps<Type> {
    placeholder: string;
    results?: Type[];
    renderItem(item: Type): JSX.Element;
    onChange?: React.ChangeEventHandler;
    onSelect?: (item: Type) => void;
    value?: string;
    dropdownPxWidth?: number;
    searcheableProperty: keyof Type;
}

function SearchDropDown<Type extends object>({ results = [], renderItem, value, placeholder, onSelect, dropdownPxWidth, searcheableProperty }: ISearchDropDownProps<Type>) {

    const [focusedIndex, setFocusedIndex] = useState(-1)
    const [showDropDown, setShowDropDown] = useState(false)
    const [defaultValue, setDefaultValue] = useState("")

    const [searchText, setSearchText] = useState("")

    const resultContainer = useRef<HTMLDivElement>(null)

    const dropdownStyleValue: CSSProperties = (dropdownPxWidth) ? { minWidth: dropdownPxWidth } : {}

    function handleSelection(selected: Type) {
        const selectedItem = results.find(item => { return item == selected })

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

    // type changeHandler = React.ChangeEventHandler<HTMLInputElement>

    // const handleChange: changeHandler = (event) => {
    //     setDefaultValue(event.target.value)
    //     if (onChange) { onChange(event) }
    // }

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

    return (
        <div className={styles.container} onClick={toggleShowPopup}>
            {/* <div tabIndex={0} onBlur={resetSearchComplete}> */}
            <div tabIndex={0} className={styles.placeholder_container}>
                {
                    defaultValue ? <span>{defaultValue}</span> : <span>{placeholder}</span>
                }

                <img src={dropDownArrow} alt="Dropdown Arrow" />
            </div>

            {/* Search reaults container */}
            {
                showDropDown && (
                    <div className={styles.dropdown_container} style={dropdownStyleValue}>

                        <div className={styles.search_bar_container}>
                            <input
                                type="text"
                                onChange={(event) => { setSearchText(event.currentTarget.value) }}
                                onKeyDown={handleKeyDown}
                                value={searchText}
                                autoFocus
                            />

                            <img className={styles.search_icon} src={zoomIcon} alt="Search icon" />
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
                                        const focusedStyle: CSSProperties = (iAmFocused) ? { fontWeight: "bold", backgroundColor: "#f2f7f2" } : {}
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
                    </div>
                )
            }
        </div>
    )
}

export { SearchDropDown }