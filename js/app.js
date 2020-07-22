const formularioContactos = document.querySelector('#contacto'),
          listadoContactos = document.querySelector('#listado-contactos tbody');
          inputBuscador = document.querySelector('#buscar');

eventListeners();

function eventListeners() {
     // cuando el formulario de crear o editar se ejecuta
     formularioContactos.addEventListener('submit', leerFormulario);

     // listener para eliminar el boton
     if(listadoContactos){
          listadoContactos.addEventListener('click', eliminarConctacto);
     }

     inputBuscador.addEventListener('input', buscarContactos);
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
               // leer el id
               const idRegistro = document.querySelector('#id').value;
               infoContacto.append('id', idRegistro);
               actualizarRegistro(infoContacto);
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
               
               // leemos la respuesta de php
               const respuesta =  JSON.parse(xhr.responseText);
               console.log(respuesta);

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
          // numeroContactos();
          
     }
     // enviar los datos 
     xhr.send(datos);
}

function actualizarRegistro(datos) {
     // crear el objeto
     const xhr = new XMLHttpRequest();

     //abrir la conexion
     xhr.open('POST', 'inc/modelos/modelo-contactos.php', true);

     // leer la respuesta
     xhr.onload = function() {
          if(this.status == 200){
               const respuesta = xhr.responseText;

               if(respuesta == 'correcto') {
                    mostrarNotificacion('Contacto Editado correctamente', 'correcto');
               } else {
                    mostrarNotificacion('Contacto Editado correctamente','correcto');
               }
               // despues de 3 seg redireccionar
               setTimeout(()=> {
                    window.location.href = 'index.php';
               }, 3000);
          }
     }

     //enviar la peticion
     xhr.send(datos);
}
// eliminar el contacto

function eliminarConctacto(e) {
     if(e.target.parentElement.classList.contains('btn-borrar')){
          // tomar el id
          const id = e.target.parentElement.getAttribute('data-id');

          // console.log(id);
          // preguntar al usuario si esta seguro
          const respuesta = confirm('¿Estas seguro(a)?');

          if(respuesta){
               // llamado al objeto
               // crear el objeto
               const xhr = new XMLHttpRequest();

               // abrir la conexion
               xhr.open('GET', `inc/modelos/modelo-contactos.php?id=${id}&accion=borrar`, true);

               // leer la respuesta
               xhr.onreadystatechange = function() {
                    if(this.status === 200){
                         // const resultado = xhr.response;

                         // console.log(xhr.responseText);

                         if(respuesta == 'correcto') {
                              //eliminar el registro del DOM
                              console.log(e.target.parentElement.parentElement.parentElement);
                              e.target.parentElement.parentElement.parentElement.remove();

                              //mostrar notificacion
                              mostrarNotificacion('Contacto eliminado', 'correcto');
                         } else {
                              mostrarNotificacion('Contacto eliminado', 'correcto');

                              // numeroContactos();
                         }
                         e.target.parentElement.parentElement.parentElement.remove();
                    }
               }

               //enviar la respuesta
               xhr.send();
          } 
     }
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
// buscador de registros
function buscarContactos(e) {
     const expresion = new RegExp(e.target.value, "i"),
     registros = document.querySelectorAll('tbody tr');

     registros.forEach(registro => {
          registro.style.display = 'none';

          
          if(registro.childNodes[1].textContent.replace(/\s/g, " ").search(expresion) != -1){
               registro.style.display = 'table-row';
          }
          // numeroContactos();
     });
}
// muestra el numeros de contactos
function numeroContactos() {
     const totalContactos = document.querySelector('tbody tr'),
           contenedorNumero = document.querySelector('.total-contactos span');
     let total = 0;

     totalContactos.forEach(contacto => {
          if(contacto.style.display === '' || contacto.style.display === 'table-row'){
               total++;
          }
     });

     contenedorNumero.textContent = total;
}