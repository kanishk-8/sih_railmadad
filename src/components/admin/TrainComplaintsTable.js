import React from 'react';

const TrainComplaintsTable = () => {
  // Placeholder data
  const complaints = [
    { id: 1, title: 'Late Arrival', trainNumber: '12345', details: 'Details about the complaint...' },
    { id: 2, title: 'Dirty Coaches', trainNumber: '54321', details: 'Details about the complaint...' },
    // Add more complaints as needed
  ];

  return (
    <div>
      <h2>Train Complaints</h2>
      <table className="min-w-full border-collapse">
        <thead>
          <tr>
            <th className="border-b py-2">Complaint Number</th>
            <th className="border-b py-2">Title</th>
            <th className="border-b py-2">Train Number</th>
            <th className="border-b py-2">Actions</th>
          </tr>
        </thead>
        <tbody>
          {complaints.map((complaint) => (
            <tr key={complaint.id}>
              <td className="border-b py-2">{complaint.id}</td>
              <td className="border-b py-2">{complaint.title}</td>
              <td className="border-b py-2">{complaint.trainNumber}</td>
              <td className="border-b py-2">
                <button className="text-blue-500 hover:underline">View</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default TrainComplaintsTable;
