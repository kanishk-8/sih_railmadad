"use client";
import React from "react";
import Link from "next/link";
import { useAuth } from "@/context/AuthContext";
import { useRouter } from "next/navigation";

function LandingPage() {
  const { loading, user } = useAuth();
  const Router = useRouter();
  if (!loading && user) {
    Router.replace("/home");
  }
  return (
    <div className="flex flex-col items-center justify-center">
      landing page
    </div>
  );
}

export default LandingPage;
