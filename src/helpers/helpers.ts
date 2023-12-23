import moment from "moment";
import { useState, useEffect, MutableRefObject } from "react";

// Private interfaces
interface ISortableObject {
    [key: string]: any;
}

export function getFullDateName_PtBr(date: Date) {

    const brDayNames = [
        'domingo',
        'segunda-feira',
        'terça-feira',
        'quarta-feira',
        'quinta-feira',
        'sexta-feira',
        'sábado'
    ]

    const brMonthNames = [
        "janeiro",
        "fevereiro",
        "março",
        "abril",
        "maio",
        "junho",
        "julho",
        "agosto",
        "setembro",
        "outubro",
        "novembro",
        "dezembro"
    ]

    return {
        dayNumber: new Date(date).getDate(),
        dayName: brDayNames[new Date(date).getDay()],
        monthName: brMonthNames[new Date(date).getMonth()],
        yearNumber: new Date(date).getFullYear()
    }

}

// Sort any array of objects by their object properties
// Ex: const sortedArray = sortArrayOfObjects<myArrayType>(myArrayToBeSorted, "propertyToBeSorted", true || false);
export function sortArrayOfObjects<T extends ISortableObject>(
    listToSort: T[],
    propertyToSort: keyof T,
    isAscending: boolean
): T[] {

    const sortedList = listToSort.sort((a, b) => {
        const sortOrder = (isAscending) ? 1 : -1
        const aValue = a[propertyToSort]
        const bValue = b[propertyToSort]

        if (aValue < bValue) {
            return (-1 * sortOrder)
        }
        else if (aValue > bValue) {
            return (1 * sortOrder)
        }
        else {
            return 0
        }
    })

    return sortedList

}

export function useClickOutsideComponentListener<T extends HTMLElement>(targetElement: MutableRefObject<T | null>) {
    const [isPopupOpen, setIsPopupOpen] = useState(false)

    useEffect(() => {
        function handleClickOutsideMenu(e: MouseEvent) {
            if (isPopupOpen && targetElement.current && !targetElement.current.contains(e.target as Node)) {
                setIsPopupOpen(false)
            }
        }

        document.addEventListener("click", handleClickOutsideMenu, true)

        return () => {
            document.removeEventListener("click", handleClickOutsideMenu, true)
        }
    }, [isPopupOpen])

    function toggleShowPopup(value?: boolean) {

        // Show or hide manually popup if "value" is declared
        if (typeof value == "boolean") {
            setIsPopupOpen(value)
        }
        // Or just toggles between show or hide
        else {
            setIsPopupOpen((prevStateValue) => { return !prevStateValue })
        }

    }

    return { isPopupOpen, toggleShowPopup }
}

export function useEscapeKeyListener(toggleShowElement: (value: boolean) => void) {

    function handleKeyDown(event: KeyboardEvent) {
        const pressedKey = event.keyCode || event.key

        if (pressedKey === "Escape" || pressedKey === "Esc" || pressedKey === 27) {
            toggleShowElement(false)
        }
    }

    useEffect(() => {

        // Adds event to document
        document.addEventListener("keydown", handleKeyDown)

        // Removes event on unmount this component
        return () => {
            document.removeEventListener("keydown", handleKeyDown)
        }
    }, [])

}

export function getStartAndEndOfMonth(firstDayOfMonth: number) {
    const currentDay = moment(Date.now()).startOf("day").date()
    const startDate = moment(Date.now()).startOf("day")
    const endDate = moment(Date.now()).startOf("day")

    if (currentDay < firstDayOfMonth) {
        startDate.subtract(1, "month").add(firstDayOfMonth - currentDay, "day").toISOString(true)
        endDate.add((firstDayOfMonth - currentDay) - 1, "day").toISOString(true)

        return { startDate, endDate }
    } else {
        startDate.subtract(currentDay - firstDayOfMonth, "day").toISOString(true)
        endDate.subtract((currentDay - firstDayOfMonth) + 1, "day").add(1, "month").toISOString(true)

        return { startDate, endDate }
    }
}