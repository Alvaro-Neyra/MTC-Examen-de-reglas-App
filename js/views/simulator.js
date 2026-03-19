import { questions, checkAnswer } from '../data/questions.js';
import { getUser, saveAttempt, updateStats } from '../storage.js';
import { navigate, setSimulatorState, getSimulatorState } from '../router.js';
import { showConfirm } from '../components/modal.js';

const TOTAL_QUESTIONS = 40;
const TIME_LIMIT = 40 * 60;
const PASSING_SCORE = 35;

let currentQuestion = 1;
let answers = [];
let shuffledQuestions = [];
let timerInterval = null;
let timeRemaining = TIME_LIMIT;

function shuffleArray(array) {
    const shuffled = [...array];
    for (let i = shuffled.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
    }
    return shuffled;
}

export async function renderSimulator(state) {
    const main = document.getElementById('main-content');
    
    if (state && state.answers && state.answers.length > 0) {
        currentQuestion = state.currentQuestion || 1;
        answers = state.answers;
        timeRemaining = state.timeRemaining || TIME_LIMIT;
    } else {
        currentQuestion = 1;
        answers = [];
        shuffledQuestions = shuffleArray(questions).slice(0, TOTAL_QUESTIONS);
        timeRemaining = TIME_LIMIT;
    }
    
    if (shuffledQuestions.length === 0) {
        shuffledQuestions = shuffleArray(questions).slice(0, TOTAL_QUESTIONS);
    }
    
    const question = shuffledQuestions[currentQuestion - 1];
    const progress = (currentQuestion / TOTAL_QUESTIONS) * 100;
    const user = getUser();
    const currentAnswered = answers.find(a => a.questionIndex === currentQuestion - 1);

    main.innerHTML = `
        <div class="exam-view simulator-view">
            <header class="exam-header">
                <div class="exam-progress-info simulator-header-info">
                    <div class="exam-meta">
                        <span class="question-counter">Pregunta <span id="current-q">${currentQuestion}</span> de <span id="total-q">${TOTAL_QUESTIONS}</span></span>
                        <span class="user-name">👤 ${user?.name || 'Jugador'}</span>
                    </div>
                    <div class="timer-display" id="timer-display">
                        <span class="timer-icon">⏱️</span>
                        <span class="timer-value" id="timer-value">${formatTime(timeRemaining)}</span>
                    </div>
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
                        <span class="question-badge badge badge-warning">PREGUNTA ${currentQuestion}</span>
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
                    ${currentQuestion === TOTAL_QUESTIONS ? `
                        <button id="btn-finish" class="btn btn-warning" ${!currentAnswered ? 'disabled' : ''}>
                            Finalizar Examen ✓
                        </button>
                    ` : `
                        <button id="btn-next" class="btn btn-warning" ${!currentAnswered ? 'disabled' : ''}>
                            Siguiente →
                        </button>
                    `}
                </div>
                
                ${!currentAnswered ? `
                    <p class="exam-warning">⚠️ Responde la pregunta para continuar</p>
                ` : ''}
            </div>

            <nav class="question-nav simulator-nav">
                <div class="nav-info">
                    <span class="answered-count">Respondidas: <span id="answered-count">${answers.length}</span> / ${TOTAL_QUESTIONS}</span>
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

    setupTimer();
    setupSimulatorEvents();
    highlightAnswered();
    updateTimerDisplay();
}

function formatTime(seconds) {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
}

function updateTimerDisplay() {
    const timerDisplay = document.getElementById('timer-display');
    const timerValue = document.getElementById('timer-value');
    
    if (!timerDisplay || !timerValue) return;
    
    timerValue.textContent = formatTime(timeRemaining);
    
    timerDisplay.classList.remove('timer-warning', 'timer-critical');
    
    if (timeRemaining <= 60) {
        timerDisplay.classList.add('timer-critical');
    } else if (timeRemaining <= 300) {
        timerDisplay.classList.add('timer-warning');
    }
}

function setupTimer() {
    if (timerInterval) {
        clearInterval(timerInterval);
    }
    
    timerInterval = setInterval(() => {
        timeRemaining--;
        updateTimerDisplay();
        
        if (timeRemaining <= 0) {
            clearInterval(timerInterval);
            timerInterval = null;
            autoSubmit();
        }
    }, 1000);
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

function setupSimulatorEvents() {
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
        if (currentQuestion < TOTAL_QUESTIONS) {
            currentQuestion++;
            updateSimulator();
        }
    });

    btnFinish?.addEventListener('click', () => {
        const allAnswered = answers.length === TOTAL_QUESTIONS;
        if (allAnswered) {
            finishExam();
        }
    });

    btnQuit?.addEventListener('click', quitExam);

    dots.forEach(dot => {
        dot.addEventListener('click', () => {
            const qNum = parseInt(dot.dataset.q);
            if (qNum <= currentQuestion) {
                currentQuestion = qNum;
                updateSimulator();
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

    setSimulatorState({
        started: true,
        currentQuestion,
        answers,
        timeRemaining
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

async function updateSimulator() {
    const questionCard = document.querySelector('.question-card');
    
    if (questionCard) {
        questionCard.classList.add('exit');
        await new Promise(resolve => setTimeout(resolve, 300));
    }
    
    setSimulatorState({
        started: true,
        currentQuestion,
        answers,
        timeRemaining
    });
    
    await renderSimulator({ currentQuestion, answers, timeRemaining });
    
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

async function autoSubmit() {
    if (timerInterval) {
        clearInterval(timerInterval);
        timerInterval = null;
    }
    
    for (let i = 0; i < TOTAL_QUESTIONS; i++) {
        const existing = answers.find(a => a.questionIndex === i);
        if (!existing) {
            const question = shuffledQuestions[i];
            answers.push({
                questionIndex: i,
                questionId: question.id,
                selectedIndex: -1,
                isCorrect: false,
                unanswered: true
            });
        }
    }

    await finishExam(true);
}

async function finishExam(wasAutoSubmit = false) {
    if (timerInterval) {
        clearInterval(timerInterval);
        timerInterval = null;
    }

    const correctCount = answers.filter(a => a.isCorrect).length;
    const unansweredCount = answers.filter(a => a.unanswered).length;
    const percentage = Math.round((correctCount / TOTAL_QUESTIONS) * 100);
    const passed = correctCount >= PASSING_SCORE;

    const attempt = {
        userId: getUser()?.id,
        userName: getUser()?.name,
        date: new Date().toISOString(),
        totalQuestions: TOTAL_QUESTIONS,
        correctCount,
        unansweredCount,
        percentage,
        passed,
        isSimulator: true,
        wasAutoSubmitted: wasAutoSubmit,
        answers: answers.map(a => ({
            questionId: a.questionId,
            questionIndex: a.questionIndex,
            selectedIndex: a.selectedIndex,
            isCorrect: a.isCorrect,
            unanswered: a.unanswered || false
        }))
    };

    saveAttempt(attempt);
    updateStats(answers);

    setSimulatorState(null);
    await navigate('results/' + attempt.id);
}

async function quitExam() {
    const confirmed = await showConfirm({
        title: '¿Salir del simulador?',
        message: '¿Estás seguro de salir? Tu progreso se perderá.',
        confirmText: 'Sí, salir',
        cancelText: 'Permanecer',
        type: 'warning'
    });
    
    if (confirmed) {
        if (timerInterval) {
            clearInterval(timerInterval);
            timerInterval = null;
        }
        setSimulatorState(null);
        await navigate('home');
    }
}

export async function resumeSimulator() {
    const state = getSimulatorState();
    if (state && state.started) {
        await renderSimulator(state);
    } else {
        await navigate('home');
    }
}
