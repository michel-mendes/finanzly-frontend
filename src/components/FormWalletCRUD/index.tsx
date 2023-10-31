import { Dispatch, SetStateAction } from "react"

import styles from "./styles.module.css"

// Input components
import { InputEdit } from "../InputEdit"
import { InputIconSelector } from "../InputIconSelector"

// Types
import { IWallet } from "../../services/types"
interface IFormWalletCrudProps {
    walletData: IWallet | null;
    setWalletData: Dispatch<SetStateAction<IWallet | null>>;
}

function FormWalletCRUD({walletData, setWalletData}: IFormWalletCrudProps) {

    if ( !walletData ) {
        setWalletData(
            {
                fromUser: "",
                walletName: "",
                currencySymbol: "",
                initialBalance: 0,
                iconPath: ""
            }
        )
    }

    function handleInputChange(value: string | number, propName: keyof IWallet) {
        setWalletData({...walletData, [propName]: value})
    }

    return (
        <>
            <form className={styles.form}>
                <div>
                    <InputIconSelector iconType="banks" fieldName="iconPath" placeholder="Selecione um ícone" value={walletData?.iconPath} onChange={(value) => {handleInputChange(value, "iconPath")}} />
                </div>

                <div>
                    <InputEdit
                        fieldName="walletName"
                        placeholder="Nome da carteira"
                        inputType="text"
                        value={walletData?.walletName}
                        onChange={(value) => {handleInputChange(value, "walletName")}} />

                    <InputEdit
                        fieldName="currencySymbol"
                        placeholder="Moeda"
                        inputType="text"
                        value={walletData?.currencySymbol}
                        onChange={(value) => {handleInputChange(value, "currencySymbol")}} />

                    <InputEdit
                        fieldName="initialBalance"
                        placeholder="Saldo inicial"
                        inputType="number"
                        value={walletData?.initialBalance}
                        onChange={(value) => {handleInputChange(value, "initialBalance")}} />

                </div>
            </form>
        </>
    )
}

export { FormWalletCRUD }