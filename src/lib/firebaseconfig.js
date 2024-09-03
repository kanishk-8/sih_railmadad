// lib/firebase.js

import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";

const firebaseConfig = {
  apiKey: "AIzaSyDr6EisXM4TYH0bXKrRlvkoU-_KKVZt6Og",
  authDomain: "rail-madad-8d91c.firebaseapp.com",
  projectId: "rail-madad-8d91c",
  storageBucket: "rail-madad-8d91c.appspot.com",
  messagingSenderId: "543131165261",
  appId: "1:543131165261:web:ae9ae748c8e8c311b87204",
};

const app = initializeApp(firebaseConfig);

const auth = getAuth(app);
const firestore = getFirestore(app);
const storage = getStorage(app);

export { auth, firestore, storage };
