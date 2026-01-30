<?php
//Logica para borrar canciones
require_once 'includes/config.php';
require_once MODELS_PATH . '/Borrar_canciones.php';
require_once MODELS_PATH . '/Listado_servicio.php';

$listadoActual = Listado_servicio::generarListado();
$idsEnLista = array_column($listadoActual, 'cancion_id');

if (isset($_GET['add_to_list'])) {
    require_once MODELS_PATH . '/Listado_servicio.php';
    Listado_servicio::agregar($_GET['add_to_list']);
    // Redirigimos con un parámetro de éxito
    header("Location: index.php?success=1"); 
    exit;
}

if (isset($_GET['delete'])) {
    $id = (int) $_GET['delete'];
    Borrar_canciones::borrarPorId($id);
    // Redirigir para evitar re-borrado al refrescar
    header('Location: index.php');
    exit;
}

// Lógica para quitar un elemento específico del listado de servicio
if (isset($_GET['remove_item'])) {
    require_once MODELS_PATH . '/Listado_servicio.php';
    $id_fila = $_GET['remove_item'];
    Listado_servicio::quitarDeListado($id_fila);
    // Redirigimos de vuelta a list.php para ver el cambio
    header("Location: pages/list.php");
    exit;
}

if (isset($_GET['clear_list'])) {
    require_once MODELS_PATH . '/Listado_servicio.php';
    
    Listado_servicio::vaciarListado();
    
    // Redirigimos de vuelta a list.php con un mensaje de éxito
    header("Location: " . BASE_URL . "pages/list.php?cleared=success");
    exit();
}



require_once 'includes/header.php';
require_once 'includes/navbar.php';
require_once 'pages/home.php';
require_once 'includes/footer.php';
?>