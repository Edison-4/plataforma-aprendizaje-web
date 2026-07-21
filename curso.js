import { initializeApp } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-app.js";
import { getAuth, onAuthStateChanged } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-auth.js";
import { getFirestore, doc, getDoc } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-firestore.js";

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
const db = getFirestore(app);

const urlParams = new URLSearchParams(window.location.search);
const cursoId = urlParams.get('id');

const tituloEl = document.getElementById('curso-titulo');
const descripcionEl = document.getElementById('curso-descripcion');
const contenidoEl = document.getElementById('curso-contenido');

onAuthStateChanged(auth, (user) => {
    if (user) {
        if (cursoId) {
            cargarDetalleCurso(cursoId);
        } else {
            window.location.href = "dashboard.html";
        }
    } else {
        window.location.href = "index.html";
    }
});

async function cargarDetalleCurso(id) {
    try {
        const docRef = doc(db, "cursos", id);
        const docSnap = await getDoc(docRef);

        if (docSnap.exists()) {
            const curso = docSnap.data();
            tituloEl.textContent = curso.titulo;
            descripcionEl.textContent = curso.descripcion;
            
            let htmlContenido = "";
            
            if (curso.video) {
                htmlContenido += `
                    <div class="video-container">
                        <iframe src="${curso.video}" frameborder="0" allowfullscreen></iframe>
                    </div>
                `;
            }
            
            if (curso.texto) {
                htmlContenido += `
                    <div class="texto-contenido">
                        ${curso.texto}
                    </div>
                `;
            }
            
            if (!curso.video && !curso.texto) {
                htmlContenido = "<p>El contenido de este curso estará disponible pronto.</p>";
            }
            
            contenidoEl.innerHTML = htmlContenido;
        } else {
            tituloEl.textContent = "Curso no encontrado";
            descripcionEl.textContent = "";
            contenidoEl.innerHTML = "<p>El curso que buscas no existe.</p>";
        }
    } catch (error) {
        contenidoEl.innerHTML = `<div class="error-message"><h3>Error</h3><p>${error.message}</p></div>`;
    }
}