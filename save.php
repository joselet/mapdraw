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
        $datos = json_encode($feature['properties']['datos'] ?? []);
        $estilo = json_encode($feature['properties']['estilo'] ?? []);

        $stmt = $conn->prepare("INSERT INTO map_features (mapa, datos, estilo, geom) VALUES (:mapa, :datos, :estilo, ST_GeomFromGeoJSON(:geometry))");
        $stmt->execute([
            'mapa' => $mapa,
            'datos' => $datos,
            'estilo' => $estilo,
            'geometry' => $geometry
        ]);
    }
}

echo "Datos guardados correctamente.";

?>
