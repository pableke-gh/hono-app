# hono-app

Node.js/TypeScript web application with modular architecture for scalable, maintainable development.

## Estructura del Proyecto

- **src/**: Lógica principal de la app
	- **components/**: Componentes UI reutilizables (`.tsx`)
	- **controllers/**: Lógica de rutas y controladores (`.tsx`)
	- **dao/**: Acceso a datos (SQLite y Supabase)
	- **layouts/**: Plantillas de página
	- **routes/**: Definición de rutas
	- **lib/**: Utilidades y mailer
	- **i18n/**: Archivos de internacionalización
	- **public/**: Assets estáticos (CSS, JS, imágenes)
- **views/**: Vistas HTML/XHTML organizadas por módulo/feature
- **types/**: Tipos TypeScript compartidos
- **tests/**: Archivos de pruebas

## Instalación y Ejecución

```bash
npm install
npm run dev
```

Abre la app en: [http://localhost:3000](http://localhost:3000)

## Workflows de Desarrollo

- **Instalar dependencias**: `npm install`
- **Servidor de desarrollo**: `npm run dev`
- **Pruebas**: Archivos en `tests/` (usa tu test runner Node.js preferido)
- **Build**: Configuración en `tsconfig.json` y `gulpfile.js`

## Patrones y Convenciones

- Usa TypeScript para nuevo código (`types/` para tipos comunes)
- Componentes UI en `.tsx`, lógica/utilidades en `.js`
- Acceso a datos solo vía DAOs (no accedas a DB directo desde controladores)
- Internacionalización centralizada en `src/i18n/`
- Assets estáticos en `src/public/`
- Organización modular: cada feature tiene carpeta propia en `views/`, `controllers/`, etc.

## Integraciones y Puntos Clave

- **Base de datos**: SQLite y Supabase (`src/dao/`)
- **Mailer**: `src/lib/mailer.js`
- **i18n**: `src/i18n/`

## Ejemplos de Extensión

- Nueva página: crea vista en `views/`, controlador en `src/controllers/`, y ruta en `src/routes/`
- Nuevo DAO: implementa en `src/dao/sqlite/` o `src/dao/supabase/` y registra en `src/dao/factory.js`

## Archivos y Referencias Clave

- `README.md`: este archivo
- `.github/copilot-instructions.md`: guía para agentes AI
- `tsconfig.json`, `gulpfile.js`: configuración de build
- `src/dao/factory.js`: registro de DAOs

---

Para dudas, revisa módulos similares y sigue la estructura existente. Prefiere composición sobre duplicación. Si contribuyes, mantén la organización modular y las convenciones del proyecto.
