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
        <div className="text-red-900 text-4xl font-bold p-8">Page</div>
      </div>
    </div>
  );
}

export default Page;
