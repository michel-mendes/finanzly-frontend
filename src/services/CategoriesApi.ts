import axios, { AxiosInstance } from "axios";
import { appConfigs } from "../../config/app-configs";

// Interfaces
import { ICategory } from "./types";
import { IApiErrorResponse, buildError } from "../helpers/errorHandler";

export class CategoriesApi {
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

    async getCategoriesFromLoggedUser(): Promise<ICategory[] | IApiErrorResponse> {
        try {
            const response: ICategory[] = (await this.api().get(`${appConfigs.categoryGetCategoriesFromUser}`)).data

            return response
        } catch (error: any) {
            return buildError(error)
        }
    }

    async createCategory(data: ICategory): Promise<ICategory | IApiErrorResponse> {
        try {
            const createdCategory = (await this.api().post(appConfigs.categoryCreateEndpoint, data)).data

            return createdCategory
        } catch (error: any) {
            return buildError(error)
        }
    }

    async updateCategory(categoryId: string, data: ICategory): Promise<ICategory | IApiErrorResponse> {
        try {
            // id, fromUser and actualBalance can't be sent
            // other properties are destructured in "newData"
            const { id, fromUser, ...newData } = data

            const updatedCategory: ICategory = (await this.api().put(`${appConfigs.categoryUpdateEndpoint}${categoryId}`, newData)).data

            return updatedCategory
        } catch (error: any) {
            return buildError(error)
        }
    }

    async deleteCategory(categoryId: string): Promise<ICategory | IApiErrorResponse> {
        try {
            const deletedCategory: ICategory = (await this.api().delete(`${appConfigs.categoryDeleteEndpoint}${categoryId}`)).data

            return deletedCategory
        } catch (error: any) {
            return buildError(error)
        }
    }
}