"use client";
import React, { useEffect, useState } from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import Chart from "chart.js/auto";

interface MqttDataModel {
  humidity: number;
  temperature: number;
  soil_moisture: number;
  soil_moisture_status: string;
  water_pump_status: string;
  mqtt_duration: number;
  firebase_duration: number;
}

declare global {
  interface Window {
    myChart: Chart;
  }
}

export default function Home() {
  const [mqttDataModel, setMqttDataModel] = useState<MqttDataModel>({
    humidity: 0,
    temperature: 0,
    soil_moisture: 0,
    soil_moisture_status: "",
    water_pump_status: "",
    mqtt_duration: 0,
    firebase_duration: 0,
  });

  useEffect(() => {
    const event = new EventSource("/api/monitor", { withCredentials: true });
    event.onopen = function (ev) {
      console.log("Connected");
    };
    event.onmessage = function (e) {
      if (e.data === "Connected") {
        return;
      }
      setMqttDataModel(JSON.parse(e.data));
    };
    event.onerror = function (er) {
      console.log(er);
      event.close();
    };

    return () => {
      event.close();
    };
  }, []);

  useEffect(() => {
    // Update the chart whenever mqttDataModel changes
    updateChart(mqttDataModel.firebase_duration, mqttDataModel.mqtt_duration);
  }, [mqttDataModel]);

  const updateChart = (firebaseDuration: number, mqttDuration: number) => {
    if (!window.myChart) {
      const ctx = document.getElementById('durationChart').getContext('2d');
      window.myChart = new Chart(ctx, {
        type: 'line',
        data: {
          labels: [],
          datasets: [
            {
              label: 'HTTP Duration',
              data: [],
              borderColor: 'rgb(255, 99, 132)',
              tension: 0.1
            },
            {
              label: 'MQTT Duration',
              data: [],
              borderColor: 'rgb(54, 162, 235)',
              tension: 0.1
            }
          ]
        },
        options: {
          scales: {
            y: {
              beginAtZero: true
            }
          }
        }
      });
    }

    const chart = window.myChart;
    const time = new Date().toLocaleTimeString();

    // Add new data to the datasets if the values are valid
    if (!isNaN(firebaseDuration)) {
      chart.data.datasets[0].data.push(firebaseDuration);
    }
    if (!isNaN(mqttDuration)) {
      chart.data.datasets[1].data.push(mqttDuration);
    }

    // Add new label
    chart.data.labels.push(time);

    // Limit the number of data points shown to 10
    const maxDataPoints = 10;
    if (chart.data.labels.length > maxDataPoints) {
      chart.data.labels.shift();
      chart.data.datasets.forEach(dataset => {
        dataset.data.shift();
      });
    }

    // Update the chart
    chart.update();
  };

  return (
    <div className="container">
      <h1 className="text-center mt-5 mb-4">Monitoring Tanah dan Jaringan</h1>
      <div className="row">
        <div className="col-md-4">
          <div className="card bg-info text-white mb-3">
            <div className="card-body">
              <h5 className="card-title">Kelembapan Tanah</h5>
              <p className="card-text">{mqttDataModel.soil_moisture}%</p>
            </div>
          </div>
        </div>
        <div className="col-md-4">
          <div className="card bg-success text-white mb-3">
            <div className="card-body">
              <h5 className="card-title">Kelembapan Udara</h5>
              <p className="card-text">{mqttDataModel.humidity}%</p>
            </div>
          </div>
        </div>
        <div className="col-md-4">
          <div className="card bg-warning text-white mb-3">
            <div className="card-body">
              <h5 className="card-title">Suhu Udara</h5>
              <p className="card-text">{mqttDataModel.temperature}°C</p>
            </div>
          </div>
        </div>
        <div className="col-md-6">
          <div className="card bg-secondary text-white mb-3">
            <div className="card-body">
              <h5 className="card-title">Durasi Transfer Data HTTP</h5>
              <p className="card-text">{mqttDataModel.firebase_duration}</p>
            </div>
          </div>
        </div>
        <div className="col-md-6">
          <div className="card bg-secondary text-white mb-3">
            <div className="card-body">
              <h5 className="card-title">Durasi Transfer Data MQTT</h5>
              <p className="card-text">{mqttDataModel.mqtt_duration}</p>
            </div>
          </div>
        </div>
        <div className="col-md-4">
          <div className="card bg-danger text-white mb-3">
            <div className="card-body">
              <h5 className="card-title">Status WaterPump</h5>
              <p className="card-text">{mqttDataModel.water_pump_status}</p>
            </div>
          </div>
        </div>
      </div>
      <div className="row">
        <div className="col-md-12">
          <div className="card">
            <div className="card-body">
              <canvas id="durationChart" width="400" height="200"></canvas>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

