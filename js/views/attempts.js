import { getAttempts, getUser } from '../storage.js';
import { navigate } from '../router.js';
import { showConfirm } from '../components/modal.js';

function countFailedQuestions(attempt) {
    if (!attempt.answers) return 0;
    return attempt.answers.filter(a => !a.isCorrect).length;
}

export async function renderAttempts() {
    const main = document.getElementById('main-content');
    const attempts = getAttempts();
    const user = getUser();

    const sortedAttempts = [...attempts].sort((a, b) => new Date(b.date) - new Date(a.date));
    const regularAttempts = sortedAttempts.filter(a => !a.isReview);
    const failedCount = getTotalFailedQuestions();
    
    main.innerHTML = `
        <div class="attempts-view">
            <div class="attempts-header">
                <h2 class="page-title">📋 HISTORIAL DE INTENTOS</h2>
                <p class="page-subtitle">${user?.name || 'Usuario'}</p>
            </div>

            ${sortedAttempts.length === 0 ? `
                <div class="empty-state card">
                    <div class="empty-icon">📝</div>
                    <h3>No hay intentos todavía</h3>
                    <p>Completa tu primer examen para ver tu historial aquí.</p>
                    <button id="btn-start-exam" class="btn btn-primary mt-3">
                        🏁 Comenzar Examen
                    </button>
                </div>
            ` : `
                ${failedCount > 0 ? `
                    <div class="review-cta card">
                        <div class="review-cta-content">
                            <div class="review-cta-icon">📚</div>
                            <div class="review-cta-text">
                                <h3>Modo Repaso</h3>
                                <p>Tienes <strong>${failedCount}</strong> preguntas para repasar</p>
                            </div>
                        </div>
                        <button id="btn-start-review" class="btn btn-secondary">
                            Comenzar repaso
                        </button>
                    </div>
                ` : ''}

                <div class="stats-summary">
                    <div class="stat-card">
                        <div class="stat-value">${regularAttempts.length}</div>
                        <div class="stat-label">Total Intentos</div>
                    </div>
                    <div class="stat-card">
                        <div class="stat-value">${calculateAverage(regularAttempts)}%</div>
                        <div class="stat-label">Promedio</div>
                    </div>
                    <div class="stat-card">
                        <div class="stat-value">${calculateBest(regularAttempts)}%</div>
                        <div class="stat-label">Mejor Puntaje</div>
                    </div>
                    <div class="stat-card">
                        <div class="stat-value">${regularAttempts.filter(a => a.passed).length}</div>
                        <div class="stat-label">Aprobados</div>
                    </div>
                </div>

                <h3 class="section-title">Exámenes realizados</h3>
                
                <div class="attempts-list stagger">
                    ${regularAttempts.map(attempt => {
                        const failed = countFailedQuestions(attempt);
                        const isSimulator = attempt.isSimulator || false;
                        return `
                            <div class="attempt-card card hover-lift ${isSimulator ? 'simulator-attempt' : ''}" data-id="${attempt.id}">
                                <div class="attempt-header">
                                    <span class="attempt-date">${formatDate(attempt.date)}</span>
                                    <div class="attempt-badges">
                                        ${isSimulator ? '<span class="badge badge-warning">🏁 SIMULADOR</span>' : '<span class="badge badge-info">📝 PRÁCTICA</span>'}
                                        <span class="attempt-badge badge ${attempt.passed ? 'badge-success' : 'badge-danger'}">
                                            ${attempt.passed ? '🏆 APROBADO' : '📚 REPROBADO'}
                                        </span>
                                    </div>
                                </div>
                                
                                <div class="attempt-score">
                                    <div class="score-circle-small ${attempt.passed ? 'passed' : 'failed'}">
                                        ${attempt.percentage}%
                                    </div>
                                    <div class="attempt-details">
                                        <div class="attempt-stat">
                                            <span class="stat-correct">✓ ${attempt.correctCount}</span>
                                            <span class="stat-wrong">✗ ${attempt.totalQuestions - attempt.correctCount}</span>
                                            ${failed > 0 && !isSimulator ? `<span class="stat-review">📚 ${failed}</span>` : ''}
                                        </div>
                                        <div class="attempt-bar">
                                            <div class="attempt-bar-fill ${attempt.passed ? 'passed' : 'failed'}" style="width: ${attempt.percentage}%"></div>
                                            ${isSimulator ? `
                                                <div class="attempt-bar-marker" style="left: 87.5%"></div>
                                            ` : `
                                                <div class="attempt-bar-marker" style="left: 70%"></div>
                                            `}
                                        </div>
                                    </div>
                                </div>
                                
                                <div class="attempt-actions">
                                    <button class="btn btn-secondary btn-small btn-view" data-id="${attempt.id}">
                                        Ver respuestas
                                    </button>
                                    ${failed > 0 && !isSimulator ? `
                                        <button class="btn btn-warning btn-small btn-review" data-id="${attempt.id}">
                                            Repasar (${failed})
                                        </button>
                                    ` : ''}
                                    <button class="btn btn-ghost btn-small btn-delete" data-id="${attempt.id}">
                                        Eliminar
                                    </button>
                                </div>
                            </div>
                        `;
                    }).join('')}
                </div>
            `}

            <div class="page-actions">
                <button id="btn-home" class="btn btn-ghost">
                    ← Volver al inicio
                </button>
            </div>
        </div>
    `;

    setupAttemptsEvents();
}

function getTotalFailedQuestions() {
    const attempts = getAttempts().filter(a => !a.isReview);
    const failedSet = new Set();
    
    attempts.forEach(attempt => {
        if (attempt.answers) {
            attempt.answers.forEach(a => {
                if (!a.isCorrect) {
                    failedSet.add(a.questionId);
                }
            });
        }
    });
    
    return failedSet.size;
}

function setupAttemptsEvents() {
    const btnHome = document.getElementById('btn-home');
    const btnStartExam = document.getElementById('btn-start-exam');
    const btnStartReview = document.getElementById('btn-start-review');
    const attemptCards = document.querySelectorAll('.attempt-card');

    btnHome?.addEventListener('click', () => navigate('home'));
    btnStartExam?.addEventListener('click', () => navigate('exam'));
    btnStartReview?.addEventListener('click', () => navigate('review'));

    attemptCards.forEach(card => {
        const btnView = card.querySelector('.btn-view');
        const btnReview = card.querySelector('.btn-review');
        const btnDelete = card.querySelector('.btn-delete');
        const id = card.dataset.id;

        btnView?.addEventListener('click', (e) => {
            e.stopPropagation();
            navigate('results/' + id);
        });

        btnReview?.addEventListener('click', (e) => {
            e.stopPropagation();
            navigate('review-attempt/' + id);
        });

        btnDelete?.addEventListener('click', async (e) => {
            e.stopPropagation();
            const confirmed = await showConfirm({
                title: '¿Eliminar intento?',
                message: '¿Estás seguro de que deseas eliminar este intento? Esta acción no se puede deshacer.',
                confirmText: 'Eliminar',
                cancelText: 'Cancelar',
                type: 'danger'
            });
            
            if (confirmed) {
                deleteAttempt(id);
                renderAttempts();
            }
        });
    });
}

function deleteAttempt(id) {
    const attempts = getAttempts();
    const filtered = attempts.filter(a => a.id !== parseInt(id));
    localStorage.setItem('mtc_exam_attempts', JSON.stringify(filtered));
}

function calculateAverage(attempts) {
    if (attempts.length === 0) return 0;
    const sum = attempts.reduce((acc, a) => acc + a.percentage, 0);
    return Math.round(sum / attempts.length);
}

function calculateBest(attempts) {
    if (attempts.length === 0) return 0;
    return Math.max(...attempts.map(a => a.percentage));
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
