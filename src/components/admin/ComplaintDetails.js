import React from 'react';

const ComplaintDetails = ({ complaint }) => {
  return (
    <div className="p-4 border rounded shadow">
      <h3 className="text-xl font-bold">Complaint Details</h3>
      <p><strong>PNR Number:</strong> {complaint.pnrNumber}</p>
      <p><strong>Train Number:</strong> {complaint.trainNumber}</p>
      <p><strong>Coach:</strong> {complaint.coach}</p>
      <p><strong>Start Location:</strong> {complaint.startLocation}</p>
      <p><strong>End Location:</strong> {complaint.endLocation}</p>
      <p><strong>Description:</strong> {complaint.description}</p>
      <p><strong>Category:</strong> {complaint.category}</p>
      <p><strong>Priority:</strong> {complaint.priority}</p>
      {/* Add more fields as needed */}
      <button className="mt-4 px-4 py-2 bg-green-500 text-white rounded">Mark as Resolved</button>
    </div>
  );
};

export default ComplaintDetails;
