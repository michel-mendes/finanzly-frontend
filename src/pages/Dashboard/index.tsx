import { useEffect, useState } from "react"
import { Navigate, useNavigate } from "react-router-dom"
import { FaRegArrowAltCircleLeft, FaRegArrowAltCircleRight } from "react-icons/fa";
import moment from "moment"

// Helpers functions
import { getStartAndEndOfMonth } from "../../helpers/helpers";

// Types
import { IDonutChartData, IModalCategoriesList, IModalProps } from "../../type-defs"

// Components
import { InputEdit } from "../../components/InputEdit"

// styles
import styles from "./styles.module.css"

// Page helpers
import { renderResponsiveBarChart, renderResponsivePieChart } from "./useCharts"

// Hooks
import { useReport } from "../../hooks/useReport"

// Auth context
import { useAuthContext } from "../../contexts/Auth"

// Modal
import { useModal } from "../../hooks/useModal"
import { ModalSaveCancel } from "../../components/Modal"



function DashboardPage() {
    const { loggedUser, loadingUser } = useAuthContext()
    const { showModal, closeModal, isOpen } = useModal()

    const {
        reportStartDate, reportEndDate,
        setReportStartDate, setReportEndDate, setReportDates,
        chartData, getReportData, loadingReport
    } = useReport({
        initialStartDate: getStartAndEndOfMonth(loggedUser?.firstDayOfMonth!).startDate.toJSON().slice(0, 10),
        initialEndDate: getStartAndEndOfMonth(loggedUser?.firstDayOfMonth!).endDate.toJSON().slice(0, 10),
        initialWallet: loggedUser?.activeWallet!
    })

    const [modalCategoriesList, setModalCategoriesList] = useState<Array<IModalCategoriesList>>([])

    const loadingWalletEffect = (loadingUser) ? styles.skeleton_loading_effect : ""
    const loadingChartDataEffect = (loadingReport) ? styles.skeleton_loading_effect : ""

    function handleOnClickRefreshButton() {
        setReportStartDate(moment(reportStartDate).toISOString(true).split("T")[0])
        setReportEndDate(moment(reportEndDate).toISOString(true).split("T")[0])

        getReportData()
    }

    useEffect(() => {
        document.title = "Dashboard Finanzly"
    }, [])


    if (!loggedUser) return <Navigate to="/login" />

    function changeReportDates(period: "priorMonth" | "nextMonth") {
        const changeMonthStartDate = (period == "priorMonth") ? moment(reportStartDate).subtract(1, "month") : moment(reportStartDate).add(1, "month")
        const changeMonthEndDate = (period == "priorMonth") ? moment(reportEndDate).subtract(1, "month") : moment(reportEndDate).add(1, "month")

        const newStartDate = changeMonthStartDate.toISOString(true).split("T")[0]
        const newEndDate = changeMonthEndDate.toISOString(true).split("T")[0]

        setReportDates(newStartDate, newEndDate)
        getReportData({ startDate: newStartDate, endDate: newEndDate })
    }

    return (
        <div className={styles.page_container}>

            <div className={styles.date_range_container}>
                <p className={loadingWalletEffect}>{loggedUser.activeWallet?.walletName}</p>

                <span className={loadingWalletEffect}>
                    <div style={{ display: "flex", alignItems: "center", margin: "auto", gap: "10px", width: "300px" }}>
                        <span style={{ fontSize: 20, cursor: "pointer" }} onClick={() => { changeReportDates("priorMonth") }}>
                            <FaRegArrowAltCircleLeft />
                        </span>

                        <InputEdit
                            fieldName="reportStartDate"
                            inputType="date"
                            placeholder=""
                            value={reportStartDate}
                            onChange={(value) => { setReportStartDate(moment(value).toISOString(true).split("T")[0]) }}
                        />

                        <span> - </span>

                        <InputEdit
                            fieldName="reportEndDate"
                            inputType="date"
                            placeholder=""
                            value={reportEndDate}
                            onChange={(value) => { setReportEndDate(moment(value).toISOString(true).split("T")[0]) }}
                        />

                        <span style={{ fontSize: 20, cursor: "pointer" }} onClick={() => { changeReportDates("nextMonth") }}>
                            <FaRegArrowAltCircleRight />
                        </span>
                    </div>

                    <button className="btn btn-info" onClick={handleOnClickRefreshButton}>
                        Atualizar
                    </button>
                </span>
            </div>

            <div className={styles.charts_container}>
                <div className={styles.bar_chart_container}>
                    <section className={loadingChartDataEffect} style={{ height: "200px" }}>
                        {
                            loadingChartDataEffect ? null : (
                                <>
                                    {
                                        renderResponsiveBarChart(chartData.barChartsData)
                                    }
                                </>
                            )
                        }
                    </section>
                </div>

                <div>
                    <section className={styles.donut_charts_container}>
                        <div className={`${styles.donut_container} ${loadingChartDataEffect}`} onClick={() => {
                            showModalWithCategoriesAndValues(chartData.donutChartsData.incomes.list, setModalCategoriesList, showModal)
                        }}>
                            {/* <div style={{height: "200px", border: "1px solid black", position: "relative" }}> */}
                            {
                                loadingChartDataEffect ? null : (
                                    <>
                                        {
                                            renderResponsivePieChart(chartData.donutChartsData.incomes.list)
                                        }

                                        <div style={{
                                            position: "absolute",
                                            top: 0,
                                            right: 0,
                                            bottom: 0,
                                            left: 0,
                                            display: "flex",
                                            flexDirection: "column",
                                            alignItems: "center",
                                            justifyContent: "center",
                                            fontSize: 13,
                                            color: "black",
                                            // background: "#FFFFFF33",
                                            textAlign: "center",
                                            // This is important to preserve the chart interactivity
                                            pointerEvents: "none"
                                        }}>
                                            <span>Receitas</span>
                                            <span>{chartData.donutChartsData.currencySymbol} {chartData.donutChartsData.incomes.totalValue.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</span>
                                        </div>
                                    </>
                                )}
                            {/* </div> */}
                        </div>

                        <div className={`${styles.donut_container} ${loadingChartDataEffect}`} onClick={() => {
                            showModalWithCategoriesAndValues(chartData.donutChartsData.expenses.list, setModalCategoriesList, showModal)
                        }}>
                            {/* <div style={{ height: "200px", border: "1px solid black", position: "relative" }}> */}
                            {
                                loadingChartDataEffect ? null : (
                                    <>
                                        {
                                            renderResponsivePieChart(chartData.donutChartsData.expenses.list)
                                        }

                                        <div style={{
                                            position: "absolute",
                                            top: 0,
                                            right: 0,
                                            bottom: 0,
                                            left: 0,
                                            display: "flex",
                                            flexDirection: "column",
                                            alignItems: "center",
                                            justifyContent: "center",
                                            fontSize: 13,
                                            color: "black",
                                            // background: "#FFFFFF33",
                                            textAlign: "center",
                                            // This is important to preserve the chart interactivity
                                            pointerEvents: "none"
                                        }}>
                                            <span>Despesas</span>
                                            <span>{chartData.donutChartsData.currencySymbol} {chartData.donutChartsData.expenses.totalValue.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</span>
                                        </div>
                                    </>
                                )}
                            {/* </div> */}
                        </div>

                    </section>
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

    function handleCategoryClick(categoryName: string) {
        navigate(`/transactions?startDate=${startDate}&endDate=${endDate}&category=${categoryName}`)
    }

    return (
        <div>
            <table style={{ width: "650px", fontSize: "1.2em" }}>
                <tbody>
                    {
                        categoriesList.map((item, itemIndex) => {
                            return (
                                <tr key={itemIndex} onClick={() => { handleCategoryClick(item.categoryName) }} style={{ cursor: "pointer" }}>
                                    <td style={{ textAlign: "left" }}>
                                        <span>{item.categoryName}</span>
                                    </td>

                                    <td>
                                        {currencySymbol}
                                    </td>

                                    <td style={{ textAlign: "right" }}>
                                        <span>{Number(item.value).toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</span>
                                    </td>
                                </tr>

                                // <p style={{ display: "flex", justifyContent: "space-between", width: "300px", cursor: "pointer" }} key={itemIndex} onClick={() => { handleCategoryClick(item.categoryName) }}>
                                //     <span>{item.categoryName}</span>
                                //     <span>{currencySymbol} {Number(item.value).toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</span>
                                // </p>
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