"use client";
import { useState } from "react";
import { auth } from "@/lib/firebaseconfig";
import {
  createUserWithEmailAndPassword,
  RecaptchaVerifier,
  signInWithPhoneNumber,
} from "firebase/auth";

const Signup = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [otp, setOtp] = useState("");
  const [isOtpSent, setIsOtpSent] = useState(false);
  const [verificationId, setVerificationId] = useState(null);

  const handleSignupWithEmail = async () => {
    try {
      await createUserWithEmailAndPassword(auth, email, password);
      alert("Signup successful!");
    } catch (error) {
      alert(error.message);
    }
  };

  const setupRecaptcha = () => {
    window.recaptchaVerifier = new RecaptchaVerifier(
      "recaptcha-container",
      {
        size: "invisible",
        callback: () => {
          // reCAPTCHA solved, allow signInWithPhoneNumber.
          handleSignupWithPhoneNumber();
        },
      },
      auth
    );
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
    const credential = firebase.auth.PhoneAuthProvider.credential(
      verificationId,
      otp
    );
    try {
      await auth.signInWithCredential(credential);
      alert("Phone authentication successful!");
    } catch (error) {
      alert(error.message);
    }
  };

  return (
    <div>
      <h1>Sign Up</h1>
      <div>
        <h2>Sign Up with Email</h2>
        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
        <button onClick={handleSignupWithEmail}>Sign Up with Email</button>
      </div>
      <div>
        <h2>Sign Up with Phone Number</h2>
        <input
          type="tel"
          placeholder="Phone Number"
          value={phoneNumber}
          onChange={(e) => setPhoneNumber(e.target.value)}
        />
        <div id="recaptcha-container"></div>
        {!isOtpSent ? (
          <button onClick={handleSignupWithPhoneNumber}>Send OTP</button>
        ) : (
          <div>
            <input
              type="text"
              placeholder="Enter OTP"
              value={otp}
              onChange={(e) => setOtp(e.target.value)}
            />
            <button onClick={handleVerifyOtp}>Verify OTP</button>
          </div>
        )}
      </div>
    </div>
  );
};

export default Signup;
