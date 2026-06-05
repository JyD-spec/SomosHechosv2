<?php
require_once __DIR__ . '/../includes/config.php';
require_once MODELS_PATH . '/Personalizacion.php';

if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    Personalizacion::guardar($_POST);

    echo json_encode([
        'success' => true
    ]);
}
