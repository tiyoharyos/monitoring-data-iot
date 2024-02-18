import mongoose from "mongoose";
import { getApps,initializeApp,cert } from "firebase-admin/app";

const alreadyCreatedApps = getApps();

if (alreadyCreatedApps.length === 0) {
  initializeApp({
    credential: cert("./app/api/monitor/datamonitoring-5e5c6-firebase-adminsdk-lpyrh-6978142e7a.json"),
    databaseURL: "https://datamonitoring-5e5c6-default-rtdb.asia-southeast1.firebasedatabase.app",
  });
}

export const MqttDataModel = mongoose.model(
  "MqttData",
  new mongoose.Schema({
    humidity: Number,
    temperature: Number,
    soil_moisture: Number,
    soil_moisture_status: String,
    water_pump_status: String,
    mqtt_duration: Number,
    firebase_duration: Number,
    delay_data: {
      source: String,
      delay: Number,
    },
  })
);

export async function setMqttDataModel(receivedData) {
  try {
    const newMqttData = new MqttDataModel({
      humidity: receivedData.humidity,
      temperature: receivedData.temperature,
      soil_moisture: receivedData.soil_moisture,
      soil_moisture_status: receivedData.soil_moisture_status,
      water_pump_status: receivedData.water_pump_status,
      mqtt_duration: receivedData.mqtt_duration,
      firebase_duration: receivedData.firebase_duration,
      delay_data: {
        source: "MQTT",
        delay: 0,
      },
    });
    await newMqttData.save();
    console.log("Data saved to MongoDB (MQTT).");
  } catch (error) {
    console.error("Failed to save MQTT data:", error);
  }
}

export const DelayDataModel = mongoose.model(
  "DelayData",
  new mongoose.Schema({
    source: String,
    delay: Number,
  })
);
