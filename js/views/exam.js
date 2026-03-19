import { questions, checkAnswer } from '../data/questions.js';
import { getUser, saveAttempt, updateStats } from '../storage.js';
import { navigate, setExamState, getExamState } from '../router.js';
import { showConfirm } from '../components/modal.js';

let currentQuestion = 1;
let answers = [];
let shuffledQuestions = [];

export async function renderExam(state) {
    const main = document.getElementById('main-content');
    
    if (state && state.answers && state.answers.length > 0) {
        currentQuestion = state.currentQuestion || 1;
        answers = state.answers;
    } else {
        currentQuestion = 1;
        answers = [];
        shuffledQuestions = [...questions].sort(() => Math.random() - 0.5);
    }
    
    if (shuffledQuestions.length === 0) {
        shuffledQuestions = [...questions].sort(() => Math.random() - 0.5);
    }
    
    const question = shuffledQuestions[currentQuestion - 1];
    const progress = (currentQuestion / questions.length) * 100;
    const user = getUser();
    const currentAnswered = answers.find(a => a.questionIndex === currentQuestion - 1);

    main.innerHTML = `
        <div class="exam-view">
            <header class="exam-header">
                <div class="exam-progress-info">
                    <span class="question-counter">Pregunta <span id="current-q">${currentQuestion}</span> de <span id="total-q">${questions.length}</span></span>
                    <span class="user-name">👤 ${user?.name || 'Jugador'}</span>
                </div>
                <div class="progress-bar">
                    <div class="progress-fill" style="width: ${progress}%"></div>
                </div>
            </header>

            <div class="question-container">
                <div class="question-card card">
                    ${question.image ? `
                        <div class="question-image-container">
                            <img src="assets/${question.image}" alt="Pregunta ${question.id}" class="question-image" onerror="this.style.display='none'">
                        </div>
                    ` : ''}
                    
                    <div class="question-text">
                        <span class="question-badge badge badge-info">PREGUNTA ${currentQuestion}</span>
                        <p class="question-description">${question.text}</p>
                    </div>

                    <div class="options-container" id="options-container">
                        ${question.options.map((option, index) => {
                            const isSelected = currentAnswered && currentAnswered.selectedIndex === index;
                            const animateClass = currentAnswered ? '' : 'animate';
                            const delayStyle = currentAnswered ? '' : `style="animation-delay: ${index * 0.1}s"`;
                            return `
                                <button class="option-btn ${animateClass} ${isSelected ? 'selected' : ''}" data-index="${index}" ${delayStyle}>
                                    <span class="option-letter">${String.fromCharCode(65 + index)}</span>
                                    <span class="option-text">${option}</span>
                                </button>
                            `;
                        }).join('')}
                    </div>
                </div>

                <div class="exam-actions">
                    ${currentQuestion === questions.length ? `
                        <button id="btn-finish" class="btn btn-primary" ${!currentAnswered ? 'disabled' : ''}>
                            Finalizar Examen ✓
                        </button>
                    ` : `
                        <button id="btn-next" class="btn btn-primary" ${!currentAnswered ? 'disabled' : ''}>
                            Siguiente →
                        </button>
                    `}
                </div>
                
                ${!currentAnswered ? `
                    <p class="exam-warning">⚠️ Responde la pregunta para continuar</p>
                ` : ''}
            </div>

            <nav class="question-nav">
                <div class="nav-info">
                    <span class="answered-count">Respondidas: <span id="answered-count">${answers.length}</span> / ${questions.length}</span>
                </div>
                <div class="question-dots" id="question-dots">
                    ${generateDots()}
                </div>
            </nav>

            <button id="btn-quit" class="btn btn-danger btn-quit">
                Salir del examen
            </button>
        </div>
    `;

    setupExamEvents();
    highlightAnswered();
}

function generateDots() {
    return shuffledQuestions.map((_, index) => {
        const qNum = index + 1;
        const answered = answers.find(a => a.questionIndex === index);
        const isCurrent = qNum === currentQuestion;
        return `<span class="dot ${answered ? 'answered' : ''} ${isCurrent ? 'current' : ''}" data-q="${qNum}"></span>`;
    }).join('');
}

function highlightAnswered() {
    const dots = document.querySelectorAll('.dot');
    dots.forEach(dot => {
        const qNum = parseInt(dot.dataset.q);
        const answered = answers.find(a => a.questionIndex === qNum - 1);
        if (answered) {
            dot.classList.add('answered');
        }
        if (qNum === currentQuestion) {
            dot.classList.add('current');
        }
    });
}

function setupExamEvents() {
    const optionBtns = document.querySelectorAll('.option-btn');
    const btnNext = document.getElementById('btn-next');
    const btnFinish = document.getElementById('btn-finish');
    const btnQuit = document.getElementById('btn-quit');
    const dots = document.querySelectorAll('.dot');

    optionBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            const index = parseInt(btn.dataset.index);
            selectAnswer(index);
        });
    });

    btnNext?.addEventListener('click', () => {
        if (currentQuestion < questions.length) {
            currentQuestion++;
            updateExam();
        }
    });

    btnFinish?.addEventListener('click', finishExam);

    btnQuit?.addEventListener('click', quitExam);

    dots.forEach(dot => {
        dot.addEventListener('click', () => {
            const qNum = parseInt(dot.dataset.q);
            if (qNum <= currentQuestion) {
                currentQuestion = qNum;
                updateExam();
            }
        });
    });
}

function selectAnswer(index) {
    const question = shuffledQuestions[currentQuestion - 1];
    
    const existingIndex = answers.findIndex(a => a.questionIndex === currentQuestion - 1);
    
    const answer = {
        questionIndex: currentQuestion - 1,
        questionId: question.id,
        selectedIndex: index,
        isCorrect: checkAnswer(question.id, index)
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

    document.getElementById('answered-count').textContent = answers.length;
    highlightAnswered();

    const dots = document.querySelectorAll('.dot');
    dots[currentQuestion - 1].classList.add('answered');

    setExamState({
        started: true,
        currentQuestion,
        answers
    });

    updateNavigationState();
}

function updateNavigationState() {
    const currentAnswered = answers.find(a => a.questionIndex === currentQuestion - 1);
    const btnNext = document.getElementById('btn-next');
    const btnFinish = document.getElementById('btn-finish');
    const warning = document.querySelector('.exam-warning');

    if (btnNext) {
        btnNext.disabled = !currentAnswered;
    }
    
    if (btnFinish) {
        btnFinish.disabled = !currentAnswered;
    }

    if (currentAnswered) {
        if (warning) warning.remove();
    } else {
        if (!warning) {
            const actionsDiv = document.querySelector('.exam-actions');
            if (actionsDiv && !actionsDiv.nextElementSibling?.classList.contains('exam-warning')) {
                const warningEl = document.createElement('p');
                warningEl.className = 'exam-warning';
                warningEl.textContent = '⚠️ Responde la pregunta para continuar';
                actionsDiv.after(warningEl);
            }
        }
    }
}

async function updateExam() {
    const questionCard = document.querySelector('.question-card');
    
    if (questionCard) {
        questionCard.classList.add('exit');
        await new Promise(resolve => setTimeout(resolve, 300));
    }
    
    setExamState({
        started: true,
        currentQuestion,
        answers
    });
    
    await renderExam({ currentQuestion, answers });
    
    const newQuestionCard = document.querySelector('.question-card');
    if (newQuestionCard) {
        newQuestionCard.classList.add('animate');
    }
    
    const newOptions = document.querySelectorAll('.option-btn');
    newOptions.forEach((btn, i) => {
        btn.classList.add('animate');
        btn.style.animationDelay = `${i * 0.1}s`;
    });
}

async function finishExam() {
    const correctCount = answers.filter(a => a.isCorrect).length;
    const percentage = Math.round((correctCount / questions.length) * 100);
    const passed = percentage >= 70;

    const attempt = {
        userId: getUser()?.id,
        userName: getUser()?.name,
        date: new Date().toISOString(),
        totalQuestions: questions.length,
        correctCount,
        percentage,
        passed,
        answers: answers.map(a => ({
            questionId: a.questionId,
            questionIndex: a.questionIndex,
            selectedIndex: a.selectedIndex,
            isCorrect: a.isCorrect
        }))
    };

    saveAttempt(attempt);
    updateStats(answers);

    setExamState(null);
    window.location.hash = '#results/' + attempt.id;
    await navigate('results/' + attempt.id);
}

async function quitExam() {
    const confirmed = await showConfirm({
        title: '¿Salir del examen?',
        message: '¿Estás seguro de salir? Tu progreso se perderá.',
        confirmText: 'Sí, salir',
        cancelText: 'Permanecer',
        type: 'warning'
    });
    
    if (confirmed) {
        setExamState(null);
        await navigate('home');
    }
}

export async function resumeExam() {
    const state = getExamState();
    if (state && state.started) {
        await renderExam(state);
    } else {
        await navigate('home');
    }
}
