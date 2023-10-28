import axios from "axios"
import { useRef, useState, useEffect, Dispatch, SetStateAction, MutableRefObject } from "react"
import { RiArrowDropDownFill } from "react-icons/ri"
import { appConfigs } from "../../../../config/app-configs"

import walletIcon from "../../../../public/vite.svg"
import styles from "./styles.module.css"

import { useAuthContext } from "../../../contexts/Auth"

// Interfaces
import { IWallet } from "../../../services/types"
interface IWalletSelectorProps {
    walletsList: IWallet[];
    selectedWallet: IWallet | null;
    setSelectedWallet: (walletId: string) => void;
}

function WalletSelector({ selectedWallet, setSelectedWallet, walletsList }: IWalletSelectorProps) {

    const {loggedUser, setActiveWallet} = useAuthContext()

    const popupMenu = useRef(null)
    const { isMenuOpen, closePopup, openPopup } = useMouseClickListener(popupMenu)

    function handleWalletItemClick(wallet: IWallet) {
        if (setSelectedWallet) {
            setSelectedWallet(wallet.id!)
            closePopup()

            // setActiveWallet(wallet.id || "")
        }
    }

    // useEffect(() => {
    //     if (loggedUser) {
    //         setSelectedWallet(loggedUser.activeWallet)
    //     }
    // }, [loggedUser, walletsList])

    return (
        <div className={styles.container}>
            <div className={styles.wallet_info} onClick={openPopup}>
                <img src={walletIcon} alt="Ícone" />
                <div>
                    <span show-data="name">{(selectedWallet) ? selectedWallet.walletName : ""}</span>
                    <span show-data="balance">{(selectedWallet) ? `${selectedWallet.currencySymbol} ${selectedWallet.actualBalance?.toFixed(2)}` : ""}</span>
                </div>
                <i><RiArrowDropDownFill /></i>
            </div>

            {
                (!isMenuOpen) ? null : (
                    <div className={styles.wallets_popup} ref={popupMenu}>
                        <p>Minhas carteiras</p>
                        {
                            walletsList.map(wallet => {
                                return (
                                    <div key={wallet.id} onClick={() => { handleWalletItemClick(wallet) }}>
                                        <span>{wallet.walletName}</span>
                                        <span>{wallet.currencySymbol} {wallet.actualBalance}</span>
                                    </div>
                                )
                            })
                        }
                    </div>
                )
            }
        </div>
    )
}

function useMouseClickListener(popupRef: MutableRefObject<HTMLDivElement | null>) {
    const [isMenuOpen, setIsMenuOpen] = useState(false)

    useEffect(() => {
        function handleClickOutsideMenu(e: MouseEvent) {
            if (isMenuOpen && popupRef.current && !popupRef.current.contains(e.target as Node)) {
                setIsMenuOpen(false)
            }
        }

        document.addEventListener("click", handleClickOutsideMenu, true)

        return () => {
            document.removeEventListener("click", handleClickOutsideMenu, true)
        }
    }, [isMenuOpen])

    function openPopup() {
        setIsMenuOpen(true)
    }

    function closePopup() {
        setIsMenuOpen(false)
    }

    return { isMenuOpen, openPopup, closePopup }
}

export { WalletSelector }