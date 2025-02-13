function populateEstiloContent(layer) {
    var estiloContent = document.getElementById('tabEstilo-content');
    estiloContent.innerHTML = ''; // Clear existing content

    var properties = layer.feature.properties.estilo || {};
    var styleOptions = layer.options || {};

    // Add style options based on layer type
    if (layer instanceof L.Marker) {
        var iconUrl = properties.iconUrl || styleOptions.icon.options.iconUrl || '';
        var rotationAngle = properties.rotationAngle || 0;
        var div = document.createElement('div');
        div.className = 'form-estilo';
        div.innerHTML = `
            <label>Icon URL</label>
            <input type="text" class="form-control" value="${iconUrl}" data-key="iconUrl">
            <label>Rotation Angle</label>  
            <input type="number" class="form-control" value="${rotationAngle}" data-key="rotationAngle">
            <label>Marker Gallery</label>
            <div class="marker-gallery" id="markerGallery"></div>
            <button class="btn btn-reset">Reset to Default</button>
        `;
        estiloContent.appendChild(div);

        // Load marker gallery
        var markerGallery = document.getElementById('markerGallery');
        for (var i = 1; i <= 2; i++) {
            var img = document.createElement('img');
            img.src = `markers/${i}.png`;
            img.className = 'marker-icon';
            img.addEventListener('click', function () {
                var iconUrl = this.src;
                properties.iconUrl = iconUrl;
                layer.setIcon(L.icon({ iconUrl: iconUrl }));
                updateGeoJSON();
            });
            markerGallery.appendChild(img);
        }

        div.querySelector('input[data-key="iconUrl"]').addEventListener('input', function () {
            var key = this.getAttribute('data-key');
            properties[key] = this.value;
            layer.setIcon(L.icon({ iconUrl: this.value }));
            updateGeoJSON();
        });

        div.querySelector('input[data-key="rotationAngle"]').addEventListener('input', function () {
            var key = this.getAttribute('data-key');
            properties[key] = this.value;
            layer.setRotationAngle(properties.rotationAngle);
            updateGeoJSON();
        });

        div.querySelector('.btn-reset').addEventListener('click', function () {
            layer.setIcon(new L.Icon.Default());
            properties.iconUrl = '';
            properties.rotationAngle = 0;
            layer.setRotationAngle(0);
            updateGeoJSON();
            populateEstiloContent(layer); // Refresh the style content
        });
    } else if (layer instanceof L.Polygon) {
        var fillColor = properties.fillColor || styleOptions.fillColor || '#3388ff';
        var fillOpacity = properties.fillOpacity || styleOptions.fillOpacity || 0.2;
        var color = properties.color || styleOptions.color || '#3388ff';
        var weight = properties.weight || styleOptions.weight || 4;
        var opacity = properties.opacity || styleOptions.opacity || 0.5;
        var dashArray = properties.dashArray || styleOptions.dashArray || '5, 5';
        var lineCap = properties.lineCap || styleOptions.lineCap || 'round';
        var lineJoin = properties.lineJoin || styleOptions.lineJoin || 'round';

        var div = document.createElement('div');
        div.className = 'form-estilo';
        div.innerHTML = `
            <b>Polygon</b><br>
            <label>Fill Color</label>
            <input type="color" class="form-control" value="${fillColor}" data-key="fill_color" id="fillcolor"><br>
            <label>Fill Opacity</label>
            <input type="number" step="0.1" class="form-control" value="${fillOpacity}" data-key="fill_opacity" id="fillopacity"><br>
            <label>Color</label>
            <input type="color" class="form-control" value="${color}" data-key="color" id="color"><br>
            <label>Weight</label>
            <input type="number" class="form-control" value="${weight}" data-key="weight" id="weight"><br>
            <label>Opacity</label>
            <input type="number" step="0.1" class="form-control" value="${opacity}" data-key="opacity" id="opacity"><br>
            <label>Dash Array</label>
            <input type="text" class="form-control" value="${dashArray}" data-key="dashArray" id="dashArray"><br>
            <label>Line Cap</label>
            <select class="form-control" data-key="lineCap" id="lineCap">
                <option value="${lineCap}" selected>${lineCap}</option>
                <option value="butt">Butt</option>
                <option value="round">Round</option>
                <option value="square">Square</option>
            </select><br>
            <label>Line Join</label>
            <select class="form-control" data-key="lineJoin" id="lineJoin">
                <option value="${lineJoin}" selected>${lineJoin}</option>
                <option value="miter">Miter</option>
                <option value="round">Round</option>
                <option value="bevel">Bevel</option>
            </select>
        `;
        estiloContent.appendChild(div);
        div.querySelectorAll('input').forEach(input => {
            input.addEventListener('input', function () {
                var key = this.getAttribute('data-key');
                properties[key] = this.value;
                console.log(this.value);
                var style = ({
                    fillColor: properties.fill_color || styleOptions.fillColor,
                    fillOpacity: properties.fill_opacity || styleOptions.fillOpacity,
                    color: properties.color || styleOptions.color,
                    weight: properties.weight || styleOptions.weight,
                    opacity: properties.opacity || styleOptions.opacity,
                    dashArray: properties.dashArray || styleOptions.dashArray,
                    lineCap: properties.lineCap || styleOptions.lineCap,
                    lineJoin: properties.lineJoin || styleOptions.lineJoin
                });
                layer.setStyle(style);
                layer.feature.properties.estilo = style;
                updateGeoJSON();
            });
        });
        div.querySelectorAll('select').forEach(select => {
            select.addEventListener('change', function () {
                var key = this.getAttribute('data-key');
                properties[key] = this.value;
                var style = {
                    color: properties.color || styleOptions.color,
                    weight: properties.weight || styleOptions.weight,
                    opacity: properties.opacity || styleOptions.opacity,
                    dashArray: properties.dashArray || styleOptions.dashArray,
                    lineCap: properties.lineCap || styleOptions.lineCap,
                    lineJoin: properties.lineJoin || styleOptions.lineJoin
                };
                layer.setStyle(style);
                layer.feature.properties.estilo = style;
                updateGeoJSON();
            });
        });

    } else if (layer instanceof L.Polyline) {
        var color = properties.color || styleOptions.color || '#3388ff';
        var weight = properties.weight || styleOptions.weight || 4;
        var opacity = properties.opacity || styleOptions.opacity || 0.5;
        var dashArray = properties.dashArray || styleOptions.dashArray || '5, 5';
        var lineCap = properties.lineCap || styleOptions.lineCap || 'round';
        var lineJoin = properties.lineJoin || styleOptions.lineJoin || 'round';
        var texto = properties.texto || styleOptions.texto || '';
        var div = document.createElement('div');
        div.className = 'form-estilo';
        div.innerHTML = `
            <b>Línea</b><br><label>Color</label>
            <input type="color" class="form-control" value="${color}" data-key="color" id="color"><br>
            <label>Weight</label>
            <input type="number" class="form-control" value="${weight}" data-key="weight" id="weight"><br>
            <label>Opacity</label>
            <input type="number" step="0.1" class="form-control" value="${opacity}" data-key="opacity" id="opacity"><br>
            <label>Dash Array</label>
            <input type="text" class="form-control" value="${dashArray}" data-key="dashArray" id="dashArray"><br>
            <label>Line Cap</label>
            <select class="form-control" data-key="lineCap" id="lineCap">
                <option value="${lineCap}" selected>${lineCap}</option>
                <option value="butt">Butt</option>
                <option value="round">Round</option>
                <option value="square">Square</option>
            </select><br>
            <label>Line Join</label>
            <select class="form-control" data-key="lineJoin" id="lineJoin">
                <option value="${lineJoin}" selected>${lineJoin}</option>
                <option value="miter">Miter</option>
                <option value="round">Round</option>
                <option value="bevel">Bevel</option>
            </select>
            <label>Texto sobre la línea</label>
            <input type="text" class="form-control" value="${texto}" data-key="texto" id="texto"><br>
            
        `;
        estiloContent.appendChild(div);
        div.querySelectorAll('input').forEach(input => {
            input.addEventListener('input', function () {
                var key = this.getAttribute('data-key');
                properties[key] = this.value;
                console.log(this.value);
                var style = ({
                    color: properties.color || styleOptions.color,
                    weight: properties.weight || styleOptions.weight,
                    opacity: properties.opacity || styleOptions.opacity,
                    dashArray: properties.dashArray || styleOptions.dashArray,
                    lineCap: properties.lineCap || styleOptions.lineCap,
                    lineJoin: properties.lineJoin || styleOptions.lineJoin,
                    texto: properties.texto || styleOptions.texto
                });
                layer.setStyle(style);
                layer.feature.properties.estilo = style;
                // añadir el texto si existe
                if (style.texto){
                    layer.setText(style.texto,{center:true,});
                }
                updateGeoJSON();
            });
        });
        div.querySelectorAll('select').forEach(select => {
            select.addEventListener('change', function () {
                var key = this.getAttribute('data-key');
                properties[key] = this.value;
                var style = {
                    color: properties.color || styleOptions.color,
                    weight: properties.weight || styleOptions.weight,
                    opacity: properties.opacity || styleOptions.opacity,
                    dashArray: properties.dashArray || styleOptions.dashArray,
                    lineCap: properties.lineCap || styleOptions.lineCap,
                    lineJoin: properties.lineJoin || styleOptions.lineJoin
                };
                layer.setStyle(style);
                layer.feature.properties.estilo = style;
                updateGeoJSON();
            });
        });

        /*
        div.querySelector('select').addEventListener('change', function () {
            var key = this.getAttribute('data-key');
            properties[key] = this.value;
            var style = ({
                color: properties.color || styleOptions.color,
                weight: properties.weight || styleOptions.weight,
                opacity: properties.opacity || styleOptions.opacity,
                dashArray: properties.dashArray || styleOptions.dashArray,
                lineCap: properties.lineCap || styleOptions.lineCap,
                lineJoin: properties.lineJoin || styleOptions.lineJoin
            });
            layer.setStyle(style);
            layer.feature.properties.estilo = style;
            updateGeoJSON();
        });
*/

/*
    } else if (layer instanceof L.Polygon) {
        var color = properties.color || styleOptions.color || '#3388ff';
        var fillColor = properties.fillColor || styleOptions.fillColor || '#3388ff';
        var weight = properties.weight || styleOptions.weight || 4;
        var opacity = properties.opacity || styleOptions.opacity || 0.5;
        var fillOpacity = properties.fillOpacity || styleOptions.fillOpacity || 0.2;

        var div = document.createElement('div');
        div.className = 'form-estilo';
        div.innerHTML = `
            <label>Border Color</label>
            <input type="color" class="form-control" value="${color}" data-key="color">
            <label>Fill Color</label>
            <input type="color" class="form-control" value="${fillColor}" data-key="fillColor">
            <label>Weight</label>
            <input type="number" class="form-control" value="${weight}" data-key="weight">
            <label>Opacity</label>
            <input type="number" step="0.1" class="form-control" value="${opacity}" data-key="opacity">
            <label>Fill Opacity</label>
            <input type="number" step="0.1" class="form-control" value="${fillOpacity}" data-key="fillOpacity">
        `;
        estiloContent.appendChild(div);

        div.querySelectorAll('input').forEach(input => {
            input.addEventListener('input', function () {
                var key = this.getAttribute('data-key');
                properties[key] = this.value;
                layer.setStyle({
                    color: properties.color,
                    fillColor: properties.fillColor,
                    weight: properties.weight,
                    opacity: properties.opacity,
                    fillOpacity: properties.fillOpacity
                });
                updateGeoJSON();
            });
        });
*/
    } else if (layer instanceof L.Circle) {
        var color = properties.color || styleOptions.color || '#3388ff';
        var fillColor = properties.fillColor || styleOptions.fillColor || '#3388ff';
        var weight = properties.weight || styleOptions.weight || 4;
        var opacity = properties.opacity || styleOptions.opacity || 0.5;
        var fillOpacity = properties.fillOpacity || styleOptions.fillOpacity || 0.2;
        var radius = properties.radius || layer.getRadius() || 100;

        var div = document.createElement('div');
        div.className = 'form-estilo';
        div.innerHTML = `
            <label>Border Color</label>
            <input type="color" class="form-control" value="${color}" data-key="color">
            <label>Fill Color</label>
            <input type="color" class="form-control" value="${fillColor}" data-key="fillColor">
            <label>Weight</label>
            <input type="number" class="form-control" value="${weight}" data-key="weight">
            <label>Opacity</label>
            <input type="number" step="0.1" class="form-control" value="${opacity}" data-key="opacity">
            <label>Fill Opacity</label>
            <input type="number" step="0.1" class="form-control" value="${fillOpacity}" data-key="fillOpacity">
            <label>Radius</label>
            <input type="number" class="form-control" value="${radius}" data-key="radius">
        `;
        estiloContent.appendChild(div);

        div.querySelectorAll('input').forEach(input => {
            input.addEventListener('input', function () {
                var key = this.getAttribute('data-key');
                properties[key] = this.value;
                layer.setStyle({
                    color: properties.color,
                    fillColor: properties.fillColor,
                    weight: properties.weight,
                    opacity: properties.opacity,
                    fillOpacity: properties.fillOpacity
                });
                layer.setRadius(properties.radius);
                updateGeoJSON();
            });
        });
    }

    layer.feature.properties.estilo = properties;
}
