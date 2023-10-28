import { useState, useEffect, useRef, Dispatch, SetStateAction, MutableRefObject, CSSProperties } from "react"
import { AiOutlineSearch } from "react-icons/ai"
import { RiEqualizerLine } from "react-icons/ri"
import moment from "moment"

// Context
import { useAuthContext } from "../../../contexts/Auth"

// Interfaces
import { ITransactionSearchBoxProps, ITransactionsPageFilters } from "../../../type-defs"

// Components
import { SearchDropDown } from "../../../shared_components/SearchDropDown"
import { InputEdit } from "../../../shared_components/InputEdit"

// Helper functions
import { useClickOutsideComponentListener, useEscapeKeyListener } from "../../../helpers/helpers"


import styles from "./styles.module.css"

function TransactionSearchBox({ filters, setFilters, walletsList, onSearchButtonClick, customWidth }: ITransactionSearchBoxProps) {
    const {setActiveWallet} = useAuthContext()
    
    // Component states
    const [tempFilters, setTempFilters] = useState<ITransactionsPageFilters>(setInitialTempFilterValues())
    const [searchPlaceholderText, setSearchPlaceholderText] = useState("")
    
    // Ref inputs
    const searchTextInput = useRef<HTMLInputElement>(null)
    const popupSearchTextInput = useRef<HTMLInputElement>(null)
    const popupSearchCategoryInput = useRef<HTMLInputElement>(null)
    const popupStartDateInput = useRef<HTMLInputElement>(null)
    const popupEndDateInput = useRef<HTMLInputElement>(null)

    // Popup manager
    const popupSearchFilters = useRef<HTMLDivElement>(null)
    const { isPopupOpen, toggleShowPopup } = useClickOutsideComponentListener(popupSearchFilters)
    
    // Custom component width var
    const customWidthStyle: CSSProperties = (customWidth) ? {width: customWidth} : {}
    
    useEscapeKeyListener(toggleShowPopup)

    useEffect(() => {
        const walletName = (filters.wallet?.id) ? `"${filters.wallet.walletName}", ` : ""
        const textValue = (filters.text) && `"${filters.text}", `
        const categoryValue = (filters.category) && `"${filters.category}", `
        const dateRangeValue = (filters.startDate && filters.endDate) && `${filters.startDate.toLocaleDateString()} até ${filters.endDate.toLocaleDateString()}`

        setSearchPlaceholderText(`${walletName + textValue + categoryValue + dateRangeValue}`)
    }, [filters])

    return (
        <div className={styles.container} ref={popupSearchFilters} style={customWidthStyle}>
            <div className={styles.search_bar_container}>
                <div className={styles.button} onClick={handleBarSearchButtonClick}>
                    <AiOutlineSearch />
                </div>

                <input
                    type="text"
                    // value={`${dateRange.startDate.toLocaleDateString()} ~ ${dateRange.endDate.toLocaleDateString()}`}
                    className={styles.date_range_input}
                    placeholder={searchPlaceholderText}
                    onKeyDown={(e) => handleKeyDownSearchBarInput(e as any)}
                    ref={searchTextInput}
                />

                <div className={styles.button} onClick={() => toggleShowPopup()}>
                    <RiEqualizerLine />
                </div>
            </div>

            {
                isPopupOpen && (
                    <div className={styles.popup_container}>
                        <h3>Refine sua pesquisa utilizando os campos abaixo</h3>

                        <label className={styles.fields_row}>
                            <span className={styles.name_column}>Carteira</span>

                            <div className={styles.value_column}>
                                <SearchDropDown
                                    fieldName="fromCategory"
                                    placeholder="Escolha a carteira"
                                    results={walletsList}
                                    value={tempFilters.wallet?.walletName || filters.wallet?.walletName || ""}
                                    renderItem={(item) => <><span>{item.walletName}</span><span style={{display: "flex", flexDirection: "column"}}><span>Saldo</span><span>{filters.wallet?.currencySymbol} {Number(item.actualBalance).toLocaleString(undefined, {minimumFractionDigits: 2, maximumFractionDigits: 2})}</span></span></>}
                                    onSelect={(item) => {
                                        setTempFilters({ ...tempFilters, wallet: item || null })
                                    }}
                                    searcheableProperty="walletName"
                                    dropdownPxWidth={400}
                                />
                            </div>
                        </label>

                        <label className={styles.fields_row}>
                            <span className={styles.name_column}>Contém as palavras</span>

                            <div className={styles.value_column}>
                                <InputEdit
                                    fieldName="searchText"
                                    inputType="text"
                                    placeholder=""
                                    value={tempFilters.text}
                                    onChange={(value) => { setTempFilters({ ...tempFilters, text: String(value) }) }}
                                    refObject={popupSearchTextInput}
                                />
                            </div>
                        </label>

                        <label className={styles.fields_row}>
                            <span className={styles.name_column}>Seja da categoria</span>

                            <div className={styles.value_column}>
                                <InputEdit
                                    fieldName="searchCategory"
                                    inputType="text"
                                    placeholder=""
                                    value={tempFilters.category}
                                    onChange={(value) => { setTempFilters({ ...tempFilters, category: String(value) }) }}
                                    refObject={popupSearchCategoryInput}
                                />
                            </div>
                        </label>

                        <label className={styles.fields_row}>
                            <span className={styles.name_column}>Data entre</span>

                            <div className={`${styles.value_column} ${styles.date_range_selector}`}>
                                {/* <div> */}
                                <InputEdit
                                    fieldName="searchStartDate"
                                    inputType="date"
                                    placeholder=""
                                    value={tempFilters.startDate.toISOString().slice(0, 10)}
                                    onChange={(value) => { setTempFilters({ ...tempFilters, startDate: moment(value).startOf("day").toDate() }) }}
                                    refObject={popupStartDateInput}
                                />
                                {/* </div> */}

                                <span>e</span>

                                {/* <div> */}
                                <InputEdit
                                    fieldName="searchEndDate"
                                    inputType="date"
                                    placeholder=""
                                    value={tempFilters.endDate.toISOString().slice(0, 10)}
                                    onChange={(value) => { setTempFilters({ ...tempFilters, endDate: moment(value).startOf("day").toDate() }) }}
                                    refObject={popupEndDateInput}
                                />
                                {/* </div> */}
                            </div>
                        </label>

                        <div className={styles.search_button_container}>
                            <button onClick={handlePopupSearchButtonClick} className="btn btn-normal">Pesquisar</button>
                        </div>
                    </div>
                )
            }
        </div>
    )


    // Component helper functions
    function handleBarSearchButtonClick() {
        setTempFilters({ ...tempFilters, text: searchTextInput.current!.value })
        setFilters({ ...filters, text: searchTextInput.current!.value })
        searchTextInput.current!.value = ""

        if (onSearchButtonClick) { onSearchButtonClick() }
    }

    function handleKeyDownSearchBarInput(event: KeyboardEvent) {
        const pressedKey = event.keyCode || event.key

        if (pressedKey == "Return" || pressedKey == "return" || pressedKey == 13) {
            handleBarSearchButtonClick()
        }
    }

    function handlePopupSearchButtonClick() {

        //Calls "onSearchButtonClick" function if declared
        if (onSearchButtonClick) { onSearchButtonClick() }

        setFilters({
            wallet: tempFilters.wallet || filters.wallet || null,
            text: popupSearchTextInput.current!.value,
            category: popupSearchCategoryInput.current!.value,
            startDate: moment(popupStartDateInput.current!.value).startOf("day").toDate(),
            endDate: moment(popupEndDateInput.current!.value).startOf("day").toDate(),
        })

        if (tempFilters.wallet && tempFilters.wallet.id) {
            setActiveWallet(tempFilters.wallet.id)
        }
        
        toggleShowPopup()
    }

    function setInitialTempFilterValues(): ITransactionsPageFilters {
        return {
            wallet: filters.wallet,
            text: filters.text,
            category: filters.category,
            startDate: filters.startDate,
            endDate: filters.endDate,
        }
    }
}

export { TransactionSearchBox }