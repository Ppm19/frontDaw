# Proyecto Tienda Online - TechWorld

Bienvenido al repositorio de **TechWorld**, una moderna aplicación de comercio electrónico desarrollada con Angular. Esta plataforma permite a los usuarios explorar, buscar y comprar productos tecnológicos, como móviles y accesorios, de una manera intuitiva y eficiente.

## 🚀 Descripción

**TechWorld** es una Single-Page Application (SPA) diseñada para ofrecer una experiencia de usuario fluida y dinámica. La tienda cuenta con una interfaz limpia, un diseño responsive que se adapta a cualquier dispositivo (móvil, tablet y escritorio) y funcionalidades clave para facilitar la navegación y la compra de productos.

## ✨ Características Principales

- **Catálogo de Productos Dinámico:** Muestra productos cargados desde un servicio, organizados por categorías.
- **Diseño Totalmente Responsive:**
  - **Menú de Navegación Adaptable:** Un menú superior que cambia de estilo al hacer scroll y se transforma en un menú lateral deslizable en dispositivos móviles.
  - **Cuadrículas de Productos Flexibles:** El layout de los productos se ajusta automáticamente, pasando de 4 columnas en escritorio a 2 en tablets y 1 en móviles.
  - **Footer Inteligente:** El pie de página se reorganiza de un formato de varias columnas a un diseño compacto de 2x2 en pantallas pequeñas.
- **Búsqueda en Tiempo Real:** Un buscador funcional en cada vista de productos (`Todos`, `Móviles`, `Accesorios`) que filtra los resultados al instante mientras el usuario escribe.
- **Componentes Modulares:** La aplicación está construida utilizando una arquitectura basada en componentes de Angular, lo que facilita su mantenimiento y escalabilidad.
- **Estilo Personalizado con Angular Material:** Se utilizan componentes de Angular Material con estilos personalizados para mantener una coherencia visual y una estética moderna, respetando la paleta de colores de la marca.

## 🛠️ Tecnologías Utilizadas

- **[Angular](https://angular.io/):** Framework principal para la construcción de la aplicación.
- **[Angular Material](https://material.angular.io/):** Suite de componentes UI para un diseño consistente y de alta calidad.
- **[TypeScript](https://www.typescriptlang.org/):** Lenguaje de programación principal.
- **CSS3:** Para los estilos personalizados y el diseño responsive, utilizando variables para una fácil gestión del tema.
- **HTML5:** Para la estructura semántica del contenido.

## 📂 Estructura del Proyecto

El proyecto sigue la estructura estándar de un proyecto de Angular, con los componentes principales ubicados en `src/app/`:

```
/src
|-- /app
|   |-- /admin-productos     # Componente para la gestión de productos (futuro).
|   |-- /carrito             # Componente para el carrito de compras (futuro).
|   |-- /detalles-producto   # Componente para mostrar los detalles de un producto.
|   |-- /footer              # Componente del pie de página.
|   |-- /lista-accesorios    # Componente para listar solo accesorios.
|   |-- /lista-moviles       # Componente para listar solo móviles.
|   |-- /lista-productos     # Componente principal para listar todos los productos.
|   |-- /login-registro      # Componente para la autenticación de usuarios.
|   |-- /menu-inicio         # Componente del menú de navegación principal.
|   |-- /menu-productos      # Componente del menú lateral de categorías.
|   |-- /models              # Definiciones de las interfaces (Producto, Usuario, etc.).
|   |-- carrito.service.ts   # Servicio para gestionar el estado del carrito.
|   |-- login-registro.service.ts # Servicio para la autenticación.
|   |-- productos.service.ts # Servicio para la obtención de datos de productos.
|-- /assets                  # Para imágenes, iconos y otros recursos estáticos.
|-- /styles                  # Estilos globales y variables de CSS.
```

## ⚙️ Instalación y Uso

Sigue estos pasos para levantar el proyecto en un entorno de desarrollo local.

**Requisitos previos:**
- Node.js (versión 18 o superior)
- Angular CLI (versión 17 o superior)

**1. Clona el repositorio:**
```bash
git clone https://github.com/ppm19/frontDaw.git
cd frontDaw
```

**2. Instala las dependencias:**
```bash
npm install
```

**3. Inicia el servidor de desarrollo:**
```bash
ng serve -o
```
La aplicación se abrirá automáticamente en tu navegador en `http://localhost:4200/`.