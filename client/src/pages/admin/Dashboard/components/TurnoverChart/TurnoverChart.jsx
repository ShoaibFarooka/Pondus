import { useEffect, useRef } from 'react';
import './TurnoverChart.css';
import Chart from 'chart.js/auto';

const TurnoverChart = ({ data }) => {
  const chartRef = useRef(null);

  useEffect(() => {
    const ctx = chartRef.current.getContext('2d');

    // Create the gradient
    const gradient = ctx.createLinearGradient(0, 0, ctx.canvas.width, 0); // Adjust gradient based on canvas width
    gradient.addColorStop(0, 'rgba(83, 253, 202, 0.3)'); // More color on the left
    gradient.addColorStop(1, 'rgba(83, 253, 202, 0.1)');   // Less color on the right

    const labels = data.map(item => item.period);
    const chartData = data.map(item => item.totalTurnover);
    const minValue = Math.min(...chartData);
    const maxValue = Math.max(...chartData);

    const stepSize = Math.ceil((maxValue - minValue) / 5);

    const turnoverChart = new Chart(ctx, {
      type: 'line',
      data: {
        labels: labels,
        datasets: [
          {
            label: 'Turnover',
            data: chartData,
            borderColor: '#53FDCA',
            borderWidth: '4',
            backgroundColor: gradient, // Use the gradient as background color
            fill: true,
            tension: 0.4, // Smooth curve
            pointHoverBackgroundColor: '#00d1b2',
            pointHoverBorderColor: '#fff',
            pointHoverRadius: 5,
          },
        ],
      },
      options: {
        layout: {
          padding: {
            // right: -100
          }
        },
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          legend: {
            display: false,
          },
          tooltip: {
            padding: 10,
            displayColors: false,
            yAlign: "bottom",
            cornerRadius: 10,
            
            titleColor: "#FAFAFA",
            titleFont: {
              size: 12,
              weight: "lighter",
            },
            titleAlign: "center",
            titleMarginBottom: 9,
            bodyAlign: "center",
            bodyColor: "#FFFFFF",
            bodyFont: {
              size: 16,
              weight: "bold",
            },
            callbacks: {
              title: () => 'Turnover',
              label: function (context) {
                return `          ${context.parsed.y}          `;
              },

              // label: function (context) {
              //   let label = context.dataset.label || '';

              //   if (label) {
              //     label += ': ';
              //   }
              //   if (context.parsed.y !== null) {
              //     label += `${context.parsed.y}`;
              //   }
              //   return label;
              // },
            },
          },
          title: { // Add the title configuration here
            display: true,
            text: 'Turnover',
            position: 'top',
            padding: {
              top: 30,
              bottom: 20
            },
            font: {
              size: 20,
              weight: 'bold'
            },
          },
        },
        scales: {
          y: {
            beginAtZero: true,
            title: {
              display: false,
              text: 'Turnover',
            },
            ticks: {
              stepSize: stepSize,
            },
            grid: {
              display: true, // Show horizontal grid lines
              drawBorder: false, // Optional: Remove border line on the y-axis
            },
          },
          x: {
            title: {
              display: false,
              text: 'Months',
            },
            grid: {
              display: false, // Hide vertical grid lines
              drawBorder: false, // Optional: Remove border line on the x-axis
            },
          },
        },
      },
    });

    // Cleanup function to destroy chart instance
    return () => {
      turnoverChart.destroy();
    };
  }, [data]);

  return (
    <div className='turnover-chart-container'>
      <canvas ref={chartRef}></canvas>
    </div>
  );
};

export default TurnoverChart;
