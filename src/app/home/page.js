"use client";
import ChatBot from "@/components/chatbot";
import Footer from "@/components/Footer";
import Link from "next/link";
import React from "react";

function Page() {
  return (
    <div
      className="relative h-screen bg-cover bg-center"
      style={{ backgroundImage: "url('/image.png')" }}
    >
      {/* Acrylic Effect */}
      <div className="absolute inset-0 bg-white/30 backdrop-blur-sm">
        {/* Your content */}
        <ChatBot />
      </div>
      <Footer />
    </div>
  );
}

export default Page;
