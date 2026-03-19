import { hasUser, getUser, setUser } from './storage.js';
import { renderHome, renderNameInput, renderIntro, renderExam, resumeExam, renderReview, startReviewFromAttempt, renderResults, renderStats, renderAttempts, renderSimulatorIntro, renderSimulator, resumeSimulator } from './views/index.js';
import { updateMetaTags } from './components/meta.js';

let examState = null;
let simulatorState = null;
let currentRoute = null;

export function setExamState(state) {
    examState = state;
}

export function getExamState() {
    return examState;
}

export function setSimulatorState(state) {
    simulatorState = state;
}

export function getSimulatorState() {
    return simulatorState;
}

function getRouteFromHash() {
    const hash = window.location.hash.slice(1) || '';
    const [route, ...params] = hash.split('/');
    return { route: route || (hasUser() ? 'home' : 'name'), params };
}

function updateFooterVisibility(route) {
    const footer = document.querySelector('.game-footer');
    if (!footer) return;
    
    if (route === 'home') {
        footer.style.display = 'block';
    } else {
        footer.style.display = 'none';
    }
}

async function transition(callback) {
    const overlay = document.getElementById('transition-overlay');
    const main = document.getElementById('main-content');
    
    overlay.classList.add('active');
    await new Promise(resolve => setTimeout(resolve, 300));
    
    if (callback) await callback();
    
    main.classList.remove('page-enter');
    void main.offsetWidth;
    main.classList.add('page-enter-active');
    
    await new Promise(resolve => setTimeout(resolve, 50));
    overlay.classList.add('exit');
    await new Promise(resolve => setTimeout(resolve, 300));
    overlay.classList.remove('active', 'exit');
}

export async function navigate(route, params = {}) {
    history.pushState(null, '', '#' + route);
    await transition(async () => {
        await router();
    });
}

export async function router() {
    const { route, params } = getRouteFromHash();
    currentRoute = { route, params };
    
    const main = document.getElementById('main-content');
    main.className = '';
    main.innerHTML = '';

    updateFooterVisibility(route);
    updateMetaTags(route);

    switch (route) {
        case 'name':
            if (hasUser()) {
                await renderHome();
            } else {
                await renderNameInput();
            }
            break;
            
        case 'home':
            await renderHome();
            break;
            
        case 'intro':
            if (!hasUser()) {
                await navigate('name');
                return;
            }
            await renderIntro();
            break;
            
        case 'exam':
            if (!hasUser()) {
                await navigate('name');
                return;
            }
            if (examState && examState.started) {
                await renderExam(examState);
            } else {
                examState = { started: true, currentQuestion: 1, answers: [] };
                await renderExam(examState);
            }
            break;
            
        case 'results':
            if (!hasUser()) {
                await navigate('name');
                return;
            }
            await renderResults(params[0]);
            break;
            
        case 'stats':
            if (!hasUser()) {
                await navigate('name');
                return;
            }
            await renderStats();
            break;
            
        case 'attempts':
            if (!hasUser()) {
                await navigate('name');
                return;
            }
            await renderAttempts();
            break;
            
        case 'review':
            if (!hasUser()) {
                await navigate('name');
                return;
            }
            await renderReview();
            break;
            
        case 'review-attempt':
            if (!hasUser()) {
                await navigate('name');
                return;
            }
            await startReviewFromAttempt(params[0]);
            break;
            
        case 'simulator-intro':
            if (!hasUser()) {
                await navigate('name');
                return;
            }
            await renderSimulatorIntro();
            break;
            
        case 'simulator':
            if (!hasUser()) {
                await navigate('name');
                return;
            }
            if (simulatorState && simulatorState.started) {
                await renderSimulator(simulatorState);
            } else {
                simulatorState = { started: true, currentQuestion: 1, answers: [] };
                await renderSimulator(simulatorState);
            }
            break;
            
        default:
            if (hasUser()) {
                await renderHome();
            } else {
                await renderNameInput();
            }
    }
}

window.addEventListener('popstate', router);
window.addEventListener('load', router);
