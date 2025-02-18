# Estructura de BD
```
CREATE TABLE map_features (
    id SERIAL PRIMARY KEY,
    mapa TEXT,
    geom GEOMETRY,
    estilo TEXT,
    datos TEXT
);

CREATE TABLE map_conexiones (
    id SERIAL PRIMARY KEY,
    titulo TEXT,
    descripcion TEXT,
    cadena_wms TEXT,
    capas TEXT
);


```