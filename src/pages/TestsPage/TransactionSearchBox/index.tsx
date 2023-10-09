import {useState, useEffect, useRef, Dispatch, SetStateAction, MutableRefObject} from "react"
import { AiOutlineSearch } from "react-icons/ai"
import moment from "moment"

// Interfaces
import { ITransactionsPageFilters } from "../../../prop-defs"

import styles from "./styles.module.css"

interface ITransactionSearchBoxProps {
    filters: ITransactionsPageFilters,
    setFilters: Dispatch< SetStateAction<ITransactionsPageFilters> >
}

function TransactionSearchBox({filters, setFilters}: ITransactionSearchBoxProps) {
    const popupSearchFilters = useRef(null)
    const {isPopupOpen, toggleShowPopup} = useMouseClickListener(popupSearchFilters)


    return (
        <div className={styles.container} ref={popupSearchFilters}>
            <div>
                <AiOutlineSearch />
                <input
                    type="text"
                    // value={`${dateRange.startDate.toLocaleDateString()} ~ ${dateRange.endDate.toLocaleDateString()}`}
                    onClick={toggleShowPopup}
                    className={styles.date_range_input}
                    readOnly
                />
            </div>

            {
                isPopupOpen && (
                    <div className={styles.popup_container}>
                        <div>
                            <span>Contém as palavras</span>
                            <input  
                                type="text"
                                onChange={(value) => {setFilters({...filters, text: value.currentTarget.value})}}
                            />
                        </div>

                        <div>
                            <span>Seja da categoria</span>
                            <input
                                type="text"
                                onChange={(value) => {setFilters({...filters, category: value.currentTarget.value})}}
                            />
                        </div>

                        <div>
                            <span>Data entre</span>
                            <div>
                                <input
                                    type="date"
                                    value={filters.startDate.toISOString().slice(0, 10)}
                                    onChange={(value) => {setFilters({...filters, startDate: moment(value.currentTarget.value).startOf("day").toDate()})}}
                                />
                                <span>e</span>
                                <input
                                    type="date"
                                    value={filters.endDate.toISOString().slice(0, 10)}
                                    onChange={(value) => {setFilters({...filters, endDate: moment(value.currentTarget.value).startOf("day").toDate()})}}
                                />
                            </div>
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