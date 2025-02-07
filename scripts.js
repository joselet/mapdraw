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
            polyline: {
                shapeOptions: {
                    color: '#3388ff',
                    weight: 4,
                    opacity: 0.5,
                    dashArray: '5, 5',
                    lineCap: 'round',
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
        if (layer instanceof L.Polyline) {
            addArrowheads(layer);
        }
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

    // carga de elementos de mapa
    function cargarMapa(mapa) {
        fetch('load.php?mapa=' + mapa)
            .then(response => response.json())
            .then(data => {
                L.geoJSON(data, {
                    onEachFeature: function (feature, layer) {
                        if (feature.properties && feature.properties.descripcion) {
                            layer.bindPopup(feature.properties.descripcion);
                        }
                        drawnItems.addLayer(layer);
                        if (layer instanceof L.Polyline) {
                            addArrowheads(layer);
                        }
                    }
                });
                updateGeoJSON();
            });
    }

    window.cargarMapa = cargarMapa; // Make cargarMapa globally accessible

    document.getElementById('load').addEventListener('click', function() {
        // mostrar listado de mapas disponibles en una ventana modal
        // crear ventana modal
        var modal = document.createElement('div');
        modal.id = 'modal';
        // dar estilo a la ventana modal desde jquery
        modal.style.position = 'fixed';
        modal.style.top = '0';
        modal.style.left = '0';
        modal.style.width = '100%';
        modal.style.height = '100%';
        modal.style.backgroundColor = 'rgba(0,0,0,0.5)';
        modal.style.display = 'flex';
        modal.style.justifyContent = 'center';
        modal.style.alignItems = 'center';
        modal.style.zIndex = '1000';

        // crear contenedor interno para el contenido del modal
        var modalContent = document.createElement('div');
        modalContent.style.position = 'relative';
        modalContent.style.backgroundColor = 'white';
        modalContent.style.padding = '20px';
        modalContent.style.borderRadius = '5px';
        modalContent.style.boxShadow = '0 2px 10px rgba(0,0,0,0.1)';
        

        // poner un botón para cerrar el modal
        var closeButton = document.createElement('button');
        closeButton.innerHTML = '&times;';
        closeButton.style.position = 'absolute';
        closeButton.style.top = '10px';
        closeButton.style.right = '10px';
        closeButton.style.backgroundColor = 'transparent';
        closeButton.style.color = 'black';
        closeButton.style.border = 'none';
        closeButton.style.fontSize = '20px';
        closeButton.style.cursor = 'pointer';
        closeButton.setAttribute('onclick', 'document.getElementById("modal").remove()'); // Add onclick attribute
        modalContent.appendChild(closeButton);

        // asignar este div a la ventana modal
        var html = `<h3 id="modalTitle">Añadir contenido de otro mapa&nbsp;</h3>
                    <div class="map-list">
                        <ul id="mapList" class="list-group"></ul>
                    </div>`;
        modalContent.innerHTML += html; // Use += to append the HTML without overwriting the close button
        modal.appendChild(modalContent);
        document.body.appendChild(modal);

        // hacer la ventana modal arrastrable solo desde el título
        var isDragging = false;
        var offsetX, offsetY;
        var modalTitle = document.getElementById('modalTitle');

        modalTitle.style.cursor = 'move'; // Change cursor to move for the title

        modalTitle.addEventListener('mousedown', function(e) {
            isDragging = true;
            offsetX = e.clientX - modalContent.getBoundingClientRect().left;
            offsetY = e.clientY - modalContent.getBoundingClientRect().top;
            document.addEventListener('mousemove', onMouseMove);
            document.addEventListener('mouseup', onMouseUp);
        });

        function onMouseMove(e) {
            if (isDragging) {
                modalContent.style.left = (e.clientX - offsetX) + 'px';
                modalContent.style.top = (e.clientY - offsetY) + 'px';
                modalContent.style.position = 'absolute';
            }
        }

        function onMouseUp() {
            isDragging = false;
            document.removeEventListener('mousemove', onMouseMove);
            document.removeEventListener('mouseup', onMouseUp);
        }

        // cargar los mapas disponibles   
        fetch('list_maps.php')
            .then(response => response.json())
            .then(data => {
                const mapList = document.getElementById('mapList');
                data.forEach(map => {
                    const listItem = document.createElement('li');
                    listItem.className = 'list-group-item';
                    listItem.innerHTML = `${map}`;
                    // cargar el mapa seleccionado al hacer click en él 
                    listItem.addEventListener('click', function(){
                        document.getElementById('modal').remove();
                        cargarMapa(map);
                    });
                    mapList.appendChild(listItem);
                });
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


