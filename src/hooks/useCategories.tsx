import { useEffect, useState } from "react"

// Services
import { api } from "../helpers/apiCall"
import { handleError } from "../helpers/errorHandler"

// Interfaces
import { ICategory } from "../type-defs"

// Hooks
import { useToastNotification } from "./useToastNotification"

// Custom decorator
import { decorateCustomHookFunction } from "../helpers/hookDecorator"

// Configs
import { appConfigs } from "../../config/app-configs"


const {
    categoryGetCategoriesFromUser,
    categoryCreateEndpoint,
    categoryUpdateEndpoint,
    categoryDeleteEndpoint
} = appConfigs

export function useCategories() {

    const {showErrorNotification} = useToastNotification()
    
    const [tempCategory, setTempCategory] = useState<ICategory | null>(null)
    const [categoriesList, setCategoriesList] = useState<ICategory[]>([])
    const [loadingCategories, setLoadingCategories] = useState(true)
    const [awaitingResponse, setAwaitingResponse] = useState(false)

    useEffect(() => {
        decoratedGetCateriesFromLoggedUser()
    }, [])

    async function getCategoriesFromLoggedUser() {
        try {
            const categories: Array<ICategory> = (await api.get(`${categoryGetCategoriesFromUser}`)).data

            setCategoriesList(categories)
        } catch (error: any) {
            showErrorNotification( handleError(error).message )
        }
    }

    async function createCategory(categoryData: ICategory) {
        try {
            const createdCategory = (await api.post(categoryCreateEndpoint, categoryData)).data

            setCategoriesList([...categoriesList, createdCategory])

            return true
        } catch (error: any) {
            showErrorNotification( handleError(error).message )
            return false
        }
    }

    async function updateCategory(categoryId: string, categoryData: ICategory) {
        try {
            // id, fromUser and actualBalance can't be sent
            // other properties are destructured in "newData"
            const { id, fromUser, ...newData } = categoryData

            const updatedCategory: ICategory = (await api.put(`${categoryUpdateEndpoint}${categoryId}`, newData)).data

            const updatedCategoriesList = categoriesList.map(category => {
                return (category.id == updatedCategory.id) ? updatedCategory : category
            })

            setCategoriesList(updatedCategoriesList)

            return true
        } catch (error: any) {
            showErrorNotification( handleError(error).message )
            return false
        }
    }

    async function deleteCategory(categoryId: string) {
        try {
            const deletedCategory: ICategory = (await api.delete(`${categoryDeleteEndpoint}${categoryId}`)).data

            const updatedCategoriesList = categoriesList.filter(category => {
                return category.id !== deletedCategory.id
            })

            setCategoriesList(updatedCategoriesList)

            return true
        } catch (error: any) {
            showErrorNotification( handleError(error).message )
            return false
        }
    }

    const decoratedGetCateriesFromLoggedUser = decorateCustomHookFunction(getCategoriesFromLoggedUser, setLoadingCategories)
    const decoratedCreateWallet = decorateCustomHookFunction(createCategory, setAwaitingResponse)
    const decoratedUpdateWallet = decorateCustomHookFunction(updateCategory, setAwaitingResponse)
    const decoratedDeleteWallet = decorateCustomHookFunction(deleteCategory, setAwaitingResponse)

    return {
        tempCategory,
        setTempCategory,
        categoriesList,
        getCategoriesFromLoggedUser: decoratedGetCateriesFromLoggedUser,
        createCategory: decoratedCreateWallet,
        updateCategory: decoratedUpdateWallet,
        deleteCategory: decoratedDeleteWallet,
        loadingCategories,
        awaitingResponse
    }
}