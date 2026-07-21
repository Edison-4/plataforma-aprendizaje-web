import { initializeApp } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-app.js";
import { getAuth, signInWithEmailAndPassword, GoogleAuthProvider, signInWithPopup } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-auth.js";

const firebaseConfig = {
  apiKey: "AIzaSyBnJXIUrwkx9s5FlYPJMREDyiBVS0VgMCg",
  authDomain: "plataforma-aprendizaje-web.firebaseapp.com",
  projectId: "plataforma-aprendizaje-web",
  storageBucket: "plataforma-aprendizaje-web.firebasestorage.app",
  messagingSenderId: "262588326355",
  appId: "1:262588326355:web:dba205b5b146b57ad8cf26",
  measurementId: "G-VGZ3XHWN5S"
};

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const provider = new GoogleAuthProvider();

const loginForm = document.getElementById('login-form');
const messageEl = document.getElementById('message');
const googleBtn = document.getElementById('google-btn');
const togglePassword = document.getElementById('toggle-password');
const passwordInput = document.getElementById('password');

togglePassword.addEventListener('click', () => {
    const type = passwordInput.getAttribute('type') === 'password' ? 'text' : 'password';
    passwordInput.setAttribute('type', type);
    togglePassword.textContent = type === 'password' ? 'Ver' : 'Ocultar';
});

loginForm.addEventListener('submit', (e) => {
    e.preventDefault();
    
    const email = document.getElementById('email').value;
    const password = passwordInput.value;
    
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
