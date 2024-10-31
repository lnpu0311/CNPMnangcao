import React from "react";
import { Line } from "react-chartjs-2";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";
import { Box, Heading } from "@chakra-ui/react";
// Register the required components for the Line chart
ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
);

function MonthlyRevenueChart() {
  // Monthly revenue data for each facility
  const data = {
    labels: ["1", "2", "3", "4", "5", "6", "7", "8", "9", "10", "11", "12"],
    datasets: [
      {
        label: "Cơ Sở A",
        data: [10, 12, 14, 16, 20, 18, 15, 14, 16, 18, 20, 50],
        borderColor: "#FF6384",
        backgroundColor: "rgba(255, 99, 132, 0.3)",
        pointBackgroundColor: "#FF6384",
        pointBorderColor: "#fff",
        pointRadius: 6,
        pointHoverRadius: 8,
        borderWidth: 3,
        tension: 0.4,
      },
      {
        label: "Cơ Sở B",
        data: [15, 16, 14, 18, 19, 22, 21, 20, 18, 21, 23, 24],
        borderColor: "#36A2EB",
        backgroundColor: "rgba(54, 162, 235, 0.3)",
        pointBackgroundColor: "#36A2EB",
        pointBorderColor: "#fff",
        pointRadius: 6,
        pointHoverRadius: 8,
        borderWidth: 3,
        tension: 0.4,
      },
      {
        label: "Cơ Sở C",
        data: [12, 14, 13, 15, 17, 19, 18, 17, 15, 16, 19, 21],
        borderColor: "#FFCE56",
        backgroundColor: "rgba(255, 206, 86, 0.3)",
        pointBackgroundColor: "#FFCE56",
        pointBorderColor: "#fff",
        pointRadius: 6,
        pointHoverRadius: 8,
        borderWidth: 3,
        tension: 0.4,
      },
    ],
  };

  const options = {
    responsive: true,
    plugins: {
      legend: {
        position: "top",
        labels: {
          font: {
            size: 16,
            weight: "bold",
          },
        },
      },

      tooltip: {
        enabled: true,
        backgroundColor: "#333",
        titleFont: { size: 14 },
        bodyFont: { size: 12 },
        padding: 10,
        borderColor: "#ddd",
        borderWidth: 1,
      },
    },
    scales: {
      y: {
        beginAtZero: true,
        title: {
          display: true,
          text: "triệu VND",
          font: {
            size: 16,
          },
          color: "#333",
        },
        ticks: {
          font: {
            size: 14,
          },
        },
      },
      x: {
        title: {
          display: true,
          text: "Tháng",
          font: {
            size: 16,
          },
          color: "#333",
        },
        ticks: {
          font: {
            size: 14,
          },
        },
      },
    },
  };

  return (
    <Box
      bgColor={"brand.2"}
      boxShadow={"2xl"}
      maxW={"950px"}
      style={{
        margin: "auto",

        borderRadius: "12px",
      }}
    >
      <Heading
        textColor={"blue.500"}
        as="h3"
        size="lg"
        mb={{ base: 4, md: 12 }}
      >
        Thống Kê Doanh Thu
      </Heading>
      <Line data={data} options={options} />
    </Box>
  );
}

export default MonthlyRevenueChart;
