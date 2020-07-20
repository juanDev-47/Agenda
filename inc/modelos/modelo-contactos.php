<?php     

if($_POST['accion'] == 'crear'){
     // creara un nuevo registro en la base de datos

     require_once('../funciones/bd.php');

     //validar entradas
     $nombre = filter_var($_POST['nombre'], FILTER_SANITIZE_STRING);
     $empresa = filter_var($_POST['empresa'], FILTER_SANITIZE_STRING);
     $telefono = filter_var($_POST['telefono'], FILTER_SANITIZE_STRING);

     try{
          $stmt = $conn->prepare("INSERT INTO contactos (nombre, empresa, telefono) VALUES (?, ?, ?)");
          $stmt->bind_param("sss", $nombre, $empresa, $telefono);
          $stmt->execute();
          if($stmt->affected_rows == 1){
               $respuesta = array(
                    'respuesta' => 'correcto',
                    'id_insertado' => $stmt->insert_id,
                    'datos' => array(
                         'nombre' => $nombre,
                         'empresa' => $empresa,
                         'telefono' => $telefono
                    )
               );
          }
          $stmt->close();
          $conn->close();
     } catch(Exception $e){
          $respuesta = array(
               'error' => $e->getMessage()
          );
     }

     echo json_encode($respuesta);

}
