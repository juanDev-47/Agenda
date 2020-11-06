
eventListeners();

function eventListeners() {
     document.querySelector('#formulario').addEventListener('submit', validarRegistro);

}


function validarRegistro(e) {
     e.preventDefault();

     var usuario = document.querySelector('#usuario').value,
          password = document.querySelector('#password').value
          tipo = document.querySelector('#tipo').value;

     if(usuario === '' || password === ''){           
          Swal.fire({
               type: 'error',
               title: 'Error',
               text: 'Ambos campos son obligatorios!',
               // footer: '<a href>Why do I have this issue?</a>'
          })
     } else {
          Swal.fire({
               type: 'success',
               title: 'Correcto',
               text: 'Se registro correctamente!',
               // footer: '<a href>Why do I have this issue?</a>'
          })
          // Ambos campos son corrector, mandar a ejecutar Ajax

          var datos = new FormData();
          datos.append('usuario', usuario);
          datos.append('password', password);
          datos.append('accion', tipo);

          //crear el llamado a ajax
          var xhr = new XMLHttpRequest();

          // abrir la conexion
          xhr.open('POST', 'inc/modelos/modelo-admin.php', true);

          // retorno de datos
          xhr.onload = function() {
               if(this.status == 200){
                    var respuesta = JSON.parse(xhr.responseText);                    
                    // console.log(respuesta);

                    if(respuesta.respuesta === 'correcto') {
                         // si es un nuevo usuario
                         if(respuesta.tipo === 'crear') {
                              swal({
                                   title: 'Usuario creado',
                                   text: 'El Usuario Se Creo Correctamente',
                                   type: 'success'
                              });
                         } else if(respuesta.tipo === 'login') {
                              swal({
                                   title: 'Login correcto',
                                   text: 'Presiona OK, para ir al dashboard',
                                   type: 'success'
                              })
                              .then(resultado =>{
                                   if(resultado.value) {
                                        window.location.href = 'index.php';
                                   }
                              })                        
                         } 
                    } else {
                         // Hubo error
                         swal({
                              title: 'Error',
                              text: 'Hubo un error',
                              type: 'error'
                         });
                    }
               }
          }

          // enviar la peticion
          xhr.send(datos);
          
          
     }     
          
          
}