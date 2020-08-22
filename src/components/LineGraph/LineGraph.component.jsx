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

const LineGraph = ({caseType}) => {
    const [data, setData] = useState({});

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
        <div>
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