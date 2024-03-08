import { MouseEventHandler } from "react";

// Stylesheet
import style from "./style.module.css"

interface ICustomButtonProps {
    icon?: string,
    iconDirection?: "left" | "right",
    caption?: string,
    captionAlignment?: "left" | "center" | "right",
    disabled?: boolean,
    handleClick?: MouseEventHandler<HTMLButtonElement>;
}

function CustomButton({ caption, handleClick, icon, iconDirection, captionAlignment, disabled }: ICustomButtonProps) {
    const iconOnRightSide = iconDirection == "right" ? style.icon_right_side : ""

    return (
        <button
            className={`${style.button} ${iconOnRightSide}`}
            onClick={(!handleClick) ? undefined : (event) => { handleClick(event) }}
            style={{
                textAlign: captionAlignment || "left"
            }}
            disabled={disabled || false}
        >
            {icon && <img src={icon} alt="Button icon" />}

            {caption && <span>{caption}</span>}

        </button>
    )
}

export { CustomButton }