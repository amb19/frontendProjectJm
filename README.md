# Nombre del Proyecto

Pagina web Venta de Productos

## Descripción:
Este proyecto es una página web básica desarrollada como parte de un curso de Front-End.
La página está estructurada con HTML semántico y utiliza las etiquetas `<header>`,
`<main>`, y `<footer>` para organizar el contenido. El objetivo es aprender a crear la
estructura básica de una página web y prepararla para futuras mejoras con CSS y
JavaScript.

## Project Structure
```
proyecto-de-comercio-electrónico-en-javascript
├── index.html           # Muestra información detallada sobre la web y productos.
├── src                  # Recursos multimedia, imagenes
│── js
│   ├── script.js        # Gestiona la interactividad, la validación de formularios y la manipulación del DOM.
│── css
│   └── styles.css       # Estilos para la página web.
├── pages
│   ├── video.html       # Archivo multimedia de la pagina.   
│   └── contacto.html    # Proporciona un formulario para consultas
├── .gitignore           # Especifica los archivos que se deben ignorar en el control de versiones.
└── README.md            # Documentación del proyecto.
```

## Características
- **Visualización de productos**: atractivas fichas de productos que muestran imágenes, nombres y precios.
- **Carrito de la compra**: los usuarios pueden añadir productos a su carrito, actualizar cantidades y eliminar artículos. Los datos del carrito se almacenan para su persistencia.
- **Validación de formularios**: garantiza que las entradas del usuario sean válidas antes de su envío.
- **Obtención dinámica de datos**: utiliza la API Fetch para recuperar datos de productos de una API REST, lo que permite actualizaciones en tiempo real y una experiencia de usuario dinámica.
- **Diseño responsivo**: la aplicación está diseñada para ser compatible con dispositivos móviles, lo que garantiza su usabilidad en diversos dispositivos.

## Uso
- Explore los productos en la página de inicio.
- Haga clic en un producto para ver más detalles y añadirlo a su carrito.
- Acceda al carrito de la compra para revisar los artículos seleccionados.