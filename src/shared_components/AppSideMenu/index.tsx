import { useState } from "react"
import { Link } from "react-router-dom"
import axios from "axios"
import { useAuthContext } from "../../contexts/Auth"
import { appConfigs } from "../../../config/app-configs"
import { BsGrid3X3GapFill, BsListUl } from "react-icons/bs"
import { BsFillPieChartFill } from "react-icons/bs"
import { IoWalletSharp, IoLogOut } from "react-icons/io5"
import { RxHamburgerMenu } from "react-icons/rx"
import { BsGearFill } from "react-icons/bs"

import styles from "./styles.module.css"

const { userLogoutEnpoint } = appConfigs

function AppSideMenu() {
    const { loggedUser, setLoggedUser } = useAuthContext()

    const [isExpanded, setIsExpanded] = useState(false)

    function handleMenuButtonClick() {
        setIsExpanded(prevState => { return !prevState })
    }

    async function handleLogoutUser() {
        try {
            const resp = await axios.post(userLogoutEnpoint, {}, { withCredentials: true })

            // alert(resp.data.message)
            setLoggedUser!(null)
        } catch (error: any) {
            alert("Erro")
        }
    }

    const menuExpandedOrNot = (isExpanded) ? `${styles.side_menu} ${styles.expanded}` : styles.side_menu

    return (
        <div className={menuExpandedOrNot}>
            <ul>

                {/* Menu links to pages */}
                <div>
                    <div title="Menu" className={styles.header}>
                        <i onClick={handleMenuButtonClick}><RxHamburgerMenu></RxHamburgerMenu></i>
                        <span>Finanzly</span>
                    </div>
                    <li title="Dashboard">
                        <Link to="/dashboard" className={styles.menu_item}>
                            <i><BsFillPieChartFill /></i>
                            <span>Dashboard</span>
                        </Link>
                    </li>

                    <li title="Carteiras">
                        <Link to="/wallets" className={styles.menu_item}>
                            <i><IoWalletSharp /></i>
                            <span>Carteiras</span>
                        </Link>
                    </li>

                    <li title="Categorias">
                        <Link to="/categories" className={styles.menu_item}>
                            <i><BsGrid3X3GapFill /></i>
                            <span>Categorias</span>
                        </Link>
                    </li>

                    <li title="Transações">
                        <Link to="/transactions" className={styles.menu_item}>
                            <i><BsListUl /></i>
                            <span>Transações</span>
                        </Link>
                    </li>
                </div>


                {/* Menu links for user management */}
                <div>
                    <li title={"Configurações"}>
                        <Link to={"javascript:void(0);"} className={styles.menu_item}>
                            <i><BsGearFill /></i>
                            <span>{`Configurações`}</span>
                        </Link>
                    </li>

                    <li title={`Sair`}>
                        <Link to={"javascript:void(0);"} className={styles.menu_item} onClick={handleLogoutUser}>
                            <i><IoLogOut /></i>
                            <span>{`Sair`}</span>
                        </Link>
                    </li>
                </div>

            </ul>
        </div>
    )
}

export { AppSideMenu }