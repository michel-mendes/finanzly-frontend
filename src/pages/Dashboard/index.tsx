import { Navigate, useNavigate } from "react-router-dom"
import { appConfigs } from "../../../config/app-configs"
import axios from "axios"

// Auth context
import { useAuthContext } from "../../contexts/Auth"

// Modal
import { useModal } from "../../hooks/useModal"

const { userLogoutEnpoint } = appConfigs

function DashboardPage() {
    const { loggedUser, setLoggedUser } = useAuthContext()
    if (!loggedUser) return <Navigate to="/login" />

    const navigate = useNavigate()

    const { isOpen, closeModal, showModal } = useModal()
    const { isOpen2, closeModal2, showModal2 } = useOtherModal()

    function handleOkClick() {
        alert("Cricou em OK")
        closeModal2()
    }
    function handleCancelClick() {
        alert("Cricou em cancelar")
        closeModal2()
    }

    async function handleLogoutUser() {
        try {
            const resp = await axios.post(userLogoutEnpoint, {}, {withCredentials: true})

            // alert(resp.data.message)
            setLoggedUser!(null)
        } catch (error: any) {
            alert("Erro")
        }
    }

    return (
        <>
            <h1>Dashboard</h1>
            <h2>Escolha uma das opções abaixo</h2>
            <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
                <button onClick={() => {navigate("/wallets")}}>Minhas cartieras</button>
                <button onClick={() => {navigate("/categories")}}>Minhas categorias</button>
                <button onClick={() => {navigate("/transactions")}}>Minhas transações</button>
                <hr />
                <button onClick={handleLogoutUser}>Sair</button>
            </div>
        </>
    )
}

function useOtherModal() {
    const { isOpen, closeModal, showModal } = useModal()

    return { isOpen2: isOpen, closeModal2: closeModal, showModal2: showModal }
}

export { DashboardPage }