import { useState } from "react"
import { useNavigate } from "react-router-dom"

// Auth context
import { useAuthContext } from "../../contexts/Auth"

// Types
import { IWallet } from "../../services/types"

// Modal
import { ModalSaveCancel } from "../../components/Modal"
import { useModal } from "../../hooks/useModal"

// Wallet CRUD form
import { FormWalletCRUD } from "../../components/FormWalletCRUD"

// hooks
import { useWallets } from "../../hooks/useWallets"
import { useToastNotification } from "../../hooks/useToastNotification"

// Components
import { PageHeaderDesktop } from "../../components/PageHeaderDesktop"
import { IoArrowBack } from "react-icons/io5"

// Styling
import styles from "./styles.module.css"


function WalletsPage() {
  const navigate = useNavigate()
  const { walletsList, tempWallet, setTempWallet, loadingWallets, deleteWallet, updateWallet, createWallet, awaitingResponse } = useWallets()

  const { showSuccessNotification } = useToastNotification()

  // Authenticated user data
  const { loggedUser } = useAuthContext()

  // Modal
  const { closeModal, isOpen, showModal } = useModal()
  const [modalTitle, setModalTitle] = useState("")

  // New and updating wallet management
  const [isEditingWallet, setIsEditingWallet] = useState(false)


  return (
    <div className={styles.page_container}>

      <PageHeaderDesktop>
        <div className={styles.header_content}>
          <i onClick={() => { navigate("/dashboard") }}>{<IoArrowBack />}</i>
          <span>Minhas carteiras</span>
          <button onClick={() => { handleOpenWalletModal() }}>Nova carteira</button>
        </div>
      </PageHeaderDesktop>

      <ul className={styles.list}>
        <WalletsList isLoading={loadingWallets} walletsList={walletsList} handleOpenWalletModal={handleOpenWalletModal} />
      </ul>

      <ModalSaveCancel
        isOpen={isOpen}
        modalTitle={modalTitle}
        modalButtons={
          {
            cancelButton: { onClick: closeModal },
            saveButton: { onClick: async () => { await handleClickSaveWallet() } },
            deleteButton: {
              enabled: isEditingWallet,
              onClick: async () => {
                if (await deleteWallet(tempWallet?.id!)) {
                  showSuccessNotification(`A carteira "${tempWallet?.walletName}" foi removida`)
                  closeModal()
                }
              }
            }
          }
        }
      >
        <FormWalletCRUD walletData={tempWallet} setWalletData={setTempWallet} />
      </ModalSaveCancel>
    </div>
  )

  // Helpers
  function handleOpenWalletModal(walletToEdit?: IWallet) {
    if (!walletToEdit) {
      setModalTitle("Nova carteira")
      setIsEditingWallet(false)
      setTempWallet({
        fromUser: loggedUser?.id,
        walletName: "",
        currencySymbol: "",
        initialBalance: 0.00,
        iconPath: ""
      })
    }
    else {
      setModalTitle("Alterar carteira")
      setIsEditingWallet(true)
      setTempWallet({ ...walletToEdit })
    }

    showModal()
  }

  async function handleClickSaveWallet() {
    const success = (isEditingWallet) ? await updateWallet(tempWallet?.id!, { ...tempWallet! }) : await createWallet(tempWallet!)
    const operationType = (isEditingWallet) ? "alterada" : "adicionada"
    const message = `A carteira "${tempWallet?.walletName}" foi ${operationType}`

    if (success) {
      showSuccessNotification(message)
      closeModal()
    }

  }
}

function WalletsList(props: { walletsList: IWallet[], isLoading: boolean, handleOpenWalletModal: Function }) {
  const { walletsList, isLoading, handleOpenWalletModal } = props

  return (

    (isLoading) ? (
      <>
        <span>CARREGANDO...</span>
      </>
    ) : (
      <>
        {
          walletsList.map(wallet => {
            return (
              <li key={wallet.id} onClick={() => { handleOpenWalletModal(wallet) }}>
                <img src={wallet.iconPath} alt="ícone do banco" />

                <div>
                  <span className={styles.wallet_name}>{wallet.walletName}</span>
                  <span>{wallet.currencySymbol} {wallet.actualBalance?.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</span>
                </div>
              </li>
            )
          })
        }
      </>
    )
  )

}

export { WalletsPage }