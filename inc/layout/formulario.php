<div class="campos">
               <div class="campo">
                    <label for="nombre">Nombre:</label>
                    <input 
                         type="text" 
                         placeholder="Nombre Contacto" 
                         id="nombre"
                         value="<?php echo ($contacto['nombre']) ? $contacto['nombre'] : ''; ?>"
                    > 
               </div>

               <div class="campo">
                    <label for="empresa">Empresa:</label>
                    <input 
                         type="text" 
                         placeholder="Nombre Empresa" 
                         id="empresa" 
                         value="<?php echo ($contacto['empresa']) ? $contacto['empresa'] : ''; ?>"
                    > 
               </div>

               <div class="campo">
                    <label for="telefono">Telefono:</label>
                    <input 
                         type="tel" 
                         placeholder="Numero de contacto" 
                         id="telefono"
                         value="<?php echo ($contacto['telefono']) ?  $contacto['telefono'] : ''; ?>"
                    > 
               </div>               
          </div>
          <div class="campo enviar"> 
               <?php
                    $textoBtn = ($contacto['telefono']) ? 'Guardar' : 'Añadir';
                    $accion = ($contacto['telefono']) ? 'editar' : 'crear';
               ?>
               <input type="hidden" id="accion" value="<?php echo $accion; ?>">

               <?php if(isset( $contacto['id'] )) { ?>
                    <input type="hidden" id="id" value="<?php echo $contacto['id']; ?>">
               <?php } ?>
               
               <input type="submit" value="<?php echo $textoBtn; ?>"> 
          </div>