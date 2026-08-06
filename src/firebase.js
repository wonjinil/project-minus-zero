import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getAuth } from "firebase/auth";

const firebaseConfig = {
  apiKey: "AIzaSyANEcpgWCKyj8xuSqFl0LDr2enffVCYc28",
  authDomain: "project-minus-zero-74a6b.firebaseapp.com",
  projectId: "project-minus-zero-74a6b",
  storageBucket: "project-minus-zero-74a6b.firebasestorage.app",
  messagingSenderId: "878685982910",
  appId: "1:878685982910:web:edd49b5a6265e2c9050eef",
};

const app = initializeApp(firebaseConfig);

export const db = getFirestore(app);
export const auth = getAuth(app);