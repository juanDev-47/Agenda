
eventListeners();

var listaProyectos = document.querySelector('ul#proyectos');

function eventListeners() {
     // document ready
     document.addEventListener('DOMContentLoaded', function(){
          actualizarProgreso();
     })


     document.querySelector('.crear-proyecto a').addEventListener('click', nuevoProyecto);

     
     // boton para una nueva tarea
     document.querySelector('.nueva-tarea').addEventListener('click', agregarTarea);

     // botones para las acciones de las tareas
     document.querySelector('.listado-pendientes').addEventListener('click', accionesTareas);
}

function nuevoProyecto(e) {
     e.preventDefault();


     //crea un input para el nombre del nuevo proyecto
     var nuevoProyecto = document.createElement('li');
     nuevoProyecto.innerHTML = '<input type="text" id="nuevo-proyecto">';
     listaProyectos.appendChild(nuevoProyecto);

     // seleccionar el id con el nuevo-proyecto
     var inputNuevoProyecto = document.querySelector('#nuevo-proyecto');

     // al presionar enter crear el proyecto

     inputNuevoProyecto.addEventListener('keypress', function(e) {
          var tecla = e.wich || e.keyCode;

          if(tecla === 13) {
               guardarProyectoDB(inputNuevoProyecto.value);
               listaProyectos.removeChild(nuevoProyecto);
          }
     });

}

function guardarProyectoDB(nombreProyecto) {
     // Crear el llamado ajax
     var xhr = new XMLHttpRequest();

     var datos = new FormData();
     datos.append('proyecto', nombreProyecto);
     datos.append('accion', 'crear');

     // abrir la conexion     
     xhr.open('POST', 'inc/modelos/modelo-proyecto.php', true);

     // en la carga
     xhr.onload = function() {
          //console.log('TEST', xhr.responseText)
          if(this.status == 200){
               // obtener datos de la respuesta
               var respuesta = JSON.parse(xhr.responseText);
               console.log(respuesta);

               var proyecto = respuesta.nombre_proyecto,
                    id_proyecto = respuesta.id_insertado,
                    tipo = respuesta.tipo,
                    resultado = respuesta.respuesta;

               // comprobar la insercion
               if(resultado === 'correcto') {
                    // fue exitoso
                    if(tipo === 'crear') {
                         // se creo un nuevo proyecto
                         // inyectar el HTML
                         var nuevoProyecto = document.createElement('li');
                         nuevoProyecto.innerHTML = `
                              <a href="index.php?id_proyecto=${id_proyecto}" id="proyecto:${id_proyecto}">
                                   ${nombreProyecto}
                              </a>
                         `;
                         listaProyectos.appendChild(nuevoProyecto);

                         swal({
                              title: 'Proyecto creado',
                              text: 'El proyecto: ' + nombreProyecto + ' Se creo correctamente',
                              type: 'success'
                         })                         
                         .then(resultado => {
                              // redireccionar a la nueva URL
                              if(resultado.value) {
                                   window.location.href = 'index.php?id_proyecto=' + id_proyecto;
                              }
                         })

                    } else {
                         // se actualizo o se elimino
                    }

               } else {
                    //hubo error
                    swal({
                         title: 'Error',
                         text: 'Hubo un Error!!',
                         type: 'error'
                    });
               } 

          }

     }

     // enviar el request
     xhr.send(datos);
}

// agregar una nueva tarea al proyecto actual

function agregarTarea(e) {
     e.preventDefault();
     
     var nombreTarea = document.querySelector('.nombre-tarea').value;     
     // validar que el campo tenga algo escrito

     if(nombreTarea === '') {
          swal({
               title: 'Error',
               text: 'Una tarea no puede ir vacia',
               type: 'error'
          })
     } else {
          // la tarea tiene alg, insertar en PHP
          
          // crear el llamado a ajax
          var xhr = new XMLHttpRequest();          

          //crear formdata
          var datos = new FormData();

          datos.append('tarea', nombreTarea);
          datos.append('accion', 'crear'); 
          datos.append('id_proyecto', document.querySelector('#id_proyecto').value ); 
          

          // abrir la conexion
          xhr.open('POST', 'inc/modelos/modelo-tareas.php', true);

          // ejecutarlo y respuesta
          xhr.onload = function() {
               if(this.status === 200) {
                    //todo correcto   
                    
                    
                    var respuesta = JSON.parse(xhr.responseText);
                    console.log(respuesta);
                    // asignar valores
                    var resultado = respuesta.respuesta,
                         tarea = respuesta.tarea,
                         id_insertado = respuesta.id_insertado,
                         tipo = respuesta.tipo;

                    if(resultado === 'correcto') {
                         // se agrego correctamente
                         if(tipo === 'crear'){
                              swal({
                                   title: 'Tarea Creada',
                                   text: 'La tarea: '+ tarea + ' se creo correctamente',
                                   type: 'success'
                              });

                              // construir el template
                              var nuevaTarea = document.createElement('li');

                              //agregamos el id
                              nuevaTarea.id = 'tarea:'+id_insertado;

                              //agregar la clase tarea
                              nuevaTarea.classList.add('tarea');

                              // insertar en el html
                              nuevaTarea.innerHTML = `
                                   <p>${tarea}</p>
                                   <div class="acciones">
                                        <i class="far fa-check-circle"></i>
                                        <i class="fas fa-trash"></i>
                                   </div>
                              `;
                              
                              //agregarlo al html
                              var listado = document.querySelector('.listado-pendientes ul');
                              listado.appendChild(nuevaTarea);

                              //limpiar el formulario
                              document.querySelector('.agregar-tarea').reset();

                              //actualizar la barra de progreso
                              actualizarProgreso();

                         }
                    } else {
                         // hubo un error
                         swal({
                              title: 'Error!',
                              text: 'Hubo un error',
                              type: 'error'
                         });
                    }                    
               }               
          }

          // Enviar la consulta
          xhr.send(datos);


     }
}

// cambia el estado de las tareas o las elimina

function accionesTareas(e){
     e.preventDefault();

     if(e.target.classList.contains('fa-check-circle')) {
          if(e.target.classList.contains('completo')){
               e.target.classList.remove('completo');
               cambiarEstadoTarea(e.target, 0);
          } else {
               e.target.classList.add('completo');
               cambiarEstadoTarea(e.target, 1);
          }
     }

     if(e.target.classList.contains('fa-trash')) {
          swal({
               title: 'Seguro(a)?',
               text: 'Esta accion no se deshace',
               type: 'warning',
               showCancelButton: true,
               showCancelButtonColor: '#3085d6',
               cancelButtonColor: '#d33',
               confirmButtonText: 'si, borrarla!',
               cancelButtonText: 'Cancelar'
          }).then((result) => {
               if (result.value) {

                    var tareaEliminar = e.target.parentElement.parentElement;
                    // borrar de la db
                    eliminarTareaBD(tareaEliminar);

                    // borrar del HTML
                    tareaEliminar.remove();


                    swal(
                         'Borrada!',
                         'Tu tarea ha sido borrada correctamente.',
                         'success'
                    )
               }
          })          
     }
}

// completa o descompleta la tarea

function cambiarEstadoTarea(tarea, estado) {
     var idTarea = tarea.parentElement.parentElement.id.split(':');
     
     // crear llamado a ajax
     var xhr = new XMLHttpRequest();

     // informacion
     var datos = new FormData();
     datos.append('id', idTarea[1]);
     datos.append('accion', 'actualizar');
     datos.append('estado', estado);


     // abrir la conexion
     xhr.open('POST', 'inc/modelos/modelo-tareas.php', true);

     //on load
     xhr.onload = function() {
          if(this.status === 200) {            
               //console.log(JSON.parse(xhr.responseText));
               // actualizar la barra de progreso
               actualizarProgreso();
          }
     }

     //enviar la peticion
     xhr.send(datos);

}


// elimina las tareas de la bd
function eliminarTareaBD(tarea){
     var idTarea = tarea.id.split(':');
     
     // crear llamado a ajax
     var xhr = new XMLHttpRequest();

     // informacion
     var datos = new FormData();
     datos.append('id', idTarea[1]);
     datos.append('accion', 'eliminar');


     // abrir la conexion
     xhr.open('POST', 'inc/modelos/modelo-tareas.php', true);

     //on load
     xhr.onload = function() {
          if(this.status === 200) {               
               console.log(JSON.parse(xhr.responseText));
               actualizarProgreso();
          }
     }

     //enviar la peticion
     xhr.send(datos);
}

// actualiza el avance del proyecto

function actualizarProgreso(){
     const tareas = document.querySelectorAll('li.tarea')

     // obtener las tareas completadas
     const tareasCompletadas = document.querySelectorAll('i.completo');

     // determinar el avance
     const avance = Math.round((tareasCompletadas.length/tareas.length)*100);

     // asigar el avance a la barra
     const porcentaje = document.querySelector('#porcentaje');
     porcentaje.style.width = avance+'%';

     // mostrar una alerta al 100%
     if(avance === 100){
          swal({
               title: 'proyecto terminado',
               text: 'Ya no hay tareas pendientes',
               type: 'success'
          })
     }


}