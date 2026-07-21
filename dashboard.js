import { initializeApp } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-app.js";
import { getAuth, onAuthStateChanged, signOut } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-auth.js";
import { getFirestore, collection, getDocs } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-firestore.js";

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

const userInfoEl = document.getElementById('user-info');
const logoutBtn = document.getElementById('logout-btn');
const courseGrid = document.getElementById('course-grid');
const userPhotoEl = document.getElementById('user-photo');

onAuthStateChanged(auth, (user) => {
    if (user) {
        if (user.displayName) {
            userInfoEl.textContent = user.displayName;
        } else {
            userInfoEl.textContent = user.email;
        }
        
        if (user.photoURL) {
            userPhotoEl.src = user.photoURL;
            userPhotoEl.style.display = "block";
        }
        
        cargarCursos();
    } else {
        window.location.href = "index.html";
    }
});

logoutBtn.addEventListener('click', () => {
    signOut(auth).then(() => {
        window.location.href = "index.html";
    }).catch((error) => {
        alert(error.message);
    });
});

async function cargarCursos() {
    courseGrid.innerHTML = `
        <div class="loader-container">
            <div class="spinner"></div>
            <p>Cargando cursos...</p>
        </div>
    `;
    
    try {
        const querySnapshot = await getDocs(collection(db, "cursos"));
        let cursosHTML = "";
        
        querySnapshot.forEach((doc) => {
            const curso = doc.data();
            const cursoId = doc.id;
            
            cursosHTML += `
                <div class="course-card">
                    <h3>${curso.titulo}</h3>
                    <p>${curso.descripcion}</p>
                    <button class="btn-course" onclick="window.location.href='curso.html?id=${cursoId}'">Continuar</button>
                </div>
            `;
        });
        
        courseGrid.innerHTML = cursosHTML;
    } catch (error) {
        if (error.code === 'permission-denied') {
            courseGrid.innerHTML = `
                <div class="error-message">
                    <h3>Acceso Restringido</h3>
                    <p>No cuentas con los permisos necesarios para visualizar el contenido. Verifica que tu sesión esté activa.</p>
                </div>
            `;
        } else {
            courseGrid.innerHTML = `
                <div class="error-message">
                    <h3>Error de conexión</h3>
                    <p>No se pudo establecer conexión con la base de datos. Inténtalo más tarde.</p>
                </div>
            `;
        }
    }
}

