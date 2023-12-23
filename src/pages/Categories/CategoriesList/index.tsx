import styles from './styles.module.css'

// Interfaces
import { ICategory } from '../../../type-defs'
interface ICategoriesListProps {
    categoriesList: ICategory[];
    onClickItem: Function;
}

function CategoriesList({ categoriesList, onClickItem }: ICategoriesListProps) {

    return (
        <>
            {/* categories */}
            {
                ["C", "D"].map(categoryType => {
                    return (

                        <ul className={styles.list} category-type={categoryType} key={categoryType}>
                            <p>{(categoryType == "C") ? "Entrada / Recebimento" : "Saída / Pagamento"}</p>
                            {
                                categoriesList.map(category => {
                                    return (category.transactionType !== categoryType) ? null : (
                                        <li
                                            className={styles.item}
                                            key={category.id}
                                            onClick={
                                                (
                                                    (!onClickItem) ? undefined : (event) => { event.stopPropagation(); onClickItem(category) }
                                                )
                                            }
                                        >
                                            <img src={category.iconPath} alt="Ícone" />
                                            <p>{category.categoryName}</p>
                                        </li>
                                    )
                                })
                            }
                        </ul>

                    )
                })
            }
        </>
    )
}

export { CategoriesList }