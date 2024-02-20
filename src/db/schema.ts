import mongoose from "mongoose";

const MqttDataModel =
  mongoose.models.MqttData ??
  mongoose.model(
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

const DelayDataModel =
  mongoose.models.DelayData ??
  mongoose.model(
    "DelayData",
    new mongoose.Schema({
      source: String,
      delay: Number,
    })
  );

const mongodb = mongoose.connect("mongodb+srv://haryos:AkuNyolo288790@datacabai.dxdvdpw.mongodb.net/?retryWrites=true&w=majority%22");

export { mongodb };
