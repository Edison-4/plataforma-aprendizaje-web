import { initializeApp } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-app.js";
import { getAuth, onAuthStateChanged } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-auth.js";
import { getFirestore, collection, addDoc, getDocs, doc, updateDoc, deleteDoc } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-firestore.js";

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

// Referencias del DOM
const formCurso = document.getElementById('form-curso');
const mensajeEl = document.getElementById('mensaje-admin');
const listaCursosEl = document.getElementById('lista-cursos');
const formTitulo = document.getElementById('form-titulo');
const btnSubmit = document.getElementById('btn-submit');
const btnCancelar = document.getElementById('btn-cancelar');

let editandoId = null; // Variable para saber si estamos creando o editando
let cursosGuardados = []; // Array temporal para guardar la información

// Proteger la ruta del administrador
onAuthStateChanged(auth, (user) => {
    if (!user || user.email !== 'gregoryplaza4@gmail.com') {
        window.location.href = "dashboard.html";
    } else {
        cargarCursosAdmin(); // Cargamos la lista si es el superusuario
    }
});

// Función para obtener y mostrar los cursos en el panel
async function cargarCursosAdmin() {
    try {
        const snapshot = await getDocs(collection(db, "cursos"));
        cursosGuardados = [];
        let html = "";
        
        snapshot.forEach((documento) => {
            const curso = documento.data();
            curso.id = documento.id;
            cursosGuardados.push(curso);
            
            html += `
                <div class="curso-list-item">
                    <div class="curso-list-info">
                        <h4>${curso.titulo}</h4>
                        <p>${curso.descripcion}</p>
                    </div>
                    <div class="curso-actions">
                        <button class="btn-edit" data-id="${curso.id}">Editar</button>
                        <button class="btn-delete" data-id="${curso.id}">Eliminar</button>
                    </div>
                </div>
            `;
        });
        
        if (cursosGuardados.length === 0) {
            listaCursosEl.innerHTML = "<p>No hay cursos publicados aún.</p>";
        } else {
            listaCursosEl.innerHTML = html;
        }
    } catch (error) {
        listaCursosEl.innerHTML = `<p style="color: red;">Error al cargar: ${error.message}</p>`;
    }
}

// Escuchar clics en los botones de Editar y Eliminar
listaCursosEl.addEventListener('click', async (e) => {
    const id = e.target.getAttribute('data-id');
    
    if (e.target.classList.contains('btn-edit')) {
        // Encontrar el curso en nuestro array
        const curso = cursosGuardados.find(c => c.id === id);
        if (curso) {
            // Llenar el formulario con los datos
            document.getElementById('titulo').value = curso.titulo || "";
            document.getElementById('descripcion').value = curso.descripcion || "";
            document.getElementById('video').value = curso.video || "";
            document.getElementById('texto').value = curso.texto || "";
            document.getElementById('recursos').value = curso.recursos || "";
            document.getElementById('cuestionario').value = curso.cuestionario || "";
          
            // Cambiar el estado del formulario a Modo Edición
            editandoId = id;
            formTitulo.textContent = "Editando Curso";
            btnSubmit.textContent = "Actualizar Curso";
            btnCancelar.style.display = "block";
            
            // Subir la pantalla al inicio del formulario
            window.scrollTo({ top: 0, behavior: 'smooth' });
        }
    }
    
    if (e.target.classList.contains('btn-delete')) {
        const confirmacion = confirm("¿Estás seguro de que deseas eliminar este curso de forma permanente?");
        if (confirmacion) {
            try {
                await deleteDoc(doc(db, "cursos", id));
                alert("Curso eliminado");
                cargarCursosAdmin(); // Recargar la lista
            } catch (error) {
                alert("Error al eliminar: " + error.message);
            }
        }
    }
});

// Botón para cancelar la edición y limpiar el formulario
btnCancelar.addEventListener('click', () => {
    reiniciarFormulario();
});

function reiniciarFormulario() {
    formCurso.reset();
    editandoId = null;
    formTitulo.textContent = "Crear Nuevo Curso";
    btnSubmit.textContent = "Guardar y Publicar Curso";
    btnCancelar.style.display = "none";
}

// Guardar o Actualizar el curso
formCurso.addEventListener('submit', async (e) => {
    e.preventDefault();
    
    const titulo = document.getElementById('titulo').value;
    const descripcion = document.getElementById('descripcion').value;
    const video = document.getElementById('video').value;
    const texto = document.getElementById('texto').value;
    const recursos = document.getElementById('recursos').value;
    const cuestionario = document.getElementById('cuestionario').value;
  
    mensajeEl.style.color = "#0056b3";
    mensajeEl.textContent = "Procesando...";
    
    try {
        if (editandoId) {
            // Si hay un ID guardado, actualizamos el documento existente
            const cursoRef = doc(db, "cursos", editandoId);
            await updateDoc(cursoRef, {
                titulo: titulo,
                descripcion: descripcion,
                video: video,
                texto: texto,
                recursos: recursos,
                cuestionario: cuestionario
            });
            mensajeEl.textContent = "¡Curso actualizado con éxito!";
        } else {
            // Si no hay ID, creamos uno nuevo
            await addDoc(collection(db, "cursos"), {
                titulo: titulo,
                descripcion: descripcion,
                video: video,
                texto: texto,
                recursos: recursos,
                cuestionario: cuestionario
            });
            mensajeEl.textContent = "¡Curso publicado con éxito!";
        }
        
        mensajeEl.style.color = "green";
        reiniciarFormulario();
        cargarCursosAdmin(); // Actualizamos la lista de abajo
        
        setTimeout(() => {
            mensajeEl.textContent = "";
        }, 3000);
        
    } catch (error) {
        mensajeEl.style.color = "red";
        mensajeEl.textContent = "Error: " + error.message;
    }
});
