import { initializeApp } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-app.js";
import { getAuth, signInWithEmailAndPassword, GoogleAuthProvider, signInWithPopup } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-auth.js";

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
const provider = new GoogleAuthProvider();

const loginForm = document.getElementById('login-form');
const messageEl = document.getElementById('message');
const googleBtn = document.getElementById('google-btn');

loginForm.addEventListener('submit', (e) => {
    e.preventDefault();
    
    const email = document.getElementById('email').value;
    const password = document.getElementById('password').value;
    
    signInWithEmailAndPassword(auth, email, password)
        .then(() => {
            messageEl.style.color = "green";
            messageEl.textContent = "Inicio de sesión exitoso. Redirigiendo...";
            setTimeout(() => {
                window.location.href = "dashboard.html";
            }, 1500);
        })
        .catch((error) => {
            messageEl.style.color = "red";
            messageEl.textContent = "Error al iniciar sesión: " + error.message;
        });
});

googleBtn.addEventListener('click', () => {
    signInWithPopup(auth, provider)
        .then(() => {
            messageEl.style.color = "green";
            messageEl.textContent = "Inicio de sesión con Google exitoso. Redirigiendo...";
            setTimeout(() => {
                window.location.href = "dashboard.html";
            }, 1500);
        })
        .catch((error) => {
            messageEl.style.color = "red";
            messageEl.textContent = "Error de Google: " + error.message;
        });
});