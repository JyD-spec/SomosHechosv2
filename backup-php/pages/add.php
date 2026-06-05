<?php
require_once __DIR__ . '/../includes/config.php';
require_once MODELS_PATH . '/Guardar_canciones.php';

$mensaje = null;

if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    $resultado = Guardar::guardar($_POST);

    if (isset($resultado['error'])) {
        $mensaje = [
            'tipo' => 'error',
            'texto' => $resultado['error'] . '<br><pre>' . htmlspecialchars($resultado['detalle'] ) . '</pre>'
        ];
    } else {
        $mensaje = [
            'tipo' => 'success',
            'texto' => 'Canción guardada correctamente 🎵'
        ];
    }
}

include INCLUDES_PATH . '/header.php';
include INCLUDES_PATH . '/navbar.php';
?>

<main class="container px-2 mt-4 mb-5">
    <h3 class="text-center mb-4">Agregar acorde nuevo</h3>
    <section class="content">
        <div class="mt-3 mb-3">
            <?php if ($mensaje): ?>
                <div class="alert alert-<?php echo $mensaje['tipo'] === 'error' ? 'danger' : 'success'; ?>">
                    <?php echo $mensaje['texto']; ?>
                </div>
            <?php endif; ?>
            <form class="row g-3 modern-form"
                method="POST"
                action=""> 
                <div class="col-md-6">
                    <label class="form-label fw-bold">Nombre</label>
                    <input type="text" name="nombre" class="form-control modern-input" placeholder="Ingresa el nombre del acorde" required>
                </div>
                <div class="col-md-6">
                    <label class="form-label fw-bold">Autor</label>
                    <input type="text" name="autor" class="form-control modern-input" placeholder="Ingresa el autor" required>
                </div>
                <div class="col-12">
                    <label for="inputAddress" class="form-label fw-bold">Acordes</label>
                    <textarea class="form-control modern-input auto-grow" name="acordes" rows="8" placeholder="Ej: C, G, Am" required></textarea>
                </div>
                <div class="col-12">
                    <label class="form-label fw-bold">Agregada por:</label>
                    <input type="text" name="agregado_por" class="form-control modern-input" placeholder="Tu nombre" required>
                </div>
                <div class="col-md-4">
                    <label for="inputState" class="form-label color-label fw-bold">Tipo</label>
                    <select id="inputState" name="tipo" class="form-select modern-select">
                        <option selected>Alabanza</option>
                        <option>Adoración</option>
                    </select>
                </div>
                <div class="col-12">
                    <div class="form-check">
                        <input class="form-check-input modern-checkbox" type="checkbox" id="gridCheck" name="verificado" required>
                        <label class="form-check-label fw-bold" for="gridCheck">
                            Verificado
                        </label>
                    </div>
                </div>
                <div class="col-12 text-center">
                    <button type="submit" class="btn btn-success add-btn">Guardar</button>
                </div>
            </form>
        </div>
    </section>
</main>

<?php
include INCLUDES_PATH . '/footer.php';
?>




