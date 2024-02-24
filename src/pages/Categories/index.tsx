import { useState, useEffect } from "react"

// Interfaces
import { ICategory } from "../../type-defs"

// Crud forms
import { FormCategoryCRUD } from "../../components/FormCategoryCRUD"

// Hooks
import { useModal } from "../../hooks/useModal"
import { useToastNotification } from "../../hooks/useToastNotification"

// Components
import { CustomButton } from "../../components/CustomButton"
import { CategoriesList } from "./CategoriesList"
import { ModalSaveCancel } from "../../components/Modal"
import { LoadingOverlay } from "../../components/LoadingPageOverlay"

// Services
import { useAuthContext } from "../../contexts/Auth"
import { useCategories } from "../../hooks/useCategories"

// Icons
import addIcon from "../../assets/add.svg"

// Stylesheet
import styles from "./styles.module.css"

function CategoriesPage() {
    const { loggedUser } = useAuthContext()

    const { showSuccessNotification } = useToastNotification()

    const { categoriesList, loadingCategories, tempCategory, setTempCategory, createCategory, updateCategory, deleteCategory } = useCategories()

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
        const success = (!isEditing) ? (await createCategory({ ...tempCategory!, fromUser: loggedUser?.id })) : (await updateCategory(tempCategory!.id!, tempCategory!))

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

            <div className={styles.list_container}>

                <div className={styles.header}>
                    <p className={styles.header_title}>Minhas categorias</p>

                    <CustomButton caption="Nova categoria" icon={addIcon} handleClick={() => { handleOpenModal() }} />
                </div>

                <ul className={styles.list}>
                    {
                        loadingCategories
                        ? <LoadingOverlay />
                        : <CategoriesList categoriesList={categoriesList} onClickItem={handleOpenModal} />
                    }
                </ul>

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