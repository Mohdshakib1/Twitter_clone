// firebase.js
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore"; // 🔥 Import Firestore

const firebaseConfig = {
  apiKey: "AIzaSyD4EdKH8ZZx-hqQ61NsDqHGj4oA9ky6mEY",
  authDomain: "twitter-a1221.firebaseapp.com",
  projectId: "twitter-a1221",
  storageBucket: "twitter-a1221.appspot.com",
  messagingSenderId: "947321632259",
  appId: "1:947321632259:web:860b32921d041194794036",
  measurementId: "G-CHCM3YLYSJ"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Auth and Firestore exports
export const auth = getAuth(app);
export const db = getFirestore(app); // ✅ Export Firestore as `db`

export default app;
