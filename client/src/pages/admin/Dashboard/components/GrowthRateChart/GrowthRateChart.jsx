import { useEffect, useRef } from 'react';
import './GrowthRateChart.css';
import Chart from 'chart.js/auto';

const GrowthRateChart = ({ data, selectedView }) => {
    // const chartRef = useRef(null);

    // useEffect(() => {
    //     const ctx = chartRef.current.getContext('2d');

    //     // Create the gradient
    //     const gradient = ctx.createLinearGradient(0, 0, 0, ctx.canvas.height); // Adjust gradient based on canvas width
    //     gradient.addColorStop(0, 'rgba(83, 253, 202, 1)'); // More color on the left
    //     gradient.addColorStop(1, 'rgba(83, 253, 202, 0.1)'); // More color on the left

    //     const labels = data.map(item => item.period);
    //     const chartData = data.map(item => item.relativeGrowthRate);
    //     const minValue = Math.min(...chartData);
    //     const maxValue = Math.max(...chartData);

    //     const stepSize = Math.ceil((maxValue - minValue) / 5);


    //     const growthRateChart = new Chart(ctx, {
    //         type: 'line',
    //         data: {
    //             labels: labels,
    //             datasets: [
    //                 {
    //                     label: 'Growth Rate',
    //                     data: chartData,
    //                     borderColor: '#53FDCA',
    //                     borderWidth: '3.5',
    //                     backgroundColor: gradient, // Use the gradient as background color
    //                     fill: true,
    //                     tension: 0.4, // Smooth curve
    //                     pointRadius: 0,
    //                     pointHoverRadius: 0,
    //                 },
    //             ],
    //         },
    //         options: {
    //             responsive: true,
    //             maintainAspectRatio: false,
    //             layout: {
    //                 padding: {
    //                     left: -8,
    //                     bottom: -8,
    //                     right: 0
    //                 }
    //             },
    //             plugins: {
    //                 legend: {
    //                     display: false,
    //                 },
    //                 tooltip: {
    //                     enabled: false, // Disable tooltips
    //                 },
    //                 title: {
    //                     display: false,
    //                 },
    //             },
    //             scales: {
    //                 y: {
    //                     beginAtZero: true,
    //                     ticks: {
    //                         display: false
    //                     },
    //                     grid: {
    //                         display: false, // Hide horizontal grid lines
    //                         drawBorder: false,
    //                     },
    //                     border: {
    //                         display: false
    //                     }
    //                 },
    //                 x: {
    //                     ticks: {
    //                         display: false
    //                     },
    //                     grid: {
    //                         display: false, // Hide vertical grid lines
    //                         drawBorder: false,
    //                     },
    //                     border: {
    //                         display: false
    //                     }
    //                 },
    //             },
    //         },
    //     });

    //     // Cleanup function to destroy chart instance
    //     return () => {
    //         growthRateChart.destroy();
    //     };
    // }, [data]);

    const getCurrentRate = () => {
        const currentMonth = new Date().getMonth();
        let dataIndex;
        if (selectedView === 'monthly') {
            dataIndex = currentMonth - 1;
        }
        else if (selectedView === 'quarterly') {
            dataIndex = Math.floor((currentMonth) / 3) - 1;
        }
        else if (selectedView === 'halfYearly') {
            dataIndex = Math.floor((currentMonth) / 6) - 1;
        }
        else {
            dataIndex = data.length - 1;
        }
        if (dataIndex < 0) {
            return 'N/A';
        }
        return isNaN(parseInt(data[dataIndex]?.growthRate)) ? 'N/A' : data[dataIndex].growthRate + '%';
    }

    return (
        <div className='growth-rate-chart'>
            <div className='chart-header'>
                <div className='chart-title'>Growth Rate</div>
                <div className='chart-description'>compared to last month</div>
                <div className='chart-percentage'>{getCurrentRate()}</div>
            </div>
            {/* <div className='growth-rate-chart-container'>
                <canvas ref={chartRef}></canvas>
            </div> */}
        </div>
    );
};

export default GrowthRateChart;
