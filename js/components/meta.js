const pageMeta = {
    'home': {
        title: 'Simulador Examen MTC Perú 2024 - Licencia de Conducir Categoría A | Examen de Reglas de Tránsito',
        description: 'Practica gratis el examen de reglas de tránsito del MTC Perú. Simulador con 40 preguntas y 40 minutos como el examen real. 200 preguntas de práctica. Aprueba tu licencia de conducir categoría A.',
        keywords: 'examen MTC, licencia de conducir, Perú, reglas de tránsito, simulador MTC, examen de conducir, categoría A, brevete, licencia categoria A, MTC Perú, tránsito Perú',
        ogImage: 'assets/menu-start.png',
        ogTitle: 'Simulador Examen MTC Perú - Licencia de Conducir Categoría A',
        ogDescription: 'Practica gratis el examen de reglas de tránsito del MTC Perú. Simulador con 40 preguntas y 40 minutos como el examen real.'
    },
    'intro': {
        title: 'Modo Práctica - Examen de Reglas de Tránsito MTC Perú',
        description: 'Modo práctica con 200 preguntas sin límite de tiempo. Aprende y repasa las reglas de tránsito para aprobar el examen del MTC.',
        keywords: 'modo práctica, examen MTC, 200 preguntas, reglas de tránsito, practicar examen, estudiar tránsito',
        ogImage: 'assets/practica-exam.png',
        ogTitle: 'Modo Práctica - Examen de Reglas de Tránsito MTC',
        ogDescription: 'Practica con 200 preguntas sin límite de tiempo. Aprende las reglas de tránsito a tu ritmo.'
    },
    'exam': {
        title: 'Examen de Práctica - MTC Perú | 200 Preguntas',
        description: 'Realiza el examen de práctica con 200 preguntas aleatorias. Sin límite de tiempo para que aprendas correctamente.',
        keywords: 'examen práctica, 200 preguntas, examen MTC, licencia conducir, simulator tránsito',
        ogImage: 'assets/practica-exam.png',
        ogTitle: 'Examen de Práctica - 200 Preguntas MTC',
        ogDescription: '200 preguntas de práctica sin límite de tiempo. Repasa las reglas de tránsito.'
    },
    'simulator-intro': {
        title: 'Simulador MTC Oficial - 40 Preguntas, 40 Minutos | Examen Real',
        description: 'Simula el examen real del MTC con 40 preguntas y 40 minutos de tiempo límite. 35 correctas para aprobar.',
        keywords: 'simulador MTC, examen real, 40 preguntas, 40 minutos, licencia categoría A, simulacro examen',
        ogImage: 'assets/simulacion-exam.png',
        ogTitle: 'Simulador MTC - 40 Preguntas, 40 Minutos',
        ogDescription: 'Simula el examen real del MTC. 40 preguntas en 40 minutos. 35 para aprobar.'
    },
    'simulator': {
        title: 'Simulador MTC en Vivo - Examen con Tiempo Límite',
        description: 'Examen simulador MTC activo. 40 preguntas, 40 minutos. Demuestra que estás listo para obtener tu licencia.',
        keywords: 'simulador MTC, examen activo, tiempo límite, 40 minutos, license Peru',
        ogImage: 'assets/simulacion-exam.png',
        ogTitle: 'Simulador MTC en Vivo',
        ogDescription: '40 preguntas, 40 minutos. ¡Demuestra que estás listo!'
    },
    'results': {
        title: 'Resultados del Examen - MTC Perú',
        description: 'Revisa los resultados de tu examen de práctica o simulador MTC. Ve tus aciertos, errores y repasa las preguntas.',
        keywords: 'resultados examen, revisar respuestas, aciertos errores, MTC Peru',
        ogImage: 'assets/stats.png',
        ogTitle: 'Resultados del Examen MTC',
        ogDescription: 'Revisa tu rendimiento. Ve qué preguntas acertaste y cuáles necesitas repasar.'
    },
    'attempts': {
        title: 'Historial de Intentos - MTC Perú | Ver Todos los Exámenes',
        description: 'Consulta el historial de todos tus exámenes realizados. Revisa tu progreso y mejora tu puntuación.',
        keywords: 'historial exámenes, intentos previos, progreso MTC, exámenes realizados',
        ogImage: 'assets/attempts.png',
        ogTitle: 'Historial de Intentos - Exámenes MTC',
        ogDescription: 'Consulta todos tus exámenes realizados y tu progreso.'
    },
    'stats': {
        title: 'Estadísticas y Gráficos - MTC Perú | Tu Progreso',
        description: 'Visualiza tu progreso con gráficos y estadísticas. Ve cuáles son las preguntas más difíciles y tu tasa de aprobación.',
        keywords: 'estadísticas MTC, gráficos progreso, tasa aprobación, preguntas difíciles',
        ogImage: 'assets/stats.png',
        ogTitle: 'Estadísticas - Tu Progreso en el Examen MTC',
        ogDescription: 'Gráficos y estadísticas de tu progreso. Ve qué preguntas necesitas repasar.'
    },
    'review': {
        title: 'Modo Repaso - Preguntas Falladas | MTC Perú',
        description: 'Practica solo las preguntas que fallaste en exámenes anteriores. Enfócate en lo que necesitas mejorar.',
        keywords: 'modo repaso, preguntas falladas, repaso MTC, mejorar examen',
        ogImage: 'assets/practica-exam.png',
        ogTitle: 'Modo Repaso - Preguntas Falladas',
        ogDescription: 'Practica solo las preguntas que fallaste. Enfócate en mejorar.'
    },
    'name': {
        title: 'Ingresa tu Nombre - Simulador Examen MTC Perú',
        description: 'Ingresa tu nombre para comenzar a practicar el examen de reglas de tránsito del MTC Perú.',
        keywords: 'ingresar nombre, comenzar examen, MTC Peru',
        ogImage: 'assets/menu-start.png',
        ogTitle: 'Simulador Examen MTC Perú',
        ogDescription: 'Practica el examen de reglas de tránsito del MTC Perú.'
    }
};

export function updateMetaTags(route) {
    const routeKey = route.split('/')[0];
    const meta = pageMeta[routeKey] || pageMeta['home'];
    
    const titleEl = document.querySelector('title');
    const metaTitle = document.querySelector('meta[name="title"]');
    const metaDesc = document.querySelector('meta[name="description"]');
    const metaKeywords = document.querySelector('meta[name="keywords"]');
    const metaOgTitle = document.querySelector('meta[property="og:title"]');
    const metaOgDesc = document.querySelector('meta[property="og:description"]');
    const metaOgImage = document.querySelector('meta[property="og:image"]');
    const metaTwitterTitle = document.querySelector('meta[property="twitter:title"]');
    const metaTwitterDesc = document.querySelector('meta[property="twitter:description"]');
    const metaTwitterImage = document.querySelector('meta[property="twitter:image"]');
    const canonical = document.querySelector('link[rel="canonical"]');
    
    if (titleEl) titleEl.textContent = meta.title;
    if (metaTitle) metaTitle.setAttribute('content', meta.title);
    if (metaDesc) metaDesc.setAttribute('content', meta.description);
    if (metaKeywords) metaKeywords.setAttribute('content', meta.keywords);
    if (metaOgTitle) metaOgTitle.setAttribute('content', meta.ogTitle);
    if (metaOgDesc) metaOgDesc.setAttribute('content', meta.ogDescription);
    if (metaOgImage) metaOgImage.setAttribute('content', `https://mtc-examen-de-reglas-app.vercel.app/${meta.ogImage}`);
    if (metaTwitterTitle) metaTwitterTitle.setAttribute('content', meta.ogTitle);
    if (metaTwitterDesc) metaTwitterDesc.setAttribute('content', meta.ogDescription);
    if (metaTwitterImage) metaTwitterImage.setAttribute('content', `https://mtc-examen-de-reglas-app.vercel.app/${meta.ogImage}`);
    if (canonical) canonical.setAttribute('href', `https://mtc-examen-de-reglas-app.vercel.app/#${route}`);
    
    updateStructuredData(routeKey);
}

function updateStructuredData(routeKey) {
    const ldScripts = document.querySelectorAll('script[type="application/ld+json"]');
    
    ldScripts.forEach(script => {
        try {
            const data = JSON.parse(script.textContent);
            
            if (data['@type'] === 'WebApplication') {
                data.name = pageMeta[routeKey]?.ogTitle || 'Simulador Examen MTC Perú';
                data.description = pageMeta[routeKey]?.description || '';
                script.textContent = JSON.stringify(data, null, 2);
            }
        } catch (e) {
            // Ignore parsing errors
        }
    });
}
