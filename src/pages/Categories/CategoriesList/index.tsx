import styles from './styles.module.css'

// Interfaces
import { ICategory } from '../../../type-defs'

interface ICategoriesListProps {
    categoriesList: ICategory[];
    onClickItem: (category: ICategory) => void;
}

function CategoriesList({ categoriesList, onClickItem }: ICategoriesListProps) {

    return (
        <>
            {/* categories */}
            {
                categoriesList.map(category => {
                    const sideColorClass = (category.transactionType == "C") ? styles.side_color_blue : styles.side_color_red

                    return (
                        <li className={styles.category_item} key={category.id} onClick={(!onClickItem) ? undefined : (event) => { event.stopPropagation(); onClickItem(category) }}>
                            <div className={sideColorClass}></div>

                            <img className={styles.category_icon} src={category.iconPath} alt="Ícone" />

                            <div className={styles.details_container}>
                                <p>{category.categoryName}</p>
                                <p>{(category.transactionType == "C") ? "Recebimento" : "Pagamento"}</p>
                            </div>
                        </li>
                    )
                })
            }
        </>
    )
}

export { CategoriesList }