import React from "react";
import { Line } from "react-chartjs-2";
import { Chart as ChartJS, LineElement, CategoryScale, LinearScale, Title, Tooltip, Legend } from "chart.js";

// Register Chart.js components
ChartJS.register(LineElement, CategoryScale, LinearScale, Title, Tooltip, Legend);

const LineChart = ({ data }) => {
  const chartData = {
    labels: data.map((_, index) => index + 1), // X-axis labels (e.g., seconds)
    datasets: [
      {
        label: "Soil Moisture",
        data: data.map(d => d.soilMoisture),
        borderColor: 'rgba(75, 192, 192, 1)',
        backgroundColor: 'rgba(75, 192, 192, 0.2)',
        fill: false,
      },
      {
        label: "Temperature",
        data: data.map(d => d.temperature),
        borderColor: 'rgba(255, 99, 132, 1)',
        backgroundColor: 'rgba(255, 99, 132, 0.2)',
        fill: false,
      },
      {
        label: "Humidity",
        data: data.map(d => d.humidity),
        borderColor: 'rgba(153, 102, 255, 1)',
        backgroundColor: 'rgba(153, 102, 255, 0.2)',
        fill: false,
      },
    ],
  };

  const options = {
    scales: {
      x: {
        title: {
          display: true,
          text: 'Time (seconds)',
        },
      },
      y: {
        title: {
          display: true,
          text: 'Value',
        },
      },
    },
  };

  return (
    <div>
      <h2>Data Line Chart</h2>
      <Line data={chartData} options={options} />
    </div>
  );
};

export default LineChart;
