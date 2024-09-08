import React, { useState, useEffect } from "react";
import ComplaintDetails from "./ComplaintDetails";

const ComplaintList = () => {
  const [complaints, setComplaints] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchComplaints();
  }, []);

  const fetchComplaints = async () => {
    try {
      const response = await fetch(
        "http://localhost:5000/api/show-train-complaints"
      );
      const data = await response.json();
      setComplaints(data.train_complaints || []);
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
        <ComplaintDetails
          key={complaint.complaint_number}
          complaint={complaint}
          fetchComplaints={fetchComplaints} // To refetch data after status update
        />
      ))}
    </div>
  );
};

export default ComplaintList;
