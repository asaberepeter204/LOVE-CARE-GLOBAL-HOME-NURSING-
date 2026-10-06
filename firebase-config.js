import { initializeApp } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-app.js";
import { getAuth, signInWithEmailAndPassword, GoogleAuthProvider, signInWithPopup, onAuthStateChanged } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-auth.js";
import { getDatabase } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-database.js";

// PASTE THE FRESH CONFIG FROM Firebase Console > Project Settings HERE
// Don't reuse the old exposed one
const firebaseConfig = {
  apiKey: "PASTE_NEW_KEY_HERE",
  authDomain: "web-care-618e8.firebaseapp.com",
  databaseURL: "https://web-care-618e8-default-rtdb.firebaseio.com",
  projectId: "web-care-618e8",
  storageBucket: "web-care-618e8.firebasestorage.app",
  messagingSenderId: "1062578660694",
  appId: "1:1062578660694:web:f94dfe12c929df05bce2f7"
};

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getDatabase(app);
export const googleProvider = new GoogleAuthProvider();

// Auto-check if key is valid
onAuthStateChanged(auth, () => {
  console.log("Firebase connected OK - API key is valid");
}, (error) => {
  console.error("Firebase auth failed:", error.code);
});
