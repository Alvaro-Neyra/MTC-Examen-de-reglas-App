export function renderHome() {
    const main = document.getElementById('main-content');
    
    main.innerHTML = `
        <div class="home-view">
            <div class="road-container">
                <div class="road">
                    <div class="road-line"></div>
                    <div class="road-line"></div>
                    <div class="road-line"></div>
                </div>
            </div>

            <div class="cars-container">
                <div class="car car-left">
                    <svg viewBox="0 0 64 32" class="car-svg">
                        <rect x="8" y="12" width="48" height="14" fill="#ff4444"/>
                        <rect x="12" y="6" width="24" height="10" fill="#ff4444"/>
                        <rect x="14" y="8" width="8" height="6" fill="#00d4ff" opacity="0.7"/>
                        <rect x="26" y="8" width="8" height="6" fill="#00d4ff" opacity="0.7"/>
                        <circle cx="16" cy="26" r="5" fill="#333"/>
                        <circle cx="16" cy="26" r="3" fill="#666"/>
                        <circle cx="48" cy="26" r="5" fill="#333"/>
                        <circle cx="48" cy="26" r="3" fill="#666"/>
                        <rect x="4" y="14" width="4" height="4" fill="#ffd700"/>
                        <rect x="56" y="14" width="4" height="4" fill="#ff0000"/>
                    </svg>
                </div>
                <div class="car car-right">
                    <svg viewBox="0 0 64 32" class="car-svg">
                        <rect x="8" y="12" width="48" height="14" fill="#00ff41"/>
                        <rect x="28" y="6" width="24" height="10" fill="#00ff41"/>
                        <rect x="30" y="8" width="8" height="6" fill="#00d4ff" opacity="0.7"/>
                        <rect x="42" y="8" width="8" height="6" fill="#00d4ff" opacity="0.7"/>
                        <circle cx="16" cy="26" r="5" fill="#333"/>
                        <circle cx="16" cy="26" r="3" fill="#666"/>
                        <circle cx="48" cy="26" r="5" fill="#333"/>
                        <circle cx="48" cy="26" r="3" fill="#666"/>
                        <rect x="4" y="14" width="4" height="4" fill="#ffd700"/>
                        <rect x="56" y="14" width="4" height="4" fill="#ff0000"/>
                    </svg>
                </div>
            </div>

            <div class="stars">
                <div class="star"></div>
                <div class="star"></div>
                <div class="star"></div>
                <div class="star"></div>
                <div class="star"></div>
            </div>

            <div class="clouds">
                <div class="cloud cloud-1"></div>
                <div class="cloud cloud-2"></div>
            </div>

            <div class="start-section">
                <h2 class="start-title">¿LISTO PARA CONDUCIR?</h2>
                <p class="start-description">Demuestra que conoces las reglas del tránsito peruano</p>
                
                <div class="exam-modes">
                    <div class="exam-mode-card mode-practice">
                        <div class="mode-icon">📝</div>
                        <h3 class="mode-title">Modo Práctica</h3>
                        <div class="mode-info">
                            <span class="info-item">
                                <span class="info-icon">📋</span>
                                <span class="info-text">200 Preguntas</span>
                            </span>
                            <span class="info-item">
                                <span class="info-icon">⏱️</span>
                                <span class="info-text">Sin límite de tiempo</span>
                            </span>
                            <span class="info-item">
                                <span class="info-icon">🏆</span>
                                <span class="info-text">70% para aprobar</span>
                            </span>
                        </div>
                        <button id="btn-start" class="btn btn-primary btn-start">
                            <span class="btn-icon">🏁</span>
                            MODO PRÁCTICA
                        </button>
                    </div>
                    
                    <div class="exam-mode-card mode-simulator">
                        <div class="mode-icon">🏁</div>
                        <h3 class="mode-title">Simulador MTC</h3>
                        <div class="mode-info">
                            <span class="info-item">
                                <span class="info-icon">📋</span>
                                <span class="info-text">40 Preguntas</span>
                            </span>
                            <span class="info-item">
                                <span class="info-icon">⏱️</span>
                                <span class="info-text">40 Minutos</span>
                            </span>
                            <span class="info-item">
                                <span class="info-icon">🎯</span>
                                <span class="info-text">35 para aprobar</span>
                            </span>
                        </div>
                        <button id="btn-simulator" class="btn btn-warning btn-start">
                            <span class="btn-icon">🏁</span>
                            SIMULADOR MTC
                        </button>
                    </div>
                </div>

                <div class="menu-options">
                    <button id="btn-attempts" class="btn btn-ghost">
                        📋 Ver Intentos Anteriores
                    </button>
                    <button id="btn-stats" class="btn btn-ghost">
                        📊 Estadísticas
                    </button>
                </div>
            </div>
        </div>
    `;

    setTimeout(() => {
        const btnStart = document.getElementById('btn-start');
        const btnSimulator = document.getElementById('btn-simulator');
        const btnAttempts = document.getElementById('btn-attempts');
        const btnStats = document.getElementById('btn-stats');

        btnStart?.addEventListener('click', async () => {
            const { hasUser } = await import('../storage.js');
            const { navigate } = await import('../router.js');
            if (hasUser()) {
                navigate('intro');
            } else {
                navigate('name');
            }
        });

        btnSimulator?.addEventListener('click', async () => {
            const { hasUser } = await import('../storage.js');
            const { navigate } = await import('../router.js');
            if (hasUser()) {
                navigate('simulator-intro');
            } else {
                navigate('name');
            }
        });

        btnAttempts?.addEventListener('click', async () => {
            const { navigate } = await import('../router.js');
            navigate('attempts');
        });

        btnStats?.addEventListener('click', async () => {
            const { navigate } = await import('../router.js');
            navigate('stats');
        });
    }, 100);
}
