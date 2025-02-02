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

    map.on(L.Draw.Event.CREATED, function (event) {
        var layer = event.layer;
        var descripcion = prompt("Introduce una descripción:");
        var estilo = prompt("Introduce un estilo (color, etc.):");

        layer.feature = layer.feature || { type: "Feature", properties: {} };
        layer.feature.properties.descripcion = descripcion;
        layer.feature.properties.estilo = estilo;

        drawnItems.addLayer(layer);
    });

    document.getElementById('save').addEventListener('click', function() {
        var geojson = drawnItems.toGeoJSON();
        console.log(JSON.stringify(geojson, null, 2)); // Inspecciona el GeoJSON en la consola con formato legible

        // var geojson_generada = {
        //     type: "FeatureCollection",
        //     features: []
        // };

        // drawnItems.eachLayer(function(layer) {
        //     if (layer.toGeoJSON) {
        //         var feature = layer.toGeoJSON();
        //         feature.properties = feature.properties || {};
        //         feature.properties.descripcion = layer.feature.properties.descripcion;
        //         feature.properties.estilo = layer.feature.properties.estilo;
        //         geojson_generada.features.push(feature);
        //     }
        // });

        // console.log(JSON.stringify(geojson_generada, null, 2)); // Inspecciona el GeoJSON generado en la consola con formato legible

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
                    }
                }).addTo(drawnItems);
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