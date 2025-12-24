// data-manager.js - Единый менеджер данных для всей платформы

class DataManager {
    constructor() {
        this.init();
    }
    
    init() {
        // Загружаем данные при инициализации
        this.loadData();
    }
    
    loadData() {
        try {
            // Основные данные пользователя
            const userData = JSON.parse(localStorage.getItem('ecoplatform_user')) || {};
            
            // Инициализируем недостающие поля
            this.userData = {
                // Основные метрики (убеждаемся что это числа)
                ecoPoints: parseInt(userData.ecoPoints) || 0,
                co2Saved: parseFloat(userData.co2Saved) || 0,
                waterSaved: parseFloat(userData.waterSaved) || 0,
                wasteRecycled: parseFloat(userData.wasteRecycled) || 0,
                
                // Привычки
                habits: userData.habits || [],
                
                // Инициативы
                initiatives: userData.initiatives || {},
                
                // Достижения
                achievements: userData.achievements || [],
                
                // Настройки
                settings: userData.settings || {},
                
                // История расчетов калькуляторов
                calculations: userData.calculations || {
                    eco: [],
                    carbon: [],
                    savings: []
                },
                
                // Статистика
                stats: userData.stats || this.getDefaultStats()
            };
            
            // Загружаем демо-данные при первом запуске
            if (Object.keys(userData).length === 0) {
                this.loadDemoData();
            }
            
            console.log('Данные загружены:', this.userData);
            return this.userData;
            
        } catch (error) {
            console.error('Ошибка загрузки данных:', error);
            this.userData = this.getDefaultData();
            return this.userData;
        }
    }
    
    getDefaultData() {
        return {
            ecoPoints: 0,
            co2Saved: 0,
            waterSaved: 0,
            wasteRecycled: 0,
            habits: [],
            initiatives: {},
            achievements: [],
            settings: {},
            calculations: {
                eco: [],
                carbon: [],
                savings: []
            },
            stats: this.getDefaultStats()
        };
    }
    
    getDefaultStats() {
        return {
            totalHabits: 0,
            completedHabits: 0,
            totalTasks: 0,
            completedTasks: 0,
            totalInitiatives: 0,
            activeInitiatives: 0,
            completedInitiatives: 0,
            dailyStreak: 0,
            lastActiveDate: null
        };
    }
    
    loadDemoData() {
        // Демо привычки
        this.userData.habits = [
            {
                id: 1,
                type: 'bike',
                co2: 1.2,
                points: 50,
                date: new Date().toISOString(),
                description: 'Велосипед 5км'
            },
            {
                id: 2,
                type: 'recycle',
                co2: 0.5,
                points: 30,
                date: new Date(Date.now() - 86400000).toISOString(),
                description: 'Сортировка отходов'
            }
        ];
        
        // Демо инициативы
        this.userData.initiatives = {
            1: {
                id: 1,
                title: "7 дней без пластика",
                started: true,
                completed: false,
                startDate: new Date(Date.now() - 3 * 86400000).toISOString(),
                currentDay: 3,
                completedTasks: [0, 1, 2],
                progress: 42,
                totalTasks: 7
            }
        };
        
        // Демо достижения
        this.userData.achievements = [
            {
                id: 1,
                title: "Эко-новичок",
                icon: "🌱",
                date: new Date().toISOString().split('T')[0],
                description: "Первая привычка добавлена"
            }
        ];
        
        // Демо статистика
        this.userData.ecoPoints = 80;
        this.userData.co2Saved = 1.7;
        this.userData.waterSaved = 0;
        this.userData.wasteRecycled = 0.5;
        
        this.saveData();
    }
    
    saveData() {
        try {
            localStorage.setItem('ecoplatform_user', JSON.stringify(this.userData));
            console.log('Данные сохранены');
            
            // Триггерим событие обновления данных
            this.triggerDataUpdate();
            
            return true;
        } catch (error) {
            console.error('Ошибка сохранения данных:', error);
            return false;
        }
    }
    
    // ========== РАБОТА С ПРИВЫЧКАМИ ==========
    addHabit(habitData) {
        // 1) Защита от дублирования "визитов" из разных модулей (карта, дашборд и т.п.)
        // Одна и та же точка (shopId) должна добавлять привычку типа "visit" только один раз.
        if (habitData && habitData.type === 'visit' && habitData.shopId != null) {
            const alreadyExists = Array.isArray(this.userData?.habits)
                ? this.userData.habits.some(
                    h => h.type === 'visit' && h.shopId === habitData.shopId
                  )
                : false;

            if (alreadyExists) {
                // Ничего не меняем, просто возвращаем уже существующую привычку
                return this.userData.habits.find(
                    h => h.type === 'visit' && h.shopId === habitData.shopId
                );
            }
        }

        // 2) Защита от «двойного клика» по кнопке привычки:
        // если предыдущая привычка абсолютно такая же и была добавлена только что (<= 3 сек),
        // считаем это дублем и не создаём новую запись.
        if (Array.isArray(this.userData?.habits) && this.userData.habits.length > 0) {
            const last = this.userData.habits[0];
            const nowTs = Date.now();
            const lastTs = last.date ? Date.parse(last.date) : 0;
            const isSameType = last.type === habitData?.type;
            const isSameCo2 = Number(last.co2) === Number(habitData?.co2);
            const isSameDesc = (last.description || '') === (habitData?.description || '');
            const isVeryRecent = lastTs && Math.abs(nowTs - lastTs) <= 3000;

            if (isSameType && isSameCo2 && isSameDesc && isVeryRecent) {
                return last;
            }
        }

        const newHabit = {
            id: Date.now(),
            ...habitData,
            date: new Date().toISOString()
        };
        
        this.userData.habits.unshift(newHabit);
        
        // Обновляем статистику
        this.userData.ecoPoints += habitData.points || 0;
        this.userData.co2Saved += habitData.co2 || 0;
        
        // Правильное распределение очков по категориям
        const habitType = habitData.type;
        switch(habitType) {
            case 'recycle':
                // Переработка -> отходы
                this.userData.wasteRecycled += habitData.wasteRecycled || 2.0;
                break;
            case 'water':
                // Экономия воды -> вода
                this.userData.waterSaved += habitData.waterSaved || 50;
                break;
            case 'bike':
            case 'energy':
                // Велосипед и энергия -> только CO2 (уже добавлено выше)
                break;
            default:
                // Для других типов привычек используем переданные значения
                if (habitData.waterSaved) {
                    this.userData.waterSaved += habitData.waterSaved;
                }
                if (habitData.wasteRecycled) {
                    this.userData.wasteRecycled += habitData.wasteRecycled;
                }
        }
        
        // Обновляем статистику привычек
        this.updateHabitsStats();
        
        this.saveData();
        return newHabit;
    }
    
    updateHabitsStats() {
        this.userData.stats.totalHabits = this.userData.habits.length;
        this.userData.stats.completedHabits = this.userData.habits.filter(h => h.completed).length;
    }
    
    getRecentHabits(limit = 5) {
        return this.userData.habits
            .sort((a, b) => new Date(b.date) - new Date(a.date))
            .slice(0, limit);
    }
    
    // ========== РАБОТА С ИНИЦИАТИВАМИ ==========
    startInitiative(initiativeData) {
        const initiative = {
            ...initiativeData,
            started: true,
            completed: false,
            startDate: new Date().toISOString(),
            currentDay: 1,
            completedTasks: [],
            progress: 0,
            totalTasks: initiativeData.checklist?.length || 0
        };
        
        this.userData.initiatives[initiativeData.id] = initiative;
        
        // Обновляем статистику инициатив
        this.updateInitiativesStats();
        
        this.saveData();
        return initiative;
    }
    
    completeTask(initiativeId, taskIndex) {
        const initiative = this.userData.initiatives[initiativeId];
        if (!initiative) return null;
        
        // Добавляем задачу в выполненные
        if (!initiative.completedTasks.includes(taskIndex)) {
            initiative.completedTasks.push(taskIndex);
            
            // Начисляем баллы за задачу
            const taskPoints = 10;
            this.userData.ecoPoints += taskPoints;
            
            // Рассчитываем прогресс
            const totalTasks = initiative.totalTasks;
            const completedTasks = initiative.completedTasks.length;
            initiative.progress = Math.round((completedTasks / totalTasks) * 100);
            initiative.currentDay = Math.min(taskIndex + 1, totalTasks);
            
            // Проверяем завершение инициативы
            if (completedTasks === totalTasks) {
                this.completeInitiative(initiativeId);
            }
            
            // Обновляем статистику
            this.updateInitiativesStats();
            
            this.saveData();
            
            return {
                initiative,
                taskPoints,
                isCompleted: completedTasks === totalTasks
            };
        }
        
        return null;
    }
    
    completeInitiative(initiativeId) {
        const initiative = this.userData.initiatives[initiativeId];
        if (!initiative) return null;
        
        initiative.completed = true;
        initiative.completionDate = new Date().toISOString();
        initiative.progress = 100;
        
        // Начисляем награду за инициативу
        const initiativePoints = initiative.rewards?.ecoPoints || 100;
        this.userData.ecoPoints += initiativePoints;
        
        // Добавляем достижение
        if (initiative.rewards?.badge) {
            this.userData.achievements.push({
                id: Date.now(),
                title: initiative.rewards.badge,
                icon: initiative.image || "🏆",
                date: new Date().toISOString().split('T')[0],
                description: `Завершена инициатива: ${initiative.title}`
            });
        }
        
        // Обновляем экологические показатели
        this.userData.co2Saved += initiative.co2Reduction || 0;
        this.userData.waterSaved += initiative.waterSaved || 0;
        
        this.saveData();
        
        return {
            initiative,
            initiativePoints
        };
    }
    
    getActiveInitiatives() {
        return Object.values(this.userData.initiatives)
            .filter(i => i.started && !i.completed)
            .sort((a, b) => new Date(b.startDate) - new Date(a.startDate));
    }
    
    getCompletedInitiatives() {
        return Object.values(this.userData.initiatives)
            .filter(i => i.completed)
            .sort((a, b) => new Date(b.completionDate) - new Date(a.completionDate));
    }
    
    updateInitiativesStats() {
        const allInitiatives = Object.values(this.userData.initiatives);
        this.userData.stats.totalInitiatives = allInitiatives.length;
        this.userData.stats.activeInitiatives = allInitiatives.filter(i => i.started && !i.completed).length;
        this.userData.stats.completedInitiatives = allInitiatives.filter(i => i.completed).length;
        
        // Считаем общее количество задач
        let totalTasks = 0;
        let completedTasks = 0;
        
        allInitiatives.forEach(initiative => {
            totalTasks += initiative.totalTasks || 0;
            completedTasks += initiative.completedTasks?.length || 0;
        });
        
        this.userData.stats.totalTasks = totalTasks;
        this.userData.stats.completedTasks = completedTasks;
    }
    
    // ========== ДОСТИЖЕНИЯ ==========
    addAchievement(achievementData) {
        const achievement = {
            id: Date.now(),
            ...achievementData,
            date: new Date().toISOString().split('T')[0]
        };
        
        this.userData.achievements.unshift(achievement);
        this.saveData();
        
        return achievement;
    }
    
    getRecentAchievements(limit = 3) {
        return this.userData.achievements
            .sort((a, b) => new Date(b.date) - new Date(a.date))
            .slice(0, limit);
    }

    // Сохранение результатов калькуляторов в единой системе данных
    addCalculation(type, data) {
        if (!this.userData.calculations) {
            this.userData.calculations = { eco: [], carbon: [], savings: [] };
        }
        
        const allowed = ['eco', 'carbon', 'savings'];
        if (!allowed.includes(type)) return;

        const list = this.userData.calculations[type] || [];
        const entry = {
            ...data,
            type,
            savedAt: new Date().toISOString()
        };

        list.push(entry);

        // Храним максимум 10 последних записей по каждому калькулятору
        if (list.length > 10) {
            list.splice(0, list.length - 10);
        }

        this.userData.calculations[type] = list;
        this.saveData();
    }
    
    // ========== УРОВНИ И ЗАВИСИМОСТЬ ОТ ЭКО-БАЛЛОВ ==========
    getLevelInfo() {
        const points = this.userData.ecoPoints || 0;
        
        // Линейка уровней: можно легко расширить в будущем
        const levels = [
            { id: 1, name: 'Эко-новичок',       min: 0,    icon: '🌱' },
            { id: 2, name: 'Эко-энтузиаст',     min: 200,  icon: '🌿' },
            { id: 3, name: 'Эко-эксперт',       min: 500,  icon: '🌎' },
            { id: 4, name: 'Эко-гуру',          min: 1000, icon: '🌟' },
            { id: 5, name: 'Эко-легенда',       min: 2000, icon: '🏆' }
        ];

        // Находим текущий уровень по количеству баллов
        let current = levels[0];
        for (const level of levels) {
            if (points >= level.min) {
                current = level;
            } else {
                break;
            }
        }

        // Следующий уровень (или null, если пользователь на максимальном)
        const currentIndex = levels.findIndex(l => l.id === current.id);
        const next = levels[currentIndex + 1] || null;

        const pointsToNext = next ? Math.max(next.min - points, 0) : 0;

        return {
            currentLevel: current,
            nextLevel: next,
            pointsToNext
        };
    }
    
    // ========== СТАТИСТИКА ==========
    getDashboardStats() {
        const today = new Date().toISOString().split('T')[0];
        
        // Привычки за сегодня
        const todayHabits = this.userData.habits.filter(h => 
            h.date && h.date.split('T')[0] === today
        ).length;
        
        // Активные инициативы
        const activeInitiatives = this.getActiveInitiatives();
        
        // Прогресс за неделю (упрощенный)
        const weekProgress = this.calculateWeekProgress();
        
        // Убеждаемся, что значения числовые
        const wasteRecycled = parseFloat(this.userData.wasteRecycled) || 0;
        const waterSaved = parseFloat(this.userData.waterSaved) || 0;
        const co2Saved = parseFloat(this.userData.co2Saved) || 0;
        
        return {
            // Быстрая статистика
            quickStats: {
                ecoPoints: this.userData.ecoPoints || 0,
                co2Saved: co2Saved.toFixed(1),
                waterSaved: waterSaved,
                wasteRecycled: wasteRecycled.toFixed(1),
                todayHabits: todayHabits,
                activeInitiatives: activeInitiatives.length,
                level: this.getLevelInfo()
            },
            
            // Активные инициативы
            activeInitiatives: activeInitiatives.map(i => ({
                id: i.id,
                title: i.title,
                icon: i.image,
                progress: i.progress,
                currentDay: i.currentDay,
                totalDays: i.duration ? parseInt(i.duration) : 7,
                completedTasks: i.completedTasks?.length || 0,
                totalTasks: i.totalTasks
            })),
            
            // График прогресса
            weekProgress: weekProgress,
            
            // Последние привычки
            recentHabits: this.getRecentHabits(5),
            
            // Последние достижения
            recentAchievements: this.getRecentAchievements(3),
            
            // Общая статистика
            overallStats: {
                ...this.userData.stats,
                totalEcoPoints: this.userData.ecoPoints,
                totalCO2Saved: this.userData.co2Saved,
                totalWaterSaved: this.userData.waterSaved
            }
        };
    }
    
    calculateWeekProgress() {
        // Упрощенный расчет прогресса за неделю
        const days = ['Пн', 'Вт', 'Ср', 'Чт', 'Пт', 'Сб', 'Вс'];
        const progress = {};
        
        days.forEach(day => {
            // Случайные значения для демо
            progress[day] = Math.floor(Math.random() * 100) + 20;
        });
        
        return progress;
    }
    
    // ========== СОБЫТИЯ ==========
    triggerDataUpdate() {
        // Создаем кастомное событие
        const event = new CustomEvent('ecodata-updated', {
            detail: { data: this.userData }
        });
        document.dispatchEvent(event);
    }
    
    // ========== ДОПОЛНИТЕЛЬНЫЕ МЕТОДЫ ==========
    resetData() {
        // Удаляем все данные пользователя
        localStorage.removeItem('ecoplatform_user');
        localStorage.removeItem('favorites');
        localStorage.removeItem('mapFavorites');
        localStorage.removeItem('articleFavorites');
        localStorage.removeItem('visitedPoints');
        localStorage.removeItem('ecoCalculations');
        localStorage.removeItem('carbonCalculations');
        localStorage.removeItem('savingsCalculations');
        
        // Удаляем отзывы (если есть)
        const keys = Object.keys(localStorage);
        keys.forEach(key => {
            if (key.startsWith('reviews_')) {
                localStorage.removeItem(key);
            }
        });
        
        // Сбрасываем данные к начальным значениям
        this.userData = this.getDefaultData();
        this.saveData();
        
        // Триггерим событие обновления
        this.triggerDataUpdate();
        
        return this.userData;
    }
    
    resetAllData() {
        // Полный сброс всех данных платформы
        // Удаляем все данные пользователя
        localStorage.removeItem('ecoplatform_user');
        localStorage.removeItem('favorites');
        localStorage.removeItem('mapFavorites');
        localStorage.removeItem('articleFavorites');
        localStorage.removeItem('visitedPoints');
        localStorage.removeItem('ecoCalculations');
        localStorage.removeItem('carbonCalculations');
        localStorage.removeItem('savingsCalculations');
        
        // Удаляем отзывы
        const keys = Object.keys(localStorage);
        keys.forEach(key => {
            if (key.startsWith('reviews_')) {
                localStorage.removeItem(key);
            }
        });
        
        // Сбрасываем данные к начальным значениям
        this.userData = this.getDefaultData();
        this.saveData();
        
        // Триггерим событие обновления
        this.triggerDataUpdate();
        
        return this.userData;
    }
    
    exportData() {
        return JSON.stringify(this.userData, null, 2);
    }
    
    importData(jsonData) {
        try {
            const importedData = JSON.parse(jsonData);
            this.userData = { ...this.userData, ...importedData };
            this.saveData();
            return true;
        } catch (error) {
            console.error('Ошибка импорта данных:', error);
            return false;
        }
    }
}

// Создаем глобальный экземпляр
window.dataManager = new DataManager();