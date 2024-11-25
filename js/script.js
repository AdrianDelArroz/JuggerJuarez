'use strict'

import { initializeApp } from "https://www.gstatic.com/firebasejs/11.0.1/firebase-app.js";
import { getAuth, onAuthStateChanged, signInWithEmailAndPassword, createUserWithEmailAndPassword } from "https://www.gstatic.com/firebasejs/11.0.1/firebase-auth.js";
import { getFirestore, collection, addDoc, getDocs } from "https://www.gstatic.com/firebasejs/11.0.1/firebase-firestore.js";

// Tu configuración de Firebase
const firebaseConfig = {
    apiKey: "AIzaSyAx0R2Usa56ZAXupMXvch3CVqt4FUl6udQ",
    authDomain: "juggerjuarez-ac30c.firebaseapp.com",
    projectId: "juggerjuarez-ac30c",
    storageBucket: "juggerjuarez-ac30c.appspot.com",
    messagingSenderId: "674759342914",
    appId: "1:674759342914:web:3af3648c69b3eb849e66db"
};

// Inicializar Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);

// Verificar el estado de autenticación del usuario
document.addEventListener("DOMContentLoaded", function () {
    const btnAgregarEquipo = document.getElementById('btnAgregarEquipo');
    const btnEditarEquipo = document.getElementById('btnEditarEquipo');

    onAuthStateChanged(auth, (user) => {
        if (user) {
            // Usuario autenticado: Mostrar los botones y redirigir a la página de agregar equipo
            btnAgregarEquipo.style.display = 'block';
            btnEditarEquipo.style.display = 'block';
            window.location.href = 'AgregarEquipo.html'; // Redirigir a la página de agregar equipo
        } else {
            // Usuario no autenticado: Ocultar los botones
            btnAgregarEquipo.style.display = 'none';
            btnEditarEquipo.style.display = 'none';
        }
    });

    // Agregar el equipo cuando el formulario sea enviado
    const form = document.querySelector('form');
    form.addEventListener('submit', async (e) => {
        e.preventDefault(); // Prevenir el envío del formulario por defecto

        // Obtener los valores del formulario
        const nombreEquipo = document.getElementById('nombre-equipo').value;
        const logoEquipo = document.getElementById('logo-equipo').files[0]; // Se puede ajustar para subir a Firebase Storage si es necesario
        const partidosTotales = document.getElementById('partidos-totales').value;
        const victoriasTotales = document.getElementById('victorias-totales').value;
        const derrotasTotales = document.getElementById('derrotas-totales').value;
        const capitanEquipo = document.getElementById('capitan-equipo').value;
        const numeroCapitan = document.getElementById('numero-capitan').value;

        // Obtener miembros del equipo
        const miembrosEquipo = [];
        const miembros = document.querySelectorAll('.miembro');
        miembros.forEach((miembro) => {
            const nombreMiembro = miembro.querySelector('input[name="nombre-miembro[]"]').value;
            const numeroMiembro = miembro.querySelector('input[name="numero-miembro[]"]').value;
            if (nombreMiembro && numeroMiembro) {
                miembrosEquipo.push({ nombre: nombreMiembro, numero: numeroMiembro });
            }
        });

        // Validar que el formulario tenga los datos necesarios
        if (!nombreEquipo || !capitanEquipo || !numeroCapitan) {
            alert('Por favor, completa todos los campos obligatorios.');
            return;
        }

        // Datos del equipo para Firestore
        const equipoData = {
            nombre: nombreEquipo,
            logo: logoEquipo ? logoEquipo.name : null, // Si se maneja con Firebase Storage se cambiaría a URL
            partidosTotales: partidosTotales,
            victoriasTotales: victoriasTotales,
            derrotasTotales: derrotasTotales,
            capitan: {
                nombre: capitanEquipo,
                numero: numeroCapitan
            },
            miembros: miembrosEquipo
        };

        // Agregar el equipo a Firestore
        try {
            await addData('equipos', equipoData); // Asumiendo que la colección es 'equipos'
            alert('¡Equipo registrado correctamente!');
            form.reset(); // Limpiar el formulario
        } catch (error) {
            console.error('Error al registrar el equipo:', error.message);
            alert('Hubo un problema al registrar el equipo.');
        }
    });
});

// Función de inicio de sesión
export async function login(email, password) {
    try {
        await signInWithEmailAndPassword(auth, email, password);
        alert("¡Inicio de sesión exitoso!");

        // Redirección después de inicio de sesión exitoso
        setTimeout(() => {
            window.location.href = 'AgregarEquipo.html'; // Redirige a la página principal o la página correcta
        }, 1000);

        return true;
    } catch (error) {
        if (error.code === 'auth/wrong-password' || error.code === 'auth/user-not-found') {
            throw new Error('El correo electrónico y/o la contraseña son incorrectos. Por favor, intenta de nuevo.');
        }
        throw new Error('Error: ' + error.message);
    }
}

// Función de registro
export async function signup(email, password) {
    if (password.length < 6) {
        throw new Error('La contraseña debe tener al menos 6 caracteres.');
    }
    try {
        await createUserWithEmailAndPassword(auth, email, password);
        alert("¡Registro exitoso!");

        // Redirección después del registro exitoso
        setTimeout(() => {
            window.location.href = 'index.html'; // Redirige a la página principal o la página correcta
        }, 1000);
    } catch (error) {
        if (error.code === 'auth/email-already-in-use') {
            throw new Error('El correo electrónico ya ha sido utilizado.');
        }
        throw new Error('Error: ' + error.message);
    }
}

// Función para agregar datos a Firestore
export async function addData(collectionName, data) {
    try {
        await addDoc(collection(db, collectionName), data);
        alert("Datos guardados correctamente.");
    } catch (error) {
        console.error('Error al guardar datos: ' + error.message);
    }
}

async function obtenerEquipos() {
    try {
        // Acceder a la colección 'equipos'
        const equiposRef = collection(db, "equipos");
        const snapshot = await getDocs(equiposRef);

        // Acceder al tbody de la tabla en el HTML
        const tablaEquiposBody = document.getElementById('tabla-equipos-body');
        tablaEquiposBody.innerHTML = ''; // Limpiar cualquier contenido anterior

        snapshot.forEach(async (doc) => {
            const equipo = doc.data(); // Obtener los datos del equipo

            // Obtener la URL del logo del equipo si existe en Firebase Storage
            let logoUrl = 'img/default-logo.png';  // URL predeterminada si no hay logo
            if (equipo.logo) {
                const logoRef = ref(storage, `logos/${equipo.logo}`);
                try {
                    logoUrl = await getDownloadURL(logoRef);
                } catch (error) {
                    console.error('Error al obtener el logo:', error);
                }
            }

            // Crear una fila de la tabla para el equipo
            const fila = document.createElement('tr');
            fila.innerHTML = `
                <td><img src="${logoUrl}" alt="${equipo.nombre}" class="h-16"></td>
                <td>${equipo.nombre}</td>
                <td>${equipo.capitan.nombre}</td>
                <td>${equipo.partidosTotales}</td>
            `;

            // Añadir la fila al cuerpo de la tabla
            tablaEquiposBody.appendChild(fila);
        });
    } catch (error) {
        console.error('Error al obtener los equipos:', error.message);
    }
}
