"use client";
import React from "react";

const GrievanceForm = ({ onSubmit }) => {
  const [grievanceData, setGrievanceData] = React.useState({
    mobileNo: "",
    pnrNo: "",
    type: "",
    subType: "",
    incidentDate: "",
    journeyDetails: "",
    grievanceDescription: "",
    uploadedFile: null,
  });

  const handleChange = (event) => {
    const { name, value } = event.target;
    setGrievanceData({
      ...grievanceData,
      [name]: value,
    });
  };

  const handleFileChange = (event) => {
    setGrievanceData({
      ...grievanceData,
      uploadedFile: event.target.files[0],
    });
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    onSubmit(grievanceData);
  };

  return (
    <div className="bg-white p-8 rounded-lg shadow-2xl mx-auto max-w-4xl">
      <h2 className="text-3xl font-bold mb-6 text-gray-800 border-b pb-2 border-gray-300">Grievance Details</h2>
      <p className="font-semibold text-gray-600 mb-4">*Mandatory Fields</p>
      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Mobile Number */}
        <div className="flex flex-col gap-2">
          <label className="text-gray-700 font-semibold">Mobile No.*</label>
          <input
            type="text"
            className="border border-gray-300 rounded-lg p-4 focus:outline-none focus:ring-2 focus:ring-indigo-500"
            placeholder="Enter your mobile number"
            name="mobileNo"
            value={grievanceData.mobileNo}
            onChange={handleChange}
          />
        </div>
        <button
          type="button"
          className="text-blue-600 hover:underline text-sm mt-1"
        >
          Get OTP
        </button>

        {/* PNR Number */}
        <div className="flex flex-col gap-2">
          <label className="text-gray-700 font-semibold">PNR No.*</label>
          <input
            type="text"
            className="border border-gray-300 rounded-lg p-4 focus:outline-none focus:ring-2 focus:ring-indigo-500"
            placeholder="Enter your PNR number"
            name="pnrNo"
            value={grievanceData.pnrNo}
            onChange={handleChange}
          />
        </div>

        {/* Journey Details */}
        <div className="flex flex-col gap-2">
          <label className="text-gray-700 font-semibold">Journey Details*</label>
          <select
            className="border border-gray-300 rounded-lg p-4 focus:outline-none focus:ring-2 focus:ring-indigo-500"
            name="journeyDetails"
            value={grievanceData.journeyDetails}
            onChange={handleChange}
          >
            <option>--Select--</option>
            <option>PNR</option>
            <option>Train Number</option>
            <option>Booking ID</option>
          </select>
        </div>

        {/* Type and SubType */}
        <div className="flex flex-col gap-2">
          <label className="text-gray-700 font-semibold">Type*</label>
          <select
            className="border border-gray-300 rounded-lg p-4 focus:outline-none focus:ring-2 focus:ring-indigo-500"
            name="type"
            value={grievanceData.type}
            onChange={handleChange}
          >
            <option>--Select--</option>
            <option>Complaint</option>
            <option>Suggestion</option>
            <option>Enquiry</option>
          </select>
        </div>

        <div className="flex flex-col gap-2">
          <label className="text-gray-700 font-semibold">Sub Type*</label>
          <select
            className="border border-gray-300 rounded-lg p-4 focus:outline-none focus:ring-2 focus:ring-indigo-500"
            name="subType"
            value={grievanceData.subType}
            onChange={handleChange}
          >
            <option>--Select--</option>
            <option>General</option>
            <option>Booking</option>
            <option>Service</option>
          </select>
        </div>

        {/* Incident Date */}
        <div className="flex flex-col gap-2">
          <label className="text-gray-700 font-semibold">Incident Date*</label>
          <input
            type="datetime-local"
            className="border border-gray-300 rounded-lg p-4 focus:outline-none focus:ring-2 focus:ring-indigo-500"
            name="incidentDate"
            value={grievanceData.incidentDate}
            onChange={handleChange}
          />
        </div>

        {/* Upload File */}
        <div className="flex flex-col gap-2">
          <label className="text-gray-700 font-semibold">Upload File</label>
          <input
            type="file"
            className="border border-gray-300 rounded-lg p-4 text-gray-500"
            name="uploadedFile"
            onChange={handleFileChange}
          />
        </div>

        {/* Grievance Description */}
        <div className="flex flex-col gap-2">
          <label className="text-gray-700 font-semibold">Grievance Description*</label>
          <textarea
            className="border border-gray-300 rounded-lg p-4 focus:outline-none focus:ring-2 focus:ring-indigo-500"
            rows="6"
            placeholder="Describe your grievance"
            name="grievanceDescription"
            value={grievanceData.grievanceDescription}
            onChange={handleChange}
          ></textarea>
        </div>

        {/* Buttons */}
        <div className="flex justify-end space-x-4 mt-6">
          <button
            type="submit"
            className="bg-indigo-600 text-white px-6 py-3 rounded-lg shadow-md hover:bg-indigo-700 transition duration-300"
          >
            Submit
          </button>
          <button
            type="reset"
            className="bg-gray-200 text-gray-800 px-6 py-3 rounded-lg shadow-md hover:bg-gray-300 transition duration-300"
          >
            Reset
          </button>
        </div>
      </form>
    </div>
  );
};

export default GrievanceForm;
