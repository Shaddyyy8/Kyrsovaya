// calculator.js - Логика работы калькуляторов

// Константы для расчетов (ПМР)
const CALCULATION_CONSTANTS = {
    // Цены в рублях ПМР
    prices: {
        water: 45,          // руб/м³ (0.045 руб/литр)
        electricity: 5.5,   // руб/кВт⋅ч
        paper: 2,           // руб/лист
        gasoline: 45,       // руб/литр бензина
        diesel: 42,         // руб/литр дизеля
        gas: 15,            // руб/м³ газа
        waste: 250          // руб/кг (утилизация)
    },
    
    // Коэффициенты для экоследа
    ecoCoefficients: {
        transport: 0.3,     // транспортный след
        food: 0.2,          // пищевой след
        energy: 0.4,        // энергетический след
        waste: 0.1          // след от отходов
    },
    
    // Коэффициенты CO₂ (кг на единицу)
    carbonCoefficients: {
        carGasoline: 2.3,   // кг CO₂ на литр бензина
        carDiesel: 2.7,     // кг CO₂ на литр дизеля
        electricity: 0.4,   // кг CO₂ на кВт⋅ч (ПМР - в основном ГЭС)
        gas: 1.9,           // кг CO₂ на м³ газа
        bus: 0.1            // кг CO₂ на км (на пассажира)
    },
    
    // Эквиваленты для наглядности
    equivalents: {
        co2PerTree: 21,     // кг CO₂ поглощает 1 дерево в год
        waterPerShower: 100, // литров на душ
        energyPerBulb: 0.01, // кВт⋅ч/час для LED лампы
        paperPerTree: 8300   // листов бумаги из 1 дерева
    },
    
    // Расходы транспорта (литров на 100 км)
    transportConsumption: {
        car: 8,             // 8 л/100км
        bus: 30             // 30 л/100км на пассажира
    }
};

// Рекомендации для разных уровней
const RECOMMENDATIONS = {
    eco: {
        low: [
            "Отличный результат! Ваш экологический след минимален.",
            "Продолжайте практиковать осознанное потребление.",
            "Рекомендуем попробовать компостирование органических отходов."
        ],
        medium: [
            "Хороший результат! Есть куда расти.",
            "Попробуйте сократить использование автомобиля на 20%.",
            "Установите водосберегающие насадки на краны.",
            "Начните сортировать отходы хотя бы по 2 категориям."
        ],
        high: [
            "Есть над чем поработать! Начните с простых привычек.",
            "Используйте общественный транспорт 2 раза в неделю.",
            "Заменяйте мясные блюда растительными 3 раза в неделю.",
            "Выключайте электроприборы из розетки на ночь."
        ]
    },
    
    carbon: {
        low: [
            "Отлично! Ваши выбросы CO₂ ниже среднего по ПМР.",
            "Продолжайте использовать экологичный транспорт.",
            "Рассмотрите установку солнечных панелей."
        ],
        medium: [
            "Средний уровень выбросов. Можно улучшить!",
            "Рассмотрите карпулинг или переход на электромобиль.",
            "Утеплите окна для экономии на отоплении.",
            "Используйте энергоэффективные электроприборы."
        ],
        high: [
            "Высокий уровень выбросов. Рекомендуем:",
            "Сократите использование личного авто на 30%.",
            "Перейдите на тариф с зелёной энергией.",
            "Установите программируемый термостат.",
            "Посадите несколько деревьев для компенсации."
        ]
    }
};

// Глобальные переменные для графиков
let ecoChart = null;
let carbonChart = null;
let saveChart = null;

// Инициализация при загрузке страницы
document.addEventListener('DOMContentLoaded', function() {
    initCalculator();
    loadSavedData();
    setupEventListeners();
});

// Основная функция инициализации
function initCalculator() {
    console.log('Калькулятор эко-платформы инициализирован');
    
    // Инициализация range инпута
    const foodRange = document.getElementById('ecoFood');
    const foodValue = document.getElementById('ecoFoodValue');
    
    if (foodRange && foodValue) {
        foodRange.addEventListener('input', function() {
            foodValue.textContent = this.value;
        });
    }
}

// Настройка обработчиков событий
function setupEventListeners() {
    // Переключение между калькуляторами
    document.querySelectorAll('.js-calculator-tab').forEach(tab => {
        tab.addEventListener('click', function() {
            switchCalculator(this.dataset.target);
        });
    });
    
    // Калькулятор экоследа
    const ecoBtn = document.getElementById('ecoCalculateBtn');
    if (ecoBtn) {
        ecoBtn.addEventListener('click', calculateEcoFootprint);
    }
    
    // Калькулятор углеродного следа
    const carbonBtn = document.getElementById('carbonCalculateBtn');
    if (carbonBtn) {
        carbonBtn.addEventListener('click', calculateCarbonFootprint);
    }
    
    // Калькулятор экономии
    const saveBtn = document.getElementById('saveCalculateBtn');
    if (saveBtn) {
        saveBtn.addEventListener('click', calculateSavings);
    }
    
    // Сохранение результатов
    const saveEcoBtn = document.getElementById('saveEcoResults');
    if (saveEcoBtn) {
        saveEcoBtn.addEventListener('click', saveEcoResults);
    }
    
    // Сброс форм
    document.querySelectorAll('.calculator-form__reset').forEach(btn => {
        btn.addEventListener('click', function() {
            const form = this.closest('form');
            form.reset();
            
            // Сброс значения range
            const foodRange = document.getElementById('ecoFood');
            const foodValue = document.getElementById('ecoFoodValue');
            if (foodRange && foodValue) {
                foodValue.textContent = '5';
            }
            
            // Скрытие результатов
            const results = this.closest('.calculator-section').querySelector('.calculator-results');
            if (results) {
                results.hidden = true;
            }
        });
    });
}

// Переключение между калькуляторами
function switchCalculator(targetId) {
    // Скрыть все калькуляторы
    document.querySelectorAll('.calculator-section').forEach(section => {
        section.classList.remove('calculator-section--active');
        section.hidden = true;
    });
    
    // Показать выбранный
    const targetSection = document.getElementById(targetId);
    if (targetSection) {
        targetSection.classList.add('calculator-section--active');
        targetSection.hidden = false;
    }
    
    // Обновить состояние кнопок
    document.querySelectorAll('.js-calculator-tab').forEach(tab => {
        tab.setAttribute('aria-pressed', tab.dataset.target === targetId ? 'true' : 'false');
    });
    
    // Прокрутка к калькулятору
    targetSection.scrollIntoView({ behavior: 'smooth', block: 'start' });
}

// ========== КАЛЬКУЛЯТОР ЭКОЛОГИЧЕСКОГО СЛЕДА ==========
function calculateEcoFootprint() {
    // Получение значений из формы
    const transport = parseFloat(document.getElementById('ecoTransport').value) || 0;
    const food = parseFloat(document.getElementById('ecoFood').value) || 5;
    const energy = parseFloat(document.getElementById('ecoEnergy').value) || 0;
    const waste = parseFloat(document.getElementById('ecoWaste').value) || 0;
    
    // Расчет по формуле: транспорт × коэффициент + питание × коэффициент + энергия × коэффициент + отходы × коэффициент
    const ecoScore = (
        transport * CALCULATION_CONSTANTS.ecoCoefficients.transport +
        food * CALCULATION_CONSTANTS.ecoCoefficients.food +
        energy * CALCULATION_CONSTANTS.ecoCoefficients.energy +
        waste * CALCULATION_CONSTANTS.ecoCoefficients.waste
    ).toFixed(2);
    
    // Отображение результата
    document.getElementById('ecoScore').textContent = ecoScore;
    
    // Показать блок результатов
    const results = document.getElementById('ecoResults');
    results.hidden = false;
    
    // Обновить график
    updateEcoChart(transport, food, energy, waste, ecoScore);
    
    // Показать рекомендации
    showEcoRecommendations(ecoScore);
    
    // Сохранить расчет в историю
    saveCalculationToHistory('eco', {
        transport,
        food,
        energy,
        waste,
        score: parseFloat(ecoScore),
        date: new Date().toISOString()
    });
}

// Обновление графика экоследа
function updateEcoChart(transport, food, energy, waste, total) {
    const ctx = document.getElementById('ecoChart').getContext('2d');
    
    // Расчет вкладов
    const transportContribution = transport * CALCULATION_CONSTANTS.ecoCoefficients.transport;
    const foodContribution = food * CALCULATION_CONSTANTS.ecoCoefficients.food;
    const energyContribution = energy * CALCULATION_CONSTANTS.ecoCoefficients.energy;
    const wasteContribution = waste * CALCULATION_CONSTANTS.ecoCoefficients.waste;
    
    // Уничтожить старый график, если существует
    if (ecoChart) {
        ecoChart.destroy();
    }
    
    // Создать новый график
    ecoChart = new Chart(ctx, {
        type: 'doughnut',
        data: {
            labels: ['Транспорт', 'Питание', 'Энергия', 'Отходы'],
            datasets: [{
                data: [transportContribution, foodContribution, energyContribution, wasteContribution],
                backgroundColor: [
                    'rgba(46, 139, 87, 0.8)',    // Зеленый
                    'rgba(139, 69, 19, 0.8)',    // Коричневый
                    'rgba(245, 245, 220, 0.8)',  // Бежевый
                    'rgba(128, 128, 128, 0.8)'   // Серый
                ],
                borderColor: [
                    'rgb(46, 139, 87)',
                    'rgb(139, 69, 19)',
                    'rgb(245, 245, 220)',
                    'rgb(128, 128, 128)'
                ],
                borderWidth: 2
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
                legend: {
                    position: 'bottom',
                    labels: {
                        padding: 20,
                        font: {
                            size: 14
                        }
                    }
                },
                tooltip: {
                    callbacks: {
                        label: function(context) {
                            const value = context.raw;
                            const percentage = ((value / total) * 100).toFixed(1);
                            return `${context.label}: ${value} баллов (${percentage}%)`;
                        }
                    }
                }
            }
        }
    });
}

// Показать рекомендации по экоследу
function showEcoRecommendations(score) {
    const scoreNum = parseFloat(score);
    let recommendationsList = [];
    
    if (scoreNum < 3) {
        recommendationsList = RECOMMENDATIONS.eco.low;
    } else if (scoreNum < 6) {
        recommendationsList = RECOMMENDATIONS.eco.medium;
    } else {
        recommendationsList = RECOMMENDATIONS.eco.high;
    }
    
    const container = document.getElementById('ecoRecommendations');
    container.innerHTML = '';
    
    recommendationsList.forEach(rec => {
        const li = document.createElement('li');
        li.textContent = rec;
        container.appendChild(li);
    });
}

// ========== КАЛЬКУЛЯТОР УГЛЕРОДНОГО СЛЕДА ==========
function calculateCarbonFootprint() {
    // Получение значений из формы
    const transportType = document.getElementById('carbonTransportType').value;
    const transportDistance = parseFloat(document.getElementById('carbonTransport').value) || 0;
    const energy = parseFloat(document.getElementById('carbonEnergy').value) || 0;
    const heatingType = document.querySelector('input[name="heating"]:checked').value;
    const heatingAmount = parseFloat(document.getElementById('carbonHeating').value) || 0;
    
    // Расчет CO₂ от транспорта
    let transportCO2 = 0;
    switch (transportType) {
        case 'car':
            const liters = (transportDistance / 100) * CALCULATION_CONSTANTS.transportConsumption.car;
            transportCO2 = liters * CALCULATION_CONSTANTS.carbonCoefficients.carGasoline;
            break;
        case 'diesel':
            const dieselLiters = (transportDistance / 100) * CALCULATION_CONSTANTS.transportConsumption.car;
            transportCO2 = dieselLiters * CALCULATION_CONSTANTS.carbonCoefficients.carDiesel;
            break;
        case 'bus':
            transportCO2 = transportDistance * CALCULATION_CONSTANTS.carbonCoefficients.bus;
            break;
        case 'electric':
            transportCO2 = 0; // Электромобиль - 0 выбросов при использовании
            break;
    }
    
    // Расчет CO₂ от электроэнергии
    const energyCO2 = energy * CALCULATION_CONSTANTS.carbonCoefficients.electricity;
    
    // Расчет CO₂ от отопления
    let heatingCO2 = 0;
    if (heatingType === 'gas') {
        heatingCO2 = heatingAmount * CALCULATION_CONSTANTS.carbonCoefficients.gas;
    } else if (heatingType === 'electric') {
        heatingCO2 = heatingAmount * CALCULATION_CONSTANTS.carbonCoefficients.electricity;
    }
    
    // Общий CO₂ в кг в месяц
    const totalCO2 = transportCO2 + energyCO2 + heatingCO2;
    
    // Отображение результатов
    document.getElementById('carbonScore').textContent = totalCO2.toFixed(1);
    
    // Расчет эквивалентов
    const treesNeeded = (totalCO2 / CALCULATION_CONSTANTS.equivalents.co2PerTree * 12).toFixed(1); // деревьев в год
    const carKmEquivalent = (totalCO2 / CALCULATION_CONSTANTS.carbonCoefficients.carGasoline * 
                           (100 / CALCULATION_CONSTANTS.transportConsumption.car)).toFixed(0);
    
    // Расчет стоимости в рублях ПМР
    const transportCost = transportType === 'electric' ? 0 : 
                         (transportDistance / 100) * CALCULATION_CONSTANTS.transportConsumption.car * 
                         (transportType === 'diesel' ? CALCULATION_CONSTANTS.prices.diesel : CALCULATION_CONSTANTS.prices.gasoline);
    const energyCost = energy * CALCULATION_CONSTANTS.prices.electricity;
    const heatingCost = heatingType === 'gas' ? 
                       heatingAmount * CALCULATION_CONSTANTS.prices.gas : 
                       heatingAmount * CALCULATION_CONSTANTS.prices.electricity;
    const totalCost = transportCost + energyCost + heatingCost;
    
    // Обновление эквивалентов
    document.getElementById('carbonTrees').textContent = treesNeeded;
    document.getElementById('carbonCars').textContent = carKmEquivalent;
    document.getElementById('carbonPrice').textContent = totalCost.toFixed(0);
    
    // Показать результаты
    document.getElementById('carbonResults').hidden = false;
    
    // Обновить график
    updateCarbonChart(transportCO2, energyCO2, heatingCO2, totalCO2);
    
    // Показать рекомендации
    showCarbonRecommendations(totalCO2);
    
    // Сохранить расчет
    saveCalculationToHistory('carbon', {
        transportType,
        transportDistance,
        energy,
        heatingType,
        heatingAmount,
        co2: totalCO2,
        cost: totalCost,
        date: new Date().toISOString()
    });
}

// Обновление графика углеродного следа
function updateCarbonChart(transport, energy, heating, total) {
    const ctx = document.getElementById('carbonChart').getContext('2d');
    
    if (carbonChart) {
        carbonChart.destroy();
    }
    
    carbonChart = new Chart(ctx, {
        type: 'bar',
        data: {
            labels: ['Транспорт', 'Электроэнергия', 'Отопление'],
            datasets: [{
                label: 'кг CO₂',
                data: [transport, energy, heating],
                backgroundColor: [
                    'rgba(46, 139, 87, 0.7)',
                    'rgba(139, 69, 19, 0.7)',
                    'rgba(245, 245, 220, 0.7)'
                ],
                borderColor: [
                    'rgb(46, 139, 87)',
                    'rgb(139, 69, 19)',
                    'rgb(245, 245, 220)'
                ],
                borderWidth: 2
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            scales: {
                y: {
                    beginAtZero: true,
                    title: {
                        display: true,
                        text: 'кг CO₂ в месяц'
                    }
                }
            },
            plugins: {
                legend: {
                    display: false
                }
            }
        }
    });
}

// Показать рекомендации по углеродному следу
function showCarbonRecommendations(co2) {
    let recommendationsList = [];
    
    if (co2 < 100) {
        recommendationsList = RECOMMENDATIONS.carbon.low;
    } else if (co2 < 300) {
        recommendationsList = RECOMMENDATIONS.carbon.medium;
    } else {
        recommendationsList = RECOMMENDATIONS.carbon.high;
    }
    
    const container = document.getElementById('carbonRecommendations');
    container.innerHTML = '';
    
    recommendationsList.forEach(rec => {
        const li = document.createElement('li');
        li.textContent = rec;
        container.appendChild(li);
    });
}

// ========== КАЛЬКУЛЯТОР ЭКОНОМИИ РЕСУРСОВ ==========
function calculateSavings() {
    // Получение значений из формы
    const water = parseFloat(document.getElementById('saveWater').value) || 0; // литры в день
    const energy = parseFloat(document.getElementById('saveEnergy').value) || 0; // кВт⋅ч в месяц
    const paper = parseFloat(document.getElementById('savePaper').value) || 0; // листы в месяц
    const transport = parseFloat(document.getElementById('saveTransport').value) || 0; // км в месяц
    
    // Расчет экономии в рублях ПМР
    const waterSavings = (water * 30 / 1000) * CALCULATION_CONSTANTS.prices.water; // литры → м³ → рубли
    const energySavings = energy * CALCULATION_CONSTANTS.prices.electricity;
    const paperSavings = paper * CALCULATION_CONSTANTS.prices.paper;
    const transportSavings = (transport / 100) * CALCULATION_CONSTANTS.transportConsumption.car * 
                            CALCULATION_CONSTANTS.prices.gasoline;
    
    const totalSavings = waterSavings + energySavings + paperSavings + transportSavings;
    
    // Отображение результатов
    document.getElementById('saveTotal').textContent = totalSavings.toFixed(0);
    document.getElementById('saveWaterValue').textContent = waterSavings.toFixed(0) + ' руб.';
    document.getElementById('saveEnergyValue').textContent = energySavings.toFixed(0) + ' руб.';
    document.getElementById('savePaperValue').textContent = paperSavings.toFixed(0) + ' руб.';
    document.getElementById('saveTransportValue').textContent = transportSavings.toFixed(0) + ' руб.';
    
    // Расчет и отображение эквивалентов
    showSavingsEquivalents(water, energy, paper, transport);
    
    // Показать результаты
    document.getElementById('saveResults').hidden = false;
    
    // Обновить график
    updateSavingsChart(waterSavings, energySavings, paperSavings, transportSavings);
    
    // Сохранить расчет
    saveCalculationToHistory('savings', {
        water,
        energy,
        paper,
        transport,
        savings: totalSavings,
        date: new Date().toISOString()
    });
}

// Показать эквиваленты экономии
function showSavingsEquivalents(water, energy, paper, transport) {
    const container = document.getElementById('saveEquivalents');
    container.innerHTML = '';
    
    const equivalents = [];
    
    // Водные эквиваленты
    if (water > 0) {
        const showers = (water * 30 / CALCULATION_CONSTANTS.equivalents.waterPerShower).toFixed(0);
        equivalents.push(`💧 Экономия ${water * 30} литров воды = ${showers} принятых душа`);
    }
    
    // Энергетические эквиваленты
    if (energy > 0) {
        const bulbHours = (energy / CALCULATION_CONSTANTS.equivalents.energyPerBulb).toFixed(0);
        equivalents.push(`💡 Экономия ${energy} кВт⋅ч = ${bulbHours} часов работы LED лампы`);
    }
    
    // Бумажные эквиваленты
    if (paper > 0) {
        const treesSaved = (paper / CALCULATION_CONSTANTS.equivalents.paperPerTree).toFixed(2);
        equivalents.push(`🌳 Экономия ${paper} листов бумаги = сохранено ${treesSaved} деревьев`);
    }
    
    // Транспортные эквиваленты
    if (transport > 0) {
        equivalents.push(`🚲 ${transport} км на велосипеде = здоровье + экология`);
    }
    
    // Если нет экономии
    if (equivalents.length === 0) {
        equivalents.push('Введите значения для расчета эквивалентов экономии');
    }
    
    equivalents.forEach(eq => {
        const div = document.createElement('div');
        div.className = 'calculator-results__equivalent-item';
        div.textContent = eq;
        container.appendChild(div);
    });
}

// Обновление графика экономии
function updateSavingsChart(water, energy, paper, transport) {
    const ctx = document.getElementById('saveChart').getContext('2d');
    
    if (saveChart) {
        saveChart.destroy();
    }
    
    saveChart = new Chart(ctx, {
        type: 'polarArea',
        data: {
            labels: ['Вода', 'Энергия', 'Бумага', 'Транспорт'],
            datasets: [{
                label: 'Экономия в рублях',
                data: [water, energy, paper, transport],
                backgroundColor: [
                    'rgba(64, 224, 208, 0.7)',   // Аквамарин
                    'rgba(255, 215, 0, 0.7)',    // Золотой
                    'rgba(210, 180, 140, 0.7)',  // Бежевый
                    'rgba(46, 139, 87, 0.7)'     // Зеленый
                ],
                borderColor: [
                    'rgb(64, 224, 208)',
                    'rgb(255, 215, 0)',
                    'rgb(210, 180, 140)',
                    'rgb(46, 139, 87)'
                ],
                borderWidth: 2
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
                legend: {
                    position: 'right'
                }
            }
        }
    });
}

// ========== СОХРАНЕНИЕ ДАННЫХ ==========
// Загрузка сохраненных данных
function loadSavedData() {
    try {
        // Предпочитаем данные из DataManager, если он уже инициализирован
        let eco = [];
        let carbon = [];
        let savings = [];

        if (window.dataManager && window.dataManager.userData?.calculations) {
            eco = window.dataManager.userData.calculations.eco || [];
            carbon = window.dataManager.userData.calculations.carbon || [];
            savings = window.dataManager.userData.calculations.savings || [];
        } else {
            const savedEco = localStorage.getItem('ecoCalculations');
            const savedCarbon = localStorage.getItem('carbonCalculations');
            const savedSavings = localStorage.getItem('savingsCalculations');

            eco = savedEco ? JSON.parse(savedEco) : [];
            carbon = savedCarbon ? JSON.parse(savedCarbon) : [];
            savings = savedSavings ? JSON.parse(savedSavings) : [];
        }

        renderCalculatorHistory({ eco, carbon, savings });
    } catch (e) {
        console.warn('Не удалось загрузить сохраненные данные:', e);
    }
}

// Сохранение расчета в историю
function saveCalculationToHistory(type, data) {
    try {
        const key = `${type}Calculations`;
        const existing = JSON.parse(localStorage.getItem(key) || '[]');
        
        // Добавить новый расчет
        existing.push(data);
        
        // Оставить только последние 10 расчетов
        if (existing.length > 10) {
            existing.splice(0, existing.length - 10);
        }
        
        localStorage.setItem(key, JSON.stringify(existing));
        console.log(`Расчет ${type} сохранен в историю`);

        // Дополнительно сохраняем в едином DataManager, если он доступен
        if (window.dataManager && typeof window.dataManager.addCalculation === 'function') {
            window.dataManager.addCalculation(type, data);
        }
        
        // Показать уведомление
        showNotification('Расчет сохранен в вашу историю!', 'success');

        // Обновить блок истории на странице
        loadSavedData();
    } catch (e) {
        console.error('Ошибка при сохранении расчета:', e);
        showNotification('Не удалось сохранить расчет', 'error');
    }
}

// Сохранение результатов экоследа
function saveEcoResults() {
    const scoreElement = document.getElementById('ecoScore');
    const score = scoreElement ? parseFloat(scoreElement.textContent) : 0;
    
    if (score > 0) {
        saveCalculationToHistory('eco', {
            score,
            date: new Date().toISOString(),
            note: 'Сохранено из калькулятора'
        });
        
        showNotification('Результаты экоследа сохранены в личном кабинете!', 'success');
    } else {
        showNotification('Сначала выполните расчет', 'warning');
    }
}

// Отрисовка истории расчетов
function renderCalculatorHistory(all) {
    const list = document.getElementById('calculatorHistoryList');
    if (!list) return;

    const tabs = document.querySelectorAll('.calculator-history__tab');

    function getActiveType() {
        const active = document.querySelector('.calculator-history__tab--active');
        return active ? active.dataset.type : 'eco';
    }

    function getIconAndLabel(type) {
        if (type === 'eco') return { icon: '🌍', label: 'Экологический след' };
        if (type === 'carbon') return { icon: '🏭', label: 'Углеродный след' };
        return { icon: '💸', label: 'Экономия ресурсов' };
    }

    function render() {
        const type = getActiveType();
        const items = all[type] || [];

        list.innerHTML = '';

        if (!items.length) {
            list.innerHTML = `<p class="calculator-history__empty">
                Пока нет сохранённых расчетов для выбранного калькулятора.
            </p>`;
            return;
        }

        const { icon, label } = getIconAndLabel(type);

        items
            .slice() // копия
            .sort((a, b) => new Date(b.date || b.savedAt) - new Date(a.date || a.savedAt))
            .forEach(entry => {
                const dateStr = (entry.date || entry.savedAt || '').split('T')[0] || '';
                let valueText = '';

                if (type === 'eco') {
                    valueText = (entry.score || 0).toFixed ? (entry.score).toFixed(2) + ' балла' : `${entry.score} баллов`;
                } else if (type === 'carbon') {
                    valueText = (entry.co2 || 0).toFixed ? (entry.co2).toFixed(1) + ' кг CO₂' : `${entry.co2} кг CO₂`;
                } else {
                    valueText = (entry.savings || 0).toFixed ? (entry.savings).toFixed(0) + ' руб.' : `${entry.savings} руб.`;
                }

                const div = document.createElement('div');
                div.className = 'calculator-history__item';
                div.innerHTML = `
                    <div class="calculator-history__item-main">
                        <div class="calculator-history__item-icon">${icon}</div>
                        <div>
                            <div class="calculator-history__item-title">${label}</div>
                            <div class="calculator-history__item-meta">${dateStr || 'Недавно сохранено'}</div>
                        </div>
                    </div>
                    <div class="calculator-history__item-value">${valueText}</div>
                `;
                list.appendChild(div);
            });
    }

    tabs.forEach(tab => {
        tab.addEventListener('click', () => {
            tabs.forEach(t => t.classList.remove('calculator-history__tab--active'));
            tab.classList.add('calculator-history__tab--active');
            render();
        });
    });

    render();
}

// ========== УТИЛИТЫ ==========
// Показать уведомление
function showNotification(message, type = 'info') {
    // Создать элемент уведомления
    const notification = document.createElement('div');
    notification.className = `notification notification--${type}`;
    notification.textContent = message;
    notification.style.cssText = `
        position: fixed;
        top: 20px;
        right: 20px;
        padding: 1rem 1.5rem;
        background: ${type === 'success' ? 'var(--primary-color)' : 
                     type === 'error' ? '#dc3545' : 'var(--accent-color)'};
        color: white;
        border-radius: var(--border-radius-sm);
        box-shadow: var(--shadow-medium);
        z-index: 1000;
        animation: slideIn 0.3s ease-out;
    `;
    
    document.body.appendChild(notification);
    
    // Удалить уведомление через 3 секунды
    setTimeout(() => {
        notification.style.animation = 'slideOut 0.3s ease-out';
        setTimeout(() => {
            if (notification.parentNode) {
                notification.parentNode.removeChild(notification);
            }
        }, 300);
    }, 3000);
}

// Добавить стили для анимаций уведомлений
const style = document.createElement('style');
style.textContent = `
    @keyframes slideIn {
        from {
            transform: translateX(100%);
            opacity: 0;
        }
        to {
            transform: translateX(0);
            opacity: 1;
        }
    }
    
    @keyframes slideOut {
        from {
            transform: translateX(0);
            opacity: 1;
        }
        to {
            transform: translateX(100%);
            opacity: 0;
        }
    }
`;
document.head.appendChild(style);

// Экспорт функций для тестирования
if (typeof module !== 'undefined' && module.exports) {
    module.exports = {
        calculateEcoFootprint,
        calculateCarbonFootprint,
        calculateSavings,
        CALCULATION_CONSTANTS,
        RECOMMENDATIONS
    };
}