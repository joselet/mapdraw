document.getElementById('save').addEventListener('click', function () {
    var geojson = mapconfig.drawnItems.toGeoJSON();
    var mapTitle = document.getElementById('mapTitle').value;

    geojson.features.forEach(function (feature) {
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
                    mapconfig.drawnItems.addLayer(layer);
                    if (layer instanceof L.Polygon) {
                        // no hacer nada, pero así los polígonos no tendrán flechas, ya que también son polilíneas
                    } else if (layer instanceof L.Polyline) {
                        addArrowheads(layer);
                    }
                    if (layer.setStyle) {
                        var style = layer.feature.properties.estilo;
                        layer.setStyle(style);
                        // añadir el texto si existe
                        if (style.texto){
                            layer.setText(style.texto,{center:true, orientation:style.textgiro,attributes: {fill: style.textcolor}});
                        }
                    } else if (layer.setIcon) {
                        var iconUrl = layer.feature.properties.estilo.iconUrl||'';
                        if (iconUrl==''){
                            layer.setIcon(new L.Icon.Default());
                        } else {
                            layer.setIcon(L.icon({ iconUrl: iconUrl }));
                        }
                        var rotationAngle = layer.feature.properties.estilo.rotationAngle;
                        layer.setRotationAngle(rotationAngle);
                    }
                    // Añadir click event
                    layer.on('click', function () {
                        populateDatosContent(layer);
                        populateEstiloContent(layer);
                    });
                }
            });
            updateGeoJSON();
        });
}

window.cargarMapa = cargarMapa; // Make cargarMapa globally accessible



// nueva funcion save (adaptar, porque falta comprobar que ejecuta todo el código de la función document.getElementById('save').addEventListener('click', function ())
function saveMap() {
    var geojson = mapconfig.drawnItems.toGeoJSON();
    var config = {
        view: mapconfig.view,
        addedOverlays: mapconfig.addedOverlays
    };

    fetch('save.php', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            features: geojson.features,
            config: config
        })
    })
    .then(response => response.text())
    .then(data => {
        console.log(data);
    })
    .catch(error => {
        console.error('Error:', error);
    });
}


// nueva funcion load (adaptar, porque falta comprobar que ejecuta todo el código de la función cargamapa anterior)
function loadMap(mapa) {
    fetch(`load.php?mapa=${mapa}`)
    .then(response => response.json())
    .then(data => {
        mapconfig.drawnItems.clearLayers();
        L.geoJSON(data.features, {
            onEachFeature: function (feature, layer) {
                mapconfig.drawnItems.addLayer(layer);
                layer.on('click', function () {
                    populateDatosContent(layer);
                    populateEstiloContent(layer);
                });
            }
        });

        if (data.config) {
            mapconfig.view = data.config.view;
            mapconfig.addedOverlays = data.config.addedOverlays;
            map.setView([mapconfig.view.lat, mapconfig.view.lng], mapconfig.view.zoom);
            // Load overlays if any
            for (var overlay in mapconfig.addedOverlays) {
                if (mapconfig.addedOverlays.hasOwnProperty(overlay)) {
                    // Add overlay to map
                }
            }
        }
    })
    .catch(error => {
        console.error('Error:', error);
    });
}

document.getElementById('config').addEventListener('click', function () {
    console.log(mapconfig);
    // crear ventana modal
    var modal = document.createElement('div');
    modal.id = 'modal-config';
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
    closeButton.setAttribute('onclick', 'document.getElementById("modal-config").remove()'); // Add onclick attribute
    modalContent.appendChild(closeButton);

    // opciones del menú de configuracion de mapa
    var html = `<h3 id="modalTitle">Configuración del mapa</h3>
                <button id="load" class="btn btn-info">Cargar Redline de otro mapa</button>
                <button id="loadOverlay" class="btn btn-secondary">Gestión de Overlay</button>
                <button id="export" class="btn btn-warning">Exportar Redline a GeoJSON</button>
                <div id="overlayList" style="display: none;">
                    <br><b>Listado de overlays disponibles: (click para añadir al mapa)</b>
                    <div id="overlayListDisponibles" class="list-group"></div>
                    <b>Overlays cargados: (click para eliminar del mapa)</b>
                    <div id="overlayListCargados" class="list-group"></div>
                </div>`;
    modalContent.innerHTML += html; // Use += to append the HTML without overwriting the close button
    modal.appendChild(modalContent);
    document.body.appendChild(modal);

    // hacer la ventana modal arrastrable solo desde el título
    var isDragging = false;
    var offsetX, offsetY;
    var modalTitle = document.getElementById('modalTitle');

    modalTitle.style.cursor = 'move'; // Change cursor to move for the title

    modalTitle.addEventListener('mousedown', function (e) {
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

    document.getElementById('load').addEventListener('click', function () {
        // mostrar listado de mapas disponibles en una ventana modal
        // crear ventana modal
        var modal = document.createElement('div');
        modal.id = 'modal-load';
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
        closeButton.setAttribute('onclick', 'document.getElementById("modal-load").remove()'); // Add onclick attribute
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

        modalTitle.addEventListener('mousedown', function (e) {
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
                    listItem.addEventListener('click', function () {
                        document.getElementById('modal-load').remove();
                        cargarMapa(map);
                    });
                    mapList.appendChild(listItem);
                });
            });
    });

    document.getElementById('loadOverlay').addEventListener('click', function () {
        // mostrar listado de overlays disponibles en una ventana modal
        var overlayList = document.getElementById('overlayList');
        overlayList.style.display = 'block';
        var overlayListDisponibles = document.getElementById('overlayListDisponibles');
        var overlayListCargados = document.getElementById('overlayListCargados');
        overlayListDisponibles.innerHTML = ''; // Clear previous list
        overlayListCargados.innerHTML = ''; // Clear previous list

        fetch('list_overlays.php')
            .then(response => response.json())
            .then(data => {
                data.forEach(overlay => {
                    const listItem = document.createElement('a');
                    listItem.className = 'list-group-item list-group-item-action';
                    listItem.innerHTML = `${overlay.titulo}`;
                    listItem.title = `${overlay.descripcion}`;
                    // cargar el overlay seleccionado al hacer click en él 
                    listItem.addEventListener('click', function () {
                        cargarOverlay(overlay);
                    });
                    overlayListDisponibles.appendChild(listItem);
                });

                // Add already added overlays to the list
                for (const [title, layer] of Object.entries(mapconfig.addedOverlays)) {
                    const listItem = document.createElement('a');
                    listItem.className = 'list-group-item list-group-item-action';
                    listItem.innerHTML = `${title}`;
                    listItem.addEventListener('click', function () {
                        // Remove the overlay from the map
                        map.removeLayer(layer);
                        delete mapconfig.addedOverlays[title];
                        listItem.remove();
                    });
                    overlayListCargados.appendChild(listItem);
                }
            });
    });

    document.getElementById('export').addEventListener('click', function () {
        var geojson = mapconfig.drawnItems.toGeoJSON();
        var dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(geojson));
        var downloadAnchorNode = document.createElement('a');
        downloadAnchorNode.setAttribute("href", dataStr);
        downloadAnchorNode.setAttribute("download", "map_data.geojson");
        document.body.appendChild(downloadAnchorNode); // required for firefox
        downloadAnchorNode.click();
        downloadAnchorNode.remove();
    });
});

function cargarOverlay(overlay) {

    // Obtener los bounds del wms a añadir
    fetch(overlay.cadena_wms+'&service=WMS&version=1.3.0&request=GetCapabilities')
    .then(response => response.text())
    .then(xmlText => {
        // procesar el XML y extraer los límites
        const parser = new DOMParser();
        const xmlDoc = parser.parseFromString(xmlText, "text/xml");
      
        // Buscar los elementos BoundingBox
        const boundingBox = xmlDoc.querySelector('BoundingBox[SRS="EPSG:4326"]');
        
        if (boundingBox) {
          const minx = parseFloat(boundingBox.getAttribute('minx'));
          const miny = parseFloat(boundingBox.getAttribute('miny'));
          const maxx = parseFloat(boundingBox.getAttribute('maxx'));
          const maxy = parseFloat(boundingBox.getAttribute('maxy'));
      
          // Crear el objeto bounds
          const bounds = [[miny, minx], [maxy, maxx]];
      
          // Ahora puedes adaptar tu mapa de Leaflet a esos bounds
          map.fitBounds(bounds);
        } else {
          console.error('No se encontraron los bounds en el servicio WMS.');
        }
    })
    .catch(error => console.error('Error al obtener GetCapabilities:', error));

    // añadir wms al mapa leaflet
    var wmsLayer = L.tileLayer.wms(overlay.cadena_wms, {
        layers: overlay.capas,
        format: 'image/png',
        transparent: true
    }).addTo(map);

    // Add to the list of added overlays
    mapconfig.addedOverlays[overlay.titulo] = wmsLayer;

    // Add to the overlay list in the UI
    var overlayListCargados = document.getElementById('overlayListCargados');
    var listItem = document.createElement('a');
    listItem.className = 'list-group-item list-group-item-action';
    listItem.innerHTML = `${overlay.titulo}`;
    listItem.title = `${overlay.descripcion}`;
    listItem.addEventListener('click', function () {
        // Remove the overlay from the map
        map.removeLayer(wmsLayer);
        delete mapconfig.addedOverlays[overlay.titulo];
        listItem.remove();
    });
    overlayListCargados.appendChild(listItem);
}





