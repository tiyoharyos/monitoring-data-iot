import React from "react";
import { useList } from "react-firebase-hooks/database";
import { ref } from "firebase/database";
import { database } from "../firebaseConfig";
import './DataDisplay.css'; // Import the CSS file for styling
import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';

const DataDisplay = () => {
  const dbRef = ref(database, "DataNajib");
  const [snapshots, loading, error] = useList(dbRef);

  if (loading) return <div className="loading">Loading...</div>;
  if (error) return <div className="error">Error: {error.message}</div>;

  // Get the most recent snapshot (last item in the array)
  const latestSnapshot = snapshots.length > 0 ? snapshots[snapshots.length - 1] : null;
  const data = latestSnapshot ? latestSnapshot.val() : {};

  return (
    <div className="data-display">
      {latestSnapshot ? (
        <Container>
          <Row className="g-3"> {/* g-3 for spacing between columns */}
            <Col md={4}>
              <div className="data-card">
                <div className="data-header">
                  <h2>Soil Moisture</h2>
                </div>
                <div className="data-content">
                  <p>{data.soilMoisture}</p>
                </div>
              </div>
            </Col>
            <Col md={4}>
              <div className="data-card">
                <div className="data-header">
                  <h2>Temperature</h2>
                </div>
                <div className="data-content">
                  <p>{data.temperature} °C</p>
                </div>
              </div>
            </Col>
            <Col md={4}>
              <div className="data-card">
                <div className="data-header">
                  <h2>Humidity</h2>
                </div>
                <div className="data-content">
                  <p>{data.humidity} %</p>
                </div>
              </div>
            </Col>
          </Row>
        </Container>
      ) : (
        <div className="no-data">No data available</div>
      )}
    </div>
  );
};

export default DataDisplay;
