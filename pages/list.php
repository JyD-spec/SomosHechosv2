<?php
require_once __DIR__ . '/../includes/config.php';
require_once MODELS_PATH . '/Listado_servicio.php';

if (isset($_GET['mover']) && isset($_GET['id'])) {
    Listado_servicio::mover($_GET['id'], $_GET['mover']);
    header("Location: list.php"); // Recargar para ver el cambio
    exit;
}

// Obtenemos los datos reales de la base de datos
$listado = Listado_servicio::generarListado();


include INCLUDES_PATH . '/header.php';
include INCLUDES_PATH . '/navbar.php';
?>

<main class="container px-2 mt-4">
    <?php if (isset($_GET['cleared'])): ?>
        <div class="alert alert-info alert-dismissible fade show" role="alert">
            El listado ha sido vaciado correctamente.
            <button type="button" class="btn-close" data-bs-dismiss="alert" aria-label="Close"></button>
        </div>
    <?php endif; ?>

    <div class="text-center mb-4">
        <h2 class="d-inline-block me-3">🎵 Listado de Servicio 🎵</h2>
        
        <?php if (!empty($listado)): // Solo mostrar si hay canciones en la lista ?>
            <button 
                type="button" 
                class="btn btn-outline-danger btn-sm"
                onclick="if(confirm('¿Estás seguro de que quieres borrar TODA la lista del domingo?')) { 
                    window.location.href='<?= BASE_URL ?>index.php?clear_list=1'; 
                }"
            >
                <i class="bi bi-trash"></i> Vaciar listado
            </button>
        <?php endif; ?>
    </div>
    
    <section class="content">
        <div class="list-group shadow-sm">
            <?php if (!empty($listado)): ?>
                <?php foreach ($listado as $item): 
                    $cancion = $item['Canciones'] ?? null; 
                    if (!$cancion) continue;
                ?>
                    <div class="list-group-item border-bottom p-3">
                        <div class="d-flex align-items-center justify-content-between">
                            <div class="d-flex align-items-center">
                                <span class="badge bg-primary rounded-circle me-3"><?= $item['posicion_id'] ?></span>
                                <div>
                                    <h5 class="mb-0"><?= htmlspecialchars($cancion['name']) ?></h5>
                                    <small class="text-muted"><?= htmlspecialchars($cancion['author']) ?></small>
                                </div>
                            </div>
                            <div class="actions d-flex gap-2">
                                <div class="btn-group-vertical btn-group-sm">
                                    <a href="?mover=up&id=<?= $item['id'] ?>" class="btn btn-outline-success">🡡</a>
                                    <a href="?mover=down&id=<?= $item['id'] ?>" class="btn btn-outline-success">🡣</a>
                                </div>
                                <button type="button" 
                                    class="btn btn-danger btn-sm" 
                                    onclick="if(confirm('¿Quitar del listado?')) { window.location.href='<?= BASE_URL ?>index.php?remove_item=<?= $item['id'] ?>'; }">
                                Quitar
                            </button>
                            </div>
                        </div>

                        <div class="mt-3 p-3 bg-light rounded shadow-sm" style="white-space: pre-wrap; font-family: monospace; font-size: 0.9rem;"><?= htmlspecialchars($cancion['chords'] ?? 'Sin acordes registrados') ?></div>
                    </div>
                <?php endforeach; ?>
            <?php else: ?>
                <div class="alert alert-info text-center">
                    El listado está vacío. ¡Agrega algunas canciones desde el inicio!
                </div>
            <?php endif; ?>
        </div>
        
        <div class="text-center mt-4">
            <a href="<?= BASE_URL ?>index.php" class="btn btn-secondary">Volver a Canciones</a>
        </div>
        <br/>
    </section>
</main>

<?php
include INCLUDES_PATH . '/footer.php';
?>