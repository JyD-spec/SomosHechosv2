<?php
require_once __DIR__ . '/../models/Borrar.php';
require_once __DIR__ . '/../includes/config.php';

$data = json_decode(file_get_contents("php://input"), true);

if (!isset($data['id']) || !is_numeric($data['id'])) {
    echo json_encode(['success' => false, 'message' => 'ID inválido']);
    exit;
}

$model = new Borrar($db);
$result = $model->deleteChord($data['id']);

echo json_encode(['success' => $result]);
?>