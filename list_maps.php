<?php
header('Content-Type: application/json');
require_once 'cfg/config_db.php';

$conn = new PDO($dsn, $db_user, $db_password);
$stmt = $conn->query("SELECT DISTINCT mapa FROM map_features");
$maps = [];

while ($row = $stmt->fetch(PDO::FETCH_ASSOC)) {
    $maps[] = $row['mapa'];
}

echo json_encode($maps);
?>
