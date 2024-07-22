import React from "react";
import DataDisplay from "./components/DataDisplay";
import './App.css'; // Import the CSS file for styling

function App() {
  return (
    <div className="App">
      <header className="App-header">
        <h1>Firebase Data Monitoring</h1>
      </header>
      <main>
        <DataDisplay />
      </main>
    </div>
  );
}

export default App;
