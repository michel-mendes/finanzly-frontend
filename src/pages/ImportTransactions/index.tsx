import { ChangeEvent, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

// Custom hooks
import { useToastNotification } from "../../hooks/useToastNotification";

// App config
import { appConfigs } from "../../../config/app-configs";

// Contexts
import { useAuthContext } from "../../contexts/Auth";

// Components
import { SearchDropDown } from "../../components/SearchDropDown";

// Icons
import fileIcons from "../../assets/file-icons.svg"
import addFileIcon from "../../assets/add-file-icon.svg"
import checkIcon from "../../assets/check-green-icon.svg"
import threeDotsIcon from "../../assets/three-dots-icon.svg"
import rightArrowIcon from "../../assets/right-arrow-icon.svg"
import alertIcon from "../../assets/alert.svg"

// Stylesheet
import style from "./style.module.css";

interface IBankData {
    id: string,
    bankName: string
}

const bankList: Array<IBankData> = [
    { id: "inter-mobile", bankName: "Banco Inter (Mobile)" },
    { id: "inter-web", bankName: "Banco Inter (Web)" },
    { id: "cef", bankName: "Caixa Econômica Federal" },
    { id: "bb", bankName: "Banco do Brasil" },
    { id: "nubank", bankName: "Nubank" }
]

const { importPostEndpoint } = appConfigs

function ImportTransactionsPage() {
    const { loggedUser } = useAuthContext()
    const userStorageKey = `import${loggedUser?.id}`
    const [thereArePendingImports, setThereArePendingImports] = useState<string | null>( localStorage.getItem(userStorageKey) )

    const navigate = useNavigate()

    const { showErrorNotification, showSuccessNotification } = useToastNotification()

    const selectFileInput = useRef<HTMLInputElement>(null)
    const [isFileSelected, setIsFileSelected] = useState(false)
    const [selectedBank, setSelectedBank] = useState<IBankData | null>(null)
    const [importStatus, setImportStatus] = useState<"ToBeSent" | "AwaitingServerResponse" | "Ready">("ToBeSent")

    function handleClickSelectFileButton() {
        selectFileInput.current?.click()
    }

    function handleChangeFileInput(event: ChangeEvent<HTMLInputElement>) {
        setIsFileSelected(event.target.value.length > 0 ? true : false)
    }

    function redirectToImportTransactions() {
        navigate("/import/transactions")
    }

    async function sendCsvFile() {
        try {
            setImportStatus("AwaitingServerResponse")

            const formData = new FormData()
            formData.append("walletId", loggedUser!.activeWallet?.id!)
            formData.append("bank", selectedBank!.id)
            formData.append("csvFile", selectFileInput.current!.files![0])

            const resp = (await axios.post(importPostEndpoint, formData, { withCredentials: true })).data
            selectFileInput.current!.value = ""
            setIsFileSelected(false)

            localStorage.setItem(userStorageKey, JSON.stringify(resp))

            showSuccessNotification("Análise concluída")
            setImportStatus("Ready")
        } catch (error) {
            showErrorNotification("Desculpe, houve um erro ao analisar o arquivo")
            setImportStatus("ToBeSent")
        }
    }

    return (

        <div className={style.page_container}>

            <div className={style.container}>

                <h2 className={style.page_title}>Importação de Transações</h2>
                <p className={style.short_page_description}>Escolha abaixo a instituição a que as transações pertencem e o arquivo em que estão:</p>

                <label htmlFor="dropdownField" className={style.dropdown_container}>
                    <p>Instituição financeira</p>

                    <SearchDropDown
                        placeholder="Escolha a instituição financeira"
                        results={bankList}
                        value={selectedBank?.bankName}
                        renderItem={(item) => <p>{item.bankName}</p>}
                        onSelect={(item) => {
                            setSelectedBank(item)
                        }}
                        searcheableProperty="bankName"
                    />
                </label>

                <div className={style.file_section}>
                    <div className={style.choose_file_container}>

                        <img className={style.file_icons} alt="File icons" src={fileIcons} />

                        <div className={style.select_file_button} onClick={handleClickSelectFileButton}>
                            <img className={style.add_file_icon} alt="Add file icon" src={addFileIcon} />
                            <p className={style.select_file_button_caption}>ESCOLHER ARQUIVO</p>
                            <img className={style.three_dots_icon} alt="Three dots icon" src={isFileSelected ? checkIcon : threeDotsIcon} />

                            {/* Hidden file input */}
                            <input type="file" name="" id="" hidden accept=".csv" ref={selectFileInput} onChange={handleChangeFileInput} />
                        </div>

                    </div>
                </div>

                {
                    importStatus == "AwaitingServerResponse" ? (

                        <div className={style.start_import_button}>
                            <p>Carregando, aguarde...</p>
                        </div>

                    ) : importStatus == "ToBeSent" ? (

                        <div className={style.start_import_button} aria-disabled={(isFileSelected && selectedBank) ? false : true} onClick={sendCsvFile}>
                            <p>Iniciar importação</p>
                            <img alt="Right arrow icon" src={rightArrowIcon} />
                        </div>

                    ) : /* isLoading == "Ready" */ (

                        <div className={style.start_import_button} onClick={redirectToImportTransactions}>
                            <p>Visualizar</p>
                            <img alt="Right arrow icon" src={rightArrowIcon} />
                        </div>

                    )
                }

                {
                    thereArePendingImports && (
                        <div className={style.alert_existing_imports}>
                            <div className={style.text}>
                                <img alt="Alert icon" src={alertIcon} />
                                <p>Há importações pendentes de serem salvas, deseja continuar?</p>
                            </div>

                            <div className={style.response}>
                                <p onClick={redirectToImportTransactions}>SIM</p>
                                <p onClick={() => {localStorage.removeItem(userStorageKey); setThereArePendingImports(null)}}>NÃO</p>
                            </div>
                        </div>
                    )
                }

            </div>

        </div>

    )
}

export { ImportTransactionsPage }

