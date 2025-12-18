// main.js - Функциональность главной страницы (в стиле калькулятора и товаров)

// Данные пользователя
const userData = {
    ecoPoints: 0,
    co2Saved: 0,
    waterSaved: 0,
    wasteRecycled: 0,
    habits: [],
    activeInitiatives: [],
    achievements: [],
    favoriteProducts: [],
    readArticles: []
};

// Демо-данные
const demoData = {
    habits: [
        { type: 'bike', co2: 1.2, points: 50, date: '2025-01-20T08:30:00' },
        { type: 'recycle', co2: 0.5, points: 30, date: '2025-01-20T12:15:00' },
        { type: 'water', co2: 0.3, points: 20, date: '2025-01-19T19:45:00' },
        { type: 'energy', co2: 0.8, points: 40, date: '2025-01-19T10:20:00' }
    ],
    activeInitiatives: [
        { id: 1, title: 'Неделя без пластика', progress: 3, totalDays: 7, icon: '🚫' },
        { id: 2, title: 'Экономь воду', progress: 1, totalDays: 7, icon: '💧' }
    ],
    achievements: [
        { id: 1, title: 'Эко-новичок', icon: '🌱', date: '2025-01-10' },
        { id: 2, title: 'Велосипедист', icon: '🚲', date: '2025-01-15' },
        { id: 3, title: 'Переработчик', icon: '♻️', date: '2025-01-18' },
        { id: 4, title: 'Водный хранитель', icon: '💧', date: '2025-01-20' }
    ],
    recommendedProducts: [
        { id: 1, title: 'Многоразовая эко-бутылка', icon: '💧', price: 125, category: 'Кухня' },
        { id: 2, title: 'Эко-сумка', icon: '🛍️', price: 350, category: 'Сумки' }
    ],
    recentArticles: [
        { id: 1, title: 'Переход на локальные продукты', icon: '📝', date: '2025-10-19', readTime: '1 мин' },
        { id: 2, title: 'Рациональное использование воды', icon: '💧', date: '2025-10-18', readTime: '1 мин' }
    ]
};

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
    habitButtons: document.querySelectorAll('.habit-btn')
};

// Инициализация при загрузке
document.addEventListener('DOMContentLoaded', function() {
    initializePage();
    setupEventListeners();
});

// Инициализация страницы
function initializePage() {
    // DataManager и INITIATIVES_DATA теперь подключаются напрямую в HTML,
    // поэтому просто загружаем данные и отрисовываем дашборд.
    loadUserData();
    loadProductsData();
    updateDashboard();
    
    // Обновление при изменении данных из других частей приложения
    document.addEventListener('ecodata-updated', function() {
        loadUserData();
        updateDashboard();
    });
    
    // Инициализация кнопки сброса данных
    initResetButton();
}

// Загрузка данных товаров для рекомендаций
// На дашборде используем встроенные demoData, поэтому
// дополнительная логика ожидания PRODUCTS не нужна.
function loadProductsData() {
    updateRecommendedProducts();
}

// Инициализация кнопки сброса данных
function initResetButton() {
    const resetBtn = document.getElementById('resetDataBtn');
    const resetModal = document.getElementById('resetModal');
    const resetModalClose = document.getElementById('resetModalClose');
    const resetModalCancel = document.getElementById('resetModalCancel');
    const resetModalConfirm = document.getElementById('resetModalConfirm');
    
    if (!resetBtn || !resetModal) return;
    
    // Открытие модального окна
    resetBtn.addEventListener('click', () => {
        resetModal.setAttribute('aria-hidden', 'false');
        document.body.style.overflow = 'hidden';
    });
    
    // Закрытие модального окна
    const closeModal = () => {
        resetModal.setAttribute('aria-hidden', 'true');
        document.body.style.overflow = '';
    };
    
    if (resetModalClose) {
        resetModalClose.addEventListener('click', closeModal);
    }
    
    if (resetModalCancel) {
        resetModalCancel.addEventListener('click', closeModal);
    }
    
    // Клик вне модального окна
    resetModal.addEventListener('click', (e) => {
        if (e.target === resetModal) {
            closeModal();
        }
    });
    
    // Подтверждение сброса
    if (resetModalConfirm) {
        resetModalConfirm.addEventListener('click', () => {
            if (!window.dataManager) {
                showNotification('Ошибка: DataManager не загружен', 'error');
                return;
            }
            
            // Сброс данных
            window.dataManager.resetAllData();
            
            // Закрываем модальное окно
            closeModal();
            
            // Показываем уведомление
            showNotification('Все данные успешно сброшены', 'success');
            
            // Обновляем дашборд
            setTimeout(() => {
                loadUserData();
                updateDashboard();
                // Перезагружаем страницу для полного обновления
                window.location.reload();
            }, 1000);
        });
    }
}

// Загрузка данных инициатив для отображения на дашборде
// (инициативы подключаются в HTML через ../js/initiatives.js,
// поэтому дополнительная динамическая загрузка здесь не нужна)
function loadInitiativesData() {
    // Оставляем функцию-пустышку для совместимости, на случай,
    // если она где-то вызывается. Все данные уже есть в window.INITIATIVES_DATA.
    return;
}

// Загрузка данных пользователя
function loadUserData() {
    // Используем data-manager если доступен
    if (window.dataManager) {
        const stats = window.dataManager.getDashboardStats();
        userData.ecoPoints = stats.quickStats.ecoPoints;
        userData.co2Saved = parseFloat(stats.quickStats.co2Saved);
        userData.waterSaved = stats.quickStats.waterSaved;
        userData.activeInitiatives = stats.activeInitiatives;
        userData.habits = stats.recentHabits;
        userData.achievements = stats.recentAchievements;
    } else {
        const savedData = localStorage.getItem('ecoplatform_user');
        
        if (savedData) {
            const parsedData = JSON.parse(savedData);
            Object.assign(userData, parsedData);
        } else {
            // Используем демо-данные
            Object.assign(userData, {
                habits: demoData.habits,
                activeInitiatives: demoData.activeInitiatives,
                achievements: demoData.achievements
            });
            
            saveUserData();
        }
    }
}

// Сохранение данных пользователя
function saveUserData() {
    localStorage.setItem('ecoplatform_user', JSON.stringify(userData));
}

// Обновление дашборда
function updateDashboard() {
    updateQuickStats();
    updateHabitsHistory();
    updateActiveInitiatives();
    updateRecommendedProducts();
    updateRecentArticles();
    updateAchievements();
}

// Обновление быстрой статистики
function updateQuickStats() {
    if (elements.quickEcoPoints) {
        elements.quickEcoPoints.textContent = userData.ecoPoints || 0;
    }
    if (elements.quickCO2Saved) {
        elements.quickCO2Saved.textContent = (userData.co2Saved || 0).toFixed(1) + ' кг';
    }
    if (elements.quickWaterSaved) {
        elements.quickWaterSaved.textContent = (userData.waterSaved || 0) + ' л';
    }
    if (elements.quickWasteRecycled) {
        elements.quickWasteRecycled.textContent = (userData.wasteRecycled || 0).toFixed(1) + ' кг';
    }
    
    // Обновляем счетчики
    if (window.dataManager) {
        const stats = window.dataManager.getDashboardStats();

        const todayHabitsCount = document.getElementById('todayHabitsCount');
        if (todayHabitsCount) {
            todayHabitsCount.textContent = stats.quickStats.todayHabits || 0;
        }
        
        const activeInitiativesCount = document.getElementById('activeInitiativesCount');
        if (activeInitiativesCount) {
            activeInitiativesCount.textContent = stats.quickStats.activeInitiatives || 0;
        }

        // Обновляем уровень и прогресс до следующего уровня
        const levelInfo = stats.quickStats.level;
        const levelLabel = document.getElementById('ecoLevelLabel');
        const levelProgress = document.getElementById('ecoLevelProgress');

        if (levelInfo && levelLabel) {
            levelLabel.textContent = `${levelInfo.currentLevel.icon} ${levelInfo.currentLevel.name}`;
        }

        if (levelInfo && levelProgress) {
            if (levelInfo.nextLevel) {
                levelProgress.textContent = `До уровня "${levelInfo.nextLevel.name}": ${levelInfo.pointsToNext} баллов`;
            } else {
                levelProgress.textContent = 'Достигнут максимальный уровень 🎉';
            }
        }
    }
}

// Обновление истории привычек
function updateHabitsHistory() {
    if (!elements.habitsHistory) return;
    
    elements.habitsHistory.innerHTML = '';
    
    const recentHabits = userData.habits
        .sort((a, b) => new Date(b.date) - new Date(a.date))
        .slice(0, 5);
    
    if (recentHabits.length === 0) {
        elements.habitsHistory.innerHTML = `
            <div class="text-center p-3">
                <div class="text-muted">Пока нет привычек</div>
                <div class="text-muted" style="font-size: 0.9rem;">Добавьте первую привычку!</div>
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
        
        const habitElement = document.createElement('div');
        habitElement.className = 'habit-history-item';
        habitElement.innerHTML = `
            <div class="habit-history-info">
                <span class="habit-history-icon">${habitInfo.icon}</span>
                <div class="habit-history-details">
                    <div class="habit-history-type">${habitInfo.name}</div>
                    <div class="habit-history-date">${formattedDate}</div>
                </div>
            </div>
            <div class="habit-history-points">+${habit.points}</div>
        `;
        
        elements.habitsHistory.appendChild(habitElement);
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

// Обновление активных инициатив
function updateActiveInitiatives() {
    if (!elements.activeInitiatives) return;
    
    elements.activeInitiatives.innerHTML = '';
    
    // Получаем активные инициативы из data-manager
    let activeInitiatives = [];
    if (window.dataManager) {
        activeInitiatives = window.dataManager.getActiveInitiatives();
    } else if (userData.activeInitiatives) {
        activeInitiatives = userData.activeInitiatives;
    }
    
    if (activeInitiatives.length === 0) {
        elements.activeInitiatives.innerHTML = `
            <div class="text-center p-3">
                <div class="text-muted">Нет активных инициатив</div>
                <a href="initiatives.html" class="btn btn--secondary btn--small mt-2" style="display: inline-block;">
                    Начать инициативу
                </a>
            </div>
        `;
        return;
    }
    
    // Загружаем данные инициатив (из initiatives.js)
    const INITIATIVES_DATA = window.INITIATIVES_DATA || [];
    
    // Если данных нет, пытаемся загрузить
    if (INITIATIVES_DATA.length === 0) {
        loadInitiativesData();
        return;
    }
    
    activeInitiatives.forEach(initiativeProgress => {
        const initiativeData = INITIATIVES_DATA.find(i => i.id === initiativeProgress.id);
        if (!initiativeData) {
            // Если данных нет, используем данные из прогресса
            const initiativeElement = document.createElement('div');
            initiativeElement.className = 'initiative-item';
            initiativeElement.setAttribute('data-id', initiativeProgress.id);
            initiativeElement.style.cursor = 'pointer';
            initiativeElement.innerHTML = `
                <span class="initiative-item__icon">🎯</span>
                <div class="initiative-item__content">
                    <div class="initiative-item__title">${initiativeProgress.title || 'Инициатива'}</div>
                    <div class="initiative-item__info">
                        <span>Прогресс: ${initiativeProgress.progress || 0}%</span>
                        <div style="flex: 1; max-width: 120px; height: 6px; background: rgba(139, 69, 19, 0.1); border-radius: 3px; overflow: hidden; margin-left: 0.5rem;">
                            <div style="width: ${initiativeProgress.progress || 0}%; height: 100%; background: linear-gradient(90deg, var(--primary-color), var(--accent-color)); transition: width 0.3s ease;"></div>
                        </div>
                    </div>
                </div>
                <div class="initiative-item__progress">${initiativeProgress.progress || 0}%</div>
            `;
            initiativeElement.addEventListener('click', () => {
                window.location.href = `initiatives.html#initiative-${initiativeProgress.id}`;
            });
            elements.activeInitiatives.appendChild(initiativeElement);
            return;
        }
        
        const progressPercent = initiativeProgress.progress || 0;
        const completedTasks = initiativeProgress.completedTasks?.length || 0;
        const totalTasks = initiativeProgress.totalTasks || initiativeData.checklist?.length || 0;
        const currentDay = initiativeProgress.currentDay || 1;
        
        const initiativeElement = document.createElement('div');
        initiativeElement.className = 'initiative-item';
        initiativeElement.setAttribute('data-id', initiativeProgress.id);
        initiativeElement.style.cursor = 'pointer';
        initiativeElement.innerHTML = `
            <span class="initiative-item__icon">${initiativeData.image || '🎯'}</span>
            <div class="initiative-item__content">
                <div class="initiative-item__title">${initiativeData.title || initiativeProgress.title}</div>
                <div class="initiative-item__info">
                    <span>День ${currentDay} из ${initiativeProgress.totalDays || initiativeData.duration || '?'}</span>
                    <span>•</span>
                    <span>${completedTasks}/${totalTasks} задач</span>
                    <div style="flex: 1; max-width: 120px; height: 6px; background: rgba(139, 69, 19, 0.1); border-radius: 3px; overflow: hidden; margin-left: 0.5rem;">
                        <div style="width: ${progressPercent}%; height: 100%; background: linear-gradient(90deg, var(--primary-color), var(--accent-color)); transition: width 0.3s ease;"></div>
                    </div>
                </div>
            </div>
            <div class="initiative-item__progress">${progressPercent}%</div>
        `;
        
        // Клик для перехода к инициативе
        initiativeElement.addEventListener('click', () => {
            window.location.href = `initiatives.html#initiative-${initiativeProgress.id}`;
        });
        
        elements.activeInitiatives.appendChild(initiativeElement);
    });
    
    // Обновляем счетчик активных инициатив
    const activeInitiativesCount = document.getElementById('activeInitiativesCount');
    if (activeInitiativesCount) {
        activeInitiativesCount.textContent = activeInitiatives.length;
    }
}

// Обновление рекомендаций товаров
function updateRecommendedProducts() {
    if (!elements.recommendedProducts) return;
    
    elements.recommendedProducts.innerHTML = '';
    
    // Если есть реальные товары из products.js — используем их
    if (Array.isArray(window.PRODUCTS) && window.PRODUCTS.length > 0) {
        const topProducts = window.PRODUCTS.slice(0, 4);
        
        topProducts.forEach(product => {
            const productElement = document.createElement('div');
            productElement.className = 'product-item';
            productElement.innerHTML = `
                <span class="product-item__icon">🛍️</span>
                <div class="product-item__content">
                    <div class="product-item__title">${product.title}</div>
                    <div class="product-item__info">
                        <span>${product.category}</span>
                        <span>${product.price} руб.</span>
                    </div>
                </div>
            `;
            
            // Переход к товару по клику
            productElement.addEventListener('click', () => {
                window.location.href = `products.html#product-${product.id}`;
            });
            
            elements.recommendedProducts.appendChild(productElement);
        });
        return;
    }
    
    // Fallback: демо-данные
    demoData.recommendedProducts.forEach(product => {
        const productElement = document.createElement('div');
        productElement.className = 'product-item';
        productElement.innerHTML = `
            <span class="product-item__icon">${product.icon}</span>
            <div class="product-item__content">
                <div class="product-item__title">${product.title}</div>
                <div class="product-item__info">
                    <span>${product.category}</span>
                    <span>${product.price} руб.</span>
                </div>
            </div>
        `;
        
        elements.recommendedProducts.appendChild(productElement);
    });
}






// Обновление последних статей
function updateRecentArticles() {
    if (!elements.recentArticles) return;
    
    elements.recentArticles.innerHTML = '';
    
    // Если уже есть кэш загруженных статей — используем его
    if (Array.isArray(window.RECENT_ARTICLES_CACHE) && window.RECENT_ARTICLES_CACHE.length > 0) {
        renderRecentArticles(window.RECENT_ARTICLES_CACHE);
        return;
    }
    
    // Загружаем реальные статьи из JSON
    fetch('../json/articles.json')
        .then(resp => resp.json())
        .then(raw => {
            const articles = raw.map(a => ({
                id: a.id,
                title: a.title,
                date: a.date,
                readTime: a.readTime || '1 мин'
            }));
            
            // Сортируем по дате (последние сверху)
            articles.sort((a, b) => {
                const da = new Date(a.date);
                const db = new Date(b.date);
                return db - da;
            });
            
            const latest = articles.slice(0, 4);
            window.RECENT_ARTICLES_CACHE = latest;
            renderRecentArticles(latest);
        })
        .catch(() => {
            // Fallback: демо-данные
            renderRecentArticles(demoData.recentArticles);
        });
}

function renderRecentArticles(list) {
    if (!elements.recentArticles) return;
    
    elements.recentArticles.innerHTML = '';
    
    list.forEach(article => {
        const articleElement = document.createElement('div');
        articleElement.className = 'article-item';
        articleElement.innerHTML = `
            <span class="article-item__icon">${article.icon || '📝'}</span>
            <div class="article-item__content">
                <div class="article-item__title">${article.title}</div>
                <div class="article-item__info">
                    <span>${article.date || ''}</span>
                    <span>${article.readTime || '1 мин'}</span>
                </div>
            </div>
        `;
        
        articleElement.addEventListener('click', () => {
            window.location.href = `articles.html?article=${article.id}`;
        });
        
        elements.recentArticles.appendChild(articleElement);
    });
}

// Обновление достижений
function updateAchievements() {
    if (!elements.achievementsList) return;
    
    elements.achievementsList.innerHTML = '';
    
    userData.achievements.forEach(achievement => {
        const achievementElement = document.createElement('div');
        achievementElement.className = 'achievement';
        achievementElement.innerHTML = `
            <span class="achievement__icon">${achievement.icon}</span>
            <div class="achievement__title">${achievement.title}</div>
            <div class="achievement__date">${achievement.date}</div>
        `;
        
        // Добавляем подсказку при наведении
        achievementElement.title = `${achievement.title} • Получено ${achievement.date}`;
        
        elements.achievementsList.appendChild(achievementElement);
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
            this.setAttribute('data-added', 'true');
            setTimeout(() => {
                this.removeAttribute('data-added');
            }, 2000);
        });
    });
    
}

// Добавление привычки
function addHabit(type, co2) {
    const now = new Date().toISOString();
    const points = Math.round(co2 * 42); // Формула начисления баллов
    
    // Если доступен DataManager — добавляем привычку через него,
    // чтобы всё хранилось в единой системе и обновлялись глобальные метрики.
    if (window.dataManager) {
        window.dataManager.addHabit({
            type: type,
            co2: co2,
            points: points,
            description: getHabitInfo(type).name
        });
        
        // Локально обновляем данные и дашборд
        loadUserData();
        updateDashboard();
        
        showNotification(`Привычка добавлена! +${points} баллов`, 'success');
        return;
    }
    
    // Fallback без DataManager (на всякий случай)
    const newHabit = {
        type: type,
        co2: co2,
        points: points,
        date: now
    };
    
    userData.habits.unshift(newHabit);
    userData.ecoPoints += points;
    userData.co2Saved += co2;
    
    switch(type) {
        case 'water':
            userData.waterSaved += 50;
            break;
        case 'recycle':
            userData.wasteRecycled += 2;
            break;
    }
    
    checkForAchievements();
    saveUserData();
    updateDashboard();
    showNotification(`Привычка добавлена! +${points} баллов`, 'success');
}

// Проверка достижений
function checkForAchievements() {
    const newAchievements = [];
    
    // Проверка достижения "Эко-активист"
    if (userData.habits.length >= 10 && !userData.achievements.some(a => a.id === 5)) {
        newAchievements.push({
            id: 5,
            title: 'Эко-активист',
            icon: '🌟',
            date: new Date().toISOString().split('T')[0]
        });
    }
    
    // Проверка достижения "CO₂ борец"
    if (userData.co2Saved >= 50 && !userData.achievements.some(a => a.id === 6)) {
        newAchievements.push({
            id: 6,
            title: 'CO₂ борец',
            icon: '🌍',
            date: new Date().toISOString().split('T')[0]
        });
    }
    
    // Добавляем новые достижения
    if (newAchievements.length > 0) {
        userData.achievements.push(...newAchievements);
        
        // Показываем уведомление о достижениях
        newAchievements.forEach(achievement => {
            showNotification(`Новое достижение: ${achievement.title}!`, 'info');
        });
    }
}


// Показ уведомления
function showNotification(message, type = 'info') {
    // Удаляем предыдущие уведомления
    const existingNotifications = document.querySelectorAll('.notification');
    existingNotifications.forEach(notification => {
        notification.remove();
    });
    
    // Определяем иконку в зависимости от типа
    let icon = 'ℹ️';
    if (type === 'success') icon = '✅';
    else if (type === 'error') icon = '❌';
    else if (type === 'warning') icon = '⚠️';
    
    // Создаем новое уведомление
    const notification = document.createElement('div');
    notification.className = `notification notification--${type}`;
    notification.innerHTML = `
        <span class="notification__icon">${icon}</span>
        <span class="notification__text">${message}</span>
    `;
    
    // Добавляем в DOM
    document.body.appendChild(notification);
    
    // Автоматическое удаление через 3 секунды
    setTimeout(() => {
        if (notification.parentNode) {
            notification.style.opacity = '0';
            notification.style.transform = 'translateX(100%)';
            
            setTimeout(() => {
                if (notification.parentNode) {
                    notification.remove();
                }
            }, 300);
        }
    }, 3000);
}

// Добавляем глобальные стили для уведомлений (защищённо, чтобы избежать конфликта с другими модулями)
(function(){
    if (document.querySelector('style[data-notifications]')) return;
    const ns = document.createElement('style');
    ns.setAttribute('data-notifications', 'true');
    ns.textContent = `
    .notification {
        position: fixed;
        top: 20px;
        right: 20px;
        background: var(--text-light);
        border-left: 4px solid var(--primary-color);
        padding: 1rem 1.5rem;
        border-radius: var(--border-radius-sm);
        box-shadow: var(--shadow-medium);
        display: flex;
        align-items: center;
        gap: 0.75rem;
        z-index: 2000;
        animation: slideInRight 0.3s ease-out;
        transition: all 0.3s ease;
    }
    
    .notification--success {
        border-left-color: var(--primary-color);
    }
    
    .notification--info {
        border-left-color: var(--accent-color);
    }
    
    .notification__icon {
        font-size: 1.2rem;
    }
    
    .notification__text {
        font-weight: 500;
        color: var(--text-color);
    }
    
    @keyframes slideInRight {
        from {
            transform: translateX(100%);
            opacity: 0;
        }
        to {
            transform: translateX(0);
            opacity: 1;
        }
    }
`;
    document.head.appendChild(ns);
})();