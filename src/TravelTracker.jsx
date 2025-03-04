import React, { useState } from "react";

function TravelTracker() {
  const [locations, setLocations] = useState([]);
  const [currentLocation, setCurrentLocation] = useState("");
  const [totalDistance, setTotalDistance] = useState(0);
  const [loading, setLoading] = useState(false);
  const API_KEY = "YOUR_GOOGLE_MAPS_API_KEY"; // Replace with your API key

  // Function to add a new location
  const handleAddLocation = () => {
    if (currentLocation.trim() !== "") {
      setLocations([...locations, currentLocation]);
      setCurrentLocation("");
    } else {
      alert("Please enter a valid location.");
    }
  };

  // Function to calculate total distance traveled
  const handleCalculateDistance = async () => {
    if (locations.length < 2) {
      alert("Please add at least two locations to calculate distance.");
      return;
    }

    setLoading(true);
    let distance = 0;

    // Google Maps Distance Matrix API URL
    const origin = locations[0];
    let waypoints = locations.slice(1).join("|");

    try {
      const response = await fetch(
        `https://maps.googleapis.com/maps/api/distancematrix/json?origins=${origin}&destinations=${waypoints}&key=${API_KEY}`
      );
      const data = await response.json();

      if (data.status === "OK") {
        data.rows[0].elements.forEach((element) => {
          if (element.status === "OK") {
            // Add each segment's distance
            distance += element.distance.value; // Distance in meters
          }
        });

        setTotalDistance((distance / 1000).toFixed(2)); // Convert to kilometers
      } else {
        alert("Error calculating distance: " + data.error_message);
      }
    } catch (error) {
      console.error("Error fetching distance data:", error);
      alert("Failed to fetch distance data.");
    }

    setLoading(false);
  };

  return (
    <div>
      <div style={{ marginBottom: "20px" }}>
        <input
          type="text"
          placeholder="Enter location"
          value={currentLocation}
          onChange={(e) => setCurrentLocation(e.target.value)}
          style={{
            padding: "10px",
            fontSize: "16px",
            width: "300px",
            borderRadius: "5px",
            border: "1px solid #ccc",
            marginRight: "10px"
          }}
        />
        <button
          onClick={handleAddLocation}
          style={{
            padding: "10px 20px",
            fontSize: "16px",
            backgroundColor: "#007bff",
            color: "white",
            border: "none",
            borderRadius: "5px",
            cursor: "pointer"
          }}
        >
          Add Location
        </button>
      </div>

      <h3>Journey Plan:</h3>
      <ol style={{ textAlign: "left", margin: "20px auto", maxWidth: "300px" }}>
        {locations.map((location, index) => (
          <li key={index}>{location}</li>
        ))}
      </ol>

      <button
        onClick={handleCalculateDistance}
        style={{
          padding: "10px 20px",
          fontSize: "16px",
          backgroundColor: "#28a745",
          color: "white",
          border: "none",
          borderRadius: "5px",
          cursor: "pointer",
          marginTop: "20px"
        }}
        disabled={loading}
      >
        {loading ? "Calculating..." : "Calculate Total Distance"}
      </button>

      <h2 style={{ marginTop: "20px" }}>
        Total Distance Traveled: {totalDistance} km
      </h2>
    </div>
  );
}

export default TravelTracker;
