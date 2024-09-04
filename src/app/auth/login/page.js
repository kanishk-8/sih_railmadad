"use client";
import { useState } from "react";
import { auth } from "@/lib/firebaseconfig";
import {
  signInWithEmailAndPassword,
  signInWithPhoneNumber,
  RecaptchaVerifier,
} from "firebase/auth";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [otp, setOtp] = useState("");
  const [isOtpSent, setIsOtpSent] = useState(false);
  const [verificationId, setVerificationId] = useState(null);

  const handleLoginWithEmail = async () => {
    try {
      await signInWithEmailAndPassword(auth, email, password);
      alert("Login successful!");
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
          handleLoginWithPhoneNumber();
        },
      },
      auth
    );
  };

  const handleLoginWithPhoneNumber = async () => {
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
      <h1>Login</h1>
      <div>
        <h2>Login with Email</h2>
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
        <button onClick={handleLoginWithEmail}>Login with Email</button>
      </div>
      <div>
        <h2>Login with Phone Number</h2>
        <input
          type="tel"
          placeholder="Phone Number"
          value={phoneNumber}
          onChange={(e) => setPhoneNumber(e.target.value)}
        />
        <div id="recaptcha-container"></div>
        {!isOtpSent ? (
          <button onClick={handleLoginWithPhoneNumber}>Send OTP</button>
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

export default Login;
