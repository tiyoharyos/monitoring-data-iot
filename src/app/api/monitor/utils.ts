import mongoose from "mongoose";
import { getApps, initializeApp, cert } from "firebase-admin/app";
const alreadyCreatedApps = getApps();

if (alreadyCreatedApps.length === 0) {
  initializeApp({
    credential: cert(
      "./src/app/api/monitor/datamonitoring-5e5c6-firebase-adminsdk-lpyrh-6978142e7a.json"
    ),
    databaseURL:
      "https://datamonitoring-5e5c6-default-rtdb.asia-southeast1.firebasedatabase.app",
  });
}

export async function setMqttDataModel(receivedData: any) {
  try {
    const MqttDataModel = await mongoose.model("MqttData").create({
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
    await MqttDataModel.save();
    console.log("Data saved to MongoDB (MQTT).");
  } catch (error) {
    console.error("Failed to save MQTT data:", error);
  }
}
