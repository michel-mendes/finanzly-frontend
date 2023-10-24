import axios from "axios"

function configApiCall() {
    const clientAxios = axios.create(
        {
            withCredentials: true,
            headers: {
                Accept: "application/json"
            }
        }
    )

    return clientAxios
}

export const api = configApiCall()