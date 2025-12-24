// map.js - Карта эко-точек с Leaflet.js

// Данные эко-точек (координаты для Тирасполя, ПМР)
const ECO_POINTS = [
    // Пункты приема батареек
    {
        id: 1,
        name: 'Пункт приема батареек "ЭкоСервис"',
        category: 'recycling',
        type: 'Батарейки',
        lat: 46.8403,
        lng: 29.6113,
        address: 'ул. 25 Октября, 104',
        phone: '+373 (533) 8-45-12',
        hours: 'Пн-Пт: 9:00-18:00, Сб: 10:00-15:00',
        description: 'Принимаем все виды батареек и аккумуляторов. Бесплатный прием.',
        acceptedItems: ['Батарейки', 'Аккумуляторы', 'Электроника'],
        rating: 4.8,
        website: 'https://ecoservice.pmr',
        images: []
    },
    {
        id: 2,
        name: 'Эко-пункт "Зеленая точка"',
        category: 'recycling',
        type: 'Батарейки',
        lat: 46.8350,
        lng: 29.6250,
        address: 'ул. Ленина, 45',
        phone: '+373 (533) 7-23-56',
        hours: 'Пн-Вс: 8:00-20:00',
        description: 'Прием батареек, ламп, электроники. Выдача эко-баллов за сдачу.',
        acceptedItems: ['Батарейки', 'Лампы', 'Электроника', 'Пластик'],
        rating: 4.6,
        website: 'https://greent.pmr',
        images: []
    },
    {
        id: 3,
        name: 'Пункт приема "Вторсырье+"',
        category: 'recycling',
        type: 'Батарейки',
        lat: 46.8450,
        lng: 29.5950,
        address: 'пр. Мира, 12',
        phone: '+373 (533) 9-12-34',
        hours: 'Пн-Сб: 10:00-19:00',
        description: 'Специализированный пункт приема батареек и аккумуляторов.',
        acceptedItems: ['Батарейки', 'Аккумуляторы'],
        rating: 4.7,
        website: 'https://vtorsir+.pmr',
        images: []
    },
    
    // Магазины без упаковки
    {
        id: 4,
        name: 'Эко-магазин "Zero Waste"',
        category: 'shop',
        type: 'Магазин без упаковки',
        lat: 46.8380,
        lng: 29.6180,
        address: 'ул. Победы, 28',
        phone: '+373 (533) 6-78-90',
        hours: 'Пн-Сб: 9:00-20:00, Вс: 10:00-18:00',
        description: 'Первый магазин без упаковки в Тирасполе. Крупы, орехи, специи на развес.',
        acceptedItems: ['Своя тара', 'Многоразовые контейнеры'],
        rating: 4.2,
        website: 'https://zerowaste.pmr',
        images: []
    },
    {
        id: 5,
        name: 'Эко-маркет "Натуральный"',
        category: 'shop',
        type: 'Магазин без упаковки',
        lat: 46.8320,
        lng: 29.6080,
        address: 'ул. Мира, 67',
        phone: '+373 (533) 5-43-21',
        hours: 'Пн-Вс: 8:00-21:00',
        description: 'Органические продукты, крупы, чай, кофе на развес. Скидка при использовании своей тары.',
        acceptedItems: ['Своя тара', 'Эко-сумки'],
        rating: 3.7,
        website: 'https://natural.pmr',
        images: []
    },
    {
        id: 6,
        name: 'Магазин "ЭкоПродукт"',
        category: 'shop',
        type: 'Магазин без упаковки',
        lat: 46.8420,
        lng: 29.6200,
        address: 'ул. Комсомольская, 15',
        phone: '+373 (533) 4-56-78',
        hours: 'Пн-Сб: 9:00-19:00',
        description: 'Продукты без упаковки, бытовая химия на разлив, эко-товары.',
        acceptedItems: ['Своя тара', 'Многоразовые бутылки'],
        rating: 4.6,
        website: 'https://ekoproduct.pmr',
        images: []
    },

      // Точка компостирования
        {
            id: 7,
            name: 'Компостер "Городской сад"',
            category: 'compost',
            type: 'Компостирование',
            lat: 46.8390,
            lng: 29.6135,
            address: 'сквер им. Пушкина',
            phone: '+373 (533) 3-21-09',
            hours: 'Круглосуточно',
            description: 'Общественный компостер для кухонных и садовых отходов. Принимаем овощные и растительные остатки.',
            acceptedItems: ['Органические отходы', 'Листья', 'Травы', 'Кофейная гуща'],
            rating: 4.6,
            website: 'https://citygarden.pmr',
            images: []
        },

];

// Инициализация карты
let map;
let markers = [];
let userLocation = null;
let userMarker = null;
let favorites = JSON.parse(localStorage.getItem('mapFavorites') || '[]');

// Категории и их цвета
const CATEGORY_COLORS = {
    recycling: '#2E8B57',
    shop: '#8B4513',
    compost: '#556B2F'
};

// Use small inline SVG icons for consistent rendering
const CATEGORY_ICONS = {
    recycling: '♻️',
    shop: '🛍️',
    compost: '🌱'
};

// Гарантируем загрузку DataManager на странице карты,
// чтобы посещения точек учитывались в общей эко-статистике
(function ensureDataManagerForMap() {
    try {
        if (window.dataManager) return;
        // Если скрипт уже подключается на странице — не дублируем
        const exists = document.querySelector('script[src$="data-manager.js"]');
        if (exists) return;
        const script = document.createElement('script');
        // Путь относительно html-страницы (map.html лежит в docs/, js — в ../js/)
        script.src = '../js/data-manager.js';
        document.head.appendChild(script);
    } catch (e) {
        console.warn('Не удалось автоматически подключить DataManager для карты:', e);
    }
})();

// Инициализация при загрузке страницы (будет вызвана в конце файла)

// Инициализация карты
function initMap() {
    // Центр карты - Тирасполь
    map = L.map('map').setView([46.8403, 29.6113], 13);
    
    // Устанавливаем местоположение по умолчанию в Тирасполе
    userLocation = {
        lat: 46.8403,
        lng: 29.6113
    };
    
    // Добавление тайлов OpenStreetMap
    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '© OpenStreetMap contributors',
        maxZoom: 19
    }).addTo(map);
    
    // Добавление маркеров для всех точек
    addMarkersToMap();
    
    // Скрытие загрузчика
    const loader = document.getElementById('mapLoader');
    if (loader) {
        setTimeout(() => {
            loader.style.display = 'none';
        }, 500);
    }
    
    // Обновление списка точек в сайдбаре
    updateSidebarList(ECO_POINTS);
}

// Добавление маркеров на карту
function addMarkersToMap() {
    // Очистка существующих маркеров
    markers.forEach(marker => map.removeLayer(marker));
    markers = [];
    
    const categoryFilter = document.getElementById('categoryFilter')?.value || 'all';
    const ratingFilter = document.getElementById('ratingFilter')?.value || 'all';
    
    let filteredPoints = ECO_POINTS;
    
    // Фильтрация по категории
    if (categoryFilter !== 'all') {
        filteredPoints = filteredPoints.filter(point => point.category === categoryFilter);
    }
    
    // Фильтрация по рейтингу (по порогу)
    if (ratingFilter !== 'all') {
        const minRating = parseFloat(ratingFilter);
        filteredPoints = filteredPoints.filter(point => {
            return (point.rating || 0) >= minRating;
        });
    }
    
    // Добавление маркеров
    filteredPoints.forEach(point => {
        const isFavorite = favorites.includes(point.id);
        const marker = createMarker(point, isFavorite);
        markers.push(marker);
        marker.addTo(map);
    });
    
    // Обновление списка в сайдбаре
    updateSidebarList(filteredPoints);
}

// Создание маркера
function createMarker(point, isFavorite = false) {
    const color = CATEGORY_COLORS[point.category] || '#2E8B57';
    const icon = CATEGORY_ICONS[point.category] || '📍';
    const visited = visitedListIncludes(point.id);
    
    // Создание кастомной иконки
    const customIcon = L.divIcon({
        className: 'custom-marker',
        html: `<div class="map__marker-icon ${visited ? 'map__marker-icon--active' : ''} ${isFavorite ? 'map__marker-icon--favorite' : ''}" style="background-color: ${color};">
            <span style="font-size: 18px;">${icon}</span>
        </div>`,
        iconSize: [40, 40],
        iconAnchor: [20, 40],
        popupAnchor: [0, -40]
    });
    
    const marker = L.marker([point.lat, point.lng], { icon: customIcon });
    
    // Попап с информацией
    const popupContent = createPopupContent(point, isFavorite);
    marker.bindPopup(popupContent, {
        maxWidth: 300,
        className: 'eco-popup'
    });
    
    // Обработчик клика
    marker.on('click', function() {
        highlightPoint(point.id);
        showPointDetails(point);
    });
    
    return marker;
}

// Создание содержимого попапа
function createPopupContent(point, isFavorite) {
    const favoriteBtn = isFavorite 
        ? '<button class="map__btn-favorite map__btn-favorite--active" onclick="toggleFavorite(' + point.id + ')">❤️ В избранном</button>'
        : '<button class="map__btn-favorite" onclick="toggleFavorite(' + point.id + ')">🤍 В избранное</button>';

    return `
        <div class="popup-content">
            <div class="popup-header">
                <span class="popup-category ${point.category}">${CATEGORY_ICONS[point.category]} ${point.type}</span>
                <div class="popup-rating">⭐ ${point.rating}</div>
            </div>
            <h3 class="popup-title">${point.name}</h3>
            <p class="popup-address">📍 ${point.address}</p>
            <p class="popup-hours">🕒 ${point.hours}</p>
            <p class="popup-description">${point.description}</p>
            <div class="popup-actions">
                ${favoriteBtn}
                <button class="btn-directions" onclick="getDirections(${point.id})">🗺️ Маршрут</button>
            </div>
        </div>
    `;
}

// Инициализация обработчиков событий
function initEventListeners() {
    // Поиск
    const searchInput = document.getElementById('searchInput');
    if (searchInput) {
        searchInput.addEventListener('input', handleSearch);
    }
    
    const clearSearchBtn = document.getElementById('clearSearch');
    if (clearSearchBtn) {
        clearSearchBtn.addEventListener('click', () => {
            searchInput.value = '';
            handleSearch();
        });
    }
    
    // Фильтры
    const categoryFilter = document.getElementById('categoryFilter');
    if (categoryFilter) {
        categoryFilter.addEventListener('change', addMarkersToMap);
    }
    
    const ratingFilter = document.getElementById('ratingFilter');
    if (ratingFilter) {
        ratingFilter.addEventListener('change', addMarkersToMap);
    }
    
    // Кнопка определения местоположения
    const locateBtn = document.getElementById('locateBtn');
    if (locateBtn) {
        locateBtn.addEventListener('click', getUserLocation);
    }
    
    // Закрытие сайдбара
    const sidebarClose = document.getElementById('sidebarClose');
        if (sidebarClose) {
        sidebarClose.addEventListener('click', () => {
            document.getElementById('mapSidebar')?.classList.remove('map__sidebar--active');
        });
    }
    
    // Модальное окно
    const modal = document.getElementById('pointModal');
    const modalClose = document.getElementById('modalClose');
    if (modalClose) {
        modalClose.addEventListener('click', () => {
            modal?.classList.remove('map__modal--active');
        });
    }
    
    if (modal) {
        modal.addEventListener('click', (e) => {
            if (e.target === modal) {
                modal.classList.remove('map__modal--active');
            }
        });
    }
}

// Поиск точек
function handleSearch() {
    const query = document.getElementById('searchInput')?.value.toLowerCase() || '';
    
    if (!query) {
        addMarkersToMap();
        return;
    }
    
    const filtered = ECO_POINTS.filter(point => 
        point.name.toLowerCase().includes(query) ||
        point.address.toLowerCase().includes(query) ||
        point.type.toLowerCase().includes(query) ||
        point.description.toLowerCase().includes(query)
    );
    
    // Очистка маркеров
    markers.forEach(marker => map.removeLayer(marker));
    markers = [];
    
    // Добавление найденных точек
    filtered.forEach(point => {
        const isFavorite = favorites.includes(point.id);
        const marker = createMarker(point, isFavorite);
        markers.push(marker);
        marker.addTo(map);
    });
    
    // Обновление сайдбара
    updateSidebarList(filtered);
    
    // Фокус на найденные точки
    if (filtered.length > 0) {
        const group = new L.featureGroup(markers);
        map.fitBounds(group.getBounds().pad(0.1));
    }
}

// Определение местоположения пользователя
function getUserLocation() {
    if (!navigator.geolocation) {
        alert('Геолокация не поддерживается вашим браузером');
        return;
    }
    
    const locateBtn = document.getElementById('locateBtn');
    if (locateBtn) {
        locateBtn.disabled = true;
        locateBtn.textContent = '⏳ Определение...';
    }
    
    navigator.geolocation.getCurrentPosition(
        (position) => {
            // Проверяем корректность и точность координат
            const lat = position.coords.latitude;
            const lng = position.coords.longitude;
            const accuracy = position.coords.accuracy || 0;

            // Границы Тирасполя (приблизительно)
            function isInTiraspol(lat, lng) {
                return lat >= 46.82 && lat <= 46.86 && lng >= 29.58 && lng <= 29.64;
            }

            // Если координаты вне Тирасполя или точность низкая (>5000м), используем Тирасполь по умолчанию
            if (!isFinite(lat) || !isFinite(lng) || !isInTiraspol(lat, lng) || accuracy > 5000) {
                console.warn('Координаты пользователя неверны или вне Тирасполя, используем центр Тирасполя');
                userLocation = { lat: 46.8403, lng: 29.6113 };
                // Опциональное информирование пользователя
                try {
                    const info = document.createElement('div');
                    info.className = 'notification notification--warning';
                    info.innerHTML = '<span>ℹ️ Геолокация не уверена — показано местоположение по умолчанию (Тирасполь)</span>';
                    document.body.appendChild(info);
                    setTimeout(() => { info.classList.add('notification--hiding'); setTimeout(() => info.remove(), 300); }, 3000);
                } catch (e) { /* ignore */ }
            } else {
                userLocation = { lat, lng };
            }
            
            // Добавление маркера пользователя
            if (userMarker) {
                map.removeLayer(userMarker);
            }
            
            userMarker = L.marker([userLocation.lat, userLocation.lng], {
                icon: L.divIcon({
                    className: 'user-marker',
                    html: '<div class="user-marker-icon">📍</div>',
                    iconSize: [30, 30],
                    iconAnchor: [15, 30]
                })
            }).addTo(map);
            
            // Центрирование карты
            map.setView([userLocation.lat, userLocation.lng], 14);
            
            // Обновление маркеров с учетом расстояния
            addMarkersToMap();
            
            if (locateBtn) {
                locateBtn.disabled = false;
                locateBtn.innerHTML = '<i class="fas fa-location-arrow"></i> Мое местоположение';
            }
        },
        (error) => {
            // Если не удалось определить местоположение, используем Тирасполь по умолчанию
            userLocation = {
                lat: 46.8403,
                lng: 29.6113
            };
            
            // Добавление маркера пользователя в Тирасполе
            if (userMarker) {
                map.removeLayer(userMarker);
            }
            
            userMarker = L.marker([userLocation.lat, userLocation.lng], {
                icon: L.divIcon({
                    className: 'user-marker',
                    html: '<div class="user-marker-icon">📍</div>',
                    iconSize: [30, 30],
                    iconAnchor: [15, 30]
                })
            }).addTo(map);
            
            // Центрирование карты на Тирасполе
            map.setView([userLocation.lat, userLocation.lng], 13);
            
            // Обновление маркеров с учетом расстояния
            addMarkersToMap();
            
            if (locateBtn) {
                locateBtn.disabled = false;
                locateBtn.innerHTML = '<i class="fas fa-location-arrow"></i> Мое местоположение';
            }
        }
    );
}

// Расчет расстояния между двумя точками (в км)
function calculateDistance(lat1, lng1, lat2, lng2) {
    const R = 6371; // Радиус Земли в км
    const dLat = (lat2 - lat1) * Math.PI / 180;
    const dLng = (lng2 - lng1) * Math.PI / 180;
    const a = 
        Math.sin(dLat / 2) * Math.sin(dLat / 2) +
        Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) *
        Math.sin(dLng / 2) * Math.sin(dLng / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    return R * c;
}

// Обновление списка точек в сайдбаре
function updateSidebarList(points) {
    const pointsList = document.getElementById('pointsList');
    if (!pointsList) return;
    
    if (points.length === 0) {
        pointsList.innerHTML = `
            <div class="empty-state">
                <i class="fas fa-map-pin"></i>
                <p>Точки не найдены</p>
            </div>
        `;
        return;
    }
    
    // Сортировка по расстоянию (если есть местоположение пользователя)
    if (userLocation) {
        points = points.map(point => ({
            ...point,
            distance: calculateDistance(
                userLocation.lat,
                userLocation.lng,
                point.lat,
                point.lng
            )
        })).sort((a, b) => a.distance - b.distance);
    }
    
    pointsList.innerHTML = points.map(point => {
        const isFavorite = favorites.includes(point.id);
        const distance = point.distance ? `${point.distance.toFixed(1)} км` : '';
        return `
            <div class="point-item" onclick="showPointDetails(${JSON.stringify(point).replace(/"/g, '&quot;')})">
                <div style="display:flex; align-items:center; gap:10px;">
                    <span class="point-item__icon">${CATEGORY_ICONS[point.category]}</span>
                    <div style="flex:1">
                        <div class="point-header">
                            <h4 class="point-title">${point.name}</h4>
                            ${distance ? `<span class="point-distance">${distance}</span>` : ''}
                        </div>
                        <span class="point-category category-${point.category}">${point.type}</span>
                        <p class="point-description">${point.description}</p>
                    </div>
                </div>
                <div class="point-item__actions">
                    <button class="map__btn-favorite ${isFavorite ? 'map__btn-favorite--active' : ''}" 
                            onclick="event.stopPropagation(); toggleFavorite(${point.id})" title="Добавить в избранное">
                        ${isFavorite ? '❤️' : '🤍'}
                    </button>
                    <button class="btn-small btn-directions" title="Построить маршрут" 
                            onclick="event.stopPropagation(); getDirections(${point.id})">
                        🗺️ Маршрут
                    </button>
                </div>
            </div>
        `;
    }).join('');
}

// Показать детали точки
function showPointDetails(point) {
    const modal = document.getElementById('pointModal');
    if (!modal) return;
    
    const isFavorite = favorites.includes(point.id);
    
    // Заполнение модального окна
    document.getElementById('modalCategory').textContent = `${CATEGORY_ICONS[point.category]} ${point.type}`;
    document.getElementById('modalCategory').className = `point-category category-${point.category}`;
    document.getElementById('modalTitle').textContent = point.name;
    document.getElementById('modalAddress').textContent = point.address;
    document.getElementById('modalHours').textContent = point.hours;
    document.getElementById('modalPhone').textContent = point.phone;
    document.getElementById('modalDescription').textContent = point.description;
    
    const modalWebsite = document.getElementById('modalWebsite');
    if (point.website) {
        modalWebsite.href = point.website;
        modalWebsite.textContent = point.website;
        modalWebsite.style.display = 'inline';
    } else {
        modalWebsite.style.display = 'none';
    }
    
    // Рейтинг
    const modalRating = document.getElementById('modalRating');
    if (modalRating) {
        modalRating.innerHTML = '⭐'.repeat(Math.floor(point.rating)) + 
                               (point.rating % 1 >= 0.5 ? '⭐' : '') + 
                               ` ${point.rating}`;
    }
    
    // Принимаемые предметы
    const modalItems = document.getElementById('modalItems');
    if (modalItems) {
        modalItems.innerHTML = point.acceptedItems.map(item => 
            `<span class="item-tag">${item}</span>`
        ).join('');
    }
    
    // Кнопка избранного
    const addToFavorites = document.getElementById('addToFavorites');
    if (addToFavorites) {
        addToFavorites.innerHTML = isFavorite 
            ? '<i class="fas fa-heart"></i> В избранном'
            : '<i class="fas fa-heart"></i> В избранное';
        addToFavorites.onclick = () => toggleFavorite(point.id);
    }
    
    // Кнопка маршрута
    const getDirectionsBtn = document.getElementById('getDirections');
    if (getDirectionsBtn) {
        getDirectionsBtn.onclick = () => getDirections(point.id);
    }

    // Кнопка отметить посещенным: помечаем и также добавляем в избранное
    const markVisitedBtn = document.getElementById('markVisited');
    if (markVisitedBtn) {
        markVisitedBtn.onclick = () => {
            toggleVisited(point.id);
            // также добавляем в избранное при отметке
            if (!favorites.includes(point.id)) toggleFavorite(point.id);
        };
        // Установить текст по текущему состоянию
        markVisitedBtn.innerHTML = visitedListIncludes(point.id)
            ? '<i class="fas fa-check-circle"></i> Отмечено'
            : '<i class="fas fa-check-circle"></i> Отметить посещенным';
    }
    
    modal.classList.add('map__modal--active');
}

// Переключение избранного
function toggleFavorite(pointId) {
    const index = favorites.indexOf(pointId);
    
    if (index > -1) {
        favorites.splice(index, 1);
    } else {
        favorites.push(pointId);
    }
    
    localStorage.setItem('mapFavorites', JSON.stringify(favorites));
    addMarkersToMap();
    updateSidebarList(ECO_POINTS);
    
    // Обновление кнопки в модальном окне
    const point = ECO_POINTS.find(p => p.id === pointId);
    if (point) {
        const addToFavorites = document.getElementById('addToFavorites');
        if (addToFavorites) {
            const isFavorite = favorites.includes(pointId);
            addToFavorites.innerHTML = isFavorite 
                ? '<i class="fas fa-heart"></i> В избранном'
                : '<i class="fas fa-heart"></i> В избранное';
        }
    }
}

// Helper: проверить включён ли pointId в visited list
// Возвращает объект с массивами посещённых точек по категориям
function getVisitedPoints() {
    try {
        const raw = localStorage.getItem('visitedPoints');
        if (raw) return JSON.parse(raw);
    } catch (e) {
        console.error('Ошибка парсинга visitedPoints', e);
    }
    return { recycling: [], shop: [], compost: [] };
}

function saveVisitedPoints(obj) {
    localStorage.setItem('visitedPoints', JSON.stringify(obj));
}

// Проверяет, отмечен ли pointId в любом разделе
function visitedListIncludes(pointId) {
    const visited = getVisitedPoints();
    return Object.values(visited).some(arr => arr.includes(pointId));
}

// Переключение посещённости точки с учётом категории
function toggleVisited(pointId) {
    const point = ECO_POINTS.find(p => p.id === pointId);
    if (!point) return;

    const visited = getVisitedPoints();
    const cat = point.category || 'shop';
    if (!visited[cat]) visited[cat] = [];

    const idx = visited[cat].indexOf(pointId);
    if (idx > -1) {
        // снять отметку
        visited[cat].splice(idx, 1);
        saveVisitedPoints(visited);
        updateStats();
        addMarkersToMap();
        updateSidebarList(ECO_POINTS);
        return;
    }

    // отметить посещение
    visited[cat].push(pointId);
    saveVisitedPoints(visited);

    // добавить привычку/активность в DataManager (только при первичной отметке)
    if (window.dataManager) {
        const exists = window.dataManager.userData.habits.some(h => h.shopId === pointId && h.type === 'visit');
        if (!exists) {
            const habit = {
                type: 'visit',
                co2: 0,
                points: 20,
                description: point ? `Посетил: ${point.name}` : 'Посещён пункт',
                shopId: pointId,
                completed: true
            };
            window.dataManager.addHabit(habit);
        }
    }

    updateStats();
    addMarkersToMap();
    updateSidebarList(ECO_POINTS);

    // при отметке посещенным — также обновляем избранное счётчик
    if (!favorites.includes(pointId)) {
        favorites.push(pointId);
        localStorage.setItem('mapFavorites', JSON.stringify(favorites));
        updateFavoritesCount();
    }
}

// Загрузка избранного
function loadFavorites() {
    const saved = localStorage.getItem('mapFavorites');
    if (saved) {
        favorites = JSON.parse(saved);
    }
}

// Обновление счетчика избранного
function updateFavoritesCount() {
    const count = favorites.length;
    const countElement = document.getElementById('favoritesCount');
    if (countElement) {
        countElement.textContent = count;
    }
}

// Построение маршрута
function getDirections(pointId) {
    const point = ECO_POINTS.find(p => p.id === pointId);
    if (!point) return;
    
    if (userLocation) {
        // Открытие маршрута в Google Maps или Yandex Maps
        const url = `https://www.google.com/maps/dir/${userLocation.lat},${userLocation.lng}/${point.lat},${point.lng}`;
        window.open(url, '_blank');
    } else {
        // Просто открытие точки на карте
        const url = `https://www.google.com/maps/search/?api=1&query=${point.lat},${point.lng}`;
        window.open(url, '_blank');
    }
}

// Подсветка точки
function highlightPoint(pointId) {
    const point = ECO_POINTS.find(p => p.id === pointId);
    if (!point) return;
    
    // Центрирование карты на точке
    map.setView([point.lat, point.lng], 15);
    
    // Открытие попапа
    const marker = markers.find(m => {
        const latlng = m.getLatLng();
        return Math.abs(latlng.lat - point.lat) < 0.0001 && 
               Math.abs(latlng.lng - point.lng) < 0.0001;
    });
    
    if (marker) {
        marker.openPopup();
    }
}

// Отображение избранных точек
function displayFavorites() {
    const favoritesGrid = document.getElementById('favoritesGrid');
    if (!favoritesGrid) return;
    
    if (favorites.length === 0) {
        favoritesGrid.innerHTML = `
            <div class="empty-state">
                <i class="fas fa-heart"></i>
                <p>Добавьте точки в избранное, нажав на сердечко на карте</p>
                <button class="btn btn--primary" onclick="document.getElementById('map').scrollIntoView({behavior: 'smooth'})">
                    Исследовать карту
                </button>
            </div>
        `;
        return;
    }
    
    const favoritePoints = ECO_POINTS.filter(point => favorites.includes(point.id));
    
    favoritesGrid.innerHTML = favoritePoints.map(point => {
        const distance = userLocation 
            ? `${calculateDistance(userLocation.lat, userLocation.lng, point.lat, point.lng).toFixed(1)} км`
            : '';
        
        return `
            <div class="favorite-card" onclick="showPointDetails(${JSON.stringify(point).replace(/"/g, '&quot;')})">
                <div class="favorite-image">
                    <div class="favorite-category category-${point.category}">
                        ${CATEGORY_ICONS[point.category]} ${point.type}
                    </div>
                </div>
                <div class="favorite-content">
                    <div class="favorite-header">
                        <h3 class="favorite-title">${point.name}</h3>
                        <!-- remove cross button per UX: favorites are toggled via heart -->
                    </div>
                    <p class="favorite-address">📍 ${point.address} ${distance ? `(${distance})` : ''}</p>
                    <p class="favorite-description">${point.description}</p>
                    <div class="favorite-actions">
                        <button class="btn btn--primary btn-small" onclick="event.stopPropagation(); showPointDetails(${JSON.stringify(point).replace(/"/g, '&quot;')})">
                            Подробнее
                        </button>
                        <button class="btn btn--secondary btn-small" onclick="event.stopPropagation(); getDirections(${point.id})">
                            Маршрут
                        </button>
                    </div>
                </div>
            </div>
        `;
    }).join('');
}

// Обновление статистики
function updateStats() {
    const recyclingPoints = ECO_POINTS.filter(p => p.category === 'recycling').length;
    const shopPoints = ECO_POINTS.filter(p => p.category === 'shop').length;
    
    const visitedRecycling = document.getElementById('visitedRecycling');
    const totalRecycling = document.getElementById('totalRecycling');
    const visitedShops = document.getElementById('visitedShops');
    const plasticSaved = document.getElementById('plasticSaved');
    const ecoPointsEl = document.getElementById('ecoPoints');
    const pointsToNextEl = document.getElementById('pointsToNext');
    
    if (totalRecycling) totalRecycling.textContent = recyclingPoints;
    if (visitedRecycling) {
        const visited = getVisitedPoints().recycling.length;
        visitedRecycling.textContent = visited;
    }
    if (visitedShops) {
        const visited = getVisitedPoints().shop.length;
        visitedShops.textContent = visited;
    }
    
    // Простейшая модель: каждый посещённый эко-магазин экономит 1 кг пластика
    if (plasticSaved) {
        const visitedShopCount = getVisitedPoints().shop.length;
        plasticSaved.textContent = (visitedShopCount * 1).toFixed(1);
    }
    
    // Если доступен DataManager — подтягиваем общие эко-баллы
    if (window.dataManager) {
        const ecoPoints = window.dataManager.userData?.ecoPoints || 0;
        if (ecoPointsEl) ecoPointsEl.textContent = ecoPoints;
        if (pointsToNextEl) {
            const levelSize = 100;
            const toNext = levelSize - (ecoPoints % levelSize);
            pointsToNextEl.textContent = toNext;
        }
    }
}

// Инициализация при загрузке страницы
document.addEventListener('DOMContentLoaded', function() {
    initMap();
    initEventListeners();
    loadFavorites();
    updateStats();
});

// Экспорт функций для использования в HTML
window.toggleFavorite = toggleFavorite;
window.getDirections = getDirections;
window.showPointDetails = showPointDetails;
window.toggleVisited = toggleVisited;
window.visitedListIncludes = visitedListIncludes;

