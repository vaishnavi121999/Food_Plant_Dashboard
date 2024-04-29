import React, { useState, useEffect } from 'react';
import { Line } from 'react-chartjs-2';
import { Chart as ChartJS, CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend } from 'chart.js';
import './App.css';

// Register Chart.js components
ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend);

function App() {
    const [chartData, setChartData] = useState({ datasets: [] });
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState('');

    useEffect(() => {
        fetch('http://localhost:3001/data')
            .then(response => {
                if (!response.ok) {
                    throw new Error(`HTTP error! Status: ${response.status}`);
                }
                return response.json();
            })
            .then(data => {
                const labels = data[0].slice(1).map(dateString => {
                    // Create a date object using the dateString
                    const date = new Date(dateString);
                    // Format the date as "Month" (e.g., "January")
                    return date.toLocaleString('default', { month: 'long' });
                });

                const datasets = data.slice(1).map((row, index) => {
                    const borderColor = `rgb(${Math.floor(Math.random() * 255)}, ${Math.floor(Math.random() * 255)}, ${Math.floor(Math.random() * 255)})`;
                    return {
                        label: row[0],
                        data: row.slice(1),
                        fill: false,
                        borderColor: borderColor,
                        backgroundColor: borderColor,
                        tension: 0.1,
                    };
                });

                setChartData({
                    labels: labels,
                    datasets: datasets
                });
                setIsLoading(false);
            })
            .catch(error => {
                console.error('Error fetching data:', error.message);
                setError(error.message);
                setIsLoading(false);
            });
    }, []);

    const options = {
        responsive: true,
        plugins: {
            legend: {
                labels: {
                    boxWidth: 20,
                    padding: 20,
                    font: {
                        size: 14,
                    },
                },
                onClick: (e, legendItem, legend) => {
                    const index = legendItem.datasetIndex;
                    const ci = legend.chart;
                    if (ci.isDatasetVisible(index)) {
                        ci.hide(index);
                        legendItem.hidden = true;
                    } else {
                        ci.show(index);
                        legendItem.hidden = false;
                    }
                    ci.update();
                },
            },
            tooltip: {
                mode: 'index',
                intersect: false,
            },
        },
        scales: {
            x: {
                title: {
                    display: true,
                    text: 'Month',
                    font: {
                        size: 16,
                    },
                },
            },
            y: {
                title: {
                    display: true,
                    text: 'Normalized Value',
                    font: {
                        size: 16,
                    },
                },
            },
        },
    };

    return (
        <div className="App">
            <h1>Environmental Data Dashboard</h1>
            {isLoading ? (
                <p>Loading...</p>
            ) : error ? (
                <p>Error: {error}</p>
            ) : (
                <Line data={chartData} options={options} />
            )}
        </div>
    );
}

export default App;
