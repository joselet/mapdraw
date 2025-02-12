# Changelog

All notable changes to this project will be documented in this file.

## [Unreleased]
- gestión de mapas por usuario (actualmente todos los mapas son para todos los usuarios)
- manejo de estilos de los elementos (resto de elementos)
- gestión de estilo cuando un feature es un marker

## [0.0.7] - 2025-02-12
### Changed
- Estilo de polígono revisado.

## [0.0.6] - 2025-02-11
### Added
- Los estilos de las líneas se gestionan en su propia pestaña y se genera el geojson correspondiente.
- Al cargar el mapa, se aplican estilos.

## [0.0.5] - 2025-02-07
### Added
- Añadida la opción de gestión de datos en el menú de la derecha.
- Al grabar y al cargar, se gestionan estos datos correctamente.

## [0.0.4] - 2025-02-07
### Added
- Mejorado el menú de la derecha para soportar diferentes opciones

## [0.0.3] - 2025-02-07
### Changed
- Al click en el botón cargar: cargar elementos de X mapa (a elegir por el usuario)
- Al iniciar un mapa ya existente, la llamada a la función cargar no debería ir a buscar el botón cargar. sinó simplemente cargar de el mapa solicitado.

## [0.0.2] - 2025-02-06
### Changed
- Estructura de base de datos. Ahora almacena un campo para controlar el identificador de mapa.
### Added
- Pantalla inicial para seleccionar y cargar el mapa.
- El mapa debe tener un título y al grabar se almacenan los elementos actuales existentes en el mapa, sobreescribiendo en la base de datos todos los elementos con ese identificador.
- Pantalla lateral mostrando el dato de geojson existente en el mapa


## [0.0.1] - 2025-02-02
### Added
- Versión semi-funcional


---

### Added
- 

### Changed
- 

### Fixed
- 
