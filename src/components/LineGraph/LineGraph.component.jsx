import React, {useState, useEffect} from 'react'
import { Line } from 'react-chartjs-2'
import { findAllByTestId } from '@testing-library/react';
import numeral from 'numeral';

const options = {
    legend: {
        display: false
    },
    elements: {
        point: {
            radius: 0,
        },
    },
    maintainAspectRatio: false,
    tooltips: {
        mode: "index",
        intersect: false,
        callbacks: {
            label: function (tooltipItem, data) {
                return numeral(tooltipItem.value).format("+0,0");

            }
        }
    },
    scales: {
        xAxes: [
            {
                type: "time",
                time: {
                    format: "MM/DD/YY",
                    tooltipFormat: "ll"
                }
            }
        ],
        yAxes: [
            {
                gridLines: {
                    display: findAllByTestId,
                    tricks: {
                        callback: function (value, index, values) {
                            return numeral(value).format("0a")
                        }
                    }
                }
            }
        ]
    }
}

const buildChartData = (data, caseType='cases') => {
    const chartData = [];
    let lastDataPoint = undefined;

    Object.keys(data[caseType]).forEach(date => {
        if(lastDataPoint) {
            const newDataPoint = {
                x: date,
                y: data[caseType][date] - lastDataPoint
            }
            chartData.push(newDataPoint)
        }
        lastDataPoint = data[caseType][date]
    })
    
    return chartData;
}

// const getBGColor = (caseType) => {
//     if(caseType === 'cases') {
//         return "rgba(204,16,52,0.5)"
//     } else if(caseType === 'recovered') {
//         return "rgba(125,215,29,0.5)"
//     } else return "rgba(251,68,67,0.5)"
// }

// const getBorderColor = (caseType) => {
//     if(caseType === 'cases') {
//         return "#cc1034"
//     } else if(caseType === 'recovered') {
//         return "#7dd71d"
//     } else return "fb4443"
// }

const LineGraph = ({caseType, ...props}) => {
    const [data, setData] = useState({});

    // const bgColor = getBGColor(caseType);
    // const borderColor = getBorderColor(caseType);
    // console.log(bgColor, borderColor)

    //https://disease.sh/v3​/covid-19​/historical​/all?lastdays=120

    useEffect(() => {
        const fetchData = async () => {
            await fetch('https://disease.sh/v3/covid-19/historical/all?lastdays=120')
            .then(response => response.json())
            .then(data => {
                const chartData = buildChartData(data, caseType);
                setData(chartData);
            })
        }

        fetchData();
    },[caseType])


    return (
        <div className={props.className}>
            {data?.length > 0 && 
                <Line
                    data = {{
                        datasets: [
                            {
                                backgroundColor: "rgba(204, 16, 52, 0.5)",
                                borderColor: "#CC1034",
                                data: data
                            }
                        ]
                    }}
                    options = {options}
                />
            }
        </div>
    )
}

export default LineGraph;