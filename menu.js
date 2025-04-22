let lastExpandedWidth = 400; // Default expanded width

function maximiza(){
    menuContainer.style.width = lastExpandedWidth + 'px';
    menuTab.innerHTML = '&gt;';
}
function minimiza(){
    lastExpandedWidth = menuContainer.style.width.replace('px', '');
    menuContainer.style.width = '10px';
    menuTab.innerHTML = '&lt;';
}

document.addEventListener('DOMContentLoaded', function() {
    const urlParams = new URLSearchParams(window.location.search);
    const mapa = urlParams.get('mapa');
    if (mapa) {
        document.getElementById('mapTitle').value = mapa;
        cargarMapa(mapa); // Call cargarMapa directly
    }

    const menuContainer = document.getElementById('menuContainer');
    const menuTab = document.getElementById('menuTab');
    const menuContainerSizer = document.getElementById('menuContainerSizer');
    // desplegar y plegar el contenedor de menú
    menuTab.addEventListener('click', function() {
        if (menuContainer.style.width === '10px') {
            maximiza();
        } else {
            minimiza();
        }
    });
    // redimensionar el contenedor de menú
    let isResizing = false;
    menuContainerSizer.addEventListener('mousedown', function(e) {
        isResizing = true;
        document.addEventListener('mousemove', resize);
        document.addEventListener('mouseup', stopResize);
    });

    function resize(e) {
        if (isResizing) {
            const newWidth = window.innerWidth - e.clientX;
            menuContainer.style.width = newWidth + 'px';
        }
    }

    function stopResize() {
        isResizing = false;
        document.removeEventListener('mousemove', resize);
        document.removeEventListener('mouseup', stopResize);
    }

    // Tab switching functionality
    const tabs = document.querySelectorAll('.menu-header div');
    const contents = document.querySelectorAll('.menu-body');

    tabs.forEach(tab => {
        tab.addEventListener('click', function() {
            tabs.forEach(t => t.classList.remove('active'));
            contents.forEach(c => c.style.display = 'none');

            tab.classList.add('active');
            document.getElementById(tab.id + '-content').style.display = 'block';
        });
    });

    // Set default active tab
    document.getElementById('tabDatos').click();
});
