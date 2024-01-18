import { MouseEventHandler } from "react";

// Stylesheet
import style from "./style.module.css"

interface ICustomButtonProps {
    icon?: string,
    iconDirection?: "left" | "right",
    caption: string,
    captionAlignment?: "left" | "center" | "right",
    handleClick?: MouseEventHandler<HTMLButtonElement>;
}

function CustomButton({ caption, handleClick, icon, iconDirection, captionAlignment }: ICustomButtonProps) {
    const iconOnRightSide = iconDirection == "right" ? style.icon_right_side : ""

    return (
        <button
            className={`${style.button} ${iconOnRightSide}`}
            onClick={(!handleClick) ? undefined : (event) => { handleClick(event) }}
            style={{
                textAlign: captionAlignment || "left"
            }}
        >
            {icon && <img src={icon} alt="Button icon" />}

            <span>{caption}</span>

        </button>
    )
}

export { CustomButton }