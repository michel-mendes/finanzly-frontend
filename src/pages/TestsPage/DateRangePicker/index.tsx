import {useState, useEffect, useRef, Dispatch, SetStateAction, MutableRefObject} from "react"
import moment from "moment"

import styles from "./styles.module.css"

interface IDateRangePickerProps {
    dateRange: {
        startDate: Date,
        endDate: Date
    },
    setDateRange: Dispatch< SetStateAction<{
        startDate: Date,
        endDate: Date
    }>>
}

function DateRangePicker({dateRange, setDateRange}: IDateRangePickerProps) {
    const popupDateSelector = useRef(null)
    const {isPopupOpen, toggleShowPopup} = useMouseClickListener(popupDateSelector)

    const [tempDates, setTempDates] = useState({
        startDate: new Date(Date.now()).toISOString().slice(0, 10),
        endDate: new Date(Date.now()).toISOString().slice(0, 10)
    })


    function setSelectedDates() {
        setDateRange({
            startDate: moment(tempDates.startDate).startOf("day").toDate(),
            endDate: moment(tempDates.endDate).startOf("day").toDate()
        })

        toggleShowPopup()
    }

    function setTempDate(dateField: "startDate" | "endDate", value: string) {
        setTempDates({...tempDates, [dateField]: new Date(value).toISOString().slice(0, 10)})
    }

    return (
        <div className={styles.container} ref={popupDateSelector}>
            <input
                type="text"
                value={`${dateRange.startDate.toLocaleDateString()} ~ ${dateRange.endDate.toLocaleDateString()}`}
                onClick={toggleShowPopup}
                className={styles.date_range_input}
                readOnly
            />

            {
                isPopupOpen && (
                    <div className={styles.popup_container}>
                        <span>Selecione o intervalo de datas</span>
                        <div>
                            <input type="date" value={tempDates.startDate} onChange={(value) => { setTempDate("startDate", value.currentTarget.value) }} />
                            <span> até </span>
                            <input type="date" value={tempDates.endDate} onChange={(value) => { setTempDate("endDate", value.currentTarget.value) }} />

                        </div>
                        <div>
                            <button onClick={setSelectedDates}>Aplicar este intervalo</button>
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

export { DateRangePicker }