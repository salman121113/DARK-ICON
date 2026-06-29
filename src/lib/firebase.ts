import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  projectId: "nexorabd07",
  appId: "1:1020334077946:web:b15b03bb9b72cfeace1643",
  apiKey: "AIzaSyBPt26Mc6_bKHm-3o-_c-PpLkLeL0vsp4w",
  authDomain: "nexorabd07.firebaseapp.com",
  storageBucket: "nexorabd07.firebasestorage.app",
  messagingSenderId: "1020334077946",
};

const app = initializeApp(firebaseConfig);
export const db = getFirestore(app, "ai-studio-d4890b8d-04f3-4af0-9fdc-56cb5dab1dd9");
