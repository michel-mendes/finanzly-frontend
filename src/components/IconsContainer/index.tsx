import { useState, useEffect } from "react";
import styles from "./styles.module.css"

export type TIconTypes = "banks" | "categories";

interface IGlobImport {
    [key: string]: {
        default: string;
    }
}

interface IIconsContainerProps {
    iconTypes: TIconTypes;
    selectedIcon: string;
    setSelectedIcon: Function;
}

function loadIconsList(iconType: TIconTypes): IGlobImport {
    
    switch (iconType) {
        case "banks": return import.meta.glob(`../../assets/banks_icons/*.png`, { eager: true })
        case "categories": return import.meta.glob(`../../assets/categories_icons/*.png`, { eager: true })
    }

}

function IconsContainer({iconTypes, setSelectedIcon}: IIconsContainerProps) {

    const [iconsList, setIconsList] = useState<IGlobImport>({})
    
    useEffect(() => {
        setIconsList(loadIconsList(iconTypes))
        // console.log(loadIconsList(iconTypes))
    }, [])

    return (
        <div className={styles.container}>
            {
                Object.keys(iconsList).map((item, index) => {
                    const iconPath = iconsList[item].default
                    
                    return (
                        <span key={index} onClick={() => {setSelectedIcon(iconPath)}}>
                            <img src={iconPath} alt="" />
                        </span>
                    )
                })
            }
        </div>
    )
}

export { IconsContainer }