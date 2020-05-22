<?php include 'inc/layout/header.php'; ?>

<div class="contenedor-barra">
     <h1>Agenda de contactos</h1>
</div>

<div class="bg-amarillo contenedor sombra">
     <form action="#"  id="contacto">
          <legend>Añada un contacto <span>Todos los campos son obligatorios  </span> </legend>

          <div class="campos">
               <div class="campo">
                    <label for="nombre">Nombre:</label>
                    <input type="text" placeholder="Nombre Contacto" id="nombre"> 
               </div>

               <div class="campo">
                    <label for="empresa">Empresa:</label>
                    <input type="text" placeholder="Nombre Empresa" id="empresa"> 
               </div>

               <div class="campo">
                    <label for="nombre">Telefono:</label>
                    <input type="tel" placeholder="Numero de contacto" id="telefono"> 
               </div>
               <div class="enviar campo"> 
                    <input type="submit" value="Añadir">
               </div>
          </div>
     </form>
</div>

<?php include 'inc/layout/footer.php'; ?>