<?php
require_once __DIR__ . '/../includes/config.php';
require_once MODELS_PATH . '/Mostrar_canciones.php';
require_once MODELS_PATH . '/Personalizacion.php';

$opciones = Personalizacion::obtener();

include __DIR__ . '/../includes/header.php';
include __DIR__ . '/../includes/navbar.php';


$id = $_GET['id'] ?? null;
$cancion = Mostrar::obtenerPorId($id);
?>

<style>
#chords {
    font-size: <?= $opciones['font_size'] ?>px;
    text-align: <?= $opciones['align_chords'] ?? 'left' ?>;
}
</style>

<main class="container container-view px-2 mt-4 mb-5">
    <div class="d-flex justify-content-start mb-3">
        <a href="../index.php" class="btn btn-secondary">⮌ Volver</a>
    </div>
    <?php if (!$cancion): ?>
        <div class="alert alert-danger text-center">
            ❌ Canción no encontrada
        </div>
    <?php else: ?>
        <h3 class="text-center mb-4">
            <?php echo htmlspecialchars($cancion['name']); ?>
        </h3>
        <section class="content">
            <div class="mt-3 mb-3">
                <div class="chords-container">
                    <h4 class="chords-title">Acordes</h4>
                    <pre class="chords" id="chords"><?php echo htmlspecialchars($cancion['chords']); ?></pre>
                    <h4 class="chords-subtitle">
                        Agregada por: <?php echo htmlspecialchars($cancion['added_by']); ?>
                    </h4>
                    <h4 class="chords-subtitle">
                        Autor: <?php echo htmlspecialchars($cancion['author']); ?>
                    </h4>
                </div>
            </div>
        </section>
    <?php endif; ?>    
</main>

<!-- Botón flotante fuera del main -->
<button id="toggleOptions" class="btn-floating">
    ⮜
</button>

<?php include INCLUDES_PATH . '/options.php'; ?>

<?php
include __DIR__ . '/../includes/footer.php';
?>