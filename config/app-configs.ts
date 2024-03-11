const baseApiUrl = __API_BASE_URL__

export const appConfigs = {
    
    // Users endpoints
    userRegisterEndpoint: `${baseApiUrl}/users/register`,
    userVerifyToken: `${baseApiUrl}/users/verify-user/`,
    userEditEndpoint: `${baseApiUrl}/users/`, // + userId
    userLoginEnpoint: `${baseApiUrl}/users/authenticate`,
    userLogoutEnpoint: `${baseApiUrl}/users/logout`,
    getUserLoggedEndpoint: `${baseApiUrl}/users/current`,
    userSetActiveWalletEndpoint: `${baseApiUrl}/users/set-active-wallet`,

    // Wallets endpoints
    walletCreateEndpoint: `${baseApiUrl}/wallets/`,
    walletGetAllEndpoint: `${baseApiUrl}/wallets/`,
    walletGetByIdEndpoint: `${baseApiUrl}/wallets/`, // + walletId
    walletGetFromUserEndpoint: `${baseApiUrl}/wallets/from-user/`,
    walletUpdateEndpoint: `${baseApiUrl}/wallets/`, // + walletId
    walletDeleteEndpoint: `${baseApiUrl}/wallets/`, // + walletId
    walletCalculateBalanceEndpoint: `${baseApiUrl}/wallets/calculate-balance`,

    // Categories endpoints
    categoryCreateEndpoint: `${baseApiUrl}/categories/`,
    categoryGetAllEndpoint: `${baseApiUrl}/categories/`,
    categoryGetByIdEndpoint: `${baseApiUrl}/categories/`, // + categoryId
    categoryGetCategoriesFromUser: `${baseApiUrl}/categories/from-user/`,
    categoryUpdateEndpoint: `${baseApiUrl}/categories/`, // + categoryId
    categoryDeleteEndpoint: `${baseApiUrl}/categories/`, // + categoryId

    // Transactions Endpoints
    transactionCreateEndpoint: `${baseApiUrl}/transactions/`,
    transactionGetAllEndpoint: `${baseApiUrl}/transactions/`,
    transactionGetByIdEndpoint: `${baseApiUrl}/transactions/`, // + transactionId
    transactionGetFromWallet: `${baseApiUrl}/transactions/from-wallet/`,
    transactionUpdateEndpoint: `${baseApiUrl}/transactions/`, // + transactionId
    transactionDeleteEndpoint: `${baseApiUrl}/transactions/`, // + transactionId
    
    // Import Endpoint
    importPostEndpoint: `${baseApiUrl}/upload/`,

    // Report Endpoint
    reportGetEndpoint: `${baseApiUrl}/report/`,

    // Ping endpoint
    pingEndpoint: `${baseApiUrl}/ping`
}