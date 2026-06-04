import React, { useEffect, useRef } from 'react';
import './CLVSpeedometer.css';
import Chart from 'chart.js/auto';

const CLVSpeedometer = ({ title, value, unit, min, max }) => {
    const chartRef = useRef(null);
    // const value = 9.23; // The value to indicate with the needle
    // const max = 10; // Maximum value of the gauge
    // const min = 0;  // Minimum value of the gauge

    useEffect(() => {
        const ctx = chartRef.current.getContext('2d');

        // Create a gradient for the filled portion
        const gradient = ctx.createLinearGradient(0, 0, ctx.canvas.height, 0);
        gradient.addColorStop(0, '#E71D36');
        gradient.addColorStop(0.5, '#FFD66B');
        gradient.addColorStop(1, '#53FDCA');

        let filledPercentage;
        if (value > max) {
            filledPercentage = 100;
        } else {
            filledPercentage = ((value - min) / (max - min)) * 100;
            console.log('Filled Percentage: ', filledPercentage);
        }

        const data = {
            datasets: [
                {
                    data: [filledPercentage, 100 - filledPercentage], // Filled and unfilled portions
                    backgroundColor: [gradient, '#e0e0e0'], // Gradient for filled part, gray for unfilled
                    borderWidth: 0,
                    cutout: '70%', // To make it appear as a gauge
                    rotation: -135, // Start angle at -135 degrees
                    circumference: 270, // 270 degrees (75% of a circle)
                },
            ],
        };

        const options = {
            responsive: true,
            plugins: {
                tooltip: { enabled: false }, // Disable tooltip
            },
            rotation: -Math.PI, // Start angle
            circumference: 1.5 * Math.PI, // 1.5 * Pi (270 degrees)
        };

        const gaugeChart = new Chart(ctx, {
            type: 'doughnut',
            data: data,
            options: options,
        });

        return () => {
            gaugeChart.destroy();
        };
    }, [value]);

    return (
        <div className='speedometer-container'>
            <div className='title'>{title}</div>
            <div className='description'>on average</div>
            <div className='canvas-container'>
                <canvas ref={chartRef}></canvas>
            </div>
            <div className='value-container'>
                <span className='value'>{value}</span> <br /> <span className='unit'>{unit}</span>
            </div>
        </div>
    );
};

export default CLVSpeedometer;
