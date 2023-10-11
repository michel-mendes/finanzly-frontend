import { Dispatch, SetStateAction } from "react"

export interface ITransactionsPageFilters {
    text: string,
    category: string,
    startDate: Date,
    endDate: Date
}

export interface ITransactionSearchBoxProps {
    filters: ITransactionsPageFilters,
    setFilters: Dispatch<SetStateAction<ITransactionsPageFilters>>
}