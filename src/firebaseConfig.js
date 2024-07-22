// src/firebaseConfig.js
import { initializeApp } from "firebase/app";
import { getDatabase } from "firebase/database";

const firebaseConfig = {
  apiKey: "AIzaSyBc3tFR5xw6m5oIK-aXBF4Q5vQekUEzvhM",
  authDomain: "omnajib-f4f86.firebaseapp.com",
  databaseURL: "https://omnajib-f4f86-default-rtdb.firebaseio.com",
  projectId: "omnajib-f4f86",
  storageBucket: "omnajib-f4f86.appspot.com",
  messagingSenderId: "401489910264",
  appId: "1:401489910264:web:e8f51ae9d1dd89535e1e0d",
  measurementId: "G-108KH5K2CF"
};

const app = initializeApp(firebaseConfig);
const database = getDatabase(app);

export { database };
