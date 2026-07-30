import { initializeApp } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-app.js";
import { getAuth, onAuthStateChanged } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-auth.js";
import { getFirestore, collection, addDoc } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-firestore.js";

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
const db = getFirestore(app);

const formCurso = document.getElementById('form-curso');
const mensajeEl = document.getElementById('mensaje-admin');

// Proteger la ruta del administrador
onAuthStateChanged(auth, (user) => {
    if (!user || user.email !== 'gregoryplaza4@gmail.com') {
        // Si no está logueado o no es el superusuario, lo expulsamos
        window.location.href = "dashboard.html";
    }
});

formCurso.addEventListener('submit', async (e) => {
    e.preventDefault();
    
    const titulo = document.getElementById('titulo').value;
    const descripcion = document.getElementById('descripcion').value;
    const video = document.getElementById('video').value;
    const texto = document.getElementById('texto').value;
    
    mensajeEl.style.color = "#0056b3";
    mensajeEl.textContent = "Guardando curso...";
    
    try {
        await addDoc(collection(db, "cursos"), {
            titulo: titulo,
            descripcion: descripcion,
            video: video,
            texto: texto
        });
        
        mensajeEl.style.color = "green";
        mensajeEl.textContent = "¡Curso publicado con éxito!";
        formCurso.reset();
        
        setTimeout(() => {
            mensajeEl.textContent = "";
        }, 3000);
        
    } catch (error) {
        mensajeEl.style.color = "red";
        mensajeEl.textContent = "Error al guardar: " + error.message;
    }
});