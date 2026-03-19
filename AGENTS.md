# MTC Rules Exam App

Aplicación web de simulación del examen de reglas de tránsito del Ministerio de Transportes y Comunicaciones (MTC) del Perú.

## Stack Tecnológico

- **Frontend**: HTML5, CSS3, JavaScript (ES6+)
- **Arquitectura**: SPA (Single Page Application) con router basado en hash
- **Almacenamiento**: localStorage para persistencia de datos
- **Gráficos**: Chart.js para estadísticas
- **Fuentes**: Google Fonts (Press Start 2P, VT323)
- **Sin frameworks**: Vanilla JavaScript puro

## Estructura del Proyecto

```
mtc-rules-exam-app/
├── index.html                    # Punto de entrada HTML
├── css/
│   ├── main.css                  # Variables CSS, layout base, header/footer
│   ├── components.css            # Botones, cards, inputs, badges, modals
│   ├── animations.css            # Keyframes y animaciones
│   ├── pages.css                 # Estilos por página/vista
│   └── modal.css                 # Sistema de modales personalizados
├── js/
│   ├── app.js                    # Punto de entrada JS, initialization
│   ├── router.js                 # SPA router con transiciones
│   ├── storage.js               # Gestión de localStorage
│   ├── data/
│   │   ├── preguntas.json        # 200 preguntas originales del examen MTC
│   │   └── questions.js          # Questions exportadas en formato JS
│   ├── components/
│   │   ├── index.js              # Exports de componentes
│   │   ├── modal.js              # Sistema de modales personalizados (clase Modal)
│   │   └── meta.js               # Gestión dinámica de meta tags para SEO
│   └── views/
│       ├── index.js              # Exports de todas las vistas
│       ├── home.js               # Página principal con selección de modo
│       ├── name.js               # Página de ingreso de nombre
│       ├── intro.js              # Reglas del examen de práctica
│       ├── exam.js               # Examen de práctica (200 preguntas, sin timer)
│       ├── results.js            # Resultados y revisión de respuestas
│       ├── attempts.js           # Historial de intentos
│       ├── stats.js              # Estadísticas con Chart.js
│       ├── review.js             # Modo repaso (preguntas falladas)
│       ├── simulator-intro.js     # Reglas del simulador MTC
│       └── simulator.js           # Simulador MTC (40 preguntas, 40 min timer)
└── assets/                       # Imágenes de preguntas y OG para SEO
    ├── pregunta_X.png            # Imágenes de preguntas (X = ID)
    ├── menu-start.png            # OG image para página principal
    ├── practica-exam.png         # OG image para modo práctica
    ├── simulacion-exam.png       # OG image para simulador MTC
    ├── stats.png                 # OG image para estadísticas
    └── attempts.png              # OG image para historial de intentos
```

## Features Implementadas

### 1. Página de Inicio
- Animación retro de autos en carretera
- Dos modos de examen disponibles:
  - **Modo Práctica**: 200 preguntas, sin límite de tiempo
  - **Simulador MTC**: 40 preguntas, 40 minutos de tiempo límite
- Estética retro/arcade de los 90s con efectos CRT y scanlines

### 2. Sistema de Usuarios
- Ingreso de nombre para nuevos usuarios
- Datos guardados en localStorage
- Persistencia entre sesiones

### 3. Modo Práctica (Examen Regular)
- 200 preguntas aleatorias de la banca de preguntas
- Sin límite de tiempo
- Progreso guardado automáticamente en cada respuesta
- Navegación por dots para ver preguntas respondidas
- **70% para aprobar** (140 de 200 correctas)
- Revisión de respuestas al finalizar

### 4. Simulador MTC
- 40 preguntas aleatorias de la banca de 200
- Timer de 40 minutos
- **Auto-submit** cuando el tiempo llega a 0
- Preguntas sin responder se marcan como incorrectas
- **35 correctas para aprobar** (solo 5 errores permitidos)
- Indicador visual del timer:
  - Normal: cyan
  - < 5 minutos: amarillo + pulso lento
  - < 1 minuto: rojo + pulso rápido
- Sin poder regresar a preguntas anteriores

### 5. Sistema de Resultados
- Indicador visual de aprobación (verde/rojo)
- Score circle con porcentaje
- Desglose de respuestas correctas/incorrectas
- Para simulador: muestra "Sin responder"
- Revisión de cada respuesta con opciones coloreadas
- Filtros: Todas / Correctas / Incorrectas
- Botón para reintentar (va al modo correspondiente)

### 6. Historial de Intentos
- Lista de todos los exámenes realizados
- Badges diferenciados: "PRÁCTICA" vs "SIMULADOR"
- Barra de progreso visual
- Intentos de simulador con borde naranja
- Estadísticas resumidas (total, promedio, mejor, aprobados)
- Ver respuestas, revisar fallos, eliminar intento

### 7. Modo Repaso
- Practicar solo las preguntas falladas
- Acceso rápido desde historial de intentos
- Progreso de repaso guardado

### 8. Estadísticas
- Gráficos de barras con Chart.js
- Top 10 preguntas con mayor tasa de acierto
- Top 10 preguntas con menor tasa de acierto
- Resumen general (total correctas, incorrectas, intentos)

### 9. Sistema de Modales
- Alternativa a `alert()` y `confirm()` nativos
- Tipos: info, warning, danger, success
- Botones configurables
- Estilo retro consistente con la app

### 10. Transiciones y Animaciones
- Transiciones de página suaves
- Animación de entrada/salida de preguntas
- Efectos de hover en botones y cards
- Animación de cars y estrada en home

## Reglas del Proyecto

### Convenciones de Código
- **CSS**: No usar `!important` - usar especificidad y selectores más precisos
- **Comentarios**: NO agregar comentarios al código a menos que el usuario lo solicite explícitamente
- **Nomenclatura**: camelCase para variables y funciones, PascalCase para componentes/clases
- **Módulos**: Usar ES6 modules (import/export)
- **Estado**: Usar localStorage para toda la persistencia, NO usar cookies ni backend

### Arquitectura SPA
- Router basado en hash (`#route` / `#route/params`)
- Transiciones animadas entre páginas usando `#transition-overlay`
- Estado del examen (`examState`, `simulatorState`) gestionado en `router.js`
- Cada vista es una función `render*` que actualiza `#main-content`

### Gestión de Exámenes
- El examen inicia con estado `{ started: true, currentQuestion: 1, answers: [] }`
- El estado se actualiza en cada respuesta (`setExamState` / `setSimulatorState`)
- Al finalizar, se limpia el estado y se navega a resultados
- Las preguntas se shuffling al inicio usando `Math.random()`
- Las respuestas se guardan con: `questionIndex`, `questionId`, `selectedIndex`, `isCorrect`

### Flags de Intento
- `isSimulator`: boolean - indica si es examen de simulador
- `isReview`: boolean - indica si es intento de modo repaso
- `wasAutoSubmitted`: boolean - indica si el simulador terminó por tiempo
- `unanswered`: boolean - indica si una respuesta no fue seleccionada

### Estilos CSS
- Variables CSS en `:root` para colores y fuentes
- Clases utilitarias: `.card`, `.btn`, `.badge`
- Estilos por página con prefijo: `.home-*`, `.exam-*`, `.results-*`, etc.
- Media queries para responsividad (breakpoints: 600px, 768px)
- Efectos retro: `text-shadow`, `box-shadow`, gradientes neón

### Imágenes de Preguntas
- Formato: `pregunta_X.png` donde X es el ID de la pregunta
- Ubicación: `/assets/`
- Cargadas lazy con `onerror="this.style.display='none'"` para manejo de errores
- Máximo 300px de altura en exam, 200px en resultados

### API de localStorage
```javascript
// Keys
mtc_exam_user       // Datos del usuario
mtc_exam_attempts   // Array de intentos
mtc_exam_stats      // Estadísticas globales
mtc_exam_settings   // Configuraciones

// Funciones principales
storage.get(key)           // Leer
storage.set(key, value)    // Escribir
getUser()                  // Obtener usuario
saveAttempt(attempt)        // Guardar intento
updateStats(answers)        // Actualizar estadísticas
```

## Criterios de Aprobación

| Modo | Preguntas | Aprobación | Errores permitidos |
|------|-----------|------------|-------------------|
| Práctica | 200 | ≥ 70% (≥ 140) | Ilimitados |
| Simulador | 40 | ≥ 35 correctas | Máximo 5 |

## Rutas SPA

| Hash | Vista | Descripción |
|------|-------|-------------|
| `#name` | name.js | Ingreso de nombre |
| `#home` | home.js | Página principal |
| `#intro` | intro.js | Reglas examen práctica |
| `#exam` | exam.js | Examen de práctica |
| `#results/:id` | results.js | Resultados de intento |
| `#stats` | stats.js | Estadísticas |
| `#attempts` | attempts.js | Historial de intentos |
| `#review` | review.js | Modo repaso general |
| `#review-attempt/:id` | review.js | Repaso de intento específico |
| `#simulator-intro` | simulator-intro.js | Reglas simulador |
| `#simulator` | simulator.js | Simulador MTC |

## Colores del Tema

```css
--color-black: #0a0a0a;
--color-dark: #1a1a2e;
--color-neon-green: #00ff41;    /* Aprobado, correcto */
--color-neon-yellow: #ffd700;   /* Warning, en progreso */
--color-neon-red: #ff4444;      /* Error, reprobado */
--color-neon-blue: #00d4ff;     /* Info, neutro */
--color-neon-orange: #ff6600;    /* Simulador MTC */
--color-neon-cyan: #00ffff;     /* Timer normal */
--color-white: #ffffff;
--color-gray: #333333;
```

## Bibliotecas Externas

- **Chart.js** (CDN): Gráficos de estadísticas
- **Google Fonts**: Press Start 2P (pixel), VT323 (retro)

## SEO y Metadata

La aplicación implementa SEO completo para SPAs con routing basado en hash.

### Sistema de Meta Tags Dinámicos

El componente `js/components/meta.js` contiene meta tags específicos para cada ruta:

```javascript
const pageMeta = {
    'home': { title, description, keywords, ogImage, ogTitle, ogDescription },
    'intro': { ... },
    'exam': { ... },
    'simulator-intro': { ... },
    'simulator': { ... },
    'results': { ... },
    'attempts': { ... },
    'stats': { ... },
    'review': { ... },
    'name': { ... }
};
```

El router actualiza los meta tags automáticamente al navegar a cada página mediante `updateMetaTags(route)`.

### Imágenes OG por Página

| Página | Imagen OG |
|--------|----------|
| Home / Menú | `assets/menu-start.png` |
| Modo Práctica | `assets/practica-exam.png` |
| Simulador MTC | `assets/simulacion-exam.png` |
| Estadísticas | `assets/stats.png` |
| Historial | `assets/attempts.png` |

### Archivos SEO

- `index.html`: Meta tags base, Open Graph, Twitter Cards, JSON-LD
- `sitemap.xml`: Sitemap con todas las rutas y imágenes
- `robots.txt`: Directivas para crawlers

### JSON-LD Structured Data

El sitio incluye:
- **WebApplication**: Info de la aplicación
- **FAQPage**: 5 preguntas frecuentes para rich snippets
- **BreadcrumbList**: Migas de pan

## Buenas Prácticas

1. **No modificar el DOM directamente** - usar innerHTML con templates
2. **Eventos con delegation** cuando sea posible
3. **Limpiar timers** al salir de una vista o confirmar
4. **Validar datos** de localStorage antes de usar
5. **Manejar errores** de imágenes con onerror
6. **Responsive** - diseñar para móvil primero
7. **Accesibilidad** - usar elementos semánticos y labels apropiados
8. **SEO** - Actualizar meta tags con `updateMetaTags()` en cada ruta

## Notas para Desarrollo Futuro

- El proyecto usa 200 preguntas reales del examen MTC Perú
- Las preguntas están basadas en el PDF oficial del MTC
- El examen simula fielmente las condiciones del examen real
- Para agregar más preguntas, editar `js/data/questions.js` o `js/data/preguntas.json`
- Las imágenes de preguntas están en `/assets/` con naming `pregunta_X.png`
