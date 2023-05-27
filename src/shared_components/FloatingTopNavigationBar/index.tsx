import React from 'react'

import styles from "./styles.module.css"

function FloatingTopNavigationBar() {
    return (
        <nav className={styles.navbar}>
            <div className={styles.logo_container}>
                <span>Finanzly</span>
            </div>

            <ul className={styles.links_container}>
                <li>Dashboard</li>
                <li>Carteiras</li>
                <li>Categorias</li>
                <li>Transações</li>
            </ul>

            <div className={styles.user_container}>
                <img className={styles.user_icon} src="https://e7.pngegg.com/pngimages/550/997/png-clipart-user-icon-foreigners-avatar-child-face.png" alt="" />

                <span>Michel Mendes</span>
                <span>V</span>
            </div>
        </nav>
    )
}

export { FloatingTopNavigationBar }