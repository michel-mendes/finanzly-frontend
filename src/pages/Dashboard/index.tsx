import { useEffect, useState } from "react"
import { Navigate, useNavigate } from "react-router-dom"
import axios from "axios"
import moment from "moment"

// Types
import { IDonutChartData, IChartsData, IModalCategoriesList, IModalProps } from "../../type-defs"

// styles
import styles from "./styles.module.css"

// Page helpers
import { renderResponsiveBarChart, renderResponsivePieChart, formatDonutChartData, formatLineChartData } from "./useCharts"

// Auth context
import { useAuthContext } from "../../contexts/Auth"

// Modal
import { useModal } from "../../hooks/useModal"
import { ModalSaveCancel } from "../../components/Modal"



function DashboardPage() {
    const { loggedUser, loadingUser } = useAuthContext()
    const { showModal, closeModal, isOpen } = useModal()

    const navigate = useNavigate()

    const [startDate, setStartDate] = useState<string>(moment(new Date).startOf("month").toJSON().slice(0, 10))
    const [endDate, setEndDate] = useState<string>(moment(new Date).endOf("month").startOf("day").toJSON().slice(0, 10))

    const [modalCategoriesList, setModalCategoriesList] = useState<Array<IModalCategoriesList>>([])
    const [chartData, setChartData] = useState<IChartsData>({
        barChartsData: [],
        donutChartsData: {
            currencySymbol: "",
            incomes: { totalValue: 0, list: [] },
            expenses: { totalValue: 0, list: [] }
        },
        isLoadingData: true
    })

    const loadingWalletEffect = (loadingUser) ? styles.skeleton_loading_effect : ""
    const loadingChartDataEffect = (chartData.isLoadingData) ? styles.skeleton_loading_effect : ""

    
    
    useEffect(() => {
        document.title = "Dashboard Finanzly"
    }, [])
    
    
    if (!loggedUser) return <Navigate to="/login" />

    return (
        <div className={styles.page_container}>
            
            <div>
                <p className={loadingWalletEffect}>{loggedUser.activeWallet?.walletName}</p>
                                
                <span className={loadingWalletEffect}>
                    <input type="date" onChange={(e) => {setStartDate(e.currentTarget.value)}} value={startDate} />
                    <span> - </span>
                    <input type="date" onChange={(e) => {setEndDate(e.currentTarget.value)}} value={endDate} />
                </span>
            </div>

            <button onClick={async () => {
                const start = moment(startDate).toISOString(true).split("T")[0]
                const end = moment(endDate).toISOString(true).split("T")[0]
                const wallet = loggedUser.activeWallet?.id

                if (!start || !end || !wallet) {
                    alert("Faltando dados: data inicial ou data final ou carteira")
                    return
                }

                setChartData({...chartData, isLoadingData: true})
                const reportData = await axios.get(`http://localhost:3000/api/report?start=${start}&end=${end}&wallet=${wallet}`, { withCredentials: true })

                // Formats report data for charts use
                const barChartsData = formatLineChartData(start, end, reportData.data)
                const totalIncomesByCategory = formatDonutChartData(reportData.data.totalIncomes.byCategory)
                const totalExpensesByCategory = formatDonutChartData(reportData.data.totalExpenses.byCategory)

                setChartData({
                    isLoadingData: false,
                    barChartsData,
                    donutChartsData: {
                        currencySymbol: reportData.data.currencySymbol,
                        incomes: {
                            totalValue: reportData.data.totalIncomes.total,
                            list: totalIncomesByCategory
                        },
                        expenses: {
                            totalValue: reportData.data.totalExpenses.total,
                            list: totalExpensesByCategory
                        }
                    }
                })

            }}>Atualizar</button>
            
            <button onClick={() => {navigate("/transactions")}}>Página de testes</button>

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

            <ModalSaveCancel
                isOpen={isOpen}
                modalTitle="Detalhamento por categorias"
                modalButtons={{
                    okButton: {
                        onClick: () => {closeModal()}
                    }
                }}
            >
                <ModalCategoriesList
                    categoriesList={modalCategoriesList}
                    currencySymbol={chartData.donutChartsData.currencySymbol}
                    startDate={startDate}
                    endDate={endDate}
                />
            </ModalSaveCancel>
        </div>
    )
}

function ModalCategoriesList({categoriesList, currencySymbol, endDate, startDate}: IModalProps) {
    const navigate = useNavigate()

    function handleCategoryClick(categoryName: string) {
        navigate(`/transactions?startDate=${startDate}&endDate=${endDate}&category=${categoryName}`)
    }

    return (
        <div>
            {
                categoriesList.map((item, itemIndex) => {
                    return (
                        <p style={{display: "flex", justifyContent: "space-between", width: "300px", cursor: "pointer"}} key={itemIndex} onClick={() => { handleCategoryClick(item.categoryName) }}>
                            <span>{item.categoryName}</span>
                            <span>{currencySymbol} {Number(item.value).toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</span>
                        </p>
                    )
                })
            }
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

    setModalCategoriesList( mappedCategoriesList )
    showModal()
}

export { DashboardPage }