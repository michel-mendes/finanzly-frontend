import { useState } from "react"
import { Link, useNavigate } from "react-router-dom"
import { useAuthContext } from "../../contexts/Auth"
import { BsGrid3X3GapFill, BsListUl } from "react-icons/bs"
import { BsFillPieChartFill } from "react-icons/bs"
import { IoWalletSharp, IoLogOut } from "react-icons/io5"
import { RxHamburgerMenu } from "react-icons/rx"
import { BsGearFill } from "react-icons/bs"
import { FaDownload } from "react-icons/fa"

// Icons
import dashboardIcon from "../../assets/dashboard.svg"
import walletIcon from "../../assets/wallet.svg"
import categoryIcon from "../../assets/category.svg"
import transactionsIcon from "../../assets/transactions.svg"
import profileIcon from "../../assets/profile.svg"

import styles from "./styles.module.css"

function AppSideMenu() {
    const { logoutUser } = useAuthContext()
    const navigate = useNavigate()

    const [isExpanded, setIsExpanded] = useState(false)

    function handleMenuButtonClick() {
        setIsExpanded(prevState => { return !prevState })
    }

    const menuExpandedOrNot = (isExpanded) ? `${styles.side_menu} ${styles.expanded}` : styles.side_menu

    return (
        <>
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

                    <li title="Importar transações">
                        <Link to="/import" className={styles.menu_item}>
                            <i><FaDownload /></i>
                            <span>Importar transações</span>
                        </Link>
                    </li>
                </div>


                {/* Menu links for user management */}
                <div>
                    <li title={"Configurações"}>
                        <Link to={"/profile"} className={styles.menu_item}>
                            <i><BsGearFill /></i>
                            <span>{`Configurações`}</span>
                        </Link>
                    </li>

                    <li title={`Sair`}>
                        <Link to={"javascript:void(0);"} className={styles.menu_item} onClick={logoutUser}>
                            <i><IoLogOut /></i>
                            <span>{`Sair`}</span>
                        </Link>
                    </li>
                </div>

            </ul>
        </div>

        <div className={styles.mobile_navbar}>
            <div className={styles.mobile_navlink} onClick={() => {navigate("/dashboard")}}>
                <img src={dashboardIcon} alt="" />
                <p>Dashboard</p>
            </div>
            <div className={styles.mobile_navlink} onClick={() => {navigate("/wallets")}}>
                <img src={walletIcon} alt="" />
                <p>Carteiras</p>
            </div>
            <div className={styles.mobile_navlink} onClick={() => {navigate("/categories")}}>
                <img src={categoryIcon} alt="" />
                <p>Categorias</p>
            </div>
            <div className={styles.mobile_navlink} onClick={() => {navigate("/transactions")}}>
                <img src={transactionsIcon} alt="" />
                <p>Transações</p>
            </div>
            <div className={styles.mobile_navlink} onClick={() => {navigate("/profile")}}>
                <img src={profileIcon} alt="" />
                <p>Perfil</p>
            </div>
        </div>

        </>
    )
}

export { AppSideMenu }