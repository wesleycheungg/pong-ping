import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyCO1oaMgKUMsFU1aPdkKwGyIlOqK0JiyYM",
  authDomain: "pong-ping-f33d7.firebaseapp.com",
  projectId: "pong-ping-f33d7",
  storageBucket: "pong-ping-f33d7.firebasestorage.app",
  messagingSenderId: "750825307178",
  appId: "1:750825307178:web:f7a629c8315cbe54f95753",
  measurementId: "G-RMMS3K262Z",
};

const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);