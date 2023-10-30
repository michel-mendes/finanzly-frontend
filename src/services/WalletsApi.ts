import axios, { AxiosInstance, AxiosResponse, AxiosError } from "axios";
import { appConfigs } from "../../config/app-configs";

// Interfaces
import { IWallet } from "./types";
import { IApiErrorResponse, buildError } from "../helpers/errorHandler";

export class WalletsApi {
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

    async getWallet(id: string): Promise<IWallet | IApiErrorResponse> {
        try {
            const response: IWallet = (await this.api().get(`${appConfigs.walletGetByIdEndpoint}${id}`)).data

            return response
        } catch (error: any) {
            return buildError(error)
        }
    }

    async getWalletsFromUser(): Promise<IWallet[] | IApiErrorResponse> {
        try {
            const response: IWallet[] = (await this.api().get(appConfigs.walletGetFromUserEndpoint)).data

            return response
        } catch (error: any) {
            return buildError(error)
        }
    }

    async createWallet(data: IWallet): Promise<IWallet | IApiErrorResponse> {
        try {
            const createdWallet = (await this.api().post(appConfigs.walletCreateEndpoint, data)).data

            return createdWallet
        } catch (error: any) {
            return buildError(error)
        }
    }

    async updateWallet(walletId: string, data: IWallet): Promise<IWallet | IApiErrorResponse> {
        try {
            // id, fromUser and actualBalance can't be sent
            // other properties are destructured in "newData"
            const { id, fromUser, actualBalance, ...newData } = data

            const updatedWallet: IWallet = (await this.api().put(`${appConfigs.walletUpdateEndpoint}${walletId}`, newData)).data

            return updatedWallet
        } catch (error: any) {
            return buildError(error)
        }
    }

    async deleteWallet(walletId: string): Promise<IWallet | IApiErrorResponse> {
        try {
            const deletedWallet: IWallet = (await this.api().delete(`${appConfigs.walletDeleteEndpoint}${walletId}`)).data

            return deletedWallet
        } catch (error: any) {
            return buildError(error)
        }
    }
}