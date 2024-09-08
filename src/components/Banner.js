"use client";
import React from "react";
import Link from "next/link";

const Banner = () => {
  return (
    <div className="bg-[#8b0038] text-white py-6 px-8 text-center shadow-lg">
      <p className="text-lg font-semibold">
        Login to Register Complaints Through Our Chatbot!{" "}
        <Link
          href="/auth/login"
          className="underline font-bold hover:text-yellow-300 transition-colors duration-300"
        >
          Login Here
        </Link>
      </p>
    </div>
  );
};

export default Banner;
