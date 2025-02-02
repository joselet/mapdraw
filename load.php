<?php
header('Content-Type: application/json');
require_once 'cfg/config_db.php';

$conn = new PDO($dsn, $db_user, $db_password);
$stmt = $conn->query("SELECT ST_AsGeoJSON(geom) as geometry, descripcion, estilo FROM map_features");
$features = [];

while ($row = $stmt->fetch(PDO::FETCH_ASSOC)) {
    $features[] = [
        'type' => 'Feature',
        'geometry' => json_decode($row['geometry']),
        'descripcion' => json_decode($row['descripcion'], true),
        'estilo' => json_decode($row['estilo'], true)
    ];
}

echo json_encode(['type' => 'FeatureCollection', 'features' => $features]);
?>