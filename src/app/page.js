"use client";
import React from "react";
import LandingPage from "@/components/landingpage";
import { useAuth } from "@/context/AuthContext";
import { useRouter } from "next/navigation";
function page() {
  const { loading, user } = useAuth();
  const Router = useRouter();
  if (user) {
    Router.replace("/home");
  }
  return <LandingPage />;
}

export default page;
