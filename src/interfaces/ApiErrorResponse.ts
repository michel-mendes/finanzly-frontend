export interface IApiErrorResponse {
    error: string; // Error message
    status: string;  // Status code
}

export function buildError(error: any): IApiErrorResponse {
    return {
        error: error.response?.data?.errors?.[0] || error.message || "Unexpected error.",
        status: error.response?.status || ""
    }
}