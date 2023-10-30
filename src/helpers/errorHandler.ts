// Toast notification component
import { useToastNotification } from "../hooks/useToastNotification"

export function handleError(error: any, showErrorNotification?: (message: string) => void) {

    const errorMessage: string = error.response?.data?.errors?.[0] || `Oops, algo deu errado. Tente novamente mais tarde.(${error.message})`
    
    // execute "showErrorNotification" if received in parameter
    if (showErrorNotification) {showErrorNotification(errorMessage)}
    
    return new Error(errorMessage)
}





// DEPRECATED - Temporarily being used until fully remotion
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