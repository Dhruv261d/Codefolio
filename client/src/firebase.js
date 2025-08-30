import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyAtoruRZWCbBmtdKL_zQ2KgBVa5kqIBlvI",
  authDomain: "codefolio-dc15e.firebaseapp.com",
  projectId: "codefolio-dc15e",
  storageBucket: "codefolio-dc15e.firebasestorage.app",
  messagingSenderId: "976455322727",
  appId: "1:976455322727:web:900bd38d98b19cfd5b18c2",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);