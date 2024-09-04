import Image from "next/image";
import Link from "next/link";
import React from "react";
import { useAuth } from "@/context/AuthContext";
import { signOut } from "firebase/auth";
import { auth } from "@/lib/firebaseconfig";

function navbar() {
  const { loading, user } = useAuth();
  const signout = () => {
    signOut(auth);
    window.location.reload();
  };
  return (
    <nav className=" p-4 w-full">
      <Link href="/" className="flex items-center gap-2">
        <Image src="/image.png" alt="logo" width={100} height={50} />
        <div className="text-red-900 text-5xl font-extrabold ">RailMadad</div>
        <button className="border-2 w-20 h-16 border-white text-white bg-red-900 p-2 rounded-md animate-pulse">
          139
        </button>
        {user && (
          <div className="text-red-900 text-5xl font-extrabold ">
            <button onClick={() => signout()}>logout</button>
          </div>
        )}
        {!user && (
          <div className="">
            <Link href="/auth/login">
              <button className="border-2 w-20 border-white text-white bg-red-900 p-2 rounded-md">
                login
              </button>
            </Link>
            <Link href="/auth/signup">
              <button className="border-2 w-20 border-red-900 text-red-900 p-2 rounded-md">
                signup
              </button>
            </Link>
          </div>
        )}
        {/* {user.email} */}
      </Link>
    </nav>
  );
}

export default navbar;
