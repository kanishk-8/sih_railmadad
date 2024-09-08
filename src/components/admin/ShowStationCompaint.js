import React, { useState, useEffect } from "react";
import StationComplaintDetails from "./StationComplaintDerail";

const StationComplaintList = () => {
  const [complaints, setComplaints] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchComplaints();
  }, []);

  const fetchComplaints = async () => {
    try {
      const response = await fetch(
        "http://localhost:5000/api/show-station-complaints"
      ); // API endpoint to fetch station complaints
      const data = await response.json();
      setComplaints(data.station_complaints || []); // Adjust according to API response
      setLoading(false);
    } catch (err) {
      setError("Error fetching complaints");
      setLoading(false);
    }
  };

  if (loading) {
    return <p>Loading complaints...</p>;
  }

  if (error) {
    return <p>{error}</p>;
  }

  return (
    <div
      style={{
        padding: "16px",
        overflowY: "auto", // Enable vertical scrolling
        height: "80vh", // Adjust height as needed
      }}
    >
      {complaints.map((complaint) => (
        <StationComplaintDetails
          key={complaint.complaint_number}
          complaint={complaint}
          fetchComplaints={fetchComplaints} // To refetch complaints after status update
        />
      ))}
    </div>
  );
};

export default StationComplaintList;
