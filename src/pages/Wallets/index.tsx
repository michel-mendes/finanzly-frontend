import { useState, useEffect } from "react"
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

// API Services
import { WalletsApi } from "../../services/WalletsApi"

// Components
import { PageHeaderDesktop } from "../../components/PageHeaderDesktop"
import { IoArrowBack } from "react-icons/io5"

// Styling
import styles from "./styles.module.css"


function WalletsPage() {
  const navigate = useNavigate()
  const walletsApi = new WalletsApi()

  // Authenticated user data
  const { loggedUser } = useAuthContext()

  // Modal
  const { closeModal, isOpen, showModal } = useModal()
  const [modalTitle, setModalTitle] = useState("")

  // New and updating wallet management
  const [modalWalletData, setModalWalletData] = useState<IWallet | null>(null)
  const [isEditingWallet, setIsEditingWallet] = useState(false)

  // Wallets listing management
  const [walletsList, setWalletsList] = useState<IWallet[]>([])
  const [isLoading, setIsLoading] = useState(true)

  // Get wallets list when the page is loaded
  useEffect(() => {
    async function updateList() {
      const wallets = await walletsApi.getWalletsFromUser()

      if ("error" in wallets) {
        alert("Erro ao carregar lista de carteiras")
        console.log(wallets)
        return
      }

      setWalletsList(wallets)
      setIsLoading(false)
    }

    updateList()
  }, [])

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
        <WalletsList isLoading={isLoading} walletsList={walletsList} handleOpenWalletModal={handleOpenWalletModal} />
      </ul>

      <ModalSaveCancel
        isOpen={isOpen}
        modalTitle={modalTitle}
        modalButtons={
          {
            cancelButton: { onClick: closeModal },
            saveButton: { onClick: handleClickSaveWallet },
            deleteButton: {
              enabled: isEditingWallet,
              onClick: async () => {
                const deleted = await walletsApi.deleteWallet(modalWalletData?.id!)

                if ("error" in deleted) {
                  alert(`Erroooo: ${deleted.error}`)
                  return
                }

                alert(`Carteira excluida com sucesso!`)
                const newList = walletsList.filter(wallet => {
                  if (wallet.id !== deleted.id) { return wallet }
                })

                setWalletsList(newList)
                closeModal()
              }
            }
          }
        }
      >
        <FormWalletCRUD walletData={modalWalletData} setWalletData={setModalWalletData} />
      </ModalSaveCancel>
    </div>
  )

  // Helpers
  function handleOpenWalletModal(walletToEdit?: IWallet) {
    if (!walletToEdit) {
      setModalTitle("Nova carteira")
      setIsEditingWallet(false)
      setModalWalletData({
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
      setModalWalletData(walletToEdit)
    }

    showModal()
  }

  async function handleClickSaveWallet() {
    const savedWallet = (isEditingWallet) ? (await walletsApi.updateWallet(modalWalletData!.id!, modalWalletData!)) : (await walletsApi.createWallet(modalWalletData!))

    if ("error" in savedWallet) {
      alert(`Erro durante a operação:\n${savedWallet.error}`)
      console.log(savedWallet)
      return
    }

    if (isEditingWallet) {
      const updatedWalletList = walletsList!.map(wallet => {
        return (savedWallet.id == wallet.id) ? savedWallet : wallet
      })

      setWalletsList(updatedWalletList)
    }
    else {
      setWalletsList([...walletsList!, savedWallet])
    }

    closeModal()

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