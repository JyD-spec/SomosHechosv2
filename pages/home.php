<?php if (isset($_GET['success'])): ?>
    <div class="container mt-3">
        <div class="alert alert-success alert-dismissible fade show" role="alert">
            ¡Canción añadida al listado de servicio! 🎵
            <button type="button" class="btn-close" data-bs-dismiss="alert" aria-label="Close"></button>
        </div>
    </div>
<?php endif; ?>

<?php
require_once MODELS_PATH . '/Canciones_inicio.php';
require_once MODELS_PATH . '/Listado_servicio.php'; // Necesario para verificar el estado

$termino = isset($_GET['q']) ? $_GET['q'] : null;
$canciones = Lista::obtenerTodas($termino);

// Obtenemos los IDs que ya están en el listado para deshabilitar botones
$listadoActual = Listado_servicio::generarListado();
$idsEnLista = array_column($listadoActual, 'cancion_id'); 
?>

<main>
    <section class="hero">
        <h2>Canciones</h2>
    </section>

    <?php if ($termino): ?>
        <div class="container mt-3 mb-3 custom-container">
            <div class="alert alert-search d-flex justify-content-between align-items-center">
                <div class="search-info">
                    <i class="bi bi-search"></i>
                    <span>Mostrando resultados para: <strong><?= htmlspecialchars($termino) ?></strong></span>
                </div>
                <a href="index.php" class="btn btn-sm btn-close-search">Limpiar búsqueda</a>
            </div>
        </div>
    <?php endif; ?>

    <section class="content">
        <div class="container mt-3 mb-3 custom-container">
            <div class="list-group">

                <div class="list-group-item list-header">
                    <span>Nombre</span>
                    <span>Autor</span>
                    <span>Tipo</span>
                    <span>Opciones</span>
                </div>
                
                <?php if (!empty($canciones)): ?>
                    <?php foreach ($canciones as $cancion): 
                        // Verificamos si esta canción ya existe en el listado actual
                        $yaAgregada = in_array($cancion['id'], $idsEnLista);
                    ?>
                        <div 
                        class="list-group-item list-row list-clickeable"
                        onclick="window.location.href='<?php echo BASE_URL; ?>pages/view.php?id=<?php echo $cancion['id']; ?>'"
                        >
                            <span><?php echo htmlspecialchars($cancion['name']); ?></span>
                            <span><?php echo htmlspecialchars($cancion['author']); ?></span>
                            <span><?php echo htmlspecialchars($cancion['type']); ?></span>

                            <span class="actions">
                                <button 
                                    type="button"
                                    class="btn <?= $yaAgregada ? 'btn-secondary' : 'btn-success' ?> btn-sm"
                                    onclick="event.stopPropagation(); window.location.href='<?php echo BASE_URL; ?>index.php?add_to_list=<?= $cancion['id'] ?>';"
                                    <?= $yaAgregada ? 'disabled' : '' ?>
                                >
                                    <?= $yaAgregada ? 'En lista' : 'Agregar' ?>
                                </button>

                                <button 
                                    type="button"
                                    class="btn btn-warning btn-sm"
                                    onclick="event.stopPropagation(); window.location.href='<?php echo BASE_URL; ?>pages/edit.php?id=<?php echo $cancion['id']; ?>';"
                                >
                                    Editar
                                </button>

                                <button
                                    type="button"
                                    class="btn btn-danger btn-sm"
                                    onclick="
                                        event.stopPropagation();
                                        if (confirm('¿Seguro que deseas borrar esta canción?')) {
                                            window.location.href='<?= BASE_URL ?>index.php?delete=<?= $cancion['id'] ?>';
                                        }
                                    "
                                >
                                    Borrar
                                </button>
                            </span>
                        </div>
                    <?php endforeach; ?>
                <?php else: ?>
                    <div class="list-group-item text-center text-muted">
                        No hay canciones registradas.
                    </div>
                <?php endif; ?>
            </div>
        </div>
    </section>
</main>

