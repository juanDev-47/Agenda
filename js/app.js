const formularioContactos = document.querySelector('#contacto'),
          listadoContactos = document.querySelector('#listado-contactos tbody');

eventListeners();

function eventListeners() {
     // cuando el formulario de crear o editar se ejecuta
     formularioContactos.addEventListener('submit', leerFormulario);
}

function leerFormulario(e){
     e.preventDefault();

     const nombre = document.querySelector('#nombre').value,
          empresa = document.querySelector('#empresa').value,
          telefono = document.querySelector('#telefono').value,
          accion = document.querySelector('#accion').value;


     if(nombre === '' || empresa === '' || telefono === ''){
          // 2 parametros: texto y clase
          mostrarNotificacion('Todos los campos son obligatorios', 'error');

          
     }else{
          //pasa la validacion, crear llamado a Ajax
          const infoContacto = new FormData();
          infoContacto.append('nombre', nombre);
          infoContacto.append('empresa', empresa);
          infoContacto.append('telefono', telefono);
          infoContacto.append('accion', accion);

          // console.log(...infoContacto);

          if(accion === 'crear'){
               // crearemos un nuevo contacto
               insertarBD(infoContacto);

          } else {
               // editar el contacto
          }
     }
}

// Insertar en la BD via Ajax
function insertarBD(datos){
     // llamado a Ajax

     // crear el objeto
     const xhr = new XMLHttpRequest();

     // abrir la conexion
     xhr.open('POST', 'inc/modelos/modelo-contactos.php', true );

     // pasar los datos 
     xhr.onload = function() {
          if(this.status === 200){               
               console.log(JSON.parse(xhr.responseText));
               // leemos la respuesta de php
               const respuesta =  JSON.parse(xhr.responseText);

               // inserta un nuevo elemento a la tabla 
               const nuevoContacto = document.createElement('tr');

               nuevoContacto.innerHTML = `
                    <td>${respuesta.datos.nombre}</td>
                    <td>${respuesta.datos.empresa}</td>
                    <td>${respuesta.datos.telefono}</td>
               `;

               // crear conotenedor para los botones
               const contenedorAcciones = document.createElement('td');

               // crear el icono de editar
               const iconoEditar = document.createElement('i');
               iconoEditar.classList.add('fas','fa-pen-square');

               // crea e lenlace para editar
               const btnEditar = document.createElement('a');
               btnEditar.appendChild(iconoEditar);
               btnEditar.href = `edita.php?id=${respuesta.datos.id_insertado}`;
               btnEditar.classList.add('btn', 'btn-editar');

               //agregarlo al padre
               contenedorAcciones.appendChild(btnEditar);

               // crear el icono de eliminar
               const iconoEliminar = document.createElement('i');
               iconoEliminar.classList.add('fas','fa-trash-alt');

               // crear el boton de eliminar
               const btnEliminar = document.createElement('button');
               btnEliminar.appendChild(iconoEliminar);
               btnEliminar.setAttribute('data-id', respuesta.datos.id_insertado);
               btnEliminar.classList.add('btn','btn-borrar');

               // agregar al padre
               contenedorAcciones.appendChild(btnEliminar);

               // Agregarlo al tr
               nuevoContacto.appendChild(contenedorAcciones);

               // agregarlo con los contactos 
               listadoContactos.appendChild(nuevoContacto);

               // Resetear el formulario
               document.querySelector('form').reset();
               // Mostar la notificacion

               mostrarNotificacion('Contacto Creado correctamente', 'correcto');
          }
     }
     // enviar los datos 
     xhr.send(datos);
}

// Notificacion en pantalla 
function mostrarNotificacion(mensaje, clase) {
     const notificacion = document.createElement('div');
     notificacion.classList.add(clase,'notificacion', 'sombra');
     notificacion.textContent = mensaje;

     // forumulario
     formularioContactos.insertBefore(notificacion, document.querySelector('form legend'));

     // Ocultar y mostrar la notificacion
     setTimeout(() => {
          notificacion.classList.add('visible');

          setTimeout(() => {
               notificacion.classList.remove('visible');
               setTimeout(()=>{
                    notificacion.remove();
               }, 500)
          }, 3000);
     }, 100);
}