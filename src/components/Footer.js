"use client";
import React from "react";

const Footer = () => {
  return (
    <footer className="bg-red-900 text-white py-2 text-center fixed bottom-0 left-0 w-full">
      <div className="container mx-auto flex justify-between px-4">
        <p>&copy; 2024 Railmadad. All rights reserved.</p>
        <div className="flex space-x-4">
          <a href="/" className="hover:underline">
            Home
          </a>
          <a href="/faqs" className="hover:underline">
            FAQs
          </a>
          <a href="/admin-login" className="hover:underline">
            Railway Admin Login
          </a>
          <a href="/contact-us" className="hover:underline">
            Contact Us
          </a>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
