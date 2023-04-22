import { useEffect, useState } from "react"

// Services
import { CategoriesApi } from "../services/CategoriesApi"

// Interfaces
import { ICategory } from "../services/types"

export function useCategories() {
    const api = new CategoriesApi()

    const [draftCategory, setDraftCategory] = useState<ICategory | null>(null)
    const [categoriesList, setCategoriesList] = useState<ICategory[]>([])
    const [loadingCategories, setLoadingCategories] = useState(true)

    useEffect(() => {
        async function fetchData() {
            setLoadingCategories(true)

            const categories = await api.getCategoriesFromLoggedUser()

            if ("error" in categories) {
                alert(`Erro ao atualizar lista de categorias:\n\n${categories.error}`)
                console.log(categories)
                return
            }

            setCategoriesList(categories)
            setLoadingCategories(false)
        }

        fetchData()
    }, [])

    return { draftCategory, setDraftCategory, categoriesList, setCategoriesList, loadingCategories, setLoadingCategories }
}