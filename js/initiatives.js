// initiatives.js - Обновленный с интеграцией в единую систему

// Инициативы база данных
const INITIATIVES_DATA = [
    {
        id: 1,
        title: "7 дней без пластика",
        category: "Отходы",
        duration: "7 дней",
        difficulty: "Средняя",
        description: "Попробуйте неделю обходиться без одноразового пластика. Старайтесь покупать продукты в многоразовой или биоразлагаемой упаковке и использовать альтернативы пластиковым изделиям. Это поможет сократить количество отходов и снизить загрязнение окружающей среды. Простые шаги могут привести к большим изменениям!",
        checklist: [
            "Используйте многоразовую бутылку",
            "Возьмите свою сумку в магазин",
            "Откажитесь от пластиковых пакетов",
            "Купите продукты в стеклянной таре",
            "Откажитесь от пластиковых соломинок",
            "Используйте многоразовые контейнеры",
            "Сдайте пластик на переработку"
        ],
        rewards: {
            ecoPoints: 150,
            badge: "Герой без пластика"
        },
        co2Reduction: 12,
        waterSaved: 50,
        image: "♻️"
    },
    {
        id: 2,
        title: "Zero Waste на кухне",
        category: "Отходы",
        duration: "14 дней",
        difficulty: "Сложная",
        description: "Превратите свою кухню в пространство без отходов. Простые практики помогут сократить количество упаковки, продлить срок хранения продуктов и уменьшить пищевые отходы.",
        checklist: [
            "Проведите ревизию кухонных запасов — отметьте, что можно использовать",
            "Составьте список покупок и план питания на неделю",
            "Перейдите на многоразовые мешочки и сумки для покупок",
            "Откажитесь от одноразовой посуды и салфеток",
            "Начните компостировать органические отходы",
            "Покупайте продукты без упаковки (на развес) или в стеклянной таре",
            "Приготовьте обед из остатков — минимизируйте пищевые отходы"
        ],
        rewards: {
            ecoPoints: 300,
            badge: "Мастер Zero Waste"
        },
        co2Reduction: 25,
        waterSaved: 80,
        image: "♻️"
    },
    {
        id: 3,
        title: "Энергосбережение дома",
        category: "Энергия",
        duration: "5 дней",
        difficulty: "Легкая",
        description: "Сокращайте потребление электроэнергии.",
        checklist: [
            "Заменить лампы на светодиодные",
            "Выключать свет при выходе",
            "Отключать технику на ночь",
            "Использовать естественный свет",
            "Настроить энергосберегающий режим"
        ],
        rewards: {
            ecoPoints: 100,
            badge: "Хранитель энергии"
        },
        co2Reduction: 8,
        waterSaved: 30,
        image: "💡"
    },
    {
        id: 4,
        title: "Экономия воды",
        category: "Ресурсы",
        duration: "5 дней",
        difficulty: "Легкая",
        description: "Следите за потреблением воды.",
        checklist: [
            "Принимать душ вместо ванны",
            "Выключать воду при чистке зубов",
            "Собирать дождевую воду",
            "Использовать полную посудомоечную машину",
            "Установить экономичные насадки"
        ],
        rewards: {
            ecoPoints: 100,
            badge: "Экономный водопользователь"
        },
        co2Reduction: 5,
        waterSaved: 120,
        image: "🚰"
    }
];

// ========== ОТОБРАЖЕНИЕ ИНИЦИАТИВ ==========
function renderInitiativeCard(initiative, progress, container) {
    const completedCount = progress?.completedTasks?.length || 0;
    const totalTasks = initiative.checklist.length;
    const percentage = totalTasks > 0 ? Math.round((completedCount / totalTasks) * 100) : 0;
    const isCompleted = progress?.completed === true;
    const isActive = progress?.started && !isCompleted;
    const startDate = progress?.startDate ? new Date(progress.startDate).toLocaleDateString('ru-RU') : null;
    
    const card = document.createElement('div');
    card.className = 'initiative-card';
    if (isCompleted) card.classList.add('initiative-card--completed');
    if (isActive) card.classList.add('initiative-card--active');
    card.setAttribute('data-id', initiative.id);
    
    card.innerHTML = `
        <div class="initiative-card__header">
            <div class="initiative-card__icon">${initiative.image}</div>
            <div class="initiative-card__title-wrapper">
                <h3 class="initiative-card__title">${initiative.title}</h3>
                <div class="initiative-card__meta">
                    <span class="initiative-card__meta-item">📅 ${initiative.duration}</span>
                    <span class="initiative-card__meta-item">🏷️ ${initiative.category}</span>
                    <span class="initiative-card__meta-item">⚡ ${initiative.difficulty}</span>
                </div>
            </div>
            ${isCompleted ? 
                '<div class="initiative-card__badge initiative-card__badge--completed">✅ Завершено</div>' : 
                isActive ? 
                '<div class="initiative-card__badge initiative-card__badge--active">🚀 В процессе</div>' : 
                ''
            }
        </div>
        
        <div class="initiative-card__content">
            <p class="initiative-card__description">${initiative.description}</p>
            
            ${isActive || isCompleted ? `
                <div class="initiative-card__progress">
                    <div class="initiative-card__progress-text">
                        <span>Прогресс:</span>
                        <span>${completedCount}/${totalTasks}</span>
                    </div>
                    <div class="initiative-card__progress-bar">
                        <div class="initiative-card__progress-fill" style="width: ${percentage}%"></div>
                    </div>
                    ${startDate ? `<div class="initiative-card__date">Начато: ${startDate}</div>` : ''}
                </div>
                
                <div class="initiative-card__impact">
                    <div class="initiative-card__impact-item">
                        <span class="initiative-card__impact-icon">🌱</span>
                        <span class="initiative-card__impact-text">+${initiative.rewards.ecoPoints} баллов</span>
                    </div>
                    <div class="initiative-card__impact-item">
                        <span class="initiative-card__impact-icon">🌍</span>
                        <span class="initiative-card__impact-text">−${initiative.co2Reduction} кг CO₂</span>
                    </div>
                    <div class="initiative-card__impact-item">
                        <span class="initiative-card__impact-icon">💧</span>
                        <span class="initiative-card__impact-text">−${initiative.waterSaved} л воды</span>
                    </div>
                </div>
            ` : ''}
            
            <div class="tasks-list" id="tasks-${initiative.id}">
                ${initiative.checklist.map((task, index) => {
                    const isTaskCompleted = progress?.completedTasks?.includes(index) || false;
                    const dayNumber = index + 1;
                    const canCheck = isActive && dayNumber <= (progress?.currentDay || 1);
                    
                    return `
                        <div class="task-item ${isTaskCompleted ? 'task-item--completed' : ''}" data-task-index="${index}">
                            <div class="task-item__day">День ${dayNumber}</div>
                            ${isActive || isCompleted ? `
                                <input type="checkbox" 
                                       class="task-item__checkbox" 
                                       data-id="${initiative.id}" 
                                       data-index="${index}"
                                       ${isTaskCompleted ? 'checked' : ''}
                                       ${!canCheck && !isTaskCompleted ? 'disabled' : ''}
                                       id="task-${initiative.id}-${index}">
                            ` : ''}
                            <label class="task-item__label" for="task-${initiative.id}-${index}">
                                ${task}
                                ${!canCheck && !isTaskCompleted && isActive ? 
                                    '<span class="task-item__lock">🔒</span>' : ''}
                            </label>
                        </div>
                    `;
                }).join('')}
            </div>
        </div>
        
        <div class="initiative-card__footer">
            <div class="initiative-card__rewards">
                <span class="rewards-icon">🏆</span>
                <span class="rewards-text">Бейдж "${initiative.rewards.badge}"</span>
            </div>
            <div class="initiative-card__actions">
                ${isCompleted ? 
                    `<button class="btn btn--small btn--completed" disabled>
                        <span>✅</span>
                        <span>Завершено</span>
                    </button>` :
                    isActive ?
                    `<button class="btn btn--small btn--primary initiative-card__btn--continue" data-id="${initiative.id}">
                        <span>📋</span>
                        <span>Продолжить</span>
                    </button>` :
                    `<button class="btn btn--small btn--primary initiative-card__btn--start" data-id="${initiative.id}">
                        <span>🎯</span>
                        <span>Начать инициативу</span>
                    </button>`
                }
            </div>
        </div>
    `;
    
    container.appendChild(card);
    return card;
}

function renderAllInitiatives() {
    const initiativesContainer = document.getElementById('initiativesContainer');
    const moreInitiativesContainer = document.getElementById('moreInitiativesContainer');
    
    if (!initiativesContainer || !moreInitiativesContainer) return;
    
    // Получаем данные из единой системы
    const userData = window.dataManager?.userData || { initiatives: {} };
    
    // Очищаем контейнеры
    initiativesContainer.innerHTML = '';
    moreInitiativesContainer.innerHTML = '';
    
    // Сортируем инициативы: активные → начатые → не начатые
    const sortedInitiatives = [...INITIATIVES_DATA].sort((a, b) => {
        const progressA = userData.initiatives[a.id];
        const progressB = userData.initiatives[b.id];
        
        const isActiveA = progressA?.started && !progressA.completed;
        const isActiveB = progressB?.started && !progressB.completed;
        
        if (isActiveA && !isActiveB) return -1;
        if (!isActiveA && isActiveB) return 1;
        
        const isStartedA = progressA?.started;
        const isStartedB = progressB?.started;
        
        if (isStartedA && !isStartedB) return -1;
        if (!isStartedA && isStartedB) return 1;
        
        return 0;
    });
    
    // Первые 2 инициативы
    sortedInitiatives.slice(0, 2).forEach(initiative => {
        const userProgress = userData.initiatives[initiative.id];
        renderInitiativeCard(initiative, userProgress, initiativesContainer);
    });
    
    // Остальные инициативы
    sortedInitiatives.slice(2).forEach(initiative => {
        const userProgress = userData.initiatives[initiative.id];
        renderInitiativeCard(initiative, userProgress, moreInitiativesContainer);
    });
    
    // Обновляем статистику
    updateStats();
}

// ========== ОБРАБОТКА СОБЫТИЙ ==========
function setupEventListeners() {
    // Обработка кликов по чекбоксам
    document.addEventListener('change', function(event) {
        if (event.target.classList.contains('task-item__checkbox')) {
            const initiativeId = parseInt(event.target.dataset.id);
            const taskIndex = parseInt(event.target.dataset.index);
            const isChecked = event.target.checked;
            
            handleTaskComplete(initiativeId, taskIndex, isChecked);
        }
    });
    
    // Обработка кнопок "Начать инициативу"
    document.addEventListener('click', function(event) {
        const startBtn = event.target.closest('.initiative-card__btn--start');
        const continueBtn = event.target.closest('.initiative-card__btn--continue');
        
        if (startBtn) {
            const initiativeId = parseInt(startBtn.dataset.id);
            startInitiative(initiativeId);
        }
        
        if (continueBtn) {
            const initiativeId = parseInt(continueBtn.dataset.id);
            showInitiativeDetails(initiativeId);
        }
        
        // Клик по карточке инициативы
        const initiativeCard = event.target.closest('.initiative-card');
        if (initiativeCard && !event.target.closest('button') && !event.target.closest('input')) {
            const initiativeId = parseInt(initiativeCard.dataset.id);
            showInitiativeDetails(initiativeId);
        }
    });
    
    // Обновление при изменении данных
    document.addEventListener('ecodata-updated', function() {
        renderAllInitiatives();
        updateStats();
    });

    // Модальное окно - Закрытие
    const modal = document.getElementById('initiativeModal');
    const closeBtn = document.getElementById('modalInitiativeClose');
    
    function closeInitiativeModal() {
        if (modal) {
            modal.setAttribute('aria-hidden', 'true');
        }
    }

    if (closeBtn) {
        closeBtn.addEventListener('click', closeInitiativeModal);
    }

    if (modal) {
        modal.addEventListener('click', function(e) {
            if (e.target === modal) {
                closeInitiativeModal();
            }
        });
    }

    // Закрытие по ESC
    document.addEventListener('keydown', function(e) {
        if (e.key === 'Escape' && modal && modal.getAttribute('aria-hidden') === 'false') {
            closeInitiativeModal();
        }
    });
}

function handleTaskComplete(initiativeId, taskIndex, isChecked) {
    if (!isChecked) return; // Пока только отмечаем выполнение
    
    if (!window.dataManager) {
        console.error('DataManager не загружен');
        return;
    }
    
    // Используем единую систему данных
    const result = window.dataManager.completeTask(initiativeId, taskIndex);
    
    if (result) {
        // Показываем уведомление
        showNotification(
            result.isCompleted ? 
            `🎉 Инициатива завершена! +${result.initiativePoints} баллов` :
            `✅ Задача выполнена! +10 баллов`
        );
        
        // Обновляем конкретную карточку
        updateCardProgress(initiativeId);
    }
}

function startInitiative(initiativeId) {
    const initiative = INITIATIVES_DATA.find(i => i.id === initiativeId);
    if (!initiative || !window.dataManager) return;
    
    // Используем единую систему данных
    const result = window.dataManager.startInitiative(initiative);
    
    if (result) {
        showNotification(`🎯 Инициатива "${initiative.title}" начата!`);
        
        // Перерисовываем все инициативы
        renderAllInitiatives();
        
        // Показываем детали в модальном окне
        setTimeout(() => showInitiativeDetails(initiativeId), 300);
    }
}

// ========== ОБНОВЛЕНИЕ UI ==========
function updateCardProgress(initiativeId) {
    if (!window.dataManager) return;
    
    const initiative = INITIATIVES_DATA.find(i => i.id === initiativeId);
    const progress = window.dataManager.userData.initiatives[initiativeId];
    
    if (!initiative || !progress) return;
    
    const completedCount = progress.completedTasks?.length || 0;
    const totalTasks = initiative.checklist.length;
    const percentage = totalTasks > 0 ? Math.round((completedCount / totalTasks) * 100) : 0;
    const isCompleted = progress.completed === true;
    const isActive = progress.started && !isCompleted;
    
    // Находим все карточки с этим id
    const cards = document.querySelectorAll(`.initiative-card[data-id="${initiativeId}"]`);
    
    cards.forEach(card => {
        // Обновляем прогресс
        const progressText = card.querySelector('.initiative-card__progress-text span:last-child');
        const progressFill = card.querySelector('.initiative-card__progress-fill');
        
        if (progressText) progressText.textContent = `${completedCount}/${totalTasks}`;
        if (progressFill) progressFill.style.width = `${percentage}%`;
        
        // Обновляем статус (BEM-модификаторы)
        card.classList.remove('initiative-card--completed', 'initiative-card--active');
        if (isCompleted) card.classList.add('initiative-card--completed');
        if (isActive) card.classList.add('initiative-card--active');
        
        // Обновляем бейдж
        const badgeContainer = card.querySelector('.initiative-card__header');
        let badge = card.querySelector('.initiative-card__badge');
        
        if (!badge && badgeContainer) {
            badge = document.createElement('div');
            badge.className = 'initiative-card__badge';
            badgeContainer.appendChild(badge);
        }
        
        if (badge) {
            if (isCompleted) {
                badge.className = 'initiative-card__badge initiative-card__badge--completed';
                badge.innerHTML = '✅ Завершено';
            } else if (isActive) {
                badge.className = 'initiative-card__badge initiative-card__badge--active';
                badge.innerHTML = '🚀 В процессе';
            } else {
                badge.remove();
            }
        }
        
        // Обновляем кнопку
        const actionsContainer = card.querySelector('.initiative-card__actions');
        if (actionsContainer) {
            actionsContainer.innerHTML = isCompleted ? 
                `<button class="btn btn--small btn--completed" disabled>
                    <span>✅</span>
                    <span>Завершено</span>
                </button>` :
                isActive ?
                `<button class="btn btn--small btn--primary initiative-card__btn--continue" data-id="${initiativeId}">
                    <span>📋</span>
                    <span>Продолжить</span>
                </button>` :
                `<button class="btn btn--small btn--primary initiative-card__btn--start" data-id="${initiativeId}">
                    <span>🎯</span>
                    <span>Начать инициативу</span>
                </button>`;
        }
        
        // Обновляем чекбоксы
        const checkboxes = card.querySelectorAll('.task-item__checkbox');
        checkboxes.forEach((checkbox, index) => {
            const isTaskCompleted = progress.completedTasks?.includes(index) || false;
            const canCheck = isActive && (index + 1) <= (progress.currentDay || 1);
            
            checkbox.checked = isTaskCompleted;
            checkbox.disabled = !canCheck && !isTaskCompleted;
            
            const taskItem = checkbox.closest('.task-item');
            const lockElement = taskItem?.querySelector('.task-item__lock');
            
            if (taskItem) {
                if (isTaskCompleted) {
                    taskItem.classList.add('task-item--completed');
                } else {
                    taskItem.classList.remove('task-item--completed');
                }
                
                // Показываем/скрываем замок
                if (lockElement) {
                    lockElement.style.display = !canCheck && !isTaskCompleted ? 'inline' : 'none';
                }
            }
        });
    });
}

function updateStats() {
    if (!window.dataManager) return;
    
    const stats = window.dataManager.getDashboardStats();
    const userData = window.dataManager.userData;
    
    // Обновляем DOM
    const completedTasksEl = document.getElementById('completedTasks');
    const completedInitiativesEl = document.getElementById('completedInitiatives');
    const ecoPointsEl = document.getElementById('ecoPoints');
    
    if (completedTasksEl) completedTasksEl.textContent = 
        `${stats.overallStats.completedTasks}/${stats.overallStats.totalTasks}`;
    
    if (completedInitiativesEl) completedInitiativesEl.textContent = 
        stats.overallStats.completedInitiatives;
    
    if (ecoPointsEl) ecoPointsEl.textContent = userData.ecoPoints;
    
    return stats;
}

// ========== МОДАЛЬНОЕ ОКНО ИНИЦИАТИВЫ ==========
function showInitiativeDetails(initiativeId) {
    const initiative = INITIATIVES_DATA.find(i => i.id === initiativeId);
    const progress = window.dataManager?.userData?.initiatives?.[initiativeId];
    
    if (!initiative) return;
    
    const modal = document.getElementById('initiativeModal');
    if (!modal) return;
    
    const completedCount = progress?.completedTasks?.length || 0;
    const totalTasks = initiative.checklist.length;
    const percentage = totalTasks > 0 ? Math.round((completedCount / totalTasks) * 100) : 0;
    const isCompleted = progress?.completed === true;
    const isActive = progress?.started && !isCompleted;
    const startDate = progress?.startDate ? 
        new Date(progress.startDate).toLocaleDateString('ru-RU', { 
            day: 'numeric', 
            month: 'long', 
            year: 'numeric' 
        }) : null;
    
    // Заполнение модального окна
    document.getElementById('modalInitiativeTitle').textContent = initiative.title;
    
    // Бейджи
    const badgesContainer = document.getElementById('modalInitiativeBadges');
    badgesContainer.innerHTML = `
        <span class="modal__badge modal__badge--category">${initiative.category}</span>
        <span class="modal__badge modal__badge--date">📅 ${initiative.duration}</span>
        <span class="modal__badge modal__badge--difficulty">⚡ ${initiative.difficulty}</span>
        ${isCompleted ? '<span class="modal__badge modal__badge--completed">✅ Завершено</span>' : ''}
        ${isActive ? '<span class="modal__badge modal__badge--active">🚀 В процессе</span>' : ''}
    `;
    
    // Прогресс
    const progressContainer = document.getElementById('modalInitiativeProgress');
    if (isActive || isCompleted) {
        progressContainer.innerHTML = `
            <div class="modal__progress-info">
                <div class="modal__progress-text">
                    <span>Прогресс: ${completedCount}/${totalTasks} задач</span>
                    <span class="modal__progress-percent">${percentage}%</span>
                </div>
                <div class="modal__progress-bar">
                    <div class="modal__progress-fill" style="width: ${percentage}%"></div>
                </div>
                ${startDate ? `<div class="modal__progress-date">Начато: ${startDate}</div>` : ''}
            </div>
        `;
    } else {
        progressContainer.innerHTML = '';
    }
    
    // Описание
    document.getElementById('modalInitiativeDescription').innerHTML = `
        <p>${initiative.description}</p>
    `;
    
    // Экологическое влияние
    const impactContainer = document.getElementById('modalInitiativeImpact');
    impactContainer.innerHTML = `
        <div class="modal__impact-item">
            <div class="modal__impact-icon">🌱</div>
            <div class="modal__impact-content">
                <div class="modal__impact-value">+${initiative.rewards.ecoPoints}</div>
                <div class="modal__impact-label">Эко-баллов</div>
            </div>
        </div>
        <div class="modal__impact-item">
            <div class="modal__impact-icon">🌍</div>
            <div class="modal__impact-content">
                <div class="modal__impact-value">−${initiative.co2Reduction} кг</div>
                <div class="modal__impact-label">CO₂</div>
            </div>
        </div>
        <div class="modal__impact-item">
            <div class="modal__impact-icon">💧</div>
            <div class="modal__impact-content">
                <div class="modal__impact-value">−${initiative.waterSaved} л</div>
                <div class="modal__impact-label">Воды</div>
            </div>
        </div>
    `;
    
    // Чеклист
    const checklistContainer = document.getElementById('modalInitiativeChecklist');
    checklistContainer.innerHTML = initiative.checklist.map((task, index) => {
        const isTaskCompleted = progress?.completedTasks?.includes(index) || false;
        const dayNumber = index + 1;
        const canCheck = isActive && dayNumber <= (progress?.currentDay || 1);
        
        return `
            <div class="modal__checklist-item ${isTaskCompleted ? 'modal__checklist-item--completed' : ''}">
                <input type="checkbox" 
                       class="modal__checklist-checkbox" 
                       data-id="${initiative.id}" 
                       data-index="${index}"
                       id="modal-task-${initiative.id}-${index}"
                       ${isTaskCompleted ? 'checked' : ''}
                       ${!canCheck && !isTaskCompleted ? 'disabled' : ''}>
                <label for="modal-task-${initiative.id}-${index}" class="modal__checklist-label">
                    <span class="modal__checklist-day">День ${dayNumber}</span>
                    <span class="modal__checklist-text">${task}</span>
                    ${!canCheck && !isTaskCompleted && isActive ? 
                        '<span class="modal__checklist-lock">🔒</span>' : ''}
                </label>
            </div>
        `;
    }).join('');
    
    // Награды
    const rewardsContainer = document.getElementById('modalInitiativeRewards');
    rewardsContainer.innerHTML = `
        <div class="modal__rewards-item">
            <span class="modal__rewards-icon">🏆</span>
            <div class="modal__rewards-content">
                <div class="modal__rewards-badge">${initiative.rewards.badge}</div>
                <div class="modal__rewards-points">+${initiative.rewards.ecoPoints} баллов</div>
            </div>
        </div>
    `;
    
    // Кнопка действия
    const actionBtn = document.getElementById('modalInitiativeAction');
    if (isCompleted) {
        actionBtn.innerHTML = '<span>✅</span> Инициатива завершена';
        actionBtn.disabled = true;
        actionBtn.className = 'btn btn--secondary modal__action-btn';
        actionBtn.onclick = null;
    } else if (isActive) {
        actionBtn.innerHTML = '<span>📋</span> Продолжить инициативу';
        actionBtn.disabled = false;
        actionBtn.className = 'btn btn--primary modal__action-btn';
        actionBtn.onclick = () => {
            // Обновляем данные карточки и закрываем модальное окно
            updateCardProgress(initiativeId);
            // Закрыть модальное окно
            modal.setAttribute('aria-hidden', 'true');
            // Обновить список инициатив
            renderAllInitiatives();
        };
    } else {
        actionBtn.innerHTML = '<span>🎯</span> Начать инициативу';
        actionBtn.disabled = false;
        actionBtn.className = 'btn btn--primary modal__action-btn';
        actionBtn.onclick = () => {
            startInitiative(initiativeId);
            // Обновляем модальное окно с новыми данными
            setTimeout(() => {
                showInitiativeDetails(initiativeId);
            }, 300);
        };
    }
    
    // Обработчики чекбоксов в модальном окне
    checklistContainer.querySelectorAll('.modal__checklist-checkbox').forEach(checkbox => {
        checkbox.addEventListener('change', function() {
            if (this.checked) {
                const initiativeId = parseInt(this.dataset.id);
                const taskIndex = parseInt(this.dataset.index);
                handleTaskComplete(initiativeId, taskIndex, true);
                
                // Обновляем прогресс в модальном окне
                setTimeout(() => {
                    showInitiativeDetails(initiativeId);
                }, 300);
            }
        });
    });
    
    // Показываем модальное окно (inline panel)
    modal.setAttribute('aria-hidden', 'false');
}

function showNotification(message) {
    const toast = document.createElement('div');
    toast.className = 'notification';
    toast.innerHTML = `
        <div class="notification__icon">🎯</div>
        <div class="notification__content">${message}</div>
    `;
    
    document.body.appendChild(toast);
    
    setTimeout(() => {
        toast.classList.add('notification--hiding');
        setTimeout(() => {
            if (toast.parentNode) document.body.removeChild(toast);
        }, 300);
    }, 3000);
}

// ========== ИНИЦИАЛИЗАЦИЯ ==========
function initApp() {
    // Загружаем data-manager если его нет
    if (!window.dataManager) {
        console.log('Загружаем DataManager...');
        const script = document.createElement('script');
        // Загружаем DataManager из папки eco-platform/js
        script.src = 'js/data-manager.js';
        script.onload = function() {
            console.log('DataManager загружен');
            initAfterDataManager();
        };
        document.head.appendChild(script);
    } else {
        initAfterDataManager();
    }
}

function initAfterDataManager() {
    // Инициализируем
    renderAllInitiatives();
    setupEventListeners();
    updateStats();
    
    console.log('Инициативы инициализированы с DataManager');
}

// Экспортируем для глобального доступа
window.initApp = initApp;
window.INITIATIVES_DATA = INITIATIVES_DATA;
window.getActiveInitiatives = function() {
    return window.dataManager ? window.dataManager.getActiveInitiatives() : [];
};

// Автоматическая инициализация
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initApp);
} else {
    initApp();
}

