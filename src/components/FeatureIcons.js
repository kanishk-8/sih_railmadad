"use client";
import React from "react";
import Link from "next/link";

const FeatureIcons = ({ features }) => {
  // Guard clause in case features is undefined or empty
  if (!features || features.length === 0) {
    return <div className="text-white text-center">No features available.</div>;
  }

  return (
    <div className="flex flex-col items-center justify-center min-h-[200px] py-8">
      {/* Grid container */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-6 justify-items-center items-center">
        {features.map((feature, index) => (
          feature.link.startsWith("http") ? (
            <a
              href={feature.link}
              key={index}
              target="_blank"
              rel="noopener noreferrer"
              className="block"
            >
              <div className="flex flex-col items-center hover:scale-105 transition-transform duration-300">
                {/* Icon */}
                <img
                  src={`/images/${feature.icon}`}
                  alt={feature.name}
                  className="h-12 w-12 sm:h-16 sm:w-16 object-contain hover:bg-gray-800 p-2 rounded-lg"
                />
                {/* Text */}
                <span className="text-center text-white mt-2 text-sm">
                  {feature.name}
                </span>
              </div>
            </a>
          ) : (
            <Link href={feature.link} key={index} passHref>
              <div className="flex flex-col items-center hover:scale-105 transition-transform duration-300">
                {/* Icon */}
                <img
                  src={`/images/${feature.icon}`}
                  alt={feature.name}
                  className="h-12 w-12 sm:h-16 sm:w-16 object-contain hover:bg-gray-800 p-2 rounded-lg"
                />
                {/* Text */}
                <span className="text-center text-white mt-2 text-sm">
                  {feature.name}
                </span>
              </div>
            </Link>
          )
        ))}
      </div>
    </div>
  );
};

export default FeatureIcons;






