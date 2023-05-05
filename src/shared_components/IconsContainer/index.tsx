import styles from "./styles.module.css"

interface IGlobImport {
    [key: string]: {
        default: string;
    }
}

interface IIconsContainerProps {
    selectedIcon: string;
    setSelectedIcon: Function;
}

const iconsList: IGlobImport = import.meta.glob("../../assets/icons/*.png", { eager: true })

function IconsContainer({selectedIcon, setSelectedIcon}: IIconsContainerProps) {

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