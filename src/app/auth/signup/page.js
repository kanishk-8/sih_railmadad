"use client";
import { useState } from "react";
import { auth } from "@/lib/firebaseconfig";
import {
  createUserWithEmailAndPassword,
  RecaptchaVerifier,
  signInWithPhoneNumber,
  PhoneAuthProvider,
  signInWithCredential,
} from "firebase/auth";
import { useRouter } from "next/navigation";

const Signup = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [otp, setOtp] = useState("");
  const [isOtpSent, setIsOtpSent] = useState(false);
  const [verificationId, setVerificationId] = useState(null);
  const router = useRouter();

  const handleSignupWithEmail = async () => {
    try {
      await createUserWithEmailAndPassword(auth, email, password);
      alert("Signup successful!");
      Router.replace("/home");
    } catch (error) {
      alert(error.message);
    }
  };

  const setupRecaptcha = () => {
    if (!window.recaptchaVerifier) {
      window.recaptchaVerifier = new RecaptchaVerifier(
        "recaptcha-container",
        {
          size: "invisible",
          callback: () => {
            handleSignupWithPhoneNumber();
          },
        },
        auth
      );
    }
  };

  const handleSignupWithPhoneNumber = async () => {
    setupRecaptcha();
    const appVerifier = window.recaptchaVerifier;
    try {
      const confirmationResult = await signInWithPhoneNumber(
        auth,
        phoneNumber,
        appVerifier
      );
      setVerificationId(confirmationResult.verificationId);
      setIsOtpSent(true);
    } catch (error) {
      alert(error.message);
    }
  };

  const handleVerifyOtp = async () => {
    const credential = PhoneAuthProvider.credential(verificationId, otp);
    try {
      await signInWithCredential(auth, credential);
      alert("Phone authentication successful!");
    } catch (error) {
      alert(error.message);
    }
  };

  return (
    <div className="bg-white mt-4 rounded-xl p-10 container mx-auto max-w-md ">
      <h1 className="text-2xl font-bold text-center mb-6">Sign Up</h1>
      <div className="mb-6">
        <h2 className="text-xl mb-2">Sign Up with Email</h2>
        <input
          type="email"
          className="w-full p-2 mb-2 border border-gray-300 rounded"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
        <input
          type="password"
          className="w-full p-2 mb-4 border border-gray-300 rounded"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
        <button
          onClick={handleSignupWithEmail}
          className="w-full p-2 bg-red-900 text-white rounded hover:bg-orange-600"
        >
          Sign Up with Email
        </button>
      </div>
      <div>
        <h2 className="text-xl mb-2">Sign Up with Phone Number</h2>
        <input
          type="tel"
          className="w-full p-2 mb-2 border border-gray-300 rounded"
          placeholder="Phone Number"
          value={phoneNumber}
          onChange={(e) => setPhoneNumber(e.target.value)}
        />
        <div id="recaptcha-container"></div>
        {!isOtpSent ? (
          <button
            onClick={handleSignupWithPhoneNumber}
            className="w-full p-2 bg-red-900 text-white rounded hover:bg-orange-600"
          >
            Send OTP
          </button>
        ) : (
          <div>
            <input
              type="text"
              className="w-full p-2 mb-2 border border-gray-300 rounded"
              placeholder="Enter OTP"
              value={otp}
              onChange={(e) => setOtp(e.target.value)}
            />
            <button
              onClick={handleVerifyOtp}
              className="w-full p-2 bg-green-500 text-white rounded hover:bg-green-600"
            >
              Verify OTP
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default Signup;
