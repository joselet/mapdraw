function populateDatosContent(layer) {
    var datosContent = document.getElementById('tabDatos-content');
    datosContent.innerHTML = ''; // Clear existing content

    var properties = layer.feature.properties.datos || {};
    for (var key in properties) {
        if (properties.hasOwnProperty(key)) {
            var div = document.createElement('div');
            div.className = 'form-group';
            div.innerHTML = `
                <div class="col">
                    <input type="text" class="form-control" value="${key}" data-key="${key}" data-type="key">
                </div>
                <div class="col">
                    <input type="text" class="form-control" value="${properties[key]}" data-key="${key}" data-type="value">
                </div>
                <button class="btn btn-delete">-</button>
            `;
            datosContent.appendChild(div);

            div.querySelector('.btn-delete').addEventListener('click', function () {
                delete layer.feature.properties.datos[key];
                populateDatosContent(layer);
                updateGeoJSON();
            });
        }
    }
    datosContent.appendChild(document.createElement('hr'));
    datosContent.append(document.createTextNode('Añadir:'));
    // Add new field form
    var newFieldDiv = document.createElement('div');
    newFieldDiv.className = 'form-group';
    newFieldDiv.innerHTML = `
        <div class="col">
            <input type="text" class="form-control" id="newFieldName" placeholder="Nombre del campo">
        </div>
        <div class="col">
            <input type="text" class="form-control" id="newFieldValue" placeholder="Valor del campo">
        </div>
        <button class="btn btn-add">+</button>
    `;
    datosContent.appendChild(newFieldDiv);

    document.querySelector('.btn-add').addEventListener('click', function () {
        var fieldName = document.getElementById('newFieldName').value;
        var fieldValue = document.getElementById('newFieldValue').value;
        if (fieldName && fieldValue) {
            layer.feature.properties.datos[fieldName] = fieldValue;
            populateDatosContent(layer);
            updateGeoJSON();
        }
    });

    // Update layer properties on input change
    datosContent.querySelectorAll('input[data-key]').forEach(input => {
        input.addEventListener('input', function () {
            var key = this.getAttribute('data-key');
            var type = this.getAttribute('data-type');
            if (type === 'key') {
                var newKey = this.value;
                layer.feature.properties.datos[newKey] = layer.feature.properties.datos[key];
                delete layer.feature.properties.datos[key];
                populateDatosContent(layer);
            } else {
                layer.feature.properties.datos[key] = this.value;
            }
            updateGeoJSON();
        });
    });
}

