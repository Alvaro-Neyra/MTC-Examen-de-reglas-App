import { questions, checkAnswer } from '../data/questions.js';
import { getUser, saveReviewAttempt, updateStats, getFailedQuestionsFromAllAttempts } from '../storage.js';
import { navigate, setExamState, getExamState } from '../router.js';
import { showConfirm, showSuccess } from '../components/modal.js';

let currentQuestion = 0;
let answers = [];
let failedQuestionIds = [];

export async function renderReview() {
    const main = document.getElementById('main-content');
    
    failedQuestionIds = getFailedQuestionsFromAllAttempts();
    
    if (failedQuestionIds.length === 0) {
        main.innerHTML = `
            <div class="review-view">
                <div class="review-header">
                    <h2 class="page-title">📚 MODO REPASO</h2>
                    <p class="page-subtitle">Preguntas falladas</p>
                </div>
                
                <div class="empty-state card">
                    <div class="empty-icon">🎉</div>
                    <h3>¡Felicidades!</h3>
                    <p>No tienes preguntas falladas en tus últimos intentos.</p>
                    <p class="review-hint">Sigue practicando para mantener tu nivel.</p>
                    <div class="empty-actions">
                        <button id="btn-home" class="btn btn-primary mt-3">
                            🏠 Volver al inicio
                        </button>
                    </div>
                </div>
            </div>
        `;
        
        document.getElementById('btn-home')?.addEventListener('click', () => navigate('home'));
        return;
    }
    
    const reviewQuestions = failedQuestionIds.map(id => questions.find(q => q.id === id)).filter(Boolean);
    
    currentQuestion = 0;
    answers = [];

    main.innerHTML = `
        <div class="review-view">
            <div class="review-header">
                <h2 class="page-title">📚 MODO REPASO</h2>
                <p class="page-subtitle">${reviewQuestions.length} preguntas para practicar</p>
            </div>
            
            <div class="review-info card">
                <div class="review-info-content">
                    <span class="review-icon">💡</span>
                    <p>Estas son las preguntas que fallaste en tus últimos exámenes. ¡Practica para mejorar!</p>
                </div>
                <div class="review-stats">
                    <span class="review-stat-item">
                        <span class="stat-correct">✓ Correctas: <span id="review-correct">0</span></span>
                    </span>
                    <span class="review-stat-item">
                        <span class="stat-wrong">✗ Incorrectas: <span id="review-incorrect">0</span></span>
                    </span>
                    <span class="review-stat-item">
                        <span class="stat-pending">○ Pendientes: <span id="review-pending">${reviewQuestions.length}</span></span>
                    </span>
                </div>
                <div class="review-progress-text">
                    <span id="review-current">1</span> / <span id="review-total">${reviewQuestions.length}</span>
                </div>
            </div>
            
            <div class="review-container" id="review-container">
            </div>
            
            <div class="review-actions" id="review-actions">
                <button id="btn-review-quit" class="btn btn-danger">
                    Salir del repaso
                </button>
            </div>
        </div>
    `;

    document.getElementById('btn-review-quit')?.addEventListener('click', handleQuitReview);
    
    updateReviewStats();
    
    await showReviewQuestion();
}

function updateReviewStats() {
    const reviewQuestions = failedQuestionIds.map(id => questions.find(q => q.id === id)).filter(Boolean);
    const correctCount = answers.filter(a => a.isCorrect).length;
    const incorrectCount = answers.filter(a => a && !a.isCorrect).length;
    const pendingCount = reviewQuestions.length - answers.length;
    
    const correctEl = document.getElementById('review-correct');
    const incorrectEl = document.getElementById('review-incorrect');
    const pendingEl = document.getElementById('review-pending');
    
    if (correctEl) correctEl.textContent = correctCount;
    if (incorrectEl) incorrectEl.textContent = incorrectCount;
    if (pendingEl) pendingEl.textContent = Math.max(0, pendingCount);
}

async function showReviewQuestion() {
    const reviewQuestions = failedQuestionIds.map(id => questions.find(q => q.id === id)).filter(Boolean);
    const question = reviewQuestions[currentQuestion];
    const currentAnswered = answers.find(a => a.questionIndex === currentQuestion);
    
    const container = document.getElementById('review-container');
    
    if (!question) return;
    
    const progress = ((currentQuestion + 1) / reviewQuestions.length) * 100;
    const isLastQuestion = currentQuestion === reviewQuestions.length - 1;
    
    container.innerHTML = `
        <div class="review-card card animate">
            <div class="review-progress-bar">
                <div class="review-progress-fill" style="width: ${progress}%"></div>
            </div>
            
            ${question.image ? `
                <div class="question-image-container">
                    <img src="assets/${question.image}" alt="Pregunta ${question.id}" class="question-image" onerror="this.style.display='none'">
                </div>
            ` : ''}
            
            <div class="question-text">
                <span class="question-badge badge badge-warning">REPASO ${currentQuestion + 1}</span>
                <p class="question-description">${question.text}</p>
            </div>

            <div class="options-container" id="review-options">
                ${question.options.map((option, index) => {
                    const isSelected = currentAnswered && currentAnswered.selectedIndex === index;
                    return `
                        <button class="option-btn ${isSelected ? 'selected' : ''}" data-index="${index}">
                            <span class="option-letter">${String.fromCharCode(65 + index)}</span>
                            <span class="option-text">${option}</span>
                        </button>
                    `;
                }).join('')}
            </div>
        </div>
        
        <div class="review-navigation">
            <button id="btn-review-next" class="btn btn-primary" ${!currentAnswered ? 'disabled' : ''}>
                ${isLastQuestion ? 'Finalizar ✓' : 'Siguiente →'}
            </button>
        </div>
        
        ${!currentAnswered ? `
            <p class="exam-warning">⚠️ Responde la pregunta para continuar</p>
        ` : ''}
    `;
    
    document.getElementById('review-current').textContent = currentQuestion + 1;
    
    setupReviewEvents();
    
    const newCard = container.querySelector('.review-card');
    if (newCard) {
        newCard.classList.add('animate');
    }
}

function setupReviewEvents() {
    const optionBtns = document.querySelectorAll('.option-btn');
    const btnNext = document.getElementById('btn-review-next');
    
    optionBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            const index = parseInt(btn.dataset.index);
            selectReviewAnswer(index);
        });
    });
    
    btnNext?.addEventListener('click', handleReviewNext);
}

function selectReviewAnswer(index) {
    const reviewQuestions = failedQuestionIds.map(id => questions.find(q => q.id === id)).filter(Boolean);
    const question = reviewQuestions[currentQuestion];
    const isCorrect = checkAnswer(question.id, index);
    
    const existingIndex = answers.findIndex(a => a.questionIndex === currentQuestion);
    
    const answer = {
        questionIndex: currentQuestion,
        questionId: question.id,
        selectedIndex: index,
        isCorrect
    };
    
    if (existingIndex >= 0) {
        answers[existingIndex] = answer;
    } else {
        answers.push(answer);
    }
    
    const optionBtns = document.querySelectorAll('.option-btn');
    optionBtns.forEach((btn, i) => {
        btn.classList.remove('selected');
        if (i === index) {
            btn.classList.add('selected');
        }
    });
    
    const btnNext = document.getElementById('btn-review-next');
    if (btnNext) {
        btnNext.disabled = false;
    }
    
    const warning = document.querySelector('.exam-warning');
    if (warning) warning.remove();
    
    const questionCard = document.querySelector('.review-card');
    if (questionCard) {
        questionCard.classList.add('answered');
    }
    
    updateReviewStats();
}

async function handleReviewNext() {
    const reviewQuestions = failedQuestionIds.map(id => questions.find(q => q.id === id)).filter(Boolean);
    const isLastQuestion = currentQuestion === reviewQuestions.length - 1;
    
    if (isLastQuestion) {
        await finishReview();
    } else {
        const questionCard = document.querySelector('.review-card');
        if (questionCard) {
            questionCard.classList.add('exit');
            await new Promise(resolve => setTimeout(resolve, 300));
        }
        
        currentQuestion++;
        await showReviewQuestion();
    }
}

async function finishReview() {
    const correctCount = answers.filter(a => a.isCorrect).length;
    const totalQuestions = failedQuestionIds.length;
    const percentage = Math.round((correctCount / totalQuestions) * 100);
    
    const attempt = {
        userId: getUser()?.id,
        userName: getUser()?.name,
        totalQuestions,
        correctCount,
        percentage,
        passed: true,
        isReview: true,
        answers: answers.map(a => ({
            questionId: a.questionId,
            questionIndex: a.questionIndex,
            selectedIndex: a.selectedIndex,
            isCorrect: a.isCorrect
        }))
    };
    
    saveReviewAttempt(attempt);
    updateStats(answers);
    
    const passed = percentage >= 70;
    
    const main = document.getElementById('main-content');
    main.innerHTML = `
        <div class="review-results">
            <div class="results-header ${passed ? 'passed' : 'failed'}">
                <div class="result-icon">${passed ? '🎉' : '📚'}</div>
                <h2 class="result-title">${passed ? '¡Excelente!' : '¡Sigue practicando!'}</h2>
                <p class="result-subtitle">
                    ${passed ? 'Has acertado todas las preguntas repasadas' : 'Algunas preguntas necesitan más práctica'}
                </p>
            </div>

            <div class="score-card card">
                <div class="score-display">
                    <div class="score-circle ${passed ? 'passed' : 'failed'}">
                        <span class="score-value">${percentage}%</span>
                    </div>
                </div>
                
                <div class="score-details">
                    <div class="detail-row">
                        <span class="detail-label">Correctas:</span>
                        <span class="detail-value correct">${correctCount}</span>
                    </div>
                    <div class="detail-row">
                        <span class="detail-label">Incorrectas:</span>
                        <span class="detail-value incorrect">${totalQuestions - correctCount}</span>
                    </div>
                    <div class="detail-row">
                        <span class="detail-label">Total repasadas:</span>
                        <span class="detail-value">${totalQuestions}</span>
                    </div>
                </div>
            </div>

            <div class="results-actions">
                <button id="btn-review-again" class="btn btn-secondary">
                    🔄 Repasar de nuevo
                </button>
                <button id="btn-review-home" class="btn btn-primary">
                    🏠 Volver al inicio
                </button>
            </div>
        </div>
    `;
    
    document.getElementById('btn-review-again')?.addEventListener('click', () => renderReview());
    document.getElementById('btn-review-home')?.addEventListener('click', () => navigate('home'));
}

async function handleQuitReview() {
    const confirmed = await showConfirm({
        title: '¿Salir del repaso?',
        message: '¿Estás seguro de salir? Tu progreso no se guardará.',
        confirmText: 'Sí, salir',
        cancelText: 'Permanecer',
        type: 'warning'
    });
    
    if (confirmed) {
        await navigate('attempts');
    }
}

export async function startReviewFromAttempt(attemptId) {
    const { getAttempt } = await import('../storage.js');
    const attempt = getAttempt(attemptId);
    
    if (!attempt || !attempt.answers) {
        await navigate('attempts');
        return;
    }
    
    failedQuestionIds = attempt.answers
        .filter(a => !a.isCorrect)
        .map(a => a.questionId);
    
    if (failedQuestionIds.length === 0) {
        await showSuccess({
            title: '¡Sin errores!',
            message: 'No hay preguntas falladas en este intento.',
            type: 'success'
        });
        await navigate('attempts');
        return;
    }
    
    const main = document.getElementById('main-content');
    currentQuestion = 0;
    answers = [];
    
    main.innerHTML = `
        <div class="review-view">
            <div class="review-header">
                <h2 class="page-title">📚 REPASO DE INTENTO</h2>
                <p class="page-subtitle">${failedQuestionIds.length} preguntas para practicar</p>
            </div>
            
            <div class="review-container" id="review-container">
            </div>
            
            <div class="review-actions" id="review-actions">
                <button id="btn-review-quit" class="btn btn-danger">
                    Salir del repaso
                </button>
            </div>
        </div>
    `;
    
    document.getElementById('btn-review-quit')?.addEventListener('click', handleQuitReview);
    
    await showReviewQuestion();
}
