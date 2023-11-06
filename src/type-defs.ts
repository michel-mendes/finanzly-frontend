import { Dispatch, SetStateAction, PropsWithChildren } from "react"

// Data base DATATYPES
////////////////////////////////////////////////////
export interface IWallet {
    id?:                string;
    fromUser?:          string;
    walletName?:        string;
    currencySymbol?:    string;
    initialBalance?:    number;
    actualBalance?:     number;
    iconPath?:          string;
}

export interface ICategory {
    id?:                string;
    fromUser?:          string;
    categoryName?:      string;
    transactionType?:   string;
    iconPath?:          string;
}

export interface ITransaction {
    id?:                    string;
    fromCategory?:          string;
    fromWallet?:            string;
    fromUser?:              string;
    date?:                  number | string;
    description?:           string;
    description_Upper?:     string;
    extraInfo?:             string;
    extraInfo_Upper?:       string;
    value?:                 number;
    creditValue?:           number;
    debitValue?:            number;
    importedTransaction?:   boolean;
    csvImportId?:           string;
    currentWalletBalance?:  number;
}
////////////////////////////////////////////////////



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

export interface ILoginContextProps extends PropsWithChildren {
    props?: {
        loginData:              ILoginProps
        loginError:             string | null
        setLoginData:           Function
        setLoginError:          Function

        forgotPasswordData:     IForgotPasswordProps
        forgotPasswordError:    string | null
        setForgotPasswordData:  Function
        setForgotPasswordError: Function

        registerData:           IRegisterProps
        registerError:          string | null
        setRegisterData:        Function
        setRegisterError:       Function
    }
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
    updateWalletBalance(walletId: string, newBalance: number): Promise<void>,
    categoriesList: Array<ICategory>,
    tempTransaction: ITransaction | null,
    setTempTransaction: Dispatch<SetStateAction<ITransaction | null>>
    createTransaction(transactionData: ITransaction): Promise<boolean>,
    updateTransaction(transactionId: string, transactionData: ITransaction): Promise<boolean>,
    deleteTransaction(transactionId: string): Promise<boolean>,
    walletBalanceAfterLastTransaction: number;
}