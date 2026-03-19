const STORAGE_KEYS = {
    USER: 'mtc_exam_user',
    ATTEMPTS: 'mtc_exam_attempts',
    STATS: 'mtc_exam_stats',
    SETTINGS: 'mtc_exam_settings'
};

export const storage = {
    get(key) {
        try {
            const data = localStorage.getItem(key);
            return data ? JSON.parse(data) : null;
        } catch (error) {
            console.error(`Error reading ${key} from localStorage:`, error);
            return null;
        }
    },

    set(key, value) {
        try {
            localStorage.setItem(key, JSON.stringify(value));
            return true;
        } catch (error) {
            console.error(`Error writing ${key} to localStorage:`, error);
            return false;
        }
    },

    remove(key) {
        try {
            localStorage.removeItem(key);
            return true;
        } catch (error) {
            console.error(`Error removing ${key} from localStorage:`, error);
            return false;
        }
    },

    clear() {
        try {
            Object.values(STORAGE_KEYS).forEach(key => {
                localStorage.removeItem(key);
            });
            return true;
        } catch (error) {
            console.error('Error clearing localStorage:', error);
            return false;
        }
    }
};

export function getUser() {
    return storage.get(STORAGE_KEYS.USER);
}

export function setUser(userData) {
    return storage.set(STORAGE_KEYS.USER, userData);
}

export function hasUser() {
    return getUser() !== null;
}

export function getAttempts() {
    return storage.get(STORAGE_KEYS.ATTEMPTS) || [];
}

export function saveAttempt(attempt) {
    const attempts = getAttempts();
    attempt.id = Date.now();
    attempt.date = new Date().toISOString();
    attempts.push(attempt);
    return storage.set(STORAGE_KEYS.ATTEMPTS, attempts);
}

export function getAttempt(id) {
    const attempts = getAttempts();
    return attempts.find(a => a.id === parseInt(id));
}

export function getStats() {
    return storage.get(STORAGE_KEYS.STATS) || {
        questionStats: {},
        totalCorrect: 0,
        totalWrong: 0,
        totalAttempts: 0
    };
}

export function updateStats(answers) {
    const stats = getStats();
    
    answers.forEach(answer => {
        if (!stats.questionStats[answer.questionId]) {
            stats.questionStats[answer.questionId] = {
                correct: 0,
                wrong: 0,
                timesShown: 0
            };
        }
        
        const qStats = stats.questionStats[answer.questionId];
        qStats.timesShown++;
        
        if (answer.isCorrect) {
            qStats.correct++;
            stats.totalCorrect++;
        } else {
            qStats.wrong++;
            stats.totalWrong++;
        }
    });
    
    stats.totalAttempts++;
    storage.set(STORAGE_KEYS.STATS, stats);
    return stats;
}

export function getQuestionStats(questionId) {
    const stats = getStats();
    return stats.questionStats[questionId] || { correct: 0, wrong: 0, timesShown: 0 };
}

export function getTopQuestions(limit = 10) {
    const stats = getStats();
    return Object.entries(stats.questionStats)
        .filter(([_, data]) => data.timesShown > 0)
        .map(([id, data]) => ({
            questionId: parseInt(id),
            correctRate: data.correct / data.timesShown,
            correct: data.correct,
            wrong: data.wrong,
            timesShown: data.timesShown
        }))
        .sort((a, b) => b.correctRate - a.correctRate)
        .slice(0, limit);
}

export function getBottomQuestions(limit = 10) {
    const stats = getStats();
    return Object.entries(stats.questionStats)
        .filter(([_, data]) => data.timesShown > 0)
        .map(([id, data]) => ({
            questionId: parseInt(id),
            correctRate: data.correct / data.timesShown,
            correct: data.correct,
            wrong: data.wrong,
            timesShown: data.timesShown
        }))
        .sort((a, b) => a.correctRate - b.correctRate)
        .slice(0, limit);
}

export function getFailedQuestionsFromAllAttempts() {
    const attempts = getAttempts();
    const failedQuestionsMap = new Map();
    
    attempts.forEach(attempt => {
        if (attempt.answers) {
            attempt.answers.forEach(answer => {
                if (!answer.isCorrect) {
                    const existing = failedQuestionsMap.get(answer.questionId);
                    if (existing) {
                        existing.timesFailed++;
                    } else {
                        failedQuestionsMap.set(answer.questionId, {
                            questionId: answer.questionId,
                            timesFailed: 1,
                            lastAttemptFailed: true
                        });
                    }
                } else {
                    const existing = failedQuestionsMap.get(answer.questionId);
                    if (existing && existing.lastAttemptFailed) {
                        existing.lastAttemptFailed = false;
                    }
                }
            });
        }
    });
    
    return Array.from(failedQuestionsMap.values())
        .filter(q => q.lastAttemptFailed)
        .map(q => q.questionId);
}

export function saveReviewAttempt(attempt) {
    const attempts = getAttempts();
    const reviewAttempt = {
        ...attempt,
        id: Date.now(),
        date: new Date().toISOString(),
        isReview: true
    };
    attempts.push(reviewAttempt);
    return storage.set(STORAGE_KEYS.ATTEMPTS, attempts);
}

export { STORAGE_KEYS };
