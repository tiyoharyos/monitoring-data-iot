import mongoose from "mongoose";
import mqtt from "mqtt";
import fs from "fs";
import {DelayDataModel,setMqttDataModel} from "./firebase.js";




mongoose.connect("mongodb://localhost:27017/Testing");



const MQTT_BROKER = "io.adafruit.com";
const MQTT_PORT = 1883;
const USERNAME = "haryo";
const MONITORING = `${USERNAME}/feeds/monitoring_cabai`;
const ACTIVE_KEY = "aio_bqIW38bzM9bjlZvmVaM9zZv2IzwP";
const mqttClient = mqtt.connect(`mqtt://${MQTT_BROKER}:${MQTT_PORT}`, {
  username: USERNAME,
  password: ACTIVE_KEY,
});


mqttClient.on("connect", () => {
  mqttClient.subscribe(MONITORING);
  console.log("MQTT Connected")
});

mqttClient.on("error", (e) => {
  console.log(e)
})

mqttClient.on("message", async (topic, message) => {
  try {
    const receivedData = JSON.parse(message.toString());

    const startTime = new Date().getTime();

    const delayData = {
      source: "MQTT",
      delay: 0,
    };

   

    //   io.emit('sensorDataUpdate', receivedData);
    writer.write(encoder.encode(`data: ${JSON.stringify(receivedData)}\n\n`));
    setMqttDataModel(receivedData)
    await newMqttData.save();
    console.log("Data saved to MongoDB (MQTT).");

    const endTime = new Date().getTime();
    const processingTime = endTime - startTime;

    delayData.delay = processingTime;
    await saveDelayToMongoDB(delayData);

    console.log("Processing delay (MQTT):", processingTime, "milliseconds");
  } catch (error) {
    console.error("Failed to save MQTT data:", error);
  }
});



async function saveDelayToMongoDB(delayData) {
  try {
    const newDelayData = new DelayDataModel(delayData);
    await newDelayData.save();
    console.log("Delay data saved to MongoDB.");
  } catch (error) {
    console.error("Failed to save delay data to MongoDB:", error);
  }
}


export async function GET(req) {
  let responseWriter = new TransformStream();
const writer = responseWriter.writable.getWriter();
const encoder = new TextEncoder();
  const serviceAccount = fs.readFileSync("./app/api/monitor/datamonitoring-5e5c6-firebase-adminsdk-lpyrh-6978142e7a.json");



  writer.write(encoder.encode("data: isidatanya\n\n"));
 
  return new Response(responseWriter.readable, {
    headers: {
      "Content-Type": "text/event-stream",
      Connection: "keep-alive",
      "Cache-Control": "no-cache, no-transform",
    },
  });

  //   return Response.json({ message: "Connected" });
}
export const dynamic = "force-dynamic";