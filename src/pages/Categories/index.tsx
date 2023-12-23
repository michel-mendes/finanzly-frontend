import { useState, useEffect} from "react"
import { useNavigate } from "react-router-dom"
import { IoArrowBack } from "react-icons/io5"

// Interfaces
import { ICategory } from "../../type-defs"

// Crud forms
import { FormCategoryCRUD } from "../../components/FormCategoryCRUD"

// Hooks
import { useModal } from "../../hooks/useModal"
import { useToastNotification } from "../../hooks/useToastNotification"

// Components
import { PageHeaderDesktop } from "../../components/PageHeaderDesktop"
import { CategoriesList } from "./CategoriesList"
import { ModalSaveCancel } from "../../components/Modal"
import { LoadingOverlay } from "../../components/LoadingPageOverlay"

// Services
import { useAuthContext } from "../../contexts/Auth"
import { useCategories } from "../../hooks/useCategories"

import styles from "./styles.module.css"

function CategoriesPage() {
    const { loggedUser } = useAuthContext()
    const navigate = useNavigate()

    const {showSuccessNotification} = useToastNotification()

    const {categoriesList, loadingCategories, awaitingResponse, tempCategory, setTempCategory, createCategory, updateCategory, deleteCategory} = useCategories()

    const { isOpen, showModal, closeModal } = useModal()

    const [modalTitle, setModalTitle] = useState("")
    const [isEditing, setIsEditing] = useState(false)


    function handleOpenModal(categoryToEdit: ICategory | null = null) {
        setIsEditing(categoryToEdit !== null)
        setModalTitle((categoryToEdit !== null) ? "Alterar categoria" : "Nova categoria")
        
        if (!categoryToEdit) {
            setTempCategory({
                categoryName: "",
                fromUser: loggedUser?.id,
                iconPath: "",
                transactionType: ""
            })
        }
        else {
            setTempCategory(categoryToEdit)
        }

        showModal()
    }

    async function handleModalSaveClick() {
        const success = (!isEditing) ? (await createCategory({...tempCategory!, fromUser: loggedUser?.id})) : (await updateCategory(tempCategory!.id!, tempCategory!))

        if (success) {
            setTempCategory(null)
            closeModal()
        }
    }

    function handleModalCancelClick() {
        setTempCategory(null)
        closeModal()
    }

    async function handleModalDeleteClick() {
        const success = await deleteCategory(tempCategory?.id!)

        if (success) {
            showSuccessNotification(`A categoria "${tempCategory?.categoryName}" foi removida`)
            setTempCategory(null)
            closeModal()
        }
    }

    useEffect(() => {
        document.title = "Categorias Finanzly"
    }, [])

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
                {
                    loadingCategories ? <LoadingOverlay /> : <CategoriesList categoriesList={categoriesList} onClickItem={handleOpenModal} />
                }
            </div>

            <ModalSaveCancel isOpen={isOpen} modalTitle={modalTitle} modalButtons={{
                saveButton: { onClick: handleModalSaveClick },
                cancelButton: { onClick: handleModalCancelClick },
                deleteButton: { onClick: handleModalDeleteClick, enabled: isEditing }
            }}>
                <FormCategoryCRUD categoryData={tempCategory} setCategoryData={setTempCategory} />
            </ModalSaveCancel>
        </div>
    )
}

export { CategoriesPage }