// Import the functions you need from the SDKs you need

import "firebase/firestore";
import { initializeApp } from "firebase/app";
import { getFirestore, collection, addDoc, onSnapshot } from "firebase/firestore";
import { getStorage } from "firebase/storage";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyCsTyQ4pDo8YdamQSV4gbgAsrLcJwpMkG4",
  authDomain: "observe-pwa.firebaseapp.com",
  projectId: "observe-pwa",
  storageBucket: "observe-pwa.appspot.com",
  messagingSenderId: "739038573394",
  appId: "1:739038573394:web:bf037fa7f31efdf2a3c08b",
  measurementId: "G-SSC04E6R17",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);
export const storage = getStorage(app);
