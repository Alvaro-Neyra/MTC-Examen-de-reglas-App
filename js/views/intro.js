export async function renderIntro() {
    const main = document.getElementById('main-content');
    
    main.innerHTML = `
        <div class="intro-view">
            <div class="intro-content">
                <div class="intro-header">
                    <span class="intro-icon">🚦</span>
                    <h2 class="intro-title">REGLAS DEL EXAMEN</h2>
                </div>
                
                <div class="rules-list stagger">
                    <div class="rule-item">
                        <span class="rule-number">01</span>
                        <div class="rule-text">
                            <h3>200 Preguntas</h3>
                            <p>El examen contiene 200 preguntas de opción múltiple</p>
                        </div>
                    </div>
                    
                    <div class="rule-item">
                        <span class="rule-number">02</span>
                        <div class="rule-text">
                            <h3>Sin límite de tiempo</h3>
                            <p>Tómate el tiempo que necesites para responder</p>
                        </div>
                    </div>
                    
                    <div class="rule-item">
                        <span class="rule-number">03</span>
                        <div class="rule-text">
                            <h3>70% para aprobar</h3>
                            <p>Necesitas al menos 140 respuestas correctas</p>
                        </div>
                    </div>
                    
                    <div class="rule-item">
                        <span class="rule-number">04</span>
                        <div class="rule-text">
                            <h3>Guardado automático</h3>
                            <p>Tu progreso se guarda en cada respuesta</p>
                        </div>
                    </div>
                    
                    <div class="rule-item">
                        <span class="rule-number">05</span>
                        <div class="rule-text">
                            <h3>Revisa tus errores</h3>
                            <p>Puedes ver las respuestas al finalizar</p>
                        </div>
                    </div>
                </div>
                
                <div class="intro-buttons">
                    <button id="btn-begin" class="btn btn-primary btn-large">
                        <span>🏁</span> COMENZAR EXAMEN
                    </button>
                    <button id="btn-cancel" class="btn btn-ghost">
                        ← Cancelar
                    </button>
                </div>
            </div>
            
            <div class="car-pixel">
                <svg viewBox="0 0 64 32" width="120" height="60">
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
        </div>
    `;

    const btnBegin = document.getElementById('btn-begin');
    const btnCancel = document.getElementById('btn-cancel');

    btnBegin.addEventListener('click', async () => {
        await import('../router.js').then(({ navigate, setExamState }) => {
            setExamState({ started: true, currentQuestion: 1, answers: [] });
            navigate('exam');
        });
    });

    btnCancel.addEventListener('click', async () => {
        await import('../router.js').then(({ navigate }) => {
            navigate('home');
        });
    });
}
