import Image from "next/image";
import Link from "next/link";
import React from "react";
import { useAuth } from "@/context/AuthContext";
import { signOut } from "firebase/auth";
import { auth } from "@/lib/firebaseconfig";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPhone } from "@fortawesome/free-solid-svg-icons";

function Navbar() {
  const { loading, user } = useAuth();
  const signout = () => {
    signOut(auth);
    window.location.reload();
  };

  return (
    <nav className=" w-full flex items-center ">
      <Link href="/" className="flex items-center justify-center mr-4">
        <Image src="/logo.png" alt="logo" width={200} height={50} />
        <div className="flex flex-col">
          <p className="text-red-900 text-5xl font-extrabold">RailMadad</p>
          <p>For Inquiry, Assistance & Grievance Redressal</p>
        </div>
      </Link>
      <div className="flex justify-center items-center mr-11">
        <button
          onClick={() => window.open("tel:139")}
          className="flex justify-center items-center gap-2 border-2 w-28 h-14 border-white text-white bg-red-900 p-2 rounded-md animate-pulse"
        >
          <FontAwesomeIcon icon={faPhone} />
          <p className="text-2xl font-bold">139</p>
        </button>
        <p className=" text-xl">for Security/Medical Assistance</p>
      </div>

      {user && (
        <div className="mr-4">
          <button
            onClick={signout}
            className="border-2 w-20 border-white text-white bg-red-900 p-2 rounded-md"
          >
            Logout
          </button>
        </div>
      )}
      {!user && (
        <div className="flex justify-between gap-2 mr-7">
          <Link replace href="/auth/login">
            <button className="border-2 w-20 border-white  bg-blue-200 hover:bg-red-900 hover:text-white p-2 rounded-md">
              Login
            </button>
          </Link>
          <Link replace href="/auth/signup">
            <button className="border-2 w-20 border-white  bg-red-50 hover:bg-red-900 hover:text-white p-2 rounded-md">
              Signup
            </button>
          </Link>
        </div>
      )}
      {/* {user.email} */}
    </nav>
  );
}

export default Navbar;
