import React from "react";
import Link from "next/link";

function LandingPage() {
  return (
    <div className="adjust-content-center">
      <h1>Welcome to the App</h1>
      <Link href="/auth/signup">Sign Up</Link>
      <br />
      <Link href="/auth/login">Login</Link>
    </div>
  );
}

export default LandingPage;
