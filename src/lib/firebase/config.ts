// Import the functions you need from the SDKs you need
import { initializeApp, getApp, getApps } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getAnalytics, isSupported } from "firebase/analytics";

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyA-Bp7lMBIG4PhqxIy-qf9TWHZv3imOrBE",
  authDomain: "prueba-fb-22d2a.firebaseapp.com",
  projectId: "prueba-fb-22d2a",
  storageBucket: "prueba-fb-22d2a.appspot.com",
  messagingSenderId: "313592397016",
  appId: "1:313592397016:web:78410d7530c2f7a3aaabad",
  measurementId: "G-5C741M9BMG"
};

// Initialize Firebase
const app = !getApps().length ? initializeApp(firebaseConfig) : getApp();
const db = getFirestore(app);

let analytics;
if (typeof window !== 'undefined') {
  isSupported().then(supported => {
    if (supported) {
      analytics = getAnalytics(app);
    }
  });
}


export { app, db, analytics };
