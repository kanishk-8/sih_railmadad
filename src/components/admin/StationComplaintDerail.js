import React, { useState } from "react";
import Image from "next/image";
import { FaSpinner } from "react-icons/fa"; // Import spinner for loading state

const StationComplaintDetails = ({ complaint, fetchComplaints }) => {
  const [status, setStatus] = useState(complaint.status);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const updateStatus = async (newStatus) => {
    setLoading(true);
    setError(null); // Reset error
    try {
      const response = await fetch(
        `http://localhost:5000/api/update-station-complaint/${complaint.complaint_number}`,
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
  const fileUrl = complaint.image_path;
  const isVideo = fileUrl?.endsWith(".mp4"); // Check if the file is a video

  return (
    <div className="p-6 border rounded-2xl shadow-lg bg-white m-4 max-w-10-lg flex flex-col md:flex-row">
      {/* Complaint details on the left */}
      <div className="flex-1">
        <h3 className="text-2xl font-bold text-gray-800 mb-4">Station Complaint Details</h3>
        <div className="space-y-2 text-gray-600">
          <p>
            <strong className="text-gray-700">Complaint Number:</strong> {complaint.complaint_number}
          </p>
          <p>
            <strong className="text-gray-700">Description:</strong> {complaint.description}
          </p>
          <p>
            <strong className="text-gray-700">Category:</strong> {complaint.category}
          </p>
          <p>
            <strong className="text-gray-700">Priority:</strong> {complaint.priority}
          </p>
          <p>
            <strong className="text-gray-700">Status:</strong>{" "}
            <span
              className={`inline-block px-2 py-1 rounded ${
                status === "Resolved"
                  ? "bg-green-100 text-green-700"
                  : "bg-yellow-100 text-yellow-700"
              }`}
            >
              {status}
            </span>
          </p>
          <p>
            <strong className="text-gray-700">Incident Location:</strong> {complaint.station_location}
          </p>
          <p>
            <strong className="text-gray-700">Incident Date:</strong> {complaint.incident_date}
          </p>
          <p>
            <strong className="text-gray-700">Complainant Email:</strong> {complaint.user_email}
          </p>
        </div>

        {loading && (
          <div className="flex items-center space-x-2 mt-4">
            <FaSpinner className="animate-spin text-green-500" />
            <p className="text-green-600">Updating status...</p>
          </div>
        )}
        {error && <p className="text-red-500 mt-4">{error}</p>}

        {/* Mark as Resolved Button */}
        <button
          className={`mt-6 w-full px-4 py-3 text-white font-semibold rounded-lg shadow-md transition-colors duration-300 ${
            loading || status === "Resolved"
              ? "bg-gray-400 cursor-not-allowed"
              : "bg-green-500 hover:bg-green-600"
          }`}
          onClick={() => updateStatus("Resolved")}
          disabled={loading || status === "Resolved"}
        >
          Mark as Resolved
        </button>

        {/* Mark as Under Review Button */}
        <button
          className={`mt-3 w-full px-4 py-3 text-white font-semibold rounded-lg shadow-md transition-colors duration-300 ${
            loading || status === "Under Review"
              ? "bg-gray-400 cursor-not-allowed"
              : "bg-yellow-500 hover:bg-yellow-600"
          }`}
          onClick={() => updateStatus("Under Review")}
          disabled={loading || status === "Under Review"}
        >
          Mark as Under Review
        </button>
      </div>

      {/* Image or video on the right */}
      {fileUrl && (
        <div className="flex-1 mt-6 md:mt-0 md:ml-6">
          <h4 className="font-semibold text-gray-800">Attached File:</h4>
          <div className="mt-2 rounded-lg overflow-hidden">
            {isVideo ? (
              <video
                controls
                className="rounded-lg shadow w-80 h-80 md:w-80 md:h-80"
                src={fileUrl}
              >
                Your browser does not support the video tag.
              </video>
            ) : (
              <Image
                src={fileUrl}
                width={500}
                height={500}
                alt="Complaint Image"
                className="rounded-lg shadow"
              />
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default StationComplaintDetails;

