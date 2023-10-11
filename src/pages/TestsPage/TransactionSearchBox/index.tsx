import {useState, useEffect, useRef, Dispatch, SetStateAction, MutableRefObject} from "react"
import { AiOutlineSearch } from "react-icons/ai"
import { RiEqualizerLine } from "react-icons/ri"
import moment from "moment"

// Interfaces
import { ITransactionSearchBoxProps, ITransactionsPageFilters } from "../../../prop-defs"

import styles from "./styles.module.css"





function TransactionSearchBox({filters, setFilters}: ITransactionSearchBoxProps) {
    const popupSearchFilters = useRef(null)
    const {isPopupOpen, toggleShowPopup} = useMouseClickListener(popupSearchFilters)

    const searchTextInput = useRef<HTMLInputElement>(null)
    const popupSearchTextInput = useRef<HTMLInputElement>(null)
    const popupSearchCategoryInput = useRef<HTMLInputElement>(null)
    const popupStartDateInput = useRef<HTMLInputElement>(null)
    const popupEndDateInput = useRef<HTMLInputElement>(null)

    const [tempFilters, setTempFilters] = useState<ITransactionsPageFilters>({
        text: "",
        category: "",
        startDate: new Date(Date.now()),
        endDate: new Date(Date.now()),
    })

    const [searchPlaceholderText, setSearchPlaceholderText] = useState("")

    function handleBarSearchButtonClick() {
        setTempFilters({...tempFilters, text: searchTextInput.current!.value})
        setFilters({...filters, text: searchTextInput.current!.value})
        searchTextInput.current!.value = ""
    }
    
    function handlePopupSearchButtonClick() {
        setFilters({
            text: popupSearchTextInput.current!.value,
            category: popupSearchCategoryInput.current!.value,
            startDate: moment(popupStartDateInput.current!.value).startOf("day").toDate(),
            endDate: moment(popupEndDateInput.current!.value).startOf("day").toDate(),
        })

        toggleShowPopup()
    }

    function openPopupAndFillInputValuesWithFilters() {
        // popupSearchTextInput.current!.value = "kkk"

        toggleShowPopup()
    }

    useEffect(() => {
        const textValue = (filters.text) && `"${filters.text}"`
        const textComma = (textValue) && ", "
        const categoryValue = (filters.category) && `"${filters.category}"`
        const categoryComma = (categoryValue) && ", "
        const dateRangeValue = (filters.startDate && filters.endDate) && `${filters.startDate.toLocaleDateString()} até ${filters.endDate.toLocaleDateString()}`

        setSearchPlaceholderText(`${textValue}${textComma}${categoryValue}${categoryComma}${dateRangeValue}`)
    }, [filters])


    return (
        <div className={styles.container} ref={popupSearchFilters}>
            <div className={styles.search_bar_container}>
                <div className={styles.button} onClick={handleBarSearchButtonClick}>
                    <AiOutlineSearch />
                </div>

                <input
                    type="text"
                    // value={`${dateRange.startDate.toLocaleDateString()} ~ ${dateRange.endDate.toLocaleDateString()}`}
                    className={styles.date_range_input}
                    placeholder={searchPlaceholderText}
                    ref={searchTextInput}
                />

                <div className={styles.button} onClick={openPopupAndFillInputValuesWithFilters}>
                    <RiEqualizerLine />
                </div>
            </div>

            {
                isPopupOpen && (
                    <div className={styles.popup_container}>
                        <label>
                            <span>Contém as palavras</span>
                            <input  
                                type="text"
                                value={tempFilters.text}
                                onChange={(value) => {setTempFilters({...tempFilters, text: value.currentTarget.value})}}
                                ref={popupSearchTextInput}
                            />
                        </label>

                        <label>
                            <span>Seja da categoria</span>
                            <input
                                type="text"
                                value={tempFilters.category}
                                onChange={(value) => {setTempFilters({...tempFilters, category: value.currentTarget.value})}}
                                ref={popupSearchCategoryInput}
                            />
                        </label>

                        <label>
                            <span>Data entre</span>
                            <div className={styles.date_range_selector}>
                                <input
                                    type="date"
                                    value={tempFilters.startDate.toISOString().slice(0, 10)}
                                    onChange={(value) => {setTempFilters({...tempFilters, startDate: moment(value.currentTarget.value).startOf("day").toDate()})}}
                                    ref={popupStartDateInput}
                                />
                                <span>e</span>
                                <input
                                    type="date"
                                    value={tempFilters.endDate.toISOString().slice(0, 10)}
                                    onChange={(value) => {setTempFilters({...tempFilters, endDate: moment(value.currentTarget.value).startOf("day").toDate()})}}
                                    ref={popupEndDateInput}
                                />
                            </div>
                        </label>

                        <div className={styles.search_button_container}>
                            <button onClick={handlePopupSearchButtonClick}>Pesquisar</button>
                        </div>
                    </div>
                )
            }
        </div>
    )
}

function useMouseClickListener(popupRef: MutableRefObject<HTMLDivElement | null>) {
    const [isPopupOpen, setIsPopupOpen] = useState(false)

    useEffect(() => {
        function handleClickOutsideMenu(e: MouseEvent) {
            if (isPopupOpen && popupRef.current && !popupRef.current.contains(e.target as Node)) {
                setIsPopupOpen(false)
            }
        }

        document.addEventListener("click", handleClickOutsideMenu, true)

        return () => {
            document.removeEventListener("click", handleClickOutsideMenu, true)
        }
    }, [isPopupOpen])

    function toggleShowPopup() {
        setIsPopupOpen((prevStateValue) => {return !prevStateValue})
    }

    return { isPopupOpen, toggleShowPopup }
}

export { TransactionSearchBox }