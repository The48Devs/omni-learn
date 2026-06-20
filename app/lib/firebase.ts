import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getDatabase } from "firebase/database";

const firebaseConfig = {
  apiKey: "AIzaSyBYzVUNCT0-CjInNPusvfMQpOxviBeOtXA",
  authDomain: "omnilearn-a14b6.firebaseapp.com",
  databaseURL: "https://omnilearn-a14b6-default-rtdb.firebaseio.com",
  projectId: "omnilearn-a14b6",
  storageBucket: "omnilearn-a14b6.firebasestorage.app",
  messagingSenderId: "1046573865116",
  appId: "1:1046573865116:web:873fd035640e45896af559",
  measurementId: "G-JX1YD0S39P",
};

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getDatabase(app);
