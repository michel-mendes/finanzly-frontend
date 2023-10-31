import { useState, useEffect } from "react"
import { useNavigate } from "react-router-dom"
import { IoArrowBack } from "react-icons/io5"

// Interfaces
import { ICategory } from "../../services/types"

// Crud forms
import { FormCategoryCRUD } from "../../components/FormCategoryCRUD"

// Hooks
import { useModal } from "../../hooks/useModal"

// Components
import { PageHeaderDesktop } from "../../components/PageHeaderDesktop"
import { CategoriesList } from "./CategoriesList"
import { ModalSaveCancel } from "../../components/Modal"

// Services
import { useAuthContext } from "../../contexts/Auth"
import { CategoriesApi } from "../../services/CategoriesApi"

import styles from "./styles.module.css"

function CategoriesPage() {
    const { loggedUser } = useAuthContext()
    const navigate = useNavigate()
    const api = new CategoriesApi()

    const { isOpen, showModal, closeModal } = useModal()

    const [modalCategory, setModalCategory] = useState<ICategory | null>(null)
    const [modalTitle, setModalTitle] = useState("")
    const [isEditing, setIsEditing] = useState(false)

    const [categoriesList, setCategoriesList] = useState<ICategory[]>([])

    useEffect(() => {
        async function getMyCategories() {
            const list = await api.getCategoriesFromLoggedUser()

            if ("error" in list) {
                alert(`Erro ao atualizar lista de categorias:\n\n${list.error}`)
                return
            }

            setCategoriesList(list)
        }

        getMyCategories()
    }, [])

    function handleOpenModal(categoryToEdit: ICategory | null = null) {
        setIsEditing(categoryToEdit !== null)
        setModalTitle((categoryToEdit !== null) ? "Alterar categoria" : "Nova categoria")
        
        if (!categoryToEdit) {
            setModalCategory({
                categoryName: "",
                fromUser: loggedUser?.id,
                iconPath: "",
                transactionType: ""
            })
        }
        else {
            setModalCategory(categoryToEdit)
        }

        showModal()
    }

    async function handleModalSaveClick() {
        const savedCategory = (!isEditing) ? (await api.createCategory({...modalCategory!, fromUser: loggedUser?.id})) : (await api.updateCategory(modalCategory!.id!, modalCategory!))

        if ("error" in savedCategory) {
            alert(`Erro durante a operação:\n${savedCategory.error}`)
            console.log(savedCategory)
            return
        }

        if (isEditing) {
            const updatedCategoriesList = categoriesList!.map(category => {
                return (savedCategory.id == category.id) ? savedCategory : category
            })

            setCategoriesList(updatedCategoriesList)
        }
        else {
            setCategoriesList([...categoriesList!, savedCategory])
        }

        setModalCategory(null)
        closeModal();
    }

    function handleModalCancelClick() {
        setModalCategory(null)
        closeModal();
    }

    async function handleModalDeleteClick() {
        const deletedCategory = await api.deleteCategory(modalCategory?.id!)

        if ("error" in deletedCategory) {
            alert(`Erro durante a operação:\n${deletedCategory.error}`)
            console.log(deletedCategory)
            return
        }

        const newList = categoriesList.filter(category => {
            if (category.id !== deletedCategory.id) { return category }
        })

        setCategoriesList(newList)

        alert("Categoria excluída com sucesso!")

        setModalCategory(null)
        closeModal();
    }

    return (
        <div className={styles.page_container}>
            <PageHeaderDesktop>
                <div className={styles.header_content}>
                    <i onClick={() => { navigate("/dashboard") }}>{<IoArrowBack />}</i>
                    <span>Minhas categorias</span>
                    <button onClick={() => { handleOpenModal() }}>Nova categoria</button>
                </div>
            </PageHeaderDesktop>

            <div className={styles.list_container}>
                <CategoriesList categoriesList={categoriesList} onClickItem={handleOpenModal} />
            </div>

            <ModalSaveCancel isOpen={isOpen} modalTitle={modalTitle} modalButtons={{
                saveButton: { onClick: handleModalSaveClick },
                cancelButton: { onClick: handleModalCancelClick },
                deleteButton: { onClick: handleModalDeleteClick, enabled: isEditing }
            }}>
                <FormCategoryCRUD categoryData={modalCategory} setCategoryData={setModalCategory} />
            </ModalSaveCancel>
        </div>
    )
}

export { CategoriesPage }