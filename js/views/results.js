import { getAttempt, getUser } from '../storage.js';
import { questions } from '../data/questions.js';
import { navigate } from '../router.js';

export async function renderResults(attemptId) {
    const main = document.getElementById('main-content');
    const attempt = getAttempt(attemptId);
    
    if (!attempt) {
        main.innerHTML = `
            <div class="results-view">
                <div class="card">
                    <h2 class="card-title">Resultado no encontrado</h2>
                    <p>No se encontró el intento solicitado.</p>
                    <button onclick="location.hash='#home'" class="btn btn-primary mt-3">
                        Volver al inicio
                    </button>
                </div>
            </div>
        `;
        return;
    }

    const passed = attempt.passed;
    const user = getUser();
    const isSimulator = attempt.isSimulator || false;
    const unansweredCount = attempt.unansweredCount || 0;

    main.innerHTML = `
        <div class="results-view">
            <div class="results-header ${passed ? 'passed' : 'failed'}">
                ${isSimulator ? '<span class="badge badge-warning result-mode-badge">🏁 SIMULADOR MTC</span>' : ''}
                <div class="result-icon">${passed ? '🏆' : '😢'}</div>
                <h2 class="result-title">${passed ? '¡FELICIDADES!' : 'SIGUE PRACTICANDO'}</h2>
                <p class="result-subtitle">${passed ? 'Has aprobado el examen' : (isSimulator ? 'No llegaste a 35 correctas' : 'No llegaste al 70% requerido')}</p>
                ${isSimulator && !passed ? '<p class="result-hint">Necesitas 35 correctas para aprobar</p>' : ''}
            </div>

            <div class="score-card card">
                <div class="score-display">
                    <div class="score-circle ${passed ? 'passed' : 'failed'}">
                        <span class="score-value">${attempt.percentage}%</span>
                    </div>
                </div>
                
                <div class="score-details">
                    <div class="detail-row">
                        <span class="detail-label">Respuestas correctas:</span>
                        <span class="detail-value correct">${attempt.correctCount}</span>
                    </div>
                    <div class="detail-row">
                        <span class="detail-label">Respuestas incorrectas:</span>
                        <span class="detail-value incorrect">${attempt.totalQuestions - attempt.correctCount - unansweredCount}</span>
                    </div>
                    ${isSimulator && unansweredCount > 0 ? `
                    <div class="detail-row">
                        <span class="detail-label">Sin responder:</span>
                        <span class="detail-value">${unansweredCount}</span>
                    </div>
                    ` : ''}
                    <div class="detail-row">
                        <span class="detail-label">Total de preguntas:</span>
                        <span class="detail-value">${attempt.totalQuestions}</span>
                    </div>
                    <div class="detail-row">
                        <span class="detail-label">Fecha:</span>
                        <span class="detail-value">${formatDate(attempt.date)}</span>
                    </div>
                </div>
            </div>

            <div class="answers-section">
                <h3 class="section-title">📋 Revisión de Respuestas</h3>
                
                <div class="filter-buttons">
                    <button class="filter-btn active" data-filter="all">Todas</button>
                    <button class="filter-btn" data-filter="correct">✓ Correctas</button>
                    <button class="filter-btn" data-filter="incorrect">✗ Incorrectas</button>
                </div>

                <div class="answers-list" id="answers-list">
                    ${attempt.answers.map((answer, index) => {
                        const question = questions.find(q => q.id === answer.questionId);
                        if (!question) return '';
                        return `
                            <div class="answer-item card ${answer.isCorrect ? 'correct-answer' : 'incorrect-answer'}" data-filter="${answer.isCorrect ? 'correct' : 'incorrect'}">
                                <div class="answer-header">
                                    <span class="answer-number">Pregunta ${answer.questionId}</span>
                                    ${answer.unanswered ? `
                                        <span class="answer-status badge badge-warning">
                                            Sin responder
                                        </span>
                                    ` : `
                                        <span class="answer-status ${answer.isCorrect ? 'badge badge-success' : 'badge badge-danger'}">
                                            ${answer.isCorrect ? '✓ Correcta' : '✗ Incorrecta'}
                                        </span>
                                    `}
                                </div>
                                
                                <p class="answer-question">${question.text}</p>
                                
                                ${question.image ? `
                                    <div class="answer-image">
                                        <img src="assets/${question.image}" alt="Pregunta ${question.id}" onerror="this.parentElement.style.display='none'">
                                    </div>
                                ` : ''}
                                
                                <div class="answer-options">
                                    ${question.options.map((opt, i) => {
                                        let className = 'answer-option';
                                        if (i === question.correct) className += ' correct-option';
                                        if (i === answer.selectedIndex) className += ' selected-option';
                                        return `
                                            <div class="${className}">
                                                <span class="option-marker">${String.fromCharCode(65 + i)}</span>
                                                <span class="option-text">${opt}</span>
                                                ${i === question.correct ? '<span class="correct-badge">✓</span>' : ''}
                                                ${i === answer.selectedIndex && i !== question.correct ? '<span class="incorrect-badge">✗</span>' : ''}
                                            </div>
                                        `;
                                    }).join('')}
                                </div>
                            </div>
                        `;
                    }).join('')}
                </div>
            </div>

            <div class="results-actions">
                <button id="btn-retry" class="btn btn-primary">
                    🔄 Intentar de nuevo
                </button>
                <button id="btn-attempts" class="btn btn-secondary">
                    📋 Ver todos los intentos
                </button>
                <button id="btn-stats" class="btn btn-ghost">
                    📊 Estadísticas
                </button>
                <button id="btn-home" class="btn btn-ghost">
                    🏠 Inicio
                </button>
            </div>
        </div>
    `;

    setupResultsEvents(attempt, isSimulator);
}

function setupResultsEvents(attempt, isSimulator) {
    const btnRetry = document.getElementById('btn-retry');
    const btnAttempts = document.getElementById('btn-attempts');
    const btnStats = document.getElementById('btn-stats');
    const btnHome = document.getElementById('btn-home');
    const filterBtns = document.querySelectorAll('.filter-btn');
    const answersList = document.getElementById('answers-list');

    if (btnRetry) {
        btnRetry.addEventListener('click', () => {
            if (isSimulator) {
                navigate('simulator-intro');
            } else {
                navigate('intro');
            }
        });
    }
    
    if (btnAttempts) {
        btnAttempts.addEventListener('click', () => navigate('attempts'));
    }
    
    if (btnStats) {
        btnStats.addEventListener('click', () => navigate('stats'));
    }
    
    if (btnHome) {
        btnHome.addEventListener('click', () => navigate('home'));
    }

    filterBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            filterBtns.forEach(b => b.classList.remove('active'));
            btn.classList.add('active');
            
            const filter = btn.dataset.filter;
            const items = answersList.querySelectorAll('.answer-item');
            
            items.forEach(item => {
                if (filter === 'all' || item.dataset.filter === filter) {
                    item.style.display = 'block';
                } else {
                    item.style.display = 'none';
                }
            });
        });
    });
}

function formatDate(dateStr) {
    const date = new Date(dateStr);
    return date.toLocaleDateString('es-PE', {
        day: '2-digit',
        month: '2-digit',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
    });
}
