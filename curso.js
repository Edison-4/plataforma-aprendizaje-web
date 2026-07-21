import { initializeApp } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-app.js";
import { getAuth, onAuthStateChanged } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-auth.js";
import { getFirestore, doc, getDoc, setDoc, arrayUnion, arrayRemove } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-firestore.js";

const firebaseConfig = {
  apiKey: "AIzaSyBnJXIUrwkx9s5FlYPJMREDyiBVS0VgMCg",
  authDomain: "plataforma-aprendizaje-web.firebaseapp.com",
  projectId: "plataforma-aprendizaje-web",
  storageBucket: "plataforma-aprendizaje-web.firebasestorage.app",
  messagingSenderId: "262588326355",
  appId: "1:262588326355:web:3e7704d9ce7464b3d8cf26",
  measurementId: "G-6293PR1DGL"
};

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);

const urlParams = new URLSearchParams(window.location.search);
const cursoId = urlParams.get('id');

const tituloEl = document.getElementById('curso-titulo');
const descripcionEl = document.getElementById('curso-descripcion');
const contenidoEl = document.getElementById('curso-contenido');
const btnCompletar = document.getElementById('btn-completar');

let usuarioActual = null;
let estaCompletado = false;

onAuthStateChanged(auth, (user) => {
    if (user) {
        usuarioActual = user;
        if (cursoId) {
            cargarDetalleCurso(cursoId);
            verificarProgreso(cursoId);
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

async function verificarProgreso(id) {
    try {
        const progresoRef = doc(db, "progreso", usuarioActual.uid);
        const progresoSnap = await getDoc(progresoRef);
        
        if (progresoSnap.exists()) {
            const data = progresoSnap.data();
            if (data.cursosCompletados && data.cursosCompletados.includes(id)) {
                estaCompletado = true;
            }
        }
        
        actualizarBoton();
        btnCompletar.style.display = "block";
    } catch (error) {
        console.error(error);
    }
}

function actualizarBoton() {
    if (estaCompletado) {
        btnCompletar.textContent = "Completado";
        btnCompletar.classList.add("completado");
    } else {
        btnCompletar.textContent = "Marcar como completado";
        btnCompletar.classList.remove("completado");
    }
}

btnCompletar.addEventListener('click', async () => {
    try {
        const progresoRef = doc(db, "progreso", usuarioActual.uid);
        
        if (estaCompletado) {
            await setDoc(progresoRef, {
                cursosCompletados: arrayRemove(cursoId)
            }, { merge: true });
            estaCompletado = false;
        } else {
            await setDoc(progresoRef, {
                cursosCompletados: arrayUnion(cursoId)
            }, { merge: true });
            estaCompletado = true;
        }
        
        actualizarBoton();
    } catch (error) {
        alert("Error al actualizar el progreso: " + error.message);
    }
});
