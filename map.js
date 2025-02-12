var drawnItems = new L.FeatureGroup();




function updateGeoJSON() {
    var geojson = drawnItems.toGeoJSON();
    var geojsonContent = document.getElementById('tabGeojson-content');
    geojsonContent.innerHTML = "GEOJSON<br><pre>" + JSON.stringify(geojson, null, 2) + "</pre>";
}



document.addEventListener('DOMContentLoaded', function () {
    var map = L.map('map').setView([40.4168, -3.7038], 6); // Centro en España

    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '© OpenStreetMap contributors'
    }).addTo(map);

    map.addLayer(drawnItems);

    var drawControl = new L.Control.Draw({
        edit: {
            featureGroup: drawnItems
        },
        draw: {
            polygon: {
                allowIntersection: false,
                showArea: true
            },
            marker: {},
            polyline: {
                shapeOptions: {
                    color: '#3388ff',
                    weight: 4,
                    opacity: 0.5,
                    dashArray: '5, 5',
                    lineCap: 'square',
                    lineJoin: 'round'
                }
            },
            rectangle: {},
            circle: {}
        }
    });
    map.addControl(drawControl);

    function addArrowheads(layer) {
        var arrowHead = L.polylineDecorator(layer, {
            patterns: [
                {
                    offset: '100%',
                    repeat: 0,
                    symbol: L.Symbol.arrowHead({
                        pixelSize: 15,
                        polygon: false,
                        pathOptions: {
                            stroke: true,
                            color: '#3388ff',
                            weight: 2,
                            opacity: 0.5
                        }
                    })
                }
            ]
        }).addTo(map);
        return arrowHead;
    }
    window.addArrowheads = addArrowheads; // Make addArrowheads globally accessible

    map.on(L.Draw.Event.CREATED, function (event) {
        var layer = event.layer;
        layer.feature = layer.feature || { type: "Feature", properties: { datos: {}, estilo: {} } };

        drawnItems.addLayer(layer);
        if (layer instanceof L.Polygon) {
            // no hacer nada, pero así los polígonos no tendrán flechas, ya que también son polilíneas
        } else if (layer instanceof L.Polyline) {
            addArrowheads(layer);
        }
        updateGeoJSON();

        // Añadir click event
        layer.on('click', function () {
            populateDatosContent(layer);
            populateEstiloContent(layer);
        });
    });

    map.on('click', function (e) {
        var clickedOnLayer = false;
        map.eachLayer(function (layer) {
            if (layer instanceof L.Path && layer.getBounds().contains(e.latlng)) {
                populateDatosContent(layer);
                populateEstiloContent(layer);
                clickedOnLayer = true;
            }
        });
        if (!clickedOnLayer) {
            document.getElementById('tabDatos-content').innerHTML = ''; // Clear data content
            document.getElementById('tabEstilo-content').innerHTML = ''; // Clear style content
        }
    });

    map.on(L.Draw.Event.EDITED, function () {
        updateGeoJSON();
    });

    map.on(L.Draw.Event.DELETED, function () {
        updateGeoJSON();
    });

});


// function getTipo(layer) {


//     // Comprobamos el tipo con instanceof y verificamos propiedades adicionales
//     if (layer instanceof L.Polygon || layer instanceof L.Rectangle) {
//         return ('Polygon');
//     } else if (layer instanceof L.Polyline) {
//         return ('Polyline');
//     } else if (layer instanceof L.Marker) {
//         return ('Marker');
//     } else if (layer instanceof L.Circle) {
//         return ('Circle');
//     } else if (layer instanceof L.CircleMarker) {
//         return ('CircleMarker');
//     } else {
//         return ('Unknown');
//     }

//     // Para determinar si un Polyline es un polígono, verificamos si el primer y último punto son iguales
//     // if (layer instanceof L.Polyline) {
//     //     if (layer.getLatLngs().length > 2) {
//     //         const latLngs = layer.getLatLngs();
//     //         const firstPoint = latLngs[0];
//     //         const lastPoint = latLngs[latLngs.length - 1];
//     //         if (firstPoint.equals(lastPoint)) {
//     //             console.log('Polygon (closed Polyline)');
//     //         } else {
//     //             console.log('Polyline (open)');
//     //         }
//     //     }
//     // }


// }