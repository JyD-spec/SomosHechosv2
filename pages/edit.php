<?php
require_once __DIR__ . '/../includes/config.php';
require_once MODELS_PATH . '/Editar_canciones.php';
require_once MODELS_PATH . '/Canciones_inicio.php';

$mensaje = null;
$id = $_GET['id'] ?? null;

$cancionActual = null;
if ($id) {
    $ch = curl_init(SUPABASE_URL . '/rest/v1/Canciones?id=eq.' . $id . '&select=*');
    curl_setopt($ch, CURLOPT_HTTPHEADER, ['apikey: ' . SUPABASE_KEY, 'Authorization: Bearer ' . SUPABASE_KEY]);
    curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
    $res = json_decode(curl_exec($ch), true);
    $cancionActual = $res[0] ?? null;
    curl_close($ch);
}

if (!$cancionActual) {
    die('Canción no encontrada.');
}

if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    $resultado = Editar::editar($_POST);

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
        header('Refresh: 0.5; url=' . BASE_URL . 'index.php');
    }
}

include INCLUDES_PATH . '/header.php';
include INCLUDES_PATH . '/navbar.php';
?>

<main class="container px-2 mt-4 mb-5">
    <h3 class="text-center mb-4">Editar Canción</h3>
    <section class="content">
        <form class="row g-3 modern-form" method="POST" action=""> 
            <input type="hidden" name="id" value="<?= htmlspecialchars($cancionActual['id']) ?>">

            <div class="col-md-6">
                <label class="form-label fw-bold">Actualizar Nombre</label>
                <input type="text" name="nombre" class="form-control modern-input" 
                       value="<?= htmlspecialchars($cancionActual['name']) ?>" required>
            </div>
            
            <div class="col-md-6">
                <label class="form-label fw-bold">Actualizar Autor</label>
                <input type="text" name="autor" class="form-control modern-input" 
                       value="<?= htmlspecialchars($cancionActual['author']) ?>" required>
            </div>

            <div class="col-12">
                <label class="form-label fw-bold">Actualizar Acordes</label>
                <textarea class="form-control modern-input auto-grow" name="acordes" rows="8" required><?= htmlspecialchars($cancionActual['chords']) ?></textarea>
            </div>

            <div class="col-12">
                <label class="form-label fw-bold">Agregada por (No editable):</label>
                <input type="text" class="form-control modern-input" 
                       value="<?= htmlspecialchars($cancionActual['added_by']) ?>" disabled>
            </div>

            <div class="col-md-4">
                <label class="form-label fw-bold">Tipo</label>
                <select name="tipo" class="form-select modern-select">
                    <option <?= $cancionActual['type'] == 'Alabanza' ? 'selected' : '' ?>>Alabanza</option>
                    <option <?= $cancionActual['type'] == 'Adoración' ? 'selected' : '' ?>>Adoración</option>
                </select>
            </div>

            <div class="col-12">
                <div class="form-check">
                    <input class="form-check-input modern-checkbox" type="checkbox" id="gridCheck" name="verificado" required>
                    <label class="form-check-label fw-bold" for="gridCheck">Confirmar cambios</label>
                </div>
            </div>

            <div class="col-12 text-center">
                <button type="submit" class="btn btn-primary add-btn">Actualizar Canción</button>
                <a href="<?= BASE_URL ?>index.php" class="btn btn-secondary">Cancelar</a>
            </div>
        </form>
    </section>
</main>

<?php
include INCLUDES_PATH . '/footer.php';
?>

<script>
document.addEventListener('DOMContentLoaded', function() {
    const textareas = document.querySelectorAll('.auto-grow');

    textareas.forEach(textarea => {
        // 1. Función para ajustar la altura
        const adjustHeight = (el) => {
            el.style.height = 'auto'; // Reset para calcular bien
            el.style.height = (el.scrollHeight) + 'px';
        };

        // 2. Ajustar inmediatamente al cargar (importante para Editar)
        adjustHeight(textarea);

        // 3. Ajustar cada vez que el usuario escriba
        textarea.addEventListener('input', function() {
            adjustHeight(this);
        });
    });
});
</script>