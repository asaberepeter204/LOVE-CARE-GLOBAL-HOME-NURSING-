import { auth, googleProvider } from "./firebase.js";
import { signInWithEmailAndPassword, signInWithPopup } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-auth.js";

const emailInput = document.querySelector('input[type="email"]');
const passInput = document.querySelector('input[type="password"]');
const loginBtn = document.querySelector('button'); // your "Login to Dashboard"
const googleBtn = document.getElementById('google-login'); // add id to Google Login button

loginBtn.addEventListener('click', async (e) => {
  e.preventDefault();
  try {
    loginBtn.disabled = true;
    loginBtn.textContent = "Logging in...";
    const cred = await signInWithEmailAndPassword(auth, emailInput.value, passInput.value);
    window.location.href = "/dashboard.html";
  } catch (err) {
    alert(err.message);
    // Now you'll get real errors like auth/wrong-password instead of api-key-not-valid
  } finally {
    loginBtn.disabled = false;
    loginBtn.textContent = "🔐 Login to Dashboard";
  }
});

googleBtn?.addEventListener('click', async () => {
  try {
    const result = await signInWithPopup(auth, googleProvider);
    window.location.href = "/dashboard.html";
  } catch (err) {
    alert(err.message);
  }
});
