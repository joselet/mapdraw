# Changelog

All notable changes to this project will be documented in this file.

## [Unreleased]
- gestión de mapas por usuario (actualmente todos los mapas son para todos los usuarios)
- manejo de estilos de los elementos (resto de elementos)
- añadir al estilo del marker la posición del ancla.
- cambiar el sistema de coordenadas
- Almacenar y cargarlos settings del mapa (servicios WMS cargados, sistema de coordenadas... zoom y posición...) 



## [0.0.12] - 2025-02-24
### Added
- libreria jquery (aunque de momento no se utiliza)

## [0.0.11] - 2025-02-18
### Added
- Preparar Estructura de mapa (configuracion de vista y zoom, overlays existentes, ...). Faltará que al cargar un mapa, se recupere y se aplique toda esa configuracion.
- Rotación de los textos en relación a la línea que los contiene.
### Changed
- Al cargar un Overlay, el zoom se adapta a las dimensiones de ese overlay (solucionar problema CORS)


## [0.0.10] - 2025-02-18
### Added
- Cargar Overlays de WMS.
### Changed
- Ventana modal de configuraciónd del mapa ahora gestiona las otras opciones.

## [0.0.9] - 2025-02-13
### Added
- Etiquetado en polilineas.

## [0.0.8] - 2025-02-13
### Changed
- Revisión inicial del estilo de markers.
- Separamos ficheros js para tenerlos por temas.

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
