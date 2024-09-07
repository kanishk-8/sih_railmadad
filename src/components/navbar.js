import React from "react";
import Image from "next/image";
import Link from "next/link";
import { useAuth } from "@/context/AuthContext";
import { signOut } from "firebase/auth";
import { auth } from "@/lib/firebaseconfig";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPhone } from "@fortawesome/free-solid-svg-icons";
import { useTranslation } from "react-i18next";

function Navbar() {
  const { loading, user } = useAuth();
  const { t, i18n } = useTranslation();

  const signout = () => {
    signOut(auth);
    window.location.reload();
  };

  const handleLanguageChange = (lang) => {
    i18n.changeLanguage(lang);
  };

  const handleTextToSpeech = (text) => {
    if ("speechSynthesis" in window) {
      const speech = new SpeechSynthesisUtterance(text);
      window.speechSynthesis.speak(speech);
    } else {
      alert("Sorry, your browser does not support text-to-speech.");
    }
  };

  const handleMicrophoneClick = () => {
    navigator.mediaDevices
      .getUserMedia({ audio: true })
      .then(() => {
        handleTextToSpeech(t("text_to_speak"));
      })
      .catch((error) => {
        console.error("Microphone permission denied:", error);
        alert("Microphone access denied. Please allow microphone access.");
      });
  };

  return (
    <nav className="w-full flex items-center bg-white">
      <Link href="/" className="flex items-center justify-center mr-4">
        <Image src="/logo.png" alt="logo" width={200} height={50} />
        <div className="flex flex-col">
          <p className="text-red-900 text-5xl font-extrabold">RailMadad</p>
          <p>{t("for_inquiry_assistance")}</p>
        </div>
      </Link>
      <div className="flex justify-center items-center mr-7 w-72">
        <button
          onClick={() => window.open("tel:139")}
          className="flex justify-center items-center gap-2 border-2 w-28 h-14 border-white text-white bg-red-900 p-2 rounded-md animate-pulse"
        >
          <FontAwesomeIcon icon={faPhone} />
          <p className="text-2xl font-bold">139</p>
        </button>
        <p className="text-xl">{t("for_security_medical")}</p>
      </div>

      {user && (
        <div className="mr-3">
          <button
            onClick={signout}
            className="border-2 w-20 border-white text-white bg-red-900 p-2 rounded-md"
          >
            {t("logout")}
          </button>
        </div>
      )}
      {!user && (
        <div className="flex justify-between gap-2 mr-3">
          <Link href="/admin">
            <button className="border-2 w-20 border-white bg-blue-200 hover:bg-red-900 hover:text-white p-2 rounded-md">
              Admin
            </button>
          </Link>
          <Link replace href="/auth/login">
            <button className="border-2 w-20 border-white bg-blue-200 hover:bg-red-900 hover:text-white p-2 rounded-md">
              {t("login")}
            </button>
          </Link>
          <Link replace href="/auth/signup">
            <button className="border-2 w-20 border-white bg-red-50 hover:bg-red-900 hover:text-white p-2 rounded-md">
              {t("signup")}
            </button>
          </Link>
        </div>
      )}

      {/* Language Switcher */}
      <div className="ml-auto flex justify-between mr-3">
        <button
          onClick={() => handleLanguageChange("en")}
          className="text-black border-2 border-black p-2 rounded-md"
        >
          EN
        </button>
        <button
          onClick={() => handleLanguageChange("hi")}
          className="text-black border-2 border-black p-2 rounded-md ml-2"
        >
          HI
        </button>

        {/* Google-like Microphone Icon */}
        <button
          onClick={handleMicrophoneClick}
          className="ml-2 text-black border-2 border-black p-2 rounded-md "
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 24 24"
            className="h-6 w-6"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
          >
            <g fill="#000000">
              <path
                d="M12 14a2 2 0 0 0 2-2V6a2 2 0 0 0-4 0v6a2 2 0 0 0 2 2z"
                fill="#4285F4"
              />
              <path
                d="M15 10v4a3 3 0 0 1-6 0v-4a3 3 0 0 1 6 0z"
                fill="#0F9D58"
              />
              <path d="M12 20a4 4 0 0 1-4-4h8a4 4 0 0 1-4 4z" fill="#F4B400" />
            </g>
          </svg>
        </button>
      </div>
    </nav>
  );
}

export default Navbar;
