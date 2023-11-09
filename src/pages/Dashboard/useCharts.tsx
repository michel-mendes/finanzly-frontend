import { ResponsiveBar } from "@nivo/bar"
import { ResponsivePie } from "@nivo/pie"

import moment from "moment"

import { IBarChartData, IDonutChartData } from "../../type-defs"

export function renderResponsiveBarChart(data: Array<IBarChartData>) {
    return (
        <ResponsiveBar
            data={data as any}
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
}

export function renderResponsivePieChart(data: Array<IDonutChartData>) {
    return (
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
}

export function formatLineChartData(startDate: string, endDate: string, data: any) {
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

export function formatDonutChartData(data: any) {
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