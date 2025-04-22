<?php
header('Content-Type: application/json');
require_once 'cfg/config_db.php';

$mapa = isset($_GET['mapa']) ? $_GET['mapa'] : '';

$conn = new PDO($dsn, $db_user, $db_password);
$stmt = $conn->prepare("SELECT ST_AsGeoJSON(geom) as geometry, datos, estilo, mapa FROM map_features WHERE mapa = :mapa");
$stmt->bindParam(':mapa', $mapa);
$stmt->execute();
$features = [];

while ($row = $stmt->fetch(PDO::FETCH_ASSOC)) {
    $features[] = [
        'type' => 'Feature',
        'geometry' => json_decode($row['geometry']),
        'properties' => [
            'datos' => json_decode($row['datos']),
            'estilo' => json_decode($row['estilo']),
            'mapa' => $row['mapa']
        ]
    ];
}

$stmt = $conn->prepare("SELECT config FROM map_configs WHERE mapa = :mapa");
$stmt->bindParam(':mapa', $mapa);
$stmt->execute();
$config = $stmt->fetch(PDO::FETCH_ASSOC)['config'];

echo json_encode(['type' => 'FeatureCollection', 'features' => $features, 'config' => json_decode($config)]);
?>