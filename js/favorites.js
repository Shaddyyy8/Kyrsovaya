// favorites.js - Страница избранного (товары и точки карты)

// Данные товаров (импортируем из products.js или определяем здесь)
const PRODUCTS_DATA = [
    { 
        id: 1, 
        title: "Эко-сумка из натурального хлопка", 
        category: "Сумки", 
        price: 350, 
        certificate: "Органик", 
        country: "Россия", 
        img: "images/product/product1.jpg",
        description: "Прочная многоразовая сумка из органического хлопка."
    },
    { 
        id: 2, 
        title: "Бамбуковая зубная щетка", 
        category: "Уход", 
        price: 100, 
        certificate: "Безотходный", 
        country: "Россия", 
        img: "images/product/product2.jpg",
        description: "Экологичная зубная щетка с бамбуковой ручкой."
    },
    { 
        id: 3, 
        title: "Многоразовая эко-бутылка", 
        category: "Кухня", 
        price: 125, 
        certificate: "Безотходный", 
        country: "Китай", 
        img: "images/product/product3.jpg",
        description: "Бутылка из пищевой нержавеющей стали."
    },
    { 
        id: 4, 
        title: "Натуральное эко-мыло", 
        category: "Уход", 
        price: 75, 
        certificate: "Веган", 
        country: "Германия", 
        img: "images/product/product4.jpg",
        description: "Мыло ручной работы из натуральных ингредиентов."
    },
    { 
        id: 5, 
        title: "Многоразовые восковые салфетки", 
        category: "Уход", 
        price: 65, 
        certificate: "Безотходный", 
        country: "Россия", 
        img: "images/product/product5.jpg",
        description: "Экологичная замена пищевой пленке."
    },
    { 
        id: 6, 
        title: "Бамбуковая посуда набор", 
        category: "Кухня", 
        price: 150, 
        certificate: "Безотходный", 
        country: "Китай", 
        img: "images/product/product6.jpg",
        description: "Набор столовых приборов из бамбука."
    },
    { 
        id: 7, 
        title: "Эко-ткани из органического хлопка", 
        category: "Ткани", 
        price: 350, 
        certificate: "Органик", 
        country: "Россия", 
        img: "images/product/product7.jpg",
        description: "Натуральные ткани без химических удобрений."
    },
    { 
        id: 8, 
        title: "Многоразовые эко-пакеты", 
        category: "Кухня", 
        price: 50, 
        certificate: "Безотходный", 
        country: "Германия", 
        img: "images/product/product8.jpg",
        description: "Набор многоразовых сетчатых пакетов."
    }
];

// Данные точек карты (из map.js)
const MAP_POINTS_DATA = [
    {
        id: 1,
        name: 'Пункт приема батареек "ЭкоСервис"',
        category: 'recycling',
        type: 'Батарейки',
        address: 'ул. 25 Октября, 104',
        phone: '+373 (533) 8-45-12',
        hours: 'Пн-Пт: 9:00-18:00, Сб: 10:00-15:00',
        description: 'Принимаем все виды батареек и аккумуляторов. Бесплатный прием.',
        lat: 46.8403,
        lng: 29.6113
    },
    {
        id: 2,
        name: 'Эко-пункт "Зеленая точка"',
        category: 'recycling',
        type: 'Батарейки',
        address: 'ул. Ленина, 45',
        phone: '+373 (533) 7-23-56',
        hours: 'Пн-Вс: 8:00-20:00',
        description: 'Прием батареек, ламп, электроники. Выдача эко-баллов за сдачу.',
        lat: 46.8350,
        lng: 29.6250
    },
    {
        id: 3,
        name: 'Пункт приема "Вторсырье+"',
        category: 'recycling',
        type: 'Батарейки',
        address: 'пр. Мира, 12',
        phone: '+373 (533) 9-12-34',
        hours: 'Пн-Сб: 10:00-19:00',
        description: 'Специализированный пункт приема батареек и аккумуляторов.',
        lat: 46.8450,
        lng: 29.5950
    },
    {
        id: 4,
        name: 'Эко-магазин "Zero Waste"',
        category: 'shop',
        type: 'Магазин без упаковки',
        address: 'ул. Победы, 28',
        phone: '+373 (533) 6-78-90',
        hours: 'Пн-Сб: 9:00-20:00, Вс: 10:00-18:00',
        description: 'Первый магазин без упаковки в Тирасполе. Крупы, орехи, специи на развес.',
        lat: 46.8380,
        lng: 29.6180
    },
    {
        id: 5,
        name: 'Эко-маркет "Натуральный"',
        category: 'shop',
        type: 'Магазин без упаковки',
        address: 'ул. Мира, 67',
        phone: '+373 (533) 5-43-21',
        hours: 'Пн-Вс: 8:00-21:00',
        description: 'Органические продукты, крупы, чай, кофе на развес.',
        lat: 46.8320,
        lng: 29.6080
    },
    {
        id: 6,
        name: 'Магазин "ЭкоПродукт"',
        category: 'shop',
        type: 'Магазин без упаковки',
        address: 'ул. Комсомольская, 15',
        phone: '+373 (533) 4-56-78',
        hours: 'Пн-Сб: 9:00-19:00',
        description: 'Продукты без упаковки, бытовая химия на разлив, эко-товары.',
        lat: 46.8420,
        lng: 29.6200
    },
    {
        id: 7,
        name: 'Пункт приема "ЭкоДом"',
        category: 'recycling',
        type: 'Вторсырье',
        address: 'ул. Шевченко, 89',
        phone: '+373 (533) 3-21-45',
        hours: 'Пн-Пт: 10:00-17:00',
        description: 'Прием макулатуры, пластика, стекла, металла.',
        lat: 46.8300,
        lng: 29.6150
    },
    {
        id: 8,
        name: 'Компостирование "БиоГрунт"',
        category: 'compost',
        type: 'Компост',
        address: 'ул. Садовая, 34',
        phone: '+373 (533) 2-34-56',
        hours: 'Пн-Сб: 8:00-16:00',
        description: 'Прием органических отходов для компостирования.',
        lat: 46.8480,
        lng: 29.6000
    }
];

// Категории точек карты
const CATEGORY_ICONS = {
    recycling: '♻️',
    shop: '🛍️',
    compost: '🌱',
    water: '💧',
    repair: '🔧',
    education: '📚'
};

// DOM элементы
const favoritesList = document.getElementById('favorites-list');
const emptyState = document.getElementById('emptyState');

// Загрузка избранных товаров
function getFavoriteProducts() {
    const favoriteIds = JSON.parse(localStorage.getItem('favorites') || '[]');
    return PRODUCTS_DATA.filter(product => favoriteIds.includes(product.id));
}

// Загрузка избранных точек карты
function getFavoriteMapPoints() {
    const favoriteIds = JSON.parse(localStorage.getItem('mapFavorites') || '[]');
    return MAP_POINTS_DATA.filter(point => favoriteIds.includes(point.id));
}

// Отображение избранного
async function renderFavorites() {
    if (!favoritesList) return;

    const favoriteProducts = getFavoriteProducts();
    const favoritePoints = getFavoriteMapPoints();
    const favoriteArticles = await getFavoriteArticles();

    // Если нет избранного
    if (favoriteProducts.length === 0 && favoritePoints.length === 0 && favoriteArticles.length === 0) {
        if (emptyState) {
            emptyState.hidden = false;
        }
        favoritesList.innerHTML = '';
        return;
    }
    
    if (emptyState) {
        emptyState.hidden = true;
    }
    
    favoritesList.innerHTML = '';
    
    // Отображаем товары
    if (favoriteProducts.length > 0) {
        const productsSection = document.createElement('div');
        productsSection.className = 'favorites-section__group';
        productsSection.innerHTML = `
            <h3 class="favorites-section__group-title">
                <span class="favorites-section__group-icon">🛍️</span>
                Избранные товары (${favoriteProducts.length})
            </h3>
        `;
        
        const productsGrid = document.createElement('div');
        productsGrid.className = 'favorites__grid';
        
        favoriteProducts.forEach(product => {
            const card = createProductCard(product);
            productsGrid.appendChild(card);
        });
        
        productsSection.appendChild(productsGrid);
        favoritesList.appendChild(productsSection);
    }
    
    // Отображаем точки карты
    if (favoritePoints.length > 0) {
        const pointsSection = document.createElement('div');
        pointsSection.className = 'favorites-section__group';
        pointsSection.innerHTML = `
            <h3 class="favorites-section__group-title">
                <span class="favorites-section__group-icon">📍</span>
                Избранные точки на карте (${favoritePoints.length})
            </h3>
        `;
        
        const pointsGrid = document.createElement('div');
        pointsGrid.className = 'favorites__grid';
        
        favoritePoints.forEach(point => {
            const card = createMapPointCard(point);
            pointsGrid.appendChild(card);
        });
        
        pointsSection.appendChild(pointsGrid);
        favoritesList.appendChild(pointsSection);
    }

    // Отображаем статьи
    if (favoriteArticles.length > 0) {
        const articlesSection = document.createElement('div');
        articlesSection.className = 'favorites-section__group';
        articlesSection.innerHTML = `
            <h3 class="favorites-section__group-title">
                <span class="favorites-section__group-icon">📚</span>
                Сохранённые статьи (${favoriteArticles.length})
            </h3>
        `;

        const articlesGrid = document.createElement('div');
        articlesGrid.className = 'favorites__grid';

        favoriteArticles.forEach(article => {
            const card = createArticleCard(article);
            articlesGrid.appendChild(card);
        });

        articlesSection.appendChild(articlesGrid);
        favoritesList.appendChild(articlesSection);
    }
}

// Загрузка сохранённых статей
async function getFavoriteArticles() {
    const favoriteIds = JSON.parse(localStorage.getItem('articleFavorites') || '[]');
    if (!favoriteIds || favoriteIds.length === 0) return [];

    try {
        // Загружаем JSON с учетом того, что HTML-страница лежит в папке html/
        const resp = await fetch('json/articles.json');
        const raw = await resp.json();
        // raw ожидается в формате массива статей с полем id
        const articles = raw.map(a => {
            const rawImage = a.img || a.image;
            const resolvedImage = resolveArticleImagePath(rawImage);

            return {
                id: a.id,
                title: a.title,
                excerpt: a.excerpt || (a.text ? a.text.slice(0, 160) + '...' : ''),
                image: resolvedImage
            };
        });

        return articles.filter(a => favoriteIds.includes(a.id));
    } catch (err) {
        console.error('Не удалось загрузить статьи:', err);
        return [];
    }
}

// Создание карточки статьи
function createArticleCard(article) {
    const card = document.createElement('div');
    card.className = 'product-card';
    card.setAttribute('data-id', article.id);
    card.setAttribute('data-type', 'article');

    card.innerHTML = `
        <div class="product-card__image">
            <img class="product-card__img" src="${article.image}" alt="${article.title}" loading="lazy">
        </div>
        <div class="product-card__content">
            <h3 class="product-card__title">${article.title}</h3>
            <p class="product-card__description">${article.excerpt}</p>
            <div class="product-card__actions">
                <button class="product-card__btn product-card__btn--view" data-id="${article.id}" data-type="article">
                    <span>🔍</span> Подробнее
                </button>
                <button class="product-card__btn product-card__btn--remove" data-id="${article.id}" data-type="article">
                    <span>🗑️</span> Удалить
                </button>
            </div>
        </div>
    `;

    const removeBtn = card.querySelector('.product-card__btn--remove');
    removeBtn.addEventListener('click', () => removeFromFavorites(article.id, 'article'));

    const viewBtn = card.querySelector('.product-card__btn--view');
    viewBtn.addEventListener('click', () => {
        window.location.href = `articles.html?article=${article.id}`;
    });

    return card;
}

// Унифицированное построение пути к изображению статьи,
// чтобы корректно работать из папки html/ и с JSON-путями вида "images/article/...".
function resolveArticleImagePath(rawPath) {
    if (!rawPath) {
        return 'images/article/default.jpg';
    }

    if (/^https?:\/\//.test(rawPath) || rawPath.startsWith('/')) {
        return rawPath;
    }

    return rawPath.replace(/^\/+/, '');
}

// Создание карточки товара
function createProductCard(product) {
    const card = document.createElement('div');
    card.className = 'product-card';
    card.setAttribute('data-id', product.id);
    card.setAttribute('data-type', 'product');
    
    card.innerHTML = `
        <div class="product-card__image">
            <img class="product-card__img" src="${product.img}" alt="${product.title}" loading="lazy">
            <div class="product-card__badges">
                <span class="product-card__badge product-card__badge--category">${product.category}</span>
                <span class="product-card__badge product-card__badge--cert">${product.certificate}</span>
            </div>
        </div>
        <div class="product-card__content">
            <h3 class="product-card__title">${product.title}</h3>
            <p class="product-card__description">${product.description}</p>
            <div class="product-card__country">📍 ${product.country}</div>
            <div class="product-card__price">${product.price} руб. ПМР</div>
            <div class="product-card__actions">
                <button class="product-card__btn product-card__btn--view" data-id="${product.id}" data-type="product">
                    <span>🔍</span> Подробнее
                </button>
                <button class="product-card__btn product-card__btn--remove" data-id="${product.id}" data-type="product">
                    <span>🗑️</span> Удалить
                </button>
            </div>
        </div>
    `;
    
    // Обработчики событий
    const removeBtn = card.querySelector('.product-card__btn--remove');
    removeBtn.addEventListener('click', () => removeFromFavorites(product.id, 'product'));
    
    const viewBtn = card.querySelector('.product-card__btn--view');
    viewBtn.addEventListener('click', () => {
        window.location.href = `products.html#product-${product.id}`;
    });
    
    return card;
}

// Создание карточки точки карты
function createMapPointCard(point) {
    const card = document.createElement('div');
    card.className = 'product-card';
    card.setAttribute('data-id', point.id);
    card.setAttribute('data-type', 'mappoint');
    
    const categoryIcon = CATEGORY_ICONS[point.category] || '📍';
    
    card.innerHTML = `
        <div class="product-card__image">
            <div class="product-card__image-placeholder" style="background: linear-gradient(135deg, var(--primary-color), var(--accent-color)); display: flex; align-items: center; justify-content: center; font-size: 4rem; color: white;">
                ${categoryIcon}
            </div>
            <div class="product-card__badges">
                <span class="product-card__badge product-card__badge--category">${point.type}</span>
            </div>
        </div>
        <div class="product-card__content">
            <h3 class="product-card__title">${point.name}</h3>
            <p class="product-card__description">${point.description}</p>
            <div class="product-card__country">📍 ${point.address}</div>
            <div class="product-card__info">
                <span>🕒 ${point.hours}</span>
                <span>📞 ${point.phone}</span>
            </div>
            <div class="product-card__actions">
                <button class="product-card__btn product-card__btn--view" data-id="${point.id}" data-type="mappoint">
                    <span>🗺️</span> На карте
                </button>
                <button class="product-card__btn product-card__btn--remove" data-id="${point.id}" data-type="mappoint">
                    <span>🗑️</span> Удалить
                </button>
            </div>
        </div>
    `;
    
    // Обработчики событий
    const removeBtn = card.querySelector('.product-card__btn--remove');
    removeBtn.addEventListener('click', () => removeFromFavorites(point.id, 'mappoint'));
    
    const viewBtn = card.querySelector('.product-card__btn--view');
    viewBtn.addEventListener('click', () => {
        window.location.href = `map.html#point-${point.id}`;
    });
    
    return card;
}

// Удаление из избранного
function removeFromFavorites(id, type) {
    if (type === 'product') {
        let favorites = JSON.parse(localStorage.getItem('favorites') || '[]');
        favorites = favorites.filter(favId => favId !== id);
        localStorage.setItem('favorites', JSON.stringify(favorites));
    } else if (type === 'mappoint') {
        let favorites = JSON.parse(localStorage.getItem('mapFavorites') || '[]');
        favorites = favorites.filter(favId => favId !== id);
        localStorage.setItem('mapFavorites', JSON.stringify(favorites));
    } else if (type === 'article') {
        let favorites = JSON.parse(localStorage.getItem('articleFavorites') || '[]');
        favorites = favorites.filter(favId => favId !== id);
        localStorage.setItem('articleFavorites', JSON.stringify(favorites));
    }
    
    // Перерисовываем избранное
    renderFavorites();
    
    // Показываем уведомление
    showNotification('Удалено из избранного');
}

// Показ уведомления
function showNotification(message) {
    const notification = document.createElement('div');
    notification.className = 'notification notification--success';
    notification.innerHTML = `
        <span class="notification__icon">✅</span>
        <span class="notification__text">${message}</span>
    `;
    
    document.body.appendChild(notification);
    
    setTimeout(() => {
        notification.style.opacity = '0';
        notification.style.transform = 'translateX(100%)';
        setTimeout(() => notification.remove(), 300);
    }, 2000);
}

// Инициализация при загрузке страницы
document.addEventListener('DOMContentLoaded', function() {
    renderFavorites();
    
    // Обновление при изменении данных в других вкладках
    window.addEventListener('storage', function(e) {
        if (e.key === 'favorites' || e.key === 'mapFavorites' || e.key === 'articleFavorites') {
            renderFavorites();
        }
    });
});
