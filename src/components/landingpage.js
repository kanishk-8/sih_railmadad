"use client";
import React from "react";
import Footer from "./Footer";
import FeatureIcons from "./FeatureIcons";
import Banner from "./Banner";

const LandingPage = () => {
  const features = [
    {
      name: "Ticket Booking",
      icon: "ticket-booking-icon.jpg",
      link: "/https://www.irctc.co.in/nget/train-search",
    },
    {
      name: "Train Enquiry",
      icon: "train-enquiry-icon.png",
      link: "/https://enquiry.indianrail.gov.in/mntes/",
    },
    {
      name: "Reservation Enquiry",
      icon: "reservation-enquiry-icon.png",
      link: "https://www.indianrail.gov.in/",
    },
    {
      name: "Retiring Room Booking",
      icon: "retiring-room-booking-icon.jpg",
      link: "https://www.rr.irctc.co.in/",
    },
    {
      name: "Indian Railways",
      icon: "indian-railways-icon.png",
      link: "https://indianrailways.gov.in",
    },
    {
      name: "UTS Ticketing",
      icon: "uts-ticketing-icon.jpg",
      link: "https://www.utsonmobile.indianrail.gov.in/",
    },
    {
      name: "Freight Business",
      icon: "freight-business-icon.png",
      link: "https://www.fois.indianrail.gov.in/",
    },
    {
      name: "Railway Parcel Website",
      icon: "railway-parcel-icon.png",
      link: "https://parcel.indianrail.gov.in/",
    },
  ];

  return (
    <div className="flex flex-col overflow-hidden">
      {/* Banner */}
      <Banner />

      {/* Feature Icons */}
      <div className="relative z-10 flex flex-col lg:flex-row w-full max-w-7xl p-4 mx-auto pb-24 lg:pb-16">
        <div className="flex-1 lg:w-3/4">
          <FeatureIcons features={features} />
        </div>
      </div>
    </div>
  );
};

export default LandingPage;
