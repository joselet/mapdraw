<?php
header('Content-Type: application/json');
require_once 'cfg/config_db.php';

$conn = new PDO($dsn, $db_user, $db_password);
$stmt = $conn->query("SELECT DISTINCT titulo, descripcion, cadena_wms, capas FROM map_conexiones");
$overlays = [];

while ($row = $stmt->fetch(PDO::FETCH_ASSOC)) {
    $overlays[] = $row;
}

echo json_encode($overlays);
?>
