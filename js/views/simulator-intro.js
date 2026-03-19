export async function renderSimulatorIntro() {
    const main = document.getElementById('main-content');
    
    main.innerHTML = `
        <div class="intro-view simulator-intro-view">
            <div class="intro-content simulator-intro-content">
                <div class="intro-header">
                    <span class="intro-icon">🏁</span>
                    <h2 class="intro-title simulator-title">SIMULADOR MTC</h2>
                    <p class="intro-subtitle">Simula el examen real del MTC</p>
                </div>
                
                <div class="rules-list stagger">
                    <div class="rule-item simulator-rule">
                        <span class="rule-number">01</span>
                        <div class="rule-text">
                            <h3>40 Preguntas</h3>
                            <p>Examen con 40 preguntas aleatorias de la banca de 200</p>
                        </div>
                    </div>
                    
                    <div class="rule-item simulator-rule">
                        <span class="rule-number">02</span>
                        <div class="rule-text">
                            <h3>40 Minutos</h3>
                            <p>Tiempo límite como en el examen real del MTC</p>
                        </div>
                    </div>
                    
                    <div class="rule-item simulator-rule">
                        <span class="rule-number">03</span>
                        <div class="rule-text">
                            <h3>35 para aprobar</h3>
                            <p>Necesitas al menos 35 respuestas correctas (solo 5 errores permitidos)</p>
                        </div>
                    </div>
                    
                    <div class="rule-item simulator-rule">
                        <span class="rule-number">04</span>
                        <div class="rule-text">
                            <h3>Sin volver atrás</h3>
                            <p>No puedes regresar a preguntas anteriores</p>
                        </div>
                    </div>
                    
                    <div class="rule-item simulator-rule">
                        <span class="rule-number">05</span>
                        <div class="rule-text">
                            <h3>Respuestas automáticas</h3>
                            <p>Las preguntas sin responder se marcan como incorrectas al terminar el tiempo</p>
                        </div>
                    </div>
                </div>
                
                <div class="intro-buttons">
                    <button id="btn-begin-simulator" class="btn btn-warning btn-large">
                        <span>🏁</span> COMENZAR SIMULADOR
                    </button>
                    <button id="btn-cancel" class="btn btn-ghost">
                        ← Cancelar
                    </button>
                </div>
            </div>
            
            <div class="car-pixel">
                <svg viewBox="0 0 64 32" width="120" height="60">
                    <rect x="8" y="12" width="48" height="14" fill="#ff6600"/>
                    <rect x="12" y="6" width="24" height="10" fill="#ff6600"/>
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
        </div>
    `;

    const btnBegin = document.getElementById('btn-begin-simulator');
    const btnCancel = document.getElementById('btn-cancel');

    btnBegin.addEventListener('click', async () => {
        await import('../router.js').then(({ navigate, setSimulatorState }) => {
            setSimulatorState({ started: true, currentQuestion: 1, answers: [] });
            navigate('simulator');
        });
    });

    btnCancel.addEventListener('click', async () => {
        await import('../router.js').then(({ navigate }) => {
            navigate('home');
        });
    });
}
