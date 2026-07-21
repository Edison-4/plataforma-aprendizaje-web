import { initializeApp } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-app.js";
import { getAuth, sendPasswordResetEmail } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-auth.js";

const firebaseConfig = {
    apiKey: "TU_API_KEY",
    authDomain: "TU_PROYECTO.firebaseapp.com",
    projectId: "TU_PROYECTO",
    storageBucket: "TU_PROYECTO.appspot.com",
    messagingSenderId: "TU_SENDER_ID",
    appId: "TU_APP_ID"
};

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);

const resetForm = document.getElementById('reset-form');
const messageEl = document.getElementById('message');

resetForm.addEventListener('submit', (e) => {
    e.preventDefault();
    
    const email = document.getElementById('email').value;
    
    sendPasswordResetEmail(auth, email)
        .then(() => {
            messageEl.style.color = "green";
            messageEl.textContent = "Correo de recuperación enviado. Revisa tu bandeja de entrada.";
            resetForm.reset();
        })
        .catch((error) => {
            messageEl.style.color = "red";
            messageEl.textContent = "Error: " + error.message;
        });
});