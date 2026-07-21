import { initializeApp } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-app.js";
import { getAuth, createUserWithEmailAndPassword } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-auth.js";

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

const registerForm = document.getElementById('register-form');
const messageEl = document.getElementById('message');

registerForm.addEventListener('submit', (e) => {
    e.preventDefault();
    
    const email = document.getElementById('email').value;
    const password = document.getElementById('password').value;
    
    createUserWithEmailAndPassword(auth, email, password)
        .then((userCredential) => {
            messageEl.style.color = "green";
            messageEl.textContent = "Usuario registrado con éxito.";
            registerForm.reset();
            setTimeout(() => {
                window.location.href = "index.html";
            }, 1500);
        })
        .catch((error) => {
            messageEl.style.color = "red";
            messageEl.textContent = "Error al registrar: " + error.message;
        });
});

