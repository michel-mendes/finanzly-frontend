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