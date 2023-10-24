const baseApiUrl = import.meta.env.VITE_API_BASE_URL

export const appConfigs = {
    
    // Users endpoints
    userLoginEnpoint: baseApiUrl + import.meta.env.VITE_USER_LOGIN_ENDPOINT,
    userLogoutEnpoint: baseApiUrl + import.meta.env.VITE_USER_LOGOUT_ENDPOINT,
    getUserLoggedEndpoint: baseApiUrl + import.meta.env.VITE_GET_LOGGED_USER_ENDPOINT,
    userSetActiveWalletEndpoint: baseApiUrl + import.meta.env.VITE_USER_SET_ACTIVE_WALLET,

    // Wallets endpoints
    walletCreateEndpoint: `${baseApiUrl}${import.meta.env.VITE_WALLET_POST}`,
    walletGetAllEndpoint: `${baseApiUrl}${import.meta.env.VITE_WALLET_GET_ALL}`,
    walletGetByIdEndpoint: `${baseApiUrl}${import.meta.env.VITE_WALLET_GET_BY_ID}`,
    walletGetFromUserEndpoint: `${baseApiUrl}${import.meta.env.VITE_WALLET_GET_FROM_USER}`,
    walletUpdateEndpoint: `${baseApiUrl}${import.meta.env.VITE_WALLET_PUT}`,
    walletDeleteEndpoint: `${baseApiUrl}${import.meta.env.VITE_WALLET_DELETE}`,
    walletCalculateBalanceEndpoint: `${baseApiUrl}${import.meta.env.VITE_WALLET_CALCULATE_BALANCE}`,

    // Categories endpoints
    categoryCreateEndpoint: `${baseApiUrl}${import.meta.env.VITE_CATEGORY_POST}`,
    categoryGetAllEndpoint: `${baseApiUrl}${import.meta.env.VITE_CATEGORY_GET_ALL}`,
    categoryGetByIdEndpoint: `${baseApiUrl}${import.meta.env.VITE_CATEGORY_GET_BY_ID}`,
    categoryGetCategoriesFromUser: `${baseApiUrl}${import.meta.env.VITE_CATEGORY_GET_FROM_USER}`,
    categoryUpdateEndpoint: `${baseApiUrl}${import.meta.env.VITE_CATEGORY_PUT}`,
    categoryDeleteEndpoint: `${baseApiUrl}${import.meta.env.VITE_CATEGORY_DELETE}`,

    // Transactions Endpoints
    transactionCreateEndpoint: `${baseApiUrl}${import.meta.env.VITE_TRANSACTION_POST}`,
    transactionGetAllEndpoint: `${baseApiUrl}${import.meta.env.VITE_TRANSACTION_GET_ALL}`,
    transactionGetByIdEndpoint: `${baseApiUrl}${import.meta.env.VITE_TRANSACTION_GET_BY_ID}`,
    transactionGetFromWallet: `${baseApiUrl}${import.meta.env.VITE_TRANSACTION_GET_FROM_WALLET}`,
    transactionUpdateEndpoint: `${baseApiUrl}${import.meta.env.VITE_TRANSACTION_PUT}`,
    transactionDeleteEndpoint: `${baseApiUrl}${import.meta.env.VITE_TRANSACTION_DELETE}`
}