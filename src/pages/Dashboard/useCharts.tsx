import { ResponsiveBar } from "@nivo/bar"
import { ResponsivePie } from "@nivo/pie"
import {ColorSchemeId} from "@nivo/colors/dist/types/schemes/all"

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

export function renderResponsivePieChart(data: Array<IDonutChartData>, scheme: ColorSchemeId, currencySymbol?: string) {
    currencySymbol = (currencySymbol) ? `${currencySymbol} ` : ""

    return (
        <ResponsivePie
            data={data}
                        
            margin={{ top: 15, right: 0, bottom: 15, left: 0 }}

            innerRadius={0.1}
            enableArcLabels={false}
            
            enableArcLinkLabels={true}
            arcLinkLabel={(pieItem) => { return `${pieItem.id} (${currencySymbol}${Number(pieItem.value).toLocaleString(undefined, {maximumFractionDigits: 2, minimumFractionDigits: 2})})` }}
            arcLinkLabelsSkipAngle={45}
            arcLinkLabelsDiagonalLength={5}
            arcLinkLabelsStraightLength={5}
            arcLinkLabelsTextOffset={5}

            activeInnerRadiusOffset={8}

            // sortByValue={true}
            padAngle={0.7}
            cornerRadius={3}
            activeOuterRadiusOffset={8}
            colors={{scheme}}
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

            valueFormat={value => `${Number(value).toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`}

            legends={[{
                anchor: 'bottom-right',
                direction: 'column',
                justify: false,
                translateX: -10,
                translateY: 5,
                itemsSpacing: 5,
                itemWidth: 100,
                itemHeight: 17,
                itemTextColor: '#999',
                itemDirection: 'right-to-left',
                itemOpacity: 1,
                symbolSize: 18,
                symbolShape: 'circle',


                effects: [
                    {
                        on: 'hover',
                        style: {
                            itemTextColor: '#000'
                        }
                    }
                ],
                onClick: (data) => {alert(data.label + " - " + data.fill)}
                // onClick: (data, event) => {alert(data.label + " - " + data.fill)}
            }]}
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