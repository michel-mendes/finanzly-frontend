import { Dispatch, SetStateAction, PropsWithChildren } from "react"
import { ICategory, ITransaction, IWallet } from "./services/types"

export interface ILoginProps {
    email:      string;
    password:   string;
}

export interface IForgotPasswordProps {
    email: string
}

export interface IRegisterProps {
    firstName:  string
    email:      string
    password:   string
}

export interface IAuthenticatedUser {
    id: string;
    firstName: string;
    role: string;
    activeWallet: IWallet | null;
}

export interface IAuthContextProps extends PropsWithChildren {
    loggedUser: IAuthenticatedUser | null,
    loadingUser: boolean,
    loginUser: (loginData: ILoginProps) => void,
    logoutUser: () => void,
    getLoggedUser: () => void,
    setActiveWallet: (walletId: string) => void;
}

export interface ITransactionsPageFilters {
    wallet: IWallet | null,
    text: string,
    category: string,
    startDate: Date,
    endDate: Date
}

export interface ITransactionSearchBoxProps {
    filters: ITransactionsPageFilters,
    setFilters: Dispatch<SetStateAction<ITransactionsPageFilters>>,
    walletsList: Array<IWallet>,
    onSearchButtonClick?: () => void,
    customWidth?: string | number
}

export interface useTransactionEditorModalHookProps {
    walletsList: Array<IWallet>,
    setWalletsList: Dispatch<SetStateAction<Array<IWallet>>>,
    categoriesList: Array<ICategory>,
    draftTransaction: ITransaction | null,
    setDraftTransaction: Dispatch<SetStateAction<ITransaction | null>>
    updateTransaction(data: ITransaction): Promise<ITransaction | null>,
    newTransaction(data: ITransaction): Promise<ITransaction | null>,
    deleteTransaction(transaction: ITransaction): Promise<ITransaction | null>
}