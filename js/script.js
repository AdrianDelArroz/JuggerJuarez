'use strict'

const grande    = document.querySelector('.grande')
const punto     = document.querySelectorAll('.punto')

// Recorrer TODOS los punto
punto.forEach( ( cadaPunto , i )=> {
    // Asignamos un CLICK a cadaPunto
    punto[i].addEventListener('click',()=>{

        // Guardar la posición de ese PUNTO
        let posicion  = i
        // Calculando el espacio que debe DESPLAZARSE el GRANDE
        let operacion = posicion * -50

        // MOVEMOS el grand
        grande.style.transform = `translateX(${ operacion }%)`

        // Recorremos TODOS los punto
        punto.forEach( ( cadaPunto , i )=>{
            // Quitamos la clase ACTIVO a TODOS los punto
            punto[i].classList.remove('activo')
        })
        // Añadir la clase activo en el punto que hemos hecho CLICK
        punto[i].classList.add('activo')

    })
})

/*--Funcion de agregar/eliminar miembros del formulario--*/
document.addEventListener("DOMContentLoaded", function() {
    const equipoContainer = document.getElementById('equipo'); // Contenedor principal
    const agregarMiembroBtn = document.getElementById('agregar-miembro'); // Botón agregar

    // Función para crear una nueva fila de miembro
    function crearFilaMiembro() {
        // Crear el contenedor de la fila
        const fila = document.createElement('div');
        fila.classList.add('miembro');

        // Campo para el nombre del miembro
        const inputNombre = document.createElement('input');
        inputNombre.setAttribute('type', 'text');
        inputNombre.setAttribute('name', 'nombre-miembro[]');
        inputNombre.setAttribute('placeholder', 'Nombre del miembro');
        
        // Campo para el número del miembro
        const inputNumero = document.createElement('input');
        inputNumero.setAttribute('type', 'number');
        inputNumero.setAttribute('name', 'numero-miembro[]');
        inputNumero.setAttribute('placeholder', 'Número del miembro');
        
        // Botón para eliminar la fila
        const botonEliminar = document.createElement('button');
        botonEliminar.setAttribute('type', 'button');
        botonEliminar.classList.add('eliminar-miembro');
        botonEliminar.textContent = 'X';

        // Agregar la funcionalidad al botón eliminar
        botonEliminar.addEventListener('click', function() {
            equipoContainer.removeChild(fila);
        });

        // Añadir los elementos a la fila
        fila.appendChild(inputNombre);
        fila.appendChild(inputNumero);
        fila.appendChild(botonEliminar);

        // Añadir la fila al contenedor de equipo, antes del botón agregar
        equipoContainer.insertBefore(fila, agregarMiembroBtn);
    }

    // Evento para agregar nueva fila de miembro
    agregarMiembroBtn.addEventListener('click', crearFilaMiembro);

    // Evento para eliminar una fila de miembro
    equipoContainer.addEventListener('click', function(event) {
        if (event.target && event.target.classList.contains('eliminar-miembro')) {
            const fila = event.target.parentElement;
            equipoContainer.removeChild(fila);
        }
    });
});
