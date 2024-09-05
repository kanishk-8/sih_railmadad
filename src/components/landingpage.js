"use client";
import React, { useState } from "react";
import GrievanceForm from "./GrievanceForm";
import Footer from "./Footer";
import FeatureIcons from "./FeatureIcons";
import Sidebar from "./Sidebar";

const LandingPage = () => {
  const [selectedOption, setSelectedOption] = useState(null);

  const features = [
    { name: "Ticket Booking", icon: "ticket-booking-icon.jpg", link: "/ticket-booking" },
    { name: "Train Enquiry", icon: "train-enquiry-icon.png", link: "/train-enquiry" },
    { name: "Reservation Enquiry", icon: "reservation-enquiry-icon.png", link: "/reservation-enquiry" },
    { name: "Retiring Room Booking", icon: "retiring-room-booking-icon.jpg", link: "/retiring-room-booking" },
    { name: "Indian Railways", icon: "indian-railways-icon.png", link: "https://indianrailways.gov.in" },
    { name: "UTS Ticketing", icon: "uts-ticketing-icon.jpg", link: "/uts-ticketing" },
    { name: "Freight Business", icon: "freight-business-icon.png", link: "/freight-business" },
    { name: "Railway Parcel Website", icon: "railway-parcel-icon.png", link: "/railway-parcel" },
  ];

  const sidebarOptions = [
    { name: "Train", icon: "train-icon.png" },
    { name: "Station", icon: "station-icon.jpg" },
    { name: "Appreciation/Rail Anubhav", icon: "appreciation-icon.png" },
    { name: "Enquiry", icon: "enquiry-icon.png" },
    { name: "Track Your Concern", icon: "track-concern-icon.png" },
    { name: "Suggestions", icon: "suggestions-icon.jpg" },
  ];

  const handleSubmit = (data) => {
    console.log("Grievance Data:", data);
  };

  return (
    <div className="flex flex-col min-h-screen bg-cover bg-center relative">
      {/* Background Image and Blur */}
      <div
        className="absolute inset-0 bg-cover bg-center filter blur-md"
        style={{ backgroundImage: "url('/images/background.jpg')" }}
      ></div>

      {/* Overlay for Darkening */}
      <div className="absolute inset-0 bg-black opacity-50"></div>

      {/* Content Container */}
      <div className="relative z-10 flex flex-col lg:flex-row w-full max-w-7xl p-4 mx-auto pb-24 lg:pb-16">
        {/* Left Side: Feature Icons & Sidebar */}
        <div className="flex flex-col lg:flex-row lg:w-full space-y-4 lg:space-y-0 lg:space-x-4">
          {/* Feature Icons */}
          <div className="flex-1 lg:w-3/4">
            <FeatureIcons features={features} />
          </div>

          {/* Sidebar */}
          <div className="w-full lg:w-1/4 lg:pl-4">
            <Sidebar
              options={sidebarOptions}
              selectedOption={selectedOption}
              setSelectedOption={setSelectedOption}
            />
          </div>
        </div>

        {/* Right Side: Grievance Form */}
        <div className="w-full lg:w-2/5 lg:pl-4 mt-8 lg:mt-0">
          <GrievanceForm onSubmit={handleSubmit} />
        </div>
      </div>

      {/* Footer */}
      <Footer />
    </div>
  );
};

export default LandingPage;
