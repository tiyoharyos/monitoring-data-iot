import mongoose from "mongoose";
import mqtt from "mqtt";
import { setMqttDataModel } from "./utils";
import { mongodb } from "@/db/schema";

export const dynamic = "force-dynamic";
export const fetchCache = "force-no-store";

mongodb.then(() => {
  console.log("MongoDB Connected");
});

const MQTT_BROKER = "io.adafruit.com";
const MQTT_PORT = 1883;
const USERNAME = "haryo";
const MONITORING = `${USERNAME}/feeds/monitoring_cabai`;
const ACTIVE_KEY = "aio_IzdH60pL3au3xPKAtHzTOxJnWUCX";
const mqttClient = mqtt.connect(`mqtt://${MQTT_BROKER}:${MQTT_PORT}`, {
  username: USERNAME,
  password: ACTIVE_KEY,
});

mqttClient.on("connect", () => {
  mqttClient.subscribe(MONITORING);
});

mqttClient.on("error", (e) => {
  console.log(e);
});

async function saveDelayToMongoDB(delayData: any) {
  try {
    const newDelayData = await mongoose.model("DelayData").create(delayData);
    await newDelayData.save();
    console.log("Delay data saved to MongoDB.");
  } catch (error) {
    console.log("Failed to save delay data to MongoDB:", error);
  }
}

export async function GET(req: Request) {
  let responseWriter = new TransformStream();
  const writer = responseWriter.writable.getWriter();
  const encoder = new TextEncoder();
  mqttClient.on("message", async (topic, message) => {
    console.log("Received message from MQTT:", message.toString());
    try {
      const receivedData = JSON.parse(message.toString());

      const startTime = new Date().getTime();

      const delayData = {
        source: "MQTT",
        delay: 0,
      };

      //   io.emit('sensorDataUpdate', receivedData);
      writer.write(encoder.encode(`data: ${JSON.stringify(receivedData)}\n\n`));
      await setMqttDataModel(receivedData);
      console.log("Data saved to MongoDB (MQTT).");

      const endTime = new Date().getTime();
      const processingTime = endTime - startTime;

      delayData.delay = processingTime;
      await saveDelayToMongoDB(delayData);

      console.log("Processing delay (MQTT):", processingTime, "milliseconds");
    } catch (error) {
      console.log("Failed to save MQTT data:", error);
    }
  });
  writer.write(encoder.encode("data: Connected\n\n"));
  req.signal.addEventListener("abort", () => {
    writer.close();
    console.log("Connection closed by the abort.");
  });

  req.signal.addEventListener("unhandledrejection", () => {
    writer.close();
    console.log("Connection closed by the unhandledrejection.");
  });

  return new Response(responseWriter.readable, {
    headers: {
      "Content-Type": "text/event-stream",
      Connection: "keep-alive",
      "Cache-Control": "no-cache, no-transform",
    },
  });
}
export async function POST(req: Request) {
  const body = await req.json();
  console.log("Received message from POST:", body);
  mqttClient.publish(MONITORING, JSON.stringify(body));
  return Response.json({ message: "Published", data: body });
}
