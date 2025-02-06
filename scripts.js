document.addEventListener('DOMContentLoaded', function() {
    var map = L.map('map').setView([40.4168, -3.7038], 6); // Centro en España

    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '© OpenStreetMap contributors'
    }).addTo(map);

    var drawnItems = new L.FeatureGroup();
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
            polyline: {},
            rectangle: {},
            circle: {}
        }
    });
    map.addControl(drawControl);

    function updateGeoJSON() {
        var geojson = drawnItems.toGeoJSON();
        var geojsonContent = document.getElementById('geojsonContent');
        geojsonContent.innerHTML = "GEOJSON<br><pre>" + JSON.stringify(geojson, null, 2) + "</pre>";

        // var drawnItemsStructure = '';
        // drawnItems.eachLayer(function(layer) {
        //     drawnItemsStructure += JSON.stringify(layer.toGeoJSON(), null, 2) + '\n';
        // });
        // geojsonContent.innerHTML += '<pre>\n\n<br>DRAWNITEMS<br>' + drawnItemsStructure + '</pre>';
    }

    map.on(L.Draw.Event.CREATED, function (event) {
        var layer = event.layer;
        var descripcion = prompt("Introduce una descripción:");
        var estilo = prompt("Introduce un estilo (color, etc.):");

        layer.feature = layer.feature || { type: "Feature", properties: {} };
        layer.feature.properties.descripcion = descripcion;
        layer.feature.properties.estilo = estilo;

        drawnItems.addLayer(layer);
        updateGeoJSON();
    });

    map.on(L.Draw.Event.EDITED, function () {
        updateGeoJSON();
    });

    map.on(L.Draw.Event.DELETED, function () {
        updateGeoJSON();
    });

    document.getElementById('save').addEventListener('click', function() {
        var geojson = drawnItems.toGeoJSON();
        var mapTitle = document.getElementById('mapTitle').value;
        
        geojson.features.forEach(function(feature) {
            feature.properties.mapa = mapTitle;
        });

        console.log(JSON.stringify(geojson, null, 2)); // Inspecciona el GeoJSON en la consola con formato legible

        fetch('save.php', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(geojson)
        }).then(response => response.text())
          .then(data => alert(data));
    });

    document.getElementById('load').addEventListener('click', function() {
        fetch('load.php')
            .then(response => response.json())
            .then(data => {
                L.geoJSON(data, {
                    onEachFeature: function (feature, layer) {
                        if (feature.properties && feature.properties.descripcion) {
                            layer.bindPopup(feature.properties.descripcion);
                        }
                        drawnItems.addLayer(layer);
                    }
                });
                updateGeoJSON();
            });
    });

    document.getElementById('export').addEventListener('click', function() {
        var geojson = drawnItems.toGeoJSON();
        var dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(geojson));
        var downloadAnchorNode = document.createElement('a');
        downloadAnchorNode.setAttribute("href", dataStr);
        downloadAnchorNode.setAttribute("download", "map_data.geojson");
        document.body.appendChild(downloadAnchorNode); // required for firefox
        downloadAnchorNode.click();
        downloadAnchorNode.remove();
    });
});