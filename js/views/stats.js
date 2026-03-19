import { getStats, getTopQuestions, getBottomQuestions, getAttempts, getUser } from '../storage.js';
import { navigate } from '../router.js';

let topChart = null;
let bottomChart = null;

export async function renderStats() {
    const main = document.getElementById('main-content');
    const stats = getStats();
    const user = getUser();
    const attempts = getAttempts();

    const topQuestions = getTopQuestions(10);
    const bottomQuestions = getBottomQuestions(10);

    main.innerHTML = `
        <div class="stats-view">
            <div class="stats-header">
                <h2 class="page-title">📊 ESTADÍSTICAS</h2>
                <p class="page-subtitle">${user?.name || 'Usuario'}</p>
            </div>

            <div class="overall-stats grid grid-4">
                <div class="stat-card">
                    <div class="stat-value">${stats.totalAttempts}</div>
                    <div class="stat-label">Exámenes</div>
                </div>
                <div class="stat-card">
                    <div class="stat-value">${stats.totalCorrect}</div>
                    <div class="stat-label">Correctas</div>
                </div>
                <div class="stat-card">
                    <div class="stat-value">${stats.totalWrong}</div>
                    <div class="stat-label">Incorrectas</div>
                </div>
                <div class="stat-card">
                    <div class="stat-value">${calculateOverallPercentage(stats)}%</div>
                    <div class="stat-label">Aciertos</div>
                </div>
            </div>

            ${attempts.length === 0 ? `
                <div class="empty-state card">
                    <div class="empty-icon">📈</div>
                    <h3>Sin datos todavía</h3>
                    <p>Completa al menos un examen para ver tus estadísticas.</p>
                    <button id="btn-start-exam" class="btn btn-primary mt-3">
                        🏁 Hacer examen
                    </button>
                </div>
            ` : `
                <div class="charts-container">
                    <div class="chart-section card">
                        <h3 class="chart-title">🏆 TOP 10 - Preguntas más acertadas</h3>
                        ${topQuestions.length > 0 ? `
                            <div class="chart-wrapper">
                                <canvas id="topChart"></canvas>
                            </div>
                        ` : `
                            <p class="no-data">No hay suficientes datos aún.</p>
                        `}
                    </div>

                    <div class="chart-section card">
                        <h3 class="chart-title">📉 TOP 10 - Preguntas menos acertadas</h3>
                        ${bottomQuestions.length > 0 ? `
                            <div class="chart-wrapper">
                                <canvas id="bottomChart"></canvas>
                            </div>
                        ` : `
                            <p class="no-data">No hay suficientes datos aún.</p>
                        `}
                    </div>
                </div>

                <div class="progress-section card">
                    <h3 class="section-title">📈 Progreso general</h3>
                    <div class="progress-stats">
                        <div class="progress-item">
                            <span class="progress-label">Total de preguntas respondidas</span>
                            <div class="progress-bar">
                                <div class="progress-fill" style="width: ${Math.min((stats.totalCorrect + stats.totalWrong) / 200 * 100, 100)}%"></div>
                            </div>
                            <span class="progress-value">${stats.totalCorrect + stats.totalWrong} / 200</span>
                        </div>
                    </div>
                </div>

                <div class="detailed-stats">
                    <h3 class="section-title">📋 Detalle por categoría</h3>
                    <div class="category-grid">
                        ${generateCategoryStats(stats)}
                    </div>
                </div>
            `}

            <div class="page-actions">
                <button id="btn-home" class="btn btn-ghost">
                    ← Volver al inicio
                </button>
            </div>
        </div>
    `;

    setupStatsEvents();
    
    if (topQuestions.length > 0) {
        setTimeout(() => createTopChart(topQuestions), 100);
    }
    if (bottomQuestions.length > 0) {
        setTimeout(() => createBottomChart(bottomQuestions), 100);
    }
}

function createTopChart(data) {
    const ctx = document.getElementById('topChart');
    if (!ctx) return;

    if (topChart) topChart.destroy();

    const labels = data.map(d => 'P' + d.questionId);
    const values = data.map(d => d.correctRate * 100);

    topChart = new Chart(ctx, {
        type: 'bar',
        data: {
            labels,
            datasets: [{
                label: '% Aciertos',
                data: values,
                backgroundColor: 'rgba(0, 255, 65, 0.7)',
                borderColor: '#00ff41',
                borderWidth: 2,
                borderRadius: 5
            }]
        },
        options: {
            indexAxis: 'y',
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
                legend: { display: false },
                tooltip: {
                    callbacks: {
                        label: (context) => `${context.raw.toFixed(1)}% (${data[context.dataIndex].correct}/${data[context.dataIndex].timesShown})`
                    }
                }
            },
            scales: {
                x: {
                    beginAtZero: true,
                    max: 100,
                    grid: { color: 'rgba(255,255,255,0.1)' },
                    ticks: { color: '#00d4ff' }
                },
                y: {
                    grid: { display: false },
                    ticks: { color: '#ffffff', font: { family: "'Press Start 2P'", size: 10 } }
                }
            }
        }
    });
}

function createBottomChart(data) {
    const ctx = document.getElementById('bottomChart');
    if (!ctx) return;

    if (bottomChart) bottomChart.destroy();

    const labels = data.map(d => 'P' + d.questionId);
    const values = data.map(d => d.correctRate * 100);

    bottomChart = new Chart(ctx, {
        type: 'bar',
        data: {
            labels,
            datasets: [{
                label: '% Aciertos',
                data: values,
                backgroundColor: 'rgba(255, 68, 68, 0.7)',
                borderColor: '#ff4444',
                borderWidth: 2,
                borderRadius: 5
            }]
        },
        options: {
            indexAxis: 'y',
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
                legend: { display: false },
                tooltip: {
                    callbacks: {
                        label: (context) => `${context.raw.toFixed(1)}% (${data[context.dataIndex].correct}/${data[context.dataIndex].timesShown})`
                    }
                }
            },
            scales: {
                x: {
                    beginAtZero: true,
                    max: 100,
                    grid: { color: 'rgba(255,255,255,0.1)' },
                    ticks: { color: '#00d4ff' }
                },
                y: {
                    grid: { display: false },
                    ticks: { color: '#ffffff', font: { family: "'Press Start 2P'", size: 10 } }
                }
            }
        }
    });
}

function generateCategoryStats(stats) {
    const categories = {
        'Señales': [1, 2, 5, 8, 10, 15, 19, 22, 29, 36, 38, 42, 44, 48, 52, 59, 62, 64, 68, 72, 74, 76, 84, 88, 94, 98, 100, 104, 108, 110, 114, 116, 120, 124, 128, 132, 138, 148, 150, 160, 162, 164, 166, 168, 170, 174, 176],
        'Límites de velocidad': [1, 16, 39, 60, 79, 130],
        'Licencias': [4, 11, 32, 43, 93],
        'Multas': [7, 13, 24, 41, 47, 53, 63, 69, 77, 85, 95, 101, 105, 109, 117, 121, 125, 129, 137, 149, 153, 161, 165, 173, 181, 185, 189, 197],
        'Técnica': [3, 14, 143, 144, 145, 178, 179, 180, 182, 183, 184, 186, 190, 191, 192, 194, 195, 196, 198, 199, 200]
    };

    return Object.entries(categories).map(([name, ids]) => {
        let correct = 0;
        let total = 0;
        
        ids.forEach(id => {
            const qStats = stats.questionStats[id];
            if (qStats) {
                correct += qStats.correct;
                total += qStats.timesShown;
            }
        });
        
        const percentage = total > 0 ? Math.round((correct / total) * 100) : 0;
        
        return `
            <div class="category-card card">
                <h4 class="category-name">${name}</h4>
                <div class="category-stats">
                    <span class="category-percentage">${percentage}%</span>
                    <div class="category-bar">
                        <div class="category-bar-fill" style="width: ${percentage}%"></div>
                    </div>
                    <span class="category-detail">${correct}/${total} correctas</span>
                </div>
            </div>
        `;
    }).join('');
}

function calculateOverallPercentage(stats) {
    const total = stats.totalCorrect + stats.totalWrong;
    if (total === 0) return 0;
    return Math.round((stats.totalCorrect / total) * 100);
}

function setupStatsEvents() {
    const btnHome = document.getElementById('btn-home');
    const btnStartExam = document.getElementById('btn-start-exam');

    btnHome?.addEventListener('click', () => navigate('home'));
    btnStartExam?.addEventListener('click', () => navigate('exam'));
}
