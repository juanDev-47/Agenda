<?php
 include 'inc/funciones/funciones.php';
 include 'inc/layout/header.php'; 

 $id = filter_var($_GET['id'], FILTER_VALIDATE_INT);
 
 if(!$id) {
      die("No es valido");
 }

 $resultado = obtenerContacto($id);

 $contacto = $resultado->fetch_assoc();

 ?>

<pre>
     <?php var_dump($contacto); ?>
</pre>


<div class="contenedor-barra">
     <div class="contenedor barra">
     <a href="index.php" class="btn volver">Volver</a>
     <h1>Editar Contacto</h1>
     </div>
</div>

<div class="bg-amarillo contenedor sombra">
     <form action="#"  id="contacto">
     <legend>Edite el Contacto <span></span> </legend>

     <?php include 'inc/layout/formulario.php'; ?>
     
</div>     


<?php include 'inc/layout/footer.php'; ?>