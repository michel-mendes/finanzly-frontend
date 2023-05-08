import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { IoArrowBack } from 'react-icons/io5'

import { PageHeaderDesktop } from '../../shared_components/PageHeaderDesktop'

import styles from "./styles.module.css"

function ImportTransactionsPage() {
    const navigate = useNavigate()

    const [selectedBank, setSelectedBank] = useState("n/a")

    return (
        <div className={styles.page_container}>
            <PageHeaderDesktop>
                <div className={styles.header_content}>
                    <i onClick={() => { navigate("/dashboard") }}>{<IoArrowBack />}</i>

                    <div className={styles.button_container}>
                        <div className={styles.select}>
                            <select onChange={(e) => { setSelectedBank(e.target.value) }} value={selectedBank || ""}>
                                <option value="n/a">Selecione uma instituição bancária</option>
                                <option value="bb">Banco do Brasil</option>
                                <option value="cef">Caixa Econômica Federal</option>
                                <option value="inter">Banco Inter</option>
                            </select>
                            <div className={styles.select_arrow}></div>
                        </div>

                        <button onClick={() => { alert(`Banco selecionado: ${selectedBank}`) }}>Inciar importação</button>
                    </div>
                </div>
            </PageHeaderDesktop>
        </div>
    )
}

export { ImportTransactionsPage }