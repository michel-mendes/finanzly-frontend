import { useNavigate } from 'react-router-dom'
import { FiChevronDown } from 'react-icons/fi'

// Auth context
import { useAuthContext } from '../../contexts/Auth'

import styles from "./styles.module.css"
import moment from 'moment'

function FloatingTopNavigationBar() {
    const { loggedUser } = useAuthContext()
    const navigate = useNavigate()

    function handleDashboardLinkClick() {
        const start = moment(Date.now()).startOf('month').toISOString(true).split("T")[0]
        const end = moment(Date.now()).endOf('month').toISOString(true).split("T")[0]
        const activeWallet = (loggedUser?.activeWalletId) ? `&wallet=${loggedUser.activeWalletId}` : ``

        navigate(`/dashboard?start=${start}&end=${end}${activeWallet}`)
    }

    return (
        <nav className={styles.navbar}>
            <div className={styles.logo_container}>
                <span>Finanzly</span>
            </div>

            <ul className={styles.links_container}>
                <li onClick={handleDashboardLinkClick}>Dashboard</li>
                <li onClick={() => { navigate("/wallets") }}>Carteiras</li>
                <li onClick={() => { navigate("/categories") }}>Categorias</li>
                <li onClick={() => { navigate("/transactions") }}>Transações</li>
            </ul>

            <div className={styles.user_container}>
                <img className={styles.user_icon} src="https://e7.pngegg.com/pngimages/550/997/png-clipart-user-icon-foreigners-avatar-child-face.png" alt="" />

                <span>{loggedUser?.firstName}</span>

                <span className={styles.user_drop_down_arrow}>
                    <FiChevronDown />
                </span>
            </div>
        </nav>
    )
}

export { FloatingTopNavigationBar }