import { useEffect, useState } from "react"

// Types
import { IAuthenticatedUser } from "../../type-defs"

// Components
import { InputEdit } from "../../components/InputEdit"
import { CustomButton } from "../../components/CustomButton"

// Context
import { useAuthContext } from "../../contexts/Auth"

// Icons
import defaultAvatar from "../../assets/user_default_avatar.svg"
import checkIcon from "../../assets/check-green-icon.svg"
import exitIcon from "../../assets/exit.svg"

// Stylesheet
import style from "./style.module.css"

function UserProfilePage() {
    const { loggedUser, editUser, logoutUser } = useAuthContext()

    const [userData, setUserData] = useState<IAuthenticatedUser>({
        firstName: "",
        lastName: "",
        firstDayOfMonth: 0
    })

    useEffect(() => {
        setUserData({...loggedUser})
    }, [])

    return (
        <div className={style.page_container}>

            <div className={style.profile_container}>
                <div className={style.user_picture_container}>
                    <img src={defaultAvatar} alt="User avatar" />
                </div>

                <p className={style.label_user_name}>{loggedUser?.firstName} {loggedUser?.lastName}</p>

                <div className={style.form_user_data}>
                    <div className={style.input_container}>
                        <p>Seu nome</p>
                        <InputEdit fieldName="userName" inputType="text" placeholder="Seu nome aqui" value={userData.firstName} onChange={(value) => {setUserData({...userData, firstName: String(value)})}} />
                    </div>

                    <div className={style.input_container}>
                        <p>Seu sobrenome</p>
                        <InputEdit fieldName="userLastName" inputType="text" placeholder="Seu sobrenome aqui" value={userData.lastName} onChange={(value) => {setUserData({...userData, lastName: String(value)})}} />
                    </div>

                    <div className={style.input_container}>
                        <p>Primeiro dia contábil do mês</p>
                        <InputEdit fieldName="userFirstMonthDay" inputType="number" placeholder="Ex: 1" value={userData.firstDayOfMonth} onChange={(value) => {setUserData({...userData, firstDayOfMonth: Number(value)})}} />
                    </div>

                    <div className={style.button_container}>
                        <CustomButton caption="Salvar alterações" icon={checkIcon} handleClick={() => { editUser(userData) }} />
                        <CustomButton caption="Sair" icon={exitIcon} handleClick={logoutUser} />
                    </div>

                </div>
            </div>

        </div>
    )
}

export { UserProfilePage }