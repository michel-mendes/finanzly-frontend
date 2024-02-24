import { useEffect, useState } from "react"
import { Navigate, useNavigate } from "react-router-dom"
import moment from "moment"

// Helpers functions
import { getStartAndEndOfMonth, sortArrayOfObjects } from "../../helpers/helpers";

// Types
import { IDonutChartData, IModalCategoriesList, IModalProps } from "../../type-defs"

// Components
import { InputEdit } from "../../components/InputEdit"

// Page helpers
import { renderResponsivePieChart } from "./useCharts"

// Hooks
import { useReport } from "../../hooks/useReport"
import { useWallets } from "../../hooks/useWallets";
import { useCategories } from "../../hooks/useCategories";
import { useTransactions } from "../../hooks/useTransactions";

// Auth context
import { useAuthContext } from "../../contexts/Auth"

// Modal
import { useModal } from "../../hooks/useModal"
import { ModalSaveCancel } from "../../components/Modal"
import { SearchDropDown } from "../../components/SearchDropDown";
import { CustomButton } from "../../components/CustomButton";

// Icons
import refreshIcon from "../../assets/refresh.svg"
import moneyBagIcon from "../../assets/money-bag-outline.svg"
import arrowCircleUpIcon from "../../assets/arrow-circle-up-outline.svg"
import arrowCircleDownIcon from "../../assets/arrow-circle-down-outline.svg"

// styles
import styles from "./styles.module.css"


function DashboardPage() {
    const { loggedUser, setActiveWallet } = useAuthContext()
    const { showModal, closeModal, isOpen } = useModal()

    const { walletsList } = useWallets()
    const { categoriesList } = useCategories()
    const { transactionsList, getTransactionsFromWallet } = useTransactions()

    const {
        reportStartDate, reportEndDate,
        setReportStartDate, setReportEndDate,
        chartData, getReportData
    } = useReport({
        initialStartDate: getStartAndEndOfMonth(loggedUser?.firstDayOfMonth!).startDate.toJSON().slice(0, 10),
        initialEndDate: getStartAndEndOfMonth(loggedUser?.firstDayOfMonth!).endDate.toJSON().slice(0, 10),
        initialWallet: loggedUser?.activeWallet!
    })

    const [modalCategoriesList, setModalCategoriesList] = useState<Array<IModalCategoriesList>>([])

    const [periodBalance, setPeriodBalance] = useState(0)
    const walletBalanceContainerColor = (periodBalance < 0) ? "#F46D43" : "#1F78B4"


    function handleOnClickRefreshButton() {
        setReportStartDate(moment(reportStartDate).toISOString(true).split("T")[0])
        setReportEndDate(moment(reportEndDate).toISOString(true).split("T")[0])

        getTransactionsFromWallet(loggedUser?.activeWallet?.id!, reportStartDate, reportEndDate)
        getReportData()
    }

    // function changeReportDates(period: "priorMonth" | "nextMonth") {
    //     const changeMonthStartDate = (period == "priorMonth") ? moment(reportStartDate).subtract(1, "month") : moment(reportStartDate).add(1, "month")
    //     const changeMonthEndDate = (period == "priorMonth") ? moment(reportEndDate).subtract(1, "month") : moment(reportEndDate).add(1, "month")

    //     const newStartDate = changeMonthStartDate.toISOString(true).split("T")[0]
    //     const newEndDate = changeMonthEndDate.toISOString(true).split("T")[0]

    //     setReportDates(newStartDate, newEndDate)
    //     getReportData({ startDate: newStartDate, endDate: newEndDate })
    // }

    useEffect(() => {
        document.title = "Dashboard Finanzly"
    }, [])

    useEffect(() => {
        setPeriodBalance( Number(chartData.donutChartsData.incomes.totalValue) - Number(chartData.donutChartsData.expenses.totalValue) )
    }, [chartData])

    if (!loggedUser) return <Navigate to="/login" />

    return (
        <div className={styles.page_container}>

            <div className={styles.dashboard_container}>

                <div className={styles.balance_section}>

                    {/* Wallet and date range section */}

                    <div className={styles.wallet_dates_container}>
                        <div className={styles.wallet_selector}>
                            <p>Resumo da carteira</p>

                            <SearchDropDown
                                placeholder="Selecione a carteira"
                                results={walletsList}
                                value={loggedUser?.activeWallet?.walletName || ""}
                                renderItem={(item) => <p>{item.walletName}</p>}
                                onSelect={(item) => { setActiveWallet(item.id!) }}
                                searcheableProperty="walletName"
                                dropdownPxWidth={400}
                            />
                        </div>

                        <div className={styles.dates_selector}>
                            <div className={styles.date_input_container}>
                                <p>Data início</p>

                                <InputEdit
                                    fieldName="reportStartDate"
                                    inputType="date"
                                    placeholder=""
                                    value={reportStartDate}
                                    onChange={(value) => { setReportStartDate(moment(value).toISOString(true).split("T")[0]) }}
                                />
                            </div>

                            <div className={styles.date_input_container}>
                                <p>Data fim</p>

                                <InputEdit
                                    fieldName="reportEndDate"
                                    inputType="date"
                                    placeholder=""
                                    value={reportEndDate}
                                    onChange={(value) => { setReportEndDate(moment(value).toISOString(true).split("T")[0]) }}
                                />
                            </div>

                            <div className={styles.buttons_container}>
                                {/* <CustomButton caption={`${moment(reportStartDate).toDate().toLocaleDateString()} até ${moment(reportEndDate).toDate().toLocaleDateString()}`} icon={calendarIcon} iconDirection="right" /> */}
                                <CustomButton caption="" icon={refreshIcon} handleClick={handleOnClickRefreshButton} />
                            </div>
                        </div>
                    </div>


                    {/* User balance, incomes and expenses section */}

                    <div className={styles.values_container}>
                        <div className={styles.balance_container} style={{background: walletBalanceContainerColor}}>
                            <div className={styles.container_overlay}>
                                <div>
                                    <p className={styles.balance_title} style={{color: walletBalanceContainerColor}}>Balanço do período</p>
                                    <p className={styles.container_value}>{loggedUser.activeWallet?.currencySymbol} {periodBalance.toLocaleString(undefined, {minimumFractionDigits: 2, maximumFractionDigits: 2})}</p>
                                </div>

                                <img src={moneyBagIcon} alt="Balance icon" />
                            </div>
                        </div>

                        <div className={styles.incomes_container}>
                            <div className={styles.container_overlay}>
                                <div>
                                    <p className={styles.incomes_title}>Recebimentos</p>
                                    <p className={styles.container_value}>{loggedUser.activeWallet?.currencySymbol} {Number(chartData.donutChartsData.incomes.totalValue).toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</p>
                                </div>

                                <img src={arrowCircleDownIcon} alt="Incomes icon" />
                            </div>
                        </div>

                        <div className={styles.expenses_container}>
                            <div className={styles.container_overlay}>
                                <div>
                                    <p className={styles.expenses_title}>Pagamentos</p>
                                    <p className={styles.container_value}>{loggedUser.activeWallet?.currencySymbol} {Number(chartData.donutChartsData.expenses.totalValue).toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</p>
                                </div>

                                <img src={arrowCircleUpIcon} alt="Expenses icon" />
                            </div>
                        </div>
                    </div>

                    {/* Incomes by category chart */}

                    <div className={styles.categorized_incomes_container}>
                        <div className={styles.container_header}>
                            <div>
                                <p className={styles.header_title}>Recebimentos</p>
                                <p>Seus recebimentos separados por categoria</p>
                            </div>

                            <a href="#" rel="noopener noreferrer" onClick={() => {showModalWithCategoriesAndValues(chartData.donutChartsData.incomes.list, setModalCategoriesList, showModal)}}>Ver todas</a>
                        </div>

                        <div className={styles.container_body}>
                            {renderResponsivePieChart(chartData.donutChartsData.incomes.list, "paired", loggedUser.activeWallet?.currencySymbol)}
                        </div>
                    </div>



                    {/* Expenses by category chart */}

                    <div className={styles.categorized_expenses_container}>
                        <div className={styles.container_header}>
                            <div>
                                <p className={styles.header_title}>Pagamentos</p>
                                <p>Seus pagamentos separados por categoria</p>
                            </div>

                            <a href="#" rel="noopener noreferrer" onClick={() => {showModalWithCategoriesAndValues(chartData.donutChartsData.expenses.list, setModalCategoriesList, showModal)}}>Ver todas</a>
                        </div>

                        <div className={styles.container_body}>
                            {renderResponsivePieChart(chartData.donutChartsData.expenses.list, "spectral", loggedUser.activeWallet?.currencySymbol)}
                        </div>
                    </div>

                </div>

                {/* Last transactions from wallet */}
                
                <div className={styles.last_transactions_section}>
                    <div className={styles.container_header}>
                        <div>
                            <p className={styles.header_title}>Últimas transações no período</p>
                            <p>Suas últimas transações em {loggedUser.activeWallet?.walletName}</p>
                        </div>
                    </div>

                    <div className={styles.transactions_list}>
                       {
                            (transactionsList.length > 0) && transactionsList.map((transaction, index) => {
                                const myCategory = categoriesList.find(category => { return (category.id == transaction.fromCategory) })
                                const valueTextColor = (Number(transaction.creditValue) > 0) ? "#1CC88A" : "#E74A3B"
                                
                                // Returns only the last 10 transactions
                                if (index < 9) return (
                                    <div className={styles.transaction_list_item}>
                                        <div className={styles.transaction_icon_container}>
                                            <img className={styles.category_icon} src={myCategory?.iconPath} alt="Category icon" />
                                        </div>
                                        <div className={styles.transaction_details_container}>
                                            <p className={styles.transaction_category_name}>{myCategory?.categoryName}</p>
                                            <p>{transaction.description}</p>
                                        </div>
                                        <div className={styles.transaction_date_value_container}>
                                            <p>{moment(transaction.date).toDate().toLocaleDateString()}</p>
                                            <p className={styles.transaction_value} style={{color: valueTextColor}}>{loggedUser.activeWallet?.currencySymbol} {Number(transaction.value).toLocaleString(undefined, {maximumFractionDigits: 2, minimumFractionDigits: 2})}</p>
                                        </div>
                                    </div>
                                )
                            })
                       }

                        {/* Render a footer fader effect */}
                       {
                            (transactionsList.length > 0) && (
                                <div className={styles.transactions_bottom_fader}></div>
                            )
                       }
                    </div>
                </div>

            </div>

            <ModalSaveCancel
                isOpen={isOpen}
                modalTitle="Detalhamento por categorias"
                modalButtons={{
                    okButton: {
                        onClick: () => { closeModal() }
                    }
                }}
            >
                <span>Clique na categoria para ver detalhes de cada transação</span><br /><br />
                <ModalCategoriesList
                    categoriesList={modalCategoriesList}
                    currencySymbol={chartData.donutChartsData.currencySymbol}
                    startDate={reportStartDate}
                    endDate={reportEndDate}
                />
            </ModalSaveCancel>
        </div>
    )
}

function ModalCategoriesList({ categoriesList, currencySymbol, endDate, startDate }: IModalProps) {
    const navigate = useNavigate()
    const sortedList = sortArrayOfObjects(categoriesList, "value", false)

    function handleCategoryClick(categoryName: string) {
        navigate(`/transactions?startDate=${startDate}&endDate=${endDate}&category=${categoryName}`)
    }

    return (
        <div className={styles.categories_list_modal}>
            <table style={{ width: "650px", fontSize: "1.2em" }}>
                <tbody>
                    {
                        sortedList.map((item, itemIndex) => {
                            return (
                                <tr key={itemIndex} onClick={() => { handleCategoryClick(item.categoryName) }} style={{ cursor: "pointer" }}>
                                    <td style={{ textAlign: "left" }}>
                                        <span>{item.categoryName}</span>
                                    </td>

                                    <td style={{ textAlign: "right" }}>
                                        <span>{currencySymbol}</span>
                                        <span>&nbsp;&nbsp;</span>
                                        <span>{Number(item.value).toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</span>
                                    </td>
                                </tr>
                            )
                        })
                    }
                </tbody>
            </table>
        </div>
    )
}



function showModalWithCategoriesAndValues(categoriesData: Array<IDonutChartData>, setModalCategoriesList: Function, showModal: Function) {
    const mappedCategoriesList: Array<IModalCategoriesList> = categoriesData.map(item => {
        return {
            categoryName: item.label,
            value: item.value
        }
    })

    setModalCategoriesList(mappedCategoriesList)
    showModal()
}

export { DashboardPage }