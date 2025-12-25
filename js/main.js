// main.js - Полностью интегрированный с единой системой данных

// DOM элементы
const elements = {
    quickEcoPoints: document.getElementById('quickEcoPoints'),
    quickCO2Saved: document.getElementById('quickCO2Saved'),
    quickWaterSaved: document.getElementById('quickWaterSaved'),
    quickWasteRecycled: document.getElementById('quickWasteRecycled'),
    habitsHistory: document.getElementById('habitsHistory'),
    activeInitiatives: document.getElementById('activeInitiatives'),
    recommendedProducts: document.getElementById('recommendedProducts'),
    recentArticles: document.getElementById('recentArticles'),
    achievementsList: document.getElementById('achievementsList'),
    progressChart: document.getElementById('progressChart'),
    timeRange: document.getElementById('timeRange'),
    habitButtons: document.querySelectorAll('.habit-btn'),
    todayHabitsCount: document.getElementById('todayHabitsCount'),
    activeInitiativesCount: document.getElementById('activeInitiativesCount'),
    resetDataBtn: document.getElementById('resetDataBtn')
};

// Демо-данные
const demoData = {
    recommendedProducts: [
        { id: 1, title: 'Многоразовая эко-бутылка', icon: '💧', price: 125, category: 'Кухня' },
        { id: 2, title: 'Эко-сумка', icon: '🛍️', price: 350, category: 'Сумки' }
    ],
    recentArticles: [
        { id: 1, title: 'Как начать сортировать отходы', icon: '📝', date: '2025-01-19', readTime: '5 мин' },
        { id: 2, title: 'Экономия воды в быту', icon: '💧', date: '2025-01-18', readTime: '7 мин' }
    ]
};

// Инициализация при загрузке
document.addEventListener('DOMContentLoaded', function() {
    // Загружаем data-manager если его нет
    if (!window.dataManager) {
        console.log('Загружаем DataManager для дашборда...');
        const script = document.createElement('script');
        script.src = 'js/data-manager.js';
        script.onload = function() {
            console.log('DataManager загружен для дашборда');
            initializeDashboard();
        };
        document.head.appendChild(script);
    } else {
        initializeDashboard();
    }
});

function initializeDashboard() {
    setupEventListeners();
    initializeChart();
    updateDashboard();
    
    // Подписываемся на обновления данных
    document.addEventListener('ecodata-updated', function() {
        updateDashboard();
    });
}

// Обновление всего дашборда
function updateDashboard() {
    if (!window.dataManager) {
        console.error('DataManager не доступен');
        return;
    }
    
    const stats = window.dataManager.getDashboardStats();
    
    // Обновляем быструю статистику
    updateQuickStats(stats.quickStats);
    
    // Обновляем активные инициативы
    updateActiveInitiatives(stats.activeInitiatives);
    
    // Обновляем историю привычек
    updateHabitsHistory(stats.recentHabits);
    
    // Обновляем достижения
    updateAchievements(stats.recentAchievements);
    
    // Обновляем рекомендации и статьи
    updateRecommendedProducts();
    updateRecentArticles();
    
    // Обновляем график
    updateChartData(stats.weekProgress);
    
    console.log('Дашборд обновлен:', stats);
}

// Обновление быстрой статистики
function updateQuickStats(quickStats) {
    if (!quickStats) return;
    
    if (elements.quickEcoPoints) {
        elements.quickEcoPoints.textContent = quickStats.ecoPoints;
    }
    if (elements.quickCO2Saved) {
        elements.quickCO2Saved.textContent = quickStats.co2Saved + ' кг';
    }
    if (elements.quickWaterSaved) {
        elements.quickWaterSaved.textContent = quickStats.waterSaved + ' л';
    }
    if (elements.quickWasteRecycled) {
        elements.quickWasteRecycled.textContent = quickStats.wasteRecycled + ' кг';
    }
    if (elements.todayHabitsCount) {
        elements.todayHabitsCount.textContent = quickStats.todayHabits;
    }
    if (elements.activeInitiativesCount) {
        elements.activeInitiativesCount.textContent = quickStats.activeInitiatives;
    }
}

// Обновление активных инициатив
function updateActiveInitiatives(activeInitiatives) {
    if (!elements.activeInitiatives) return;
    
    elements.activeInitiatives.innerHTML = '';
    
    if (!activeInitiatives || activeInitiatives.length === 0) {
        elements.activeInitiatives.innerHTML = `
            <div class="dashboard-empty">
                <div class="dashboard-empty__icon">📋</div>
                <div class="dashboard-empty__content">
                    <div class="dashboard-empty__title">Нет активных инициатив</div>
                    <div class="dashboard-empty__description">
                        Начните инициативу для отслеживания прогресса
                    </div>
                    <a href="initiatives.html" class="btn btn--small btn--primary">
                        <span>🎯</span>
                        <span>Начать инициативу</span>
                    </a>
                </div>
            </div>
        `;
        return;
    }
    
    // Показываем до 2 активных инициатив
    activeInitiatives.slice(0, 2).forEach(initiative => {
        const initiativeHTML = `
            <div class="dashboard-initiative" data-id="${initiative.id}">
                <div class="dashboard-initiative__header">
                    <span class="dashboard-initiative__icon">${initiative.icon}</span>
                    <div class="dashboard-initiative__info">
                        <div class="dashboard-initiative__title">${initiative.title}</div>
                        <div class="dashboard-initiative__meta">
                            <span>День ${initiative.currentDay}/${initiative.totalDays}</span>
                            <span>${initiative.completedTasks}/${initiative.totalTasks} задач</span>
                        </div>
                    </div>
                </div>
                <div class="dashboard-initiative__progress">
                    <div class="progress-bar">
                        <div class="progress-fill" style="width: ${initiative.progress}%"></div>
                    </div>
                    <div class="dashboard-initiative__progress-text">${initiative.progress}%</div>
                </div>
                <div class="dashboard-initiative__actions">
                    <a href="initiatives.html" class="btn btn--small btn--primary" onclick="focusInitiative(${initiative.id})">
                        <span>📋</span>
                        <span>Продолжить</span>
                    </a>
                </div>
            </div>
        `;
        
        elements.activeInitiatives.innerHTML += initiativeHTML;
    });
    
    // Если больше 2 инициатив, показываем ссылку "Все"
    if (activeInitiatives.length > 2) {
        elements.activeInitiatives.innerHTML += `
            <div class="dashboard-initiatives-more">
                <a href="initiatives.html" class="dashboard-initiatives-link">
                    <span>➕</span>
                    <span>Ещё ${activeInitiatives.length - 2} инициатив</span>
                </a>
            </div>
        `;
    }
}

// Фокус на конкретной инициативе
window.focusInitiative = function(initiativeId) {
    // Сохраняем ID инициативы для фокуса
    sessionStorage.setItem('focusedInitiative', initiativeId);
};

// Обновление истории привычек
function updateHabitsHistory(recentHabits) {
    if (!elements.habitsHistory) return;
    
    elements.habitsHistory.innerHTML = '';
    
    if (!recentHabits || recentHabits.length === 0) {
        elements.habitsHistory.innerHTML = `
            <div class="habits-empty">
                <div class="habits-empty__icon">🚲</div>
                <div class="habits-empty__text">Пока нет привычек</div>
            </div>
        `;
        return;
    }
    
    recentHabits.forEach(habit => {
        const habitInfo = getHabitInfo(habit.type);
        const date = new Date(habit.date);
        const formattedDate = date.toLocaleDateString('ru-RU', {
            day: 'numeric',
            month: 'short',
            hour: '2-digit',
            minute: '2-digit'
        });
        
        const habitHTML = `
            <div class="habit-history-item">
                <div class="habit-history-info">
                    <span class="habit-history-icon">${habitInfo.icon}</span>
                    <div class="habit-history-details">
                        <div class="habit-history-type">${habitInfo.name}</div>
                        <div class="habit-history-date">${formattedDate}</div>
                    </div>
                </div>
                <div class="habit-history-points">+${habit.points}</div>
            </div>
        `;
        
        elements.habitsHistory.innerHTML += habitHTML;
    });
}

// Информация о привычках
function getHabitInfo(type) {
    const habits = {
        bike: { name: 'Велосипед', icon: '🚲' },
        recycle: { name: 'Переработка', icon: '♻️' },
        water: { name: 'Экономия воды', icon: '💧' },
        energy: { name: 'Экономия энергии', icon: '💡' }
    };
    return habits[type] || { name: 'Неизвестно', icon: '❓' };
}

// Обновление достижений
function updateAchievements(recentAchievements) {
    if (!elements.achievementsList) return;
    
    elements.achievementsList.innerHTML = '';
    
    if (!recentAchievements || recentAchievements.length === 0) {
        elements.achievementsList.innerHTML = `
            <div class="achievements-empty">
                <div class="achievements-empty__icon">🏆</div>
                <div class="achievements-empty__text">Пока нет достижений</div>
            </div>
        `;
        return;
    }
    
    // Показываем последние 3 достижения
    recentAchievements.slice(0, 3).forEach(achievement => {
        const achievementHTML = `
            <div class="achievement" title="${achievement.title} • ${achievement.date}">
                <span class="achievement__icon">${achievement.icon}</span>
                <div class="achievement__title">${achievement.title}</div>
                <div class="achievement__date">${achievement.date}</div>
            </div>
        `;
        
        elements.achievementsList.innerHTML += achievementHTML;
    });
}

// Обновление рекомендованных товаров и статей (демо)
function updateRecommendedProducts() {
    if (!elements.recommendedProducts) return;
    
    elements.recommendedProducts.innerHTML = '';
    
    demoData.recommendedProducts.forEach(product => {
        const productHTML = `
            <div class="product-item">
                <span class="product-item__icon">${product.icon}</span>
                <div class="product-item__content">
                    <div class="product-item__title">${product.title}</div>
                    <div class="product-item__info">
                        <span>${product.category}</span>
                        <span>${product.price} руб.</span>
                    </div>
                </div>
            </div>
        `;
        
        elements.recommendedProducts.innerHTML += productHTML;
    });
}

function updateRecentArticles() {
    if (!elements.recentArticles) return;
    
    elements.recentArticles.innerHTML = '';
    
    demoData.recentArticles.forEach(article => {
        const articleHTML = `
            <div class="article-item">
                <span class="article-item__icon">${article.icon}</span>
                <div class="article-item__content">
                    <div class="article-item__title">${article.title}</div>
                    <div class="article-item__info">
                        <span>${article.date}</span>
                        <span>${article.readTime}</span>
                    </div>
                </div>
            </div>
        `;
        
        elements.recentArticles.innerHTML += articleHTML;
    });
}

// Настройка обработчиков событий
function setupEventListeners() {
    // Кнопки привычек
    elements.habitButtons.forEach(button => {
        button.addEventListener('click', function() {
            const habitType = this.dataset.habit;
            const co2Saved = parseFloat(this.dataset.co2);
            addHabit(habitType, co2Saved);
            
            // Визуальная обратная связь
            this.classList.add('habit-btn--added');
            setTimeout(() => {
                this.classList.remove('habit-btn--added');
            }, 2000);
        });
    });
    
    // Селектор диапазона времени
    if (elements.timeRange) {
        elements.timeRange.addEventListener('change', function() {
            updateChart(this.value);
        });
    }

    // Сброс данных
    if (elements.resetDataBtn) {
        const resetModal = document.getElementById('resetModal');
        const resetModalClose = document.getElementById('resetModalClose');
        const resetModalCancel = document.getElementById('resetModalCancel');
        const resetModalConfirm = document.getElementById('resetModalConfirm');

        const resetData = () => {
            if (window.dataManager) {
                window.dataManager.resetAllData();
                showNotification('Все данные успешно сброшены', 'success');
                // Небольшая задержка перед обновлением интерфейса
                setTimeout(() => {
                    window.location.reload();
                }, 1000);
            }
        };

        const closeModal = () => {
            if (resetModal) {
                resetModal.setAttribute('aria-hidden', 'true');
            }
        };

        elements.resetDataBtn.addEventListener('click', function(e) {
            e.preventDefault();
            if (resetModal) {
                resetModal.setAttribute('aria-hidden', 'false');
            } else if (confirm('Вы уверены, что хотите сбросить все данные? Это действие нельзя отменить.')) {
                resetData();
            }
        });

        if (resetModalClose) resetModalClose.addEventListener('click', closeModal);
        if (resetModalCancel) resetModalCancel.addEventListener('click', closeModal);
        
        if (resetModal) {
            resetModal.addEventListener('click', (e) => {
                if (e.target === resetModal) closeModal();
            });
        }

        if (resetModalConfirm) {
            resetModalConfirm.addEventListener('click', function() {
                resetData();
                closeModal();
            });
        }
    }
}

// Добавление привычки
function addHabit(type, co2) {
    if (!window.dataManager) return;
    
    const points = Math.round(co2 * 42); // Формула начисления баллов
    
    const habitData = {
        type: type,
        co2: co2,
        points: points,
        description: getHabitInfo(type).name
    };
    
    window.dataManager.addHabit(habitData);
    
    showNotification(`Привычка добавлена! +${points} баллов`, 'success');
}

// Инициализация графика
function initializeChart() {
    if (!elements.progressChart) return;
    
    const ctx = elements.progressChart.getContext('2d');
    
    window.progressChart = new Chart(ctx, {
        type: 'line',
        data: {
            labels: ['Пн', 'Вт', 'Ср', 'Чт', 'Пт', 'Сб', 'Вс'],
            datasets: [{
                label: 'Активность',
                data: [65, 78, 90, 81, 86, 55, 40],
                borderColor: 'var(--primary-color)',
                backgroundColor: 'rgba(46, 139, 87, 0.1)',
                borderWidth: 3,
                tension: 0.4,
                fill: true,
                pointBackgroundColor: 'var(--accent-color)',
                pointBorderColor: 'var(--text-light)',
                pointBorderWidth: 2,
                pointRadius: 6
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
                legend: {
                    display: false
                },
                tooltip: {
                    backgroundColor: 'var(--text-light)',
                    titleColor: 'var(--accent-color)',
                    bodyColor: 'var(--text-color)',
                    borderColor: 'var(--border-color)',
                    borderWidth: 1,
                    cornerRadius: 8,
                    padding: 12
                }
            },
            scales: {
                x: {
                    grid: {
                        color: 'rgba(139, 69, 19, 0.1)'
                    },
                    ticks: {
                        color: 'var(--text-color)'
                    }
                },
                y: {
                    beginAtZero: true,
                    grid: {
                        color: 'rgba(139, 69, 19, 0.1)'
                    },
                    ticks: {
                        color: 'var(--text-color)',
                        callback: function(value) {
                            return value + ' баллов';
                        }
                    }
                }
            }
        }
    });
}

// Обновление данных графика
function updateChartData(weekProgress) {
    if (!window.progressChart || !weekProgress) return;
    
    const labels = Object.keys(weekProgress);
    const data = Object.values(weekProgress);
    
    window.progressChart.data.labels = labels;
    window.progressChart.data.datasets[0].data = data;
    window.progressChart.update();
}

// Обновление графика по диапазону
function updateChart(range) {
    if (!window.progressChart) return;
    
    let labels, data;
    
    switch(range) {
        case 'month':
            labels = ['Нед.1', 'Нед.2', 'Нед.3', 'Нед.4'];
            data = [285, 320, 290, 310];
            break;
        case 'year':
            labels = ['Янв', 'Фев', 'Мар', 'Апр', 'Май', 'Июн', 'Июл', 'Авг', 'Сен', 'Окт', 'Ноя', 'Дек'];
            data = [1200, 1100, 1300, 1400, 1250, 1350, 1280, 1450, 1380, 1500, 1420, 1550];
            break;
        default: // week
            labels = ['Пн', 'Вт', 'Ср', 'Чт', 'Пт', 'Сб', 'Вс'];
            data = [65, 78, 90, 81, 86, 55, 40];
    }
    
    window.progressChart.data.labels = labels;
    window.progressChart.data.datasets[0].data = data;
    window.progressChart.update();
}

// Показ уведомления
function showNotification(message, type = 'info') {
    const notification = document.createElement('div');
    notification.className = `notification notification--${type}`;
    notification.innerHTML = `
        <span class="notification__icon">${type === 'success' ? '✅' : 'ℹ️'}</span>
        <span class="notification__text">${message}</span>
    `;
    
    document.body.appendChild(notification);
    
    setTimeout(() => {
        notification.style.opacity = '0';
        setTimeout(() => {
            if (notification.parentNode) {
                document.body.removeChild(notification);
            }
        }, 300);
    }, 3000);
}

// Добавляем недостающие стили
const dashboardStyles = document.createElement('style');
dashboardStyles.textContent = `
    /* Стили для дашборда */
    .dashboard-empty,
    .habits-empty,
    .achievements-empty {
        text-align: center;
        padding: 1.5rem;
        background: rgba(245, 245, 220, 0.3);
        border-radius: var(--border-radius-sm);
        border: 1px dashed var(--border-color);
    }
    
    .dashboard-empty__icon,
    .habits-empty__icon,
    .achievements-empty__icon {
        font-size: 2rem;
        margin-bottom: 1rem;
        opacity: 0.5;
    }
    
    .dashboard-empty__title,
    .habits-empty__text,
    .achievements-empty__text {
        font-weight: 600;
        color: var(--accent-color);
        margin-bottom: 0.5rem;
    }
    
    .dashboard-empty__description {
        font-size: 0.9rem;
        color: var(--text-color);
        opacity: 0.7;
        margin-bottom: 1rem;
    }
    
    .habit-btn--added {
        background: rgba(46, 139, 87, 0.2) !important;
        border-color: var(--primary-color) !important;
        transform: scale(0.98);
    }
    
    /* Анимации */
    @keyframes pulse {
        0% { transform: scale(1); }
        50% { transform: scale(1.05); }
        100% { transform: scale(1); }
    }
    
    .habit-btn--added {
        animation: pulse 0.5s ease;
    }
    
    /* Уведомления */
    .notification {
        animation: slideIn 0.3s ease-out;
    }
    
    .notification--success {
        border-left-color: var(--primary-color);
    }
    
    .notification--info {
        border-left-color: var(--accent-color);
    }
`;

if (!document.querySelector('style[data-dashboard-update]')) {
    dashboardStyles.setAttribute('data-dashboard-update', 'true');
    document.head.appendChild(dashboardStyles);
}
