import axios, { AxiosInstance } from "axios";
import { appConfigs } from "../../config/app-configs";

// Interfaces
import { ITransaction } from "./types";
import { IApiErrorResponse, buildError } from "../interfaces/ApiErrorResponse";

export class TransactionsApi {
    private api(): AxiosInstance {
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

    async getAllTransactions(): Promise<ITransaction[] | IApiErrorResponse> {
        try {
            const response: ITransaction[] = (await this.api().get(`${appConfigs.transactionGetAllEndpoint}`)).data

            return response
        } catch (error: any) {
            return buildError(error)
        }
    }
    
    async getTransactionsFromWallet(walletId: string): Promise<ITransaction[] | IApiErrorResponse> {
        try {
            const response: ITransaction[] = (await this.api().get(`${appConfigs.transactionGetFromWallet}${walletId}`)).data

            return response
        } catch (error: any) {
            return buildError(error)
        }
    }

    async createTransaction(data: ITransaction): Promise<ITransaction | IApiErrorResponse> {
        try {
            const createdTransaction = (await this.api().post(appConfigs.transactionCreateEndpoint, data)).data

            return createdTransaction
        } catch (error: any) {
            return buildError(error)
        }
    }

    async updateTransaction(transactionId: string, data: ITransaction): Promise<ITransaction | IApiErrorResponse> {
        try {
            // id, fromUser and actualBalance can't be sent
            // other properties are destructured in "newData"
            const { id, fromUser, ...newData } = data

            const updatedTransaction: ITransaction = (await this.api().put(`${appConfigs.transactionUpdateEndpoint}${transactionId}`, newData)).data

            return updatedTransaction
        } catch (error: any) {
            return buildError(error)
        }
    }

    async deleteTransaction(transactionId: string): Promise<ITransaction | IApiErrorResponse> {
        try {
            const deletedTransaction: ITransaction = (await this.api().delete(`${appConfigs.transactionDeleteEndpoint}${transactionId}`)).data

            return deletedTransaction
        } catch (error: any) {
            return buildError(error)
        }
    }
}