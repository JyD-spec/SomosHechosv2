<?php 
require_once MODELS_PATH . '/Personalizacion.php';
$opciones = Personalizacion::obtener();
?>

<div id="options-menu" class="options-sidebar hidden">
    <h5>Personalizar</h5>

    <label>Tamaño</label>
    <input type="range" min="12" max="28" value="<?=$opciones['font_size'] ?>" id="fontSize">

    <label>Alineación</label>
    <select id="alignChords">
        <option value="left" <?= $opciones['align_chords'] === 'left' ? 'selected' : '' ?>>Izquierda</option>
        <option value="center" <?= $opciones['align_chords'] === 'center' ? 'selected' : '' ?>>Centro</option>
        <option value="right" <?= $opciones['align_chords'] === 'right' ? 'selected' : '' ?>>Derecha</option>
    </select>

    <label>Transposición</label>
    <input type="number" id="transpose" value="<?=$opciones['transpose'] ?>" min="-6" max="6">
</div>
