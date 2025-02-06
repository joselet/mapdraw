<?php
require_once 'cfg/config_db.php';

$data = json_decode(file_get_contents('php://input'), true);

// Conexión a la base de datos
$conn = new PDO($dsn, $db_user, $db_password);

if (!empty($data['features'])) {
    $mapa = $data['features'][0]['properties']['mapa'] ?? '';

    // Eliminar datos existentes del mapa
    $stmt = $conn->prepare("DELETE FROM map_features WHERE mapa = :mapa");
    $stmt->execute(['mapa' => $mapa]);

    // Insertar nuevos datos
    foreach ($data['features'] as $feature) {
        $geometry = json_encode($feature['geometry']);
        $descripcion = $feature['properties']['descripcion'] ?? '';
        $estilo = $feature['properties']['estilo'] ?? '';

        $stmt = $conn->prepare("INSERT INTO map_features (mapa, descripcion, estilo, geom) VALUES (:mapa, :descripcion, :estilo, ST_GeomFromGeoJSON(:geometry))");
        $stmt->execute([
            'mapa' => $mapa,
            'descripcion' => $descripcion,
            'estilo' => $estilo,
            'geometry' => $geometry
        ]);
    }
}

echo "Datos guardados correctamente.";

?>
