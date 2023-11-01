import { useEffect, useState } from "react"
import { Navigate, useNavigate } from "react-router-dom"
import { ResponsiveBar } from "@nivo/bar"
import { ResponsivePie } from "@nivo/pie"
import axios from "axios"
import moment from "moment"

// styles
import styles from "./styles.module.css"

// Auth context
import { useAuthContext } from "../../contexts/Auth"

// Modal
import { useModal } from "../../hooks/useModal"
import { ModalSaveCancel } from "../../components/Modal"

interface IModalCategoriesList {
    categoryName: string
    value: number
}

interface IModalProps {
    categoriesList: Array<IModalCategoriesList>
    currencySymbol: string
    startDate: string
    endDate: string
}

interface IBarChartData {
    day: string,
    incomes: number,
    expenses: number
}

interface IDonutChartData {
    id: string,
    label: string,
    value: number
}

interface IChartsData {
    barChartsData: Array<IBarChartData>,
    donutChartsData: {
        currencySymbol: string,
        incomes: {
            totalValue: number,
            list: Array<IDonutChartData>
        },
        expenses: {
            totalValue: number,
            list: Array<IDonutChartData>
        }
    },
    isLoadingData: boolean
}

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

    const MyResponsiveBar = (data: any) => (
        <ResponsiveBar
            data={data}
            keys={[
                'receitas',
                'despesas'
            ]}
            indexBy="date"
            margin={{ top: 30, right: 40, bottom: 50, left: 40 }}
            padding={0.3}
            groupMode="grouped"
            valueScale={{ type: 'linear' }}
            indexScale={{ type: 'band', round: true }}
            colors={{ scheme: 'set2' }}
            borderColor={{
                from: 'color',
                modifiers: [
                    [
                        'darker',
                        1.6
                    ]
                ]
            }}
            axisTop={null}
            axisRight={null}
            axisBottom={{
                tickSize: 5,
                tickPadding: 5,
                tickRotation: -50,
                legend: '', // "Data"
                legendPosition: 'middle',
                legendOffset: 32
            }}
            axisLeft={{
                tickSize: 5,
                tickPadding: 5,
                tickRotation: 0,
                legend: '', // "Valor"
                legendPosition: 'middle',
                legendOffset: -40
            }}
            valueFormat={value => `${Number(value).toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`}
            labelSkipWidth={1000} // default 13
            labelSkipHeight={1000} // default 12
            labelTextColor={{
                from: 'color',
                modifiers: [
                    [
                        'darker',
                        1.6
                    ]
                ]
            }}
            legends={[
                {
                    dataFrom: 'keys',
                    anchor: 'bottom-right',
                    direction: 'row',
                    justify: false,
                    translateX: 0,
                    translateY: 50,
                    itemsSpacing: 2,
                    itemWidth: 100,
                    itemHeight: 20,
                    itemDirection: 'left-to-right',
                    itemOpacity: 0.85,
                    symbolSize: 20,
                    effects: [
                        {
                            on: 'hover',
                            style: {
                                itemOpacity: 1
                            }
                        }
                    ]
                }
            ]}
            role="application"
            ariaLabel="Nivo bar chart demo"
            barAriaLabel={e => e.id + ": " + e.formattedValue + " in country: " + e.indexValue}
        />
    )

    const MyResponsivePie = (data: any) => (
        <ResponsivePie
            data={data}
            margin={{ top: 35, right: 20, bottom: 35, left: 20 }}
            // innerRadius={0.5}

            innerRadius={0.8}
            enableArcLabels={false}
            arcLinkLabel={d => `${d.id}`}
            // arcLabelsComponent={({ datum, label, style }) => {
            //     return (<></>)
            // }}
            activeInnerRadiusOffset={8}

            padAngle={0.7}
            cornerRadius={3}
            activeOuterRadiusOffset={8}
            borderWidth={1}
            borderColor={{
                from: 'color',
                modifiers: [
                    [
                        'darker',
                        0.2
                    ]
                ]
            }}
            arcLinkLabelsSkipAngle={10} // default 10
            arcLinkLabelsTextColor="#333333"
            arcLinkLabelsThickness={2}
            arcLinkLabelsColor={{ from: 'color' }}
            arcLabelsSkipAngle={361} // default 10
            arcLabelsTextColor={{
                from: 'color',
                modifiers: [
                    [
                        'darker',
                        2
                    ]
                ]
            }}
            arcLinkLabelsStraightLength={5}
            valueFormat={value => `${Number(value).toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`}
        />
        /* {
                            <Pie {...commonProperties}
                            innerRadius={0.8}
                            enableArcLabels={false}
                            arcLinkLabel={d => `${d.id} (${d.formattedValue})`}
                            activeInnerRadiusOffset={commonProperties.activeOuterRadiusOffset}
                            layers={['arcs', 'arcLabels', 'arcLinkLabels', 'legends', CenteredMetric]}
                            />
                        } */
    )
    
    if (!loggedUser) return <Navigate to="/login" />

    return (
        <div className={styles.page_container}>
            <br />
            <br />
            <br />
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
                const resp = await axios.get(`http://localhost:3000/api/report?start=${start}&end=${end}&wallet=${wallet}`, { withCredentials: true })
                const meusDadinhos = formatLineChartData(start, end, resp.data)
                const totalIncomesByCategory = formatDonutChartData(resp.data.totalIncomes.byCategory)
                const totalExpensesByCategory = formatDonutChartData(resp.data.totalExpenses.byCategory)

                setChartData({
                    isLoadingData: false,
                    barChartsData: meusDadinhos, donutChartsData: {
                        currencySymbol: resp.data.currencySymbol,
                        incomes: {
                            totalValue: resp.data.totalIncomes.total,
                            list: totalIncomesByCategory
                        },
                        expenses: {
                            totalValue: resp.data.totalExpenses.total,
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
                                MyResponsiveBar(chartData.barChartsData)
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
                                        MyResponsivePie(chartData.donutChartsData.incomes.list)
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
                                        MyResponsivePie(chartData.donutChartsData.expenses.list)
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

function formatLineChartData(startDate: string, endDate: string, data: any) {
    const datesData: any = []
    const firstDate = moment(startDate).startOf("day").valueOf()
    const lastDate = moment(endDate).startOf("day").valueOf()
    let loopDate = firstDate

    while (loopDate <= lastDate) {
        const dayData = {
            // date: `${String(moment(loopDate).date()).padStart(2, "0")} / ${String(moment(loopDate).month() + 1).padStart(2, "0")}`,
            date: `${String(moment(loopDate).date()).padStart(2, "0")}`,
            receitas: 0,
            despesas: 0
        }

        for (let date in data.totalIncomes.byDate) {
            if (loopDate == moment(date).valueOf()) {
                dayData.receitas = data.totalIncomes.byDate[date]
                break
            }
        }

        for (let date in data.totalExpenses.byDate) {
            if (loopDate == moment(date).valueOf()) {
                dayData.despesas = data.totalExpenses.byDate[date]
                break
            }
        }

        datesData.push(dayData)

        loopDate += 86400000 // 24 hours
    }

    return datesData
}

function formatDonutChartData(data: any) {
    const categoriesData: Array<IDonutChartData> = []

    for (let category in data) {
        categoriesData.push({
            id: category,
            label: category,
            value: Number(data[category])
        })
    }

    return categoriesData
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