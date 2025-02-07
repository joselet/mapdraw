# Estructura de BD
```
CREATE TABLE map_features (
    id SERIAL PRIMARY KEY,
    mapa TEXT,
    geom GEOMETRY,
    estilo TEXT,
    datos TEXT
);
```