import { useState } from "react";
import { appConfigs } from "../../config/app-configs";
import moment from "moment";

// Api service
import { api } from "../helpers/apiCall";

// 
import { IReportData, IChartsData, IWallet, IDonutChartData } from "../type-defs";

const { reportGetEndpoint } = appConfigs

interface IUseReportProps {
    initialStartDate: string;
    initialEndDate: string;
    initialWallet: IWallet | null;
}


export function useReport(initialValues: IUseReportProps) {
    const { initialStartDate, initialEndDate, initialWallet } = initialValues

    const [chartData, setChartData] = useState<IChartsData>(initializeChartsData())
    const [reportProps, setReportProps] = useState({
        startDate: validateDate(initialStartDate),
        endDate: validateDate(initialEndDate),
        wallet: initialWallet
    })

    const [loadingReport, setLoadingReport] = useState(true)

    async function getReportData() {
        // 
        if (!reportProps.wallet) return false
        
        try {
            setLoadingReport(true)

            const response: IReportData = (await api.get(`${reportGetEndpoint}?start=${reportProps.startDate}&end=${reportProps.endDate}&wallet=${reportProps.wallet.id}`)).data
            const barChartsData = formatBarChartData(reportProps.startDate, reportProps.endDate, response)
            const totalIncomesByCategory = formatDonutChartData(response.totalIncomes.byCategory)
            const totalExpensesByCategory = formatDonutChartData(response.totalExpenses.byCategory)

            setChartData({
                isLoadingData: false,
                barChartsData,
                donutChartsData: {
                    currencySymbol: response.currencySymbol,
                    incomes: {
                        totalValue: response.totalIncomes.total,
                        list: totalIncomesByCategory
                    },
                    expenses: {
                        totalValue: response.totalExpenses.total,
                        list: totalExpensesByCategory
                    }
                }
            })

            return true
        } catch (error: any) {
            return false
        } finally {
            setLoadingReport(false)
        }
    }

    function setReportStartDate(date: string | Date) {
        setReportProps({ ...reportProps, startDate: validateDate(date) })
    }

    function setReportEndDate(date: string | Date) {
        setReportProps({ ...reportProps, endDate: validateDate(date) })
    }

    function setReportWallet(wallet: IWallet) {
        setReportProps({ ...reportProps, wallet })
    }

    const reportStartDate = () => { return reportProps.startDate }
    const reportEndDate = () => { return reportProps.endDate }

    
    return {
        reportStartDate,
        reportEndDate,
        setReportStartDate,
        setReportEndDate,
        setReportWallet,
        getReportData,
        chartData,
        loadingReport
    }
}

// Helpers
function validateDate(date: string | Date): string {
    try {
        const validatedDate = moment(date).toISOString(true).split("T")[0]
        return validatedDate
    } catch (error) {
        const validatedDate = moment(Date.now()).toISOString(true).split("T")[0]
        return validatedDate
    }
}

function formatBarChartData(startDate: string, endDate: string, data: any) {
    const datesData: any = []
    const firstDate = moment(startDate).startOf("day").valueOf()
    const lastDate = moment(endDate).startOf("day").valueOf()
    let loopDate = firstDate

    while (loopDate <= lastDate) {
        const dayData = {
            date: `${String(moment(loopDate).date()).padStart(2, "0")}`,
            receitas: 0,
            despesas: 0
        }

        for (const date in data.totalIncomes.byDate) {
            if (loopDate == moment(date).valueOf()) {
                dayData.receitas = data.totalIncomes.byDate[date]
                break
            }
        }

        for (const date in data.totalExpenses.byDate) {
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

function initializeChartsData(): IChartsData {
    return {
        barChartsData: [],
        donutChartsData: {
            currencySymbol: "",
            incomes: {
                totalValue: 0,
                list: []
            },
            expenses: {
                totalValue: 0,
                list: []
            }
        },
        isLoadingData: true
    }
}