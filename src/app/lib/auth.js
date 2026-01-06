import { initializeApp } from "firebase/app";
// import { getAnalytics } from "firebase/analytics";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";


const firebaseConfig = {
  apiKey: "AIzaSyAQgD0AYe7Iy37dCk93C4FFdGO-NfBU92g",
  authDomain: "backend-blog-app-19ffd.firebaseapp.com",
  projectId: "backend-blog-app-19ffd",
  storageBucket: "backend-blog-app-19ffd.firebasestorage.app",
  messagingSenderId: "415982412514",
  appId: "1:415982412514:web:8c5ae03168f43b7eedb4bb",
  measurementId: "G-WM24PQ4FFV",
  databaseURL: "https://backend-blog-app-19ffd-default-rtdb.firebaseio.com/"
};

// Initialize Firebase
export const app = initializeApp(firebaseConfig);
// export const analytics = getAnalytics(app);
export const auth = getAuth(app);

// Firestore DB
export const db = getFirestore(app);