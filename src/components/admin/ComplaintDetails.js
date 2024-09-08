import React, { useState } from "react";

const ComplaintDetails = ({ complaint, fetchComplaints }) => {
  const [status, setStatus] = useState(complaint.status);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const updateStatus = async (newStatus) => {
    setLoading(true);
    try {
      const response = await fetch(
        `http://localhost:5000/api/update-train-complaint/${complaint.complaint_number}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ status: newStatus }),
        }
      );

      if (!response.ok) {
        throw new Error("Error updating complaint status");
      }

      // Update the local status and refetch complaints
      setStatus(newStatus);
      fetchComplaints();
      setLoading(false);
    } catch (err) {
      setError("Error updating complaint status");
      setLoading(false);
    }
  };
  // Build the image URL based on the path stored in the DB
  // Ensure you're only appending the filename, not multiple /uploads/ directories
  console.log(complaint.image_path);
  const imageUrl = complaint.image_path;

  return (
    <div className="p-4 border rounded shadow bg-white">
      <h3 className="text-xl font-bold">Complaint Details</h3>
      <p>
        <strong>PNR Number:</strong> {complaint.pnr_number}
      </p>
      <p>
        <strong>Description:</strong> {complaint.description}
      </p>
      <p>
        <strong>Category:</strong> {complaint.category}
      </p>
      <p>
        <strong>Priority:</strong> {complaint.priority}
      </p>
      <p>
        <strong>Status:</strong> {status}
      </p>
      {/* Conditionally render the image */}
      {imageUrl && (
        <div className="mt-4">
          <h4 className="font-semibold">Attached Image:</h4>
          <img
            src={imageUrl}
            alt="Complaint Image"
            className="max-w-full h-auto border mt-2"
          />
        </div>
      )}

      {loading && <p>Updating status...</p>}
      {error && <p className="text-red-500">{error}</p>}

      <button
        className="mt-4 px-4 py-2 bg-green-500 text-white rounded"
        onClick={() => updateStatus("Resolved")}
        disabled={loading || status === "Resolved"}
      >
        Mark as Resolved
      </button>
    </div>
  );
};

export default ComplaintDetails;
