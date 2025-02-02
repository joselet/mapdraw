<?php
header('Content-Type: application/json');
require_once 'cfg/config_db.php';

$conn = new PDO($dsn, $db_user, $db_password);
$stmt = $conn->query("SELECT ST_AsGeoJSON(geometry) as geometry, properties FROM map_features");
$features = [];

while ($row = $stmt->fetch(PDO::FETCH_ASSOC)) {
    $features[] = [
        'type' => 'Feature',
        'geometry' => json_decode($row['geometry']),
        'properties' => json_decode($row['properties'], true)
    ];
}

$geojson = ['type' => 'FeatureCollection', 'features' => $features];
header('Content-Disposition: attachment; filename="map_data.geojson"');
echo json_encode($geojson);
?>