// dashboard.js - Функциональность главной страницы (в стиле калькулятора и товаров)

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

let currentHabitFilter = 'all';

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
        { id: 1, title: 'Многоразовая эко-бутылка', icon: '💧', price: 125, category: 'Кухня', image: 'images/product/product3.jpg' },
        { id: 2, title: 'Эко-сумка', icon: '🛍️', price: 350, category: 'Сумки', image: 'images/product/product1.jpg' }
    ],
    recentArticles: [
        { id: 1, title: 'Переход на локальные продукты', icon: '📝', date: '2025-10-19', readTime: '1 мин', image: 'images/article/article1.jpg' },
        { id: 2, title: 'Рациональное использование воды', icon: '💧', date: '2025-10-18', readTime: '1 мин', image: 'images/article/article2.jpg' }
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
    habitButtons: document.querySelectorAll('.habit-card-btn'),
    filterButtons: document.querySelectorAll('.filter-btn')
};

// Инициализация при загрузке
document.addEventListener('DOMContentLoaded', function() {
    initializePage();
    setupEventListeners();
});

// Инициализация страницы
function initializePage() {
    console.log('initializePage called');
    
    // Инициализация кнопки сброса данных (делаем это в первую очередь)
    try {
        console.log('Инициализация кнопки сброса...');
        initResetButton();
        if (typeof initArticleModalListeners === 'function') {
            initArticleModalListeners();
        }
    } catch (e) {
        console.error('Error initializing reset button:', e);
    }

    // DataManager и INITIATIVES_DATA теперь подключаются напрямую в HTML,
    // поэтому просто загружаем данные и отрисовываем дашборд.
    try {
        loadUserData();
        loadProductsData();
        updateDashboard();
    } catch (e) {
        console.error('Error updating dashboard:', e);
    }

    // Синхронизируем иконки привычек в кнопках с теми, что используются в истории
    if (typeof syncHabitIcons === 'function') syncHabitIcons();
    if (typeof applyIconsToFilters === 'function') applyIconsToFilters();

    // Обновление при изменении данных из других частей приложения
    document.addEventListener('ecodata-updated', function() {
        loadUserData();
        updateDashboard();
    });
}

// Загрузка данных товаров для рекомендаций
// На дашборде используем встроенные demoData, поэтому
// дополнительная логика ожидания PRODUCTS не нужна.
function loadProductsData() {
    updateRecommendedProducts();
}

// Загрузка данных инициатив для отображения на дашборде
// (инициативы подключаются в HTML через ../js/initiatives.js,
// поэтому дополнительная динамическая загрузка здесь не нужна)
function loadInitiativesData() {
    // Оставляем функцию-пустышку для совместимости, на случай,
    // если она где-то вызывается. Все данные уже есть в window.INITIATIVES_DATA.
    return;
}

// Инициализация кнопки сброса данных
function initResetButton() {
    const resetBtn = document.getElementById('resetDataBtn');
    const resetModal = document.getElementById('resetModal');
    const resetModalClose = document.getElementById('resetModalClose');
    const resetModalCancel = document.getElementById('resetModalCancel');
    const resetModalConfirm = document.getElementById('resetModalConfirm');

    console.log('Поиск элементов кнопки сброса:', {
        resetBtn,
        resetModal,
        resetModalClose,
        resetModalCancel,
        resetModalConfirm
    });

    if (!resetBtn || !resetModal) {
        console.log('resetBtn or resetModal not found');
        return;
    }

    // Открытие модального окна
    resetBtn.addEventListener('click', (e) => {
        e.preventDefault();
        console.log('Кнопка сброса нажата');
        resetModal.setAttribute('aria-hidden', 'false');
        resetModal.classList.add('modal--open'); // Добавляем класс для уверенности
        resetModal.style.display = 'flex'; // Принудительно показываем
        document.body.style.overflow = 'hidden';
    });

    // Закрытие модального окна
    const closeModal = () => {
        resetModal.setAttribute('aria-hidden', 'true');
        resetModal.classList.remove('modal--open');
        resetModal.style.display = '';
        document.body.style.overflow = '';
    };

    if (resetModalClose) {
        resetModalClose.addEventListener('click', (e) => {
            e.preventDefault();
            closeModal();
        });
    }

    if (resetModalCancel) {
        resetModalCancel.addEventListener('click', (e) => {
            e.preventDefault();
            closeModal();
        });
    }

    // Клик вне модального окна
    resetModal.addEventListener('click', (e) => {
        if (e.target === resetModal) {
            closeModal();
        }
    });

    // Подтверждение сброса
    if (resetModalConfirm) {
        resetModalConfirm.addEventListener('click', (e) => {
            e.preventDefault();
            console.log('Подтверждение сброса нажато');
            try {
                if (!window.dataManager) {
                    console.error('DataManager не загружен');
                    showNotification('Ошибка: DataManager не загружен', 'error');
                    return;
                }

                // Сброс данных
                window.dataManager.resetAllData();
                console.log('Данные сброшены через DataManager');

                // Закрываем модальное окно
                closeModal();

                // Показываем уведомление
                showNotification('Все данные успешно сброшены', 'success');

                // Перезагружаем страницу через 1 секунду для полного сброса
                setTimeout(() => {
                    window.location.reload();
                }, 1000);
            } catch (error) {
                console.error('Ошибка при сбросе данных:', error);
                showNotification('Ошибка при сбросе данных', 'error');
                closeModal();
            }
        });
    }
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
    // Используем dataManager для получения актуальных данных
    if (window.dataManager) {
        const stats = window.dataManager.getDashboardStats();
        
        // Обновляем основные метрики из dataManager
        if (elements.quickEcoPoints) {
            elements.quickEcoPoints.textContent = stats.quickStats.ecoPoints || 0;
        }
        if (elements.quickCO2Saved) {
            elements.quickCO2Saved.textContent = stats.quickStats.co2Saved + ' кг';
        }
        if (elements.quickWaterSaved) {
            elements.quickWaterSaved.textContent = stats.quickStats.waterSaved + ' л';
        }
        if (elements.quickWasteRecycled) {
            elements.quickWasteRecycled.textContent = stats.quickStats.wasteRecycled + ' кг';
        }

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
        const levelProgressBar = document.getElementById('ecoLevelProgressBar');

        if (levelInfo && levelLabel) {
            levelLabel.textContent = `${levelInfo.currentLevel.icon} ${levelInfo.currentLevel.name}`;
        }

        if (levelInfo) {
            if (levelInfo.nextLevel) {
                if (levelProgress) {
                    levelProgress.textContent = `До уровня "${levelInfo.nextLevel.name}": ${levelInfo.pointsToNext} баллов`;
                }
                
                // Calculate percentage
                if (levelProgressBar) {
                    const currentPoints = stats.quickStats.ecoPoints;
                    const currentLevelMin = levelInfo.currentLevel.min;
                    const nextLevelMin = levelInfo.nextLevel.min;
                    const range = nextLevelMin - currentLevelMin;
                    const progress = currentPoints - currentLevelMin;
                    const percentage = Math.min(100, Math.max(0, (progress / range) * 100));
                    levelProgressBar.style.width = `${percentage}%`;
                }
            } else {
                if (levelProgress) levelProgress.textContent = 'Достигнут максимальный уровень 🎉';
                if (levelProgressBar) levelProgressBar.style.width = '100%';
            }
        }
    } else {
        // Fallback на локальные данные
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
    }
}

// Обновление истории привычек
function updateHabitsHistory() {
    if (!elements.habitsHistory) return;
    
    elements.habitsHistory.innerHTML = '';
    
    let filteredHabits = userData.habits;
    
    if (currentHabitFilter !== 'all') {
        filteredHabits = filteredHabits.filter(h => h.type === currentHabitFilter);
    }
    
    const recentHabits = filteredHabits
        .sort((a, b) => new Date(b.date) - new Date(a.date))
        .slice(0, 5);
    
    if (recentHabits.length === 0) {
        const emptyMsg = currentHabitFilter === 'all' 
            ? 'Пока нет привычек' 
            : 'Нет привычек в этой категории';
            
        elements.habitsHistory.innerHTML = `
            <div class="text-center p-3">
                <div class="text-muted">${emptyMsg}</div>
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
        bike: { name: 'Велосипед', icon: '🚴' },
        recycle: { name: 'Переработка', icon: '♻️' },
        water: { name: 'Экономия воды', icon: '🚰' },
        energy: { name: 'Экономия энергии', icon: '💡' }
    };
    return habits[type] || { name: 'Неизвестно', icon: '❓' };
}

// Синхронизировать иконки в кнопках добавления привычек и в быстрых статистиках
function syncHabitIcons() {
    // Replace habit button icons with SVGs from getHabitInfo
    document.querySelectorAll('.habit-card-btn').forEach(btn => {
        const type = btn.dataset.habit;
        const iconEl = btn.querySelector('.habit-card-icon');
        if (iconEl) {
            const info = getHabitInfo(type);
            iconEl.innerHTML = info.icon;
            iconEl.style.width = '42px';
            iconEl.style.height = '42px';
            iconEl.style.display = 'inline-flex';
            iconEl.style.alignItems = 'center';
            iconEl.style.justifyContent = 'center';
            iconEl.style.background = 'rgba(46,139,87,0.08)';
            iconEl.style.borderRadius = '8px';
        }
    });

    // Also update quick stats icons to use same SVG style
    const statMap = {
        quickEcoPoints: 'bike',
        quickCO2Saved: 'recycle',
        quickWaterSaved: 'water',
        quickWasteRecycled: 'energy'
    };

    Object.keys(statMap).forEach(id => {
        const statEl = document.getElementById(id);
        if (!statEl) return;
        const wrapper = statEl.closest('.stat-card')?.querySelector('.dashboard-quick-stat__icon');
        if (wrapper) {
            wrapper.innerHTML = getHabitInfo(statMap[id]).icon;
            wrapper.style.width = '48px';
            wrapper.style.height = '48px';
            wrapper.style.display = 'inline-flex';
            wrapper.style.alignItems = 'center';
            wrapper.style.justifyContent = 'center';
            wrapper.style.background = 'linear-gradient(180deg,#e6f8ec,#f7fff9)';
            wrapper.style.borderRadius = '50%';
        }
    });
}

// Подставить те же SVG-иконки в кнопки-фильтры истории
function applyIconsToFilters() {
    document.querySelectorAll('.filter-btn').forEach(btn => {
        const filter = btn.dataset.filter;
        if (!filter || filter === 'all') {
            // keep text for "all"
            btn.innerHTML = btn.textContent.trim() || 'Все';
            return;
        }
        const info = getHabitInfo(filter);
        btn.innerHTML = info.icon;
        btn.classList.add('filter-btn--icon');
        // keep accessible title
        btn.setAttribute('title', info.name);
    });
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
                <a href="pages/initiatives/initiatives.html" class="btn btn--secondary btn--small mt-2" style="display: inline-block;">
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
                    window.location.href = `pages/initiatives/initiatives.html#initiative-${initiativeProgress.id}`;
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
                window.location.href = `pages/initiatives/initiatives.html#initiative-${initiativeProgress.id}`;
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
            const image = product.img || product.image;
            const icon = product.icon || '🛍️';
            const visual = image 
                ? `<img src="${image}" class="product-item__img" alt="${product.title}">` 
                : `<span class="product-item__icon">${icon}</span>`;

            productElement.innerHTML = `
                ${visual}
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
                window.location.href = `pages/products/products.html#product-${product.id}`;
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
    
    // Show loading state
    elements.recentArticles.innerHTML = `
        <div class="loading-state">
            <div class="spinner"></div>
            <p class="text-muted mt-2">Загружаем статьи...</p>
        </div>
    `;
    
    // Если уже есть кэш загруженных статей — используем его
    if (Array.isArray(window.RECENT_ARTICLES_CACHE) && window.RECENT_ARTICLES_CACHE.length > 0) {
        setTimeout(() => renderRecentArticles(window.RECENT_ARTICLES_CACHE), 300);
        return;
    }
    
    // Загружаем реальные статьи из JSON
    fetch('json/articles.json')
        .then(resp => resp.json())
        .then(raw => {
            // Преобразуем исходный массив, чтобы сохранить картинку и текст
            const articles = raw.map(a => {
                // Выбираем поле с изображением
                const rawImage = a.img || a.image || '';
                let image = rawImage || '';
                if (!image) {
                    // fallback к существующей картинке в наборе
                    image = 'images/article/article1.jpg';
                }

                return {
                    id: a.id,
                    title: a.title,
                    date: a.date,
                    readTime: a.readTime || '1 мин',
                    image: image,
                    excerpt: (a.text || a.content || '').slice(0, 160)
                };
            });

            // Сортируем по дате (последние сверху)
            articles.sort((a, b) => {
                const da = new Date(a.date);
                const db = new Date(b.date);
                return db - da;
            });

            const latest = articles.slice(0, 4);
            window.RECENT_ARTICLES_CACHE = latest;
            renderRecentArticles(latest);
            // Also render the news grid on the main page (bigger cards)
            renderNewsGrid(articles.slice(0, 6));
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
        articleElement.className = 'product-item';
        const displayDate = article.date ? new Date(article.date) : null;
        const formattedDate = displayDate
            ? displayDate.toLocaleDateString('ru-RU', { day: 'numeric', month: 'short', year: 'numeric' })
            : '';

        const imageSrc = article.image || 'images/article/article1.jpg';

        articleElement.innerHTML = `
            <img src="${imageSrc}" class="product-item__img" alt="${article.title}">
            <div class="product-item__content">
                <div class="product-item__title">${article.title}</div>
                <div class="product-item__info">
                    <span>${formattedDate}</span>
                    <span>${article.readTime || '1 мин'}</span>
                </div>
            </div>
        `;
        
        articleElement.addEventListener('click', (e) => {
            e.preventDefault();
            openArticleModal(article);
        });
        
        elements.recentArticles.appendChild(articleElement);
    });
}

// Render larger news cards for the homepage news grid
function renderNewsGrid(list) {
    const newsGrid = document.getElementById('newsGrid');
    if (!newsGrid) return;
    newsGrid.innerHTML = '';

    // Normalize list and show only 3 most recent articles
    const prepared = (Array.isArray(list) ? list.slice() : [])
        .map(i => Object.assign({}, i))
        .sort((a, b) => {
            const da = a.date ? new Date(a.date) : new Date(0);
            const db = b.date ? new Date(b.date) : new Date(0);
            return db - da;
        })
        .slice(0, 3);

    prepared.forEach(item => {
        const dateObj = item.date ? new Date(item.date) : null;
        const formattedDate = dateObj ? dateObj.toLocaleDateString('ru-RU', { day: 'numeric', month: 'short', year: 'numeric' }) : '';

        const card = document.createElement('article');
        card.className = 'news-card';
        // Use either item.image or item.img (older JSON uses 'img')
        let imageSrc = item.image || item.img || 'images/article/article1.jpg';
        const excerpt = (item.excerpt || item.text || '').slice(0, 160);
        card.innerHTML = `
            <div class="news-image-wrapper">
                <img src="${imageSrc}" alt="${item.title}" class="news-image">
                <span class="news-category">${item.category || ''}</span>
            </div>
            <div class="news-content">
                <div class="news-date">${formattedDate}</div>
                <h3 class="news-title">${item.title}</h3>
                <p class="news-excerpt">${excerpt}</p>
                <a href="#" class="news-link" data-id="${item.id}">Читать далее →</a>
            </div>
        `;
        
        // Добавляем обработчики клика
        const link = card.querySelector('.news-link');
        if (link) {
            link.addEventListener('click', (e) => {
                e.preventDefault();
                openArticleModal(item);
            });
        }
        
        const imgWrapper = card.querySelector('.news-image-wrapper');
        if (imgWrapper) {
            imgWrapper.style.cursor = 'pointer';
            imgWrapper.addEventListener('click', () => openArticleModal(item));
        }

        newsGrid.appendChild(card);
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

    // Фильтры истории
    if (elements.filterButtons) {
        elements.filterButtons.forEach(btn => {
            btn.addEventListener('click', function() {
                // Remove active class from all
                elements.filterButtons.forEach(b => b.classList.remove('filter-btn--active'));
                // Add active class to clicked
                this.classList.add('filter-btn--active');
                
                // Update filter
                currentHabitFilter = this.dataset.filter;
                updateHabitsHistory();
            });
        });
    }
    
}

// Добавление привычки
function addHabit(type, co2) {
    const now = new Date().toISOString();
    const points = Math.round(co2 * 42); // Формула начисления баллов
    
    // Если доступен DataManager — добавляем привычку через него,
    // чтобы всё хранилось в единой системе и обновлялись глобальные метрики.
    if (window.dataManager) {
        // Правильное распределение очков по категориям
        const habitData = {
            type: type,
            co2: co2,
            points: points,
            description: getHabitInfo(type).name
        };
        
        // Добавляем специфичные значения для каждой категории с реалистичными данными
        switch(type) {
            case 'recycle':
                // Переработка 1 кг отходов экономит ~0.5 кг CO2 и дает 2 кг переработанных отходов
                habitData.wasteRecycled = 2.0; // кг переработанных отходов
                habitData.co2 = 0.5; // переопределяем CO2 для переработки
                break;
            case 'water':
                // Экономия 50 литров воды экономит ~0.3 кг CO2 (на подогрев и очистку)
                habitData.waterSaved = 50; // литров сохраненной воды
                habitData.co2 = 0.3; // переопределяем CO2 для воды
                break;
            case 'bike':
                // Поездка на велосипеде 5 км вместо машины экономит ~1.2 кг CO2
                habitData.co2 = 1.2;
                break;
            case 'energy':
                // Экономия энергии (выключение света, техники) экономит ~0.8 кг CO2
                habitData.co2 = 0.8;
                break;
        }
        
        // Пересчитываем баллы на основе реального CO2
        habitData.points = Math.round(habitData.co2 * 42);
        
        window.dataManager.addHabit(habitData);
        
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

// Новые функции для работы с модальным окном статьи
function initArticleModalListeners() {
    const modal = document.getElementById('articleModal');
    const closeBtn = document.getElementById('modalClose');
    
    if (!modal) return;
    
    const closeModal = () => {
        modal.setAttribute('aria-hidden', 'true');
        document.body.style.overflow = '';
    };
    
    if (closeBtn) {
        closeBtn.addEventListener('click', closeModal);
    }
    
    modal.addEventListener('click', (e) => {
        if (e.target === modal) closeModal();
    });
    
    // ESC key
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape' && modal.getAttribute('aria-hidden') === 'false') {
            closeModal();
        }
    });
}

function openArticleModal(article) {
    const modal = document.getElementById('articleModal');
    if (!modal) return;
    
    // Fill data
    const img = document.getElementById('modalImg');
    if (img) {
        // Проверяем оба варианта ключа картинки
        img.src = article.image || article.img || 'images/article/article1.jpg';
        img.alt = article.title;
    }
    
    const title = document.getElementById('modalTitle');
    if (title) title.textContent = article.title;
    
    const category = document.getElementById('modalCategory');
    if (category) category.textContent = article.category || 'Статья';
    
    const dateEl = document.getElementById('modalDate');
    if (dateEl) {
        const date = article.date ? new Date(article.date) : new Date();
        dateEl.textContent = date.toLocaleDateString('ru-RU', {
            day: 'numeric',
            month: 'long',
            year: 'numeric'
        });
    }
    
    const text = document.getElementById('modalText');
    if (text) {
        // Simple formatting
        let content = article.content || article.text || article.excerpt || '';
        
        if (!content.includes('<p>')) {
             content = `<p>${content}</p>`;
        }
        
        // Если это демо-статья, добавим "рыбу" если текста мало
        if (content.length < 100) {
            content += `<p>Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.</p>
            <p>Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.</p>`;
        }
        
        text.innerHTML = content;
    }
    
    // Show modal
    modal.setAttribute('aria-hidden', 'false');
    document.body.style.overflow = 'hidden';
}