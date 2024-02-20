"use client";

import { ReactHTML, useEffect, useState } from "react";
import _ from "lodash";

interface MqttDataModel {
  humidity: number;
  temperature: number;
  soil_moisture: number;
  soil_moisture_status: string;
  water_pump_status: string;
  mqtt_duration: number;
  firebase_duration: number;
}

export default function Home() {
  const [mqttDataModel, setMqttDataModel] = useState([] as MqttDataModel[]);

  // const onChange = (e: any) => {
  //   e.preventDefault();
  //   setMqttDataModel((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  // };

  const onSubmit = async (e: any) => {
    e.preventDefault();
    const response = await fetch("/api/monitor", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(mqttDataModel),
    });
    console.log(await response.json());
  };

  useEffect(() => {
    const event = new EventSource("/api/monitor", { withCredentials: true });
    event.onopen = function (ev) {
      console.log("Connected");
    };
    event.onmessage = function (e) {
      if (e.data === "Connected") {
        return;
      }
      setMqttDataModel((prev) => {
        const lastData = prev.at(-1);
        const newData = JSON.parse(e.data);
        // if (
        //   lastData &&
        //   _.isEqual(
        //     _.pick(lastData, ["humidity", "temperature", "soil_moisture"]),
        //     _.pick(newData, ["humidity", "temperature", "soil_moisture"])
        //   )
        // ) {
        //   return prev;
        // }
        return [...prev, newData];
      });
    };
    event.onerror = function (er) {
      console.log(er);
      event.close();
    };

    return () => {};
  }, []);

  return (
    <div>
      {/* <form method="post">
        <input onChange={onChange} title="Message" type="text" name="message" />
        <button onClick={onSubmit} type="button">
          Send
        </button>
      </form> */}
      <pre>{JSON.stringify(mqttDataModel, null, 2)}</pre>
    </div>
  );
}
