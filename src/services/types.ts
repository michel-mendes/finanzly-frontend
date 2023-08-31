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
    csvImportId?:           string;
    currentWalletBalance?:  number;
}