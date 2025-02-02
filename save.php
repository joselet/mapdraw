<?php
require_once 'cfg/config_db.php';

$data = json_decode(file_get_contents('php://input'), true);

// Conexión a la base de datos
$conn = new PDO($dsn, $db_user, $db_password);

foreach ($data['features'] as $feature) {
    $geometry = json_encode($feature['geometry']);
    $descripcion = $feature['properties']['descripcion'] ?? '';
    $estilo = $feature['properties']['estilo'] ?? '';

    $stmt = $conn->prepare("INSERT INTO map_features (descripcion, estilo, geom) VALUES (:descripcion, :estilo, ST_GeomFromGeoJSON(:geometry))");
    $stmt->execute([
        'descripcion' => $descripcion,
        'estilo' => $estilo,
        'geometry' => $geometry
    ]);
}

echo "Datos guardados correctamente.";

?>
