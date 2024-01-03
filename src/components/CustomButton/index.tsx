// Stylesheet
import style from "./style.module.css"

interface ICustomButtonProps {
    icon: string,
    iconDirection?: "left" | "right",
    caption: string,
    handleClick?: () => void;
}

function CustomButton({ caption, handleClick, icon, iconDirection }: ICustomButtonProps) {
    const iconOnRightSide = iconDirection == "right" ? style.icon_right_side : ""

    return (
        <button className={`${style.button} ${iconOnRightSide}`} onClick={(!handleClick) ? undefined : () => { handleClick() }} >
            {
                icon && <img src={icon} alt="Button icon" />
            }
            <span>{caption}</span>
        </button>
    )
}

export { CustomButton }