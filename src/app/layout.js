// src/app/layout.js
"use client"; // Necessary to indicate this is a client component

import { Inter } from "next/font/google";
import "./globals.css";
import { AuthProvider, useAuth } from "../context/AuthContext"; // Correct import path for AuthProvider
import Head from "next/head";
import LanidingPage from "@/components/landingpage";
const inter = Inter({ subsets: ["latin"] });

function AuthLayout({ children }) {
  const { user, loading } = useAuth();

  if (loading) {
    return <p>Loading...</p>; // Optional: Replace with a spinner or loading component
  }

  if (!user) {
    return (
      <div>
        <LanidingPage />
      </div>
    );
  }

  return <>{children}</>;
}

export default function RootLayout({ children }) {
  return (
    <AuthProvider>
      <html lang="en">
        <body className={inter.className}>
          <AuthLayout>{children}</AuthLayout>
        </body>
      </html>
    </AuthProvider>
  );
}
