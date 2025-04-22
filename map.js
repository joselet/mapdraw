var mapconfig = {
    view: { //Posición del mapa inicial
        lat: 40.4168,
        lng: -3.7038,
        zoom: 6
    },
    addedOverlays: {}
};
mapconfig.drawnItems = new L.FeatureGroup();

var map = L.map('map').setView([mapconfig.view.lat, mapconfig.view.lng], mapconfig.view.zoom);


function updateGeoJSON() {
    var geojson = mapconfig.drawnItems.toGeoJSON();
    var geojsonContent = document.getElementById('tabGeojson-content');
    geojsonContent.innerHTML = "GEOJSON<br><pre>" + JSON.stringify(geojson, null, 2) + "</pre>";
}



document.addEventListener('DOMContentLoaded', function () {

    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '© OpenStreetMap contributors'
    }).addTo(map);

    map.addLayer(mapconfig.drawnItems);

    var drawControl = new L.Control.Draw({
        edit: {
            featureGroup: mapconfig.drawnItems
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

        mapconfig.drawnItems.addLayer(layer);
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

    map.on(L.Draw.Event.EDITED, function () {
        updateGeoJSON();
    });

    map.on(L.Draw.Event.DELETED, function () {
        updateGeoJSON();
    });

    map.on('moveend', function () {
        var center = map.getCenter();
        mapconfig.view.lat = center.lat;
        mapconfig.view.lng = center.lng;
        mapconfig.view.zoom = map.getZoom();
    });
    
    map.on('click', function (e) {
        var clickedOnLayer = false;
        map.eachLayer(function (layer) {
            if (layer instanceof L.Path && layer.getBounds().contains(e.latlng)) {
                populateDatosContent(layer);
                populateEstiloContent(layer);
                clickedOnLayer = true;
                maximiza();
            }
        });
        if (!clickedOnLayer) {
            document.getElementById('tabDatos-content').innerHTML = ''; // Clear data content
            document.getElementById('tabEstilo-content').innerHTML = ''; // Clear style content
        }
    });

});
