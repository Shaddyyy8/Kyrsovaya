// products.js - Логика страницы эко-товаров

// База данных товаров
const PRODUCTS = [
    { 
        id: 1, 
        title: "Эко-сумка из натурального хлопка", 
        category: "Сумки", 
        price: 350, 
        certificate: "Органик", 
        country: "Россия", 
        img: "images/product/product1.jpg",
        description: "Прочная многоразовая сумка из органического хлопка. Заменяет сотни пластиковых пакетов."
    },
    { 
        id: 2, 
        title: "Бамбуковая зубная щетка", 
        category: "Уход", 
        price: 100, 
        certificate: "Безотходный", 
        country: "Россия", 
        img: "images/product/product2.jpg",
        description: "Экологичная зубная щетка с бамбуковой ручкой. Полностью биоразлагаемая."
    },
    { 
        id: 3, 
        title: "Многоразовая эко-бутылка", 
        category: "Кухня", 
        price: 125, 
        certificate: "Безотходный", 
        country: "Китай", 
        img: "images/product/product3.jpg",
        description: "Бутылка из пищевой нержавеющей стали. Сохраняет температуру напитков до 12 часов."
    },
    { 
        id: 4, 
        title: "Натуральное эко-мыло", 
        category: "Уход", 
        price: 75, 
        certificate: "Веган", 
        country: "Германия", 
        img: "images/product/product4.jpg",
        description: "Мыло ручной работы из натуральных ингредиентов. Без парабенов и сульфатов."
    },
    { 
        id: 5, 
        title: "Многоразовые восковые салфетки", 
        category: "Уход", 
        price: 65, 
        certificate: "Безотходный", 
        country: "Россия", 
        img: "images/product/product5.jpg",
        description: "Экологичная замена пищевой пленке. Многоразовые и биоразлагаемые."
    },
    { 
        id: 6, 
        title: "Бамбуковая посуда набор", 
        category: "Кухня", 
        price: 150, 
        certificate: "Безотходный", 
        country: "Китай", 
        img: "images/product/product6.jpg",
        description: "Набор столовых приборов из бамбука для пикников и путешествий."
    },
    { 
        id: 7, 
        title: "Эко-ткани из органического хлопка", 
        category: "Ткани", 
        price: 350, 
        certificate: "Органик", 
        country: "Россия", 
        img: "images/product/product7.jpg",
        description: "Натуральные ткани, произведенные без использования химических удобрений."
    },
    { 
        id: 8, 
        title: "Многоразовые эко-пакеты", 
        category: "Кухня", 
        price: 50, 
        certificate: "Безотходный", 
        country: "Германия", 
        img: "images/product/product8.jpg",
        description: "Набор многоразовых сетчатых пакетов для фруктов и овощей."
    }
];



// DOM элементы
const productsContainer = document.getElementById('productsContainer');
const filterCategory = document.getElementById('filterCategory');
const filterCertificate = document.getElementById('filterCertificate');
const filterCountry = document.getElementById('filterCountry');
const filterPrice = document.getElementById('filterPrice');
const resetFiltersBtn = document.getElementById('resetFilters');
const productsCount = document.getElementById('productsCount');
const emptyState = document.getElementById('emptyState');
const resetEmptyFilters = document.getElementById('resetEmptyFilters');

// Модальное окно элементы
const modal = document.getElementById('productModal');
const modalImg = document.getElementById('modalImg');
const modalTitle = document.getElementById('modalTitle');
const modalCategory = document.getElementById('modalCategory');
const modalPrice = document.getElementById('modalPrice');
const modalCert = document.getElementById('modalCert');
const modalCountry = document.getElementById('modalCountry');
const modalClose = document.getElementById('modalClose');
const modalFavBtn = document.getElementById('modalFavBtn');
const reviewsList = document.getElementById('reviewsList');
const reviewInput = document.getElementById('reviewInput');
const reviewRating = document.getElementById('reviewRating');
const addReviewBtn = document.getElementById('addReviewBtn');
const modalShareBtn = document.getElementById('modalShareBtn');

// Вспомогательные функции для работы с localStorage
function getFavoritesIds() { 
    return JSON.parse(localStorage.getItem('favorites')) || []; 
}

function saveFavoritesIds(arr) { 
    localStorage.setItem('favorites', JSON.stringify(arr)); 
}

function getReviews(id) { 
    return JSON.parse(localStorage.getItem(`reviews_${id}`)) || []; 
}

function saveReviews(id, arr) { 
    localStorage.setItem(`reviews_${id}`, JSON.stringify(arr)); 
}

// Создание карточки товара
function createProductCard(product) {
    const favorites = getFavoritesIds();
    const isFavorite = favorites.includes(product.id);
    
    const card = document.createElement('article');
    card.className = 'product-card';
    card.setAttribute('data-id', product.id);
    
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
            <div class="product-card__country">${product.country}</div>
            <div class="product-card__price">${product.price}</div>
            <div class="product-card__actions">
                <button class="product-card__btn product-card__btn--details" data-id="${product.id}">
                    <span class="product-card__btn-icon">🔍</span>
                    Подробнее
                </button>
                <button class="product-card__btn product-card__btn--fav ${isFavorite ? 'product-card__btn--fav--active' : ''}" data-id="${product.id}" title="${isFavorite ? 'В избранном' : 'В избранное'}">
                    <span class="product-card__btn-icon">${isFavorite ? '❤️' : '🤍'}</span>
                    <span class="product-card__btn-text">${isFavorite ? 'В избранном' : 'В избранное'}</span>
                </button>
            </div>
        </div>
    `;
    
    return card;
}

// Отображение товаров
function renderProducts(products) {
    if (!productsContainer) return;
    productsContainer.innerHTML = '';
    
    if (products.length === 0) {
        emptyState.hidden = false;
        productsCount.textContent = '0';
        return;
    }
    
    emptyState.hidden = true;
    productsCount.textContent = products.length;
    
    const fragment = document.createDocumentFragment();
    products.forEach(product => {
        fragment.appendChild(createProductCard(product));
    });
    
    productsContainer.appendChild(fragment);
    attachProductHandlers();
}

// Привязка обработчиков событий к карточкам
function attachProductHandlers() {
    // Кнопки "Подробнее"
    productsContainer.querySelectorAll('.product-card__btn--details').forEach(btn => {
        btn.addEventListener('click', (e) => {
            e.stopPropagation();
            const productId = parseInt(btn.dataset.id);
            const product = PRODUCTS.find(p => p.id === productId);
            if (product) {
                openProductModal(product);
            }
        });
    });
    
    // Кнопки "В избранное"
    productsContainer.querySelectorAll('.product-card__btn--fav').forEach(btn => {
        btn.addEventListener('click', (e) => {
            e.stopPropagation();
            const productId = parseInt(btn.dataset.id);
            toggleFavorite(productId, btn);
        });
    });
    
    // Клик по карточке товара
    productsContainer.querySelectorAll('.product-card').forEach(card => {
        card.addEventListener('click', (e) => {
            if (!e.target.closest('.product-card__btn')) {
                const productId = parseInt(card.dataset.id);
                const product = PRODUCTS.find(p => p.id === productId);
                if (product) {
                    openProductModal(product);
                }
            }
        });
    });
}

// Переключение избранного
function toggleFavorite(productId, button) {
    let favorites = getFavoritesIds();
    const isFavorite = favorites.includes(productId);
    
    if (isFavorite) {
        favorites = favorites.filter(id => id !== productId);
        if (button) {
            button.innerHTML = '<span class="product-card__btn-icon">🤍</span><span class="product-card__btn-text"> В избранное</span>';
            button.classList.remove('product-card__btn--fav--active');
        }
        if (modalFavBtn.dataset.id == productId) {
            modalFavBtn.innerHTML = '<span class="product-modal__action-icon">🤍</span><span class="product-modal__action-text">Добавить в избранное</span>';
        }
    } else {
        favorites.push(productId);
        if (button) {
            button.innerHTML = '<span class="product-card__btn-icon">❤️</span><span class="product-card__btn-text"> В избранном</span>';
            button.classList.add('product-card__btn--fav--active');
        }
        if (modalFavBtn.dataset.id == productId) {
            modalFavBtn.innerHTML = '<span class="product-modal__action-icon">❤️</span><span class="product-modal__action-text">В избранном</span>';
        }
    }
    
    saveFavoritesIds(favorites);
    
    // Показать уведомление
    showNotification(isFavorite ? 'Товар удален из избранного' : 'Товар добавлен в избранное');
}

// Открытие модального окна товара
function openProductModal(product) {
    // Заполнение информации о товаре
    modalImg.src = product.img;
    modalImg.alt = product.title;
    modalTitle.textContent = product.title;
    modalCategory.textContent = product.category;
    modalCert.textContent = product.certificate;
    modalCountry.textContent = product.country;
    modalPrice.textContent = product.price;
    
    // Установка ID товара для кнопки избранного
    modalFavBtn.dataset.id = product.id;
    
    // Проверка, находится ли товар в избранном
    const favorites = getFavoritesIds();
    const isFavorite = favorites.includes(product.id);
    modalFavBtn.innerHTML = isFavorite 
        ? '<span class="product-modal__action-icon">❤️</span><span class="product-modal__action-text">В избранном</span>'
        : '<span class="product-modal__action-icon">🤍</span><span class="product-modal__action-text">Добавить в избранное</span>';
    
    // Загрузка отзывов
    loadReviews(product.id);
    
    // Сброс формы отзыва
    reviewInput.value = '';
    reviewRating.value = '5';
    
    // Показать модальное окно
    modal.setAttribute('aria-hidden', 'false');
    document.body.style.overflow = 'hidden';
}

// Загрузка отзывов
function loadReviews(productId) {
    const reviews = getReviews(productId);
    reviewsList.innerHTML = '';
    
    if (reviews.length === 0) {
        reviewsList.innerHTML = '<p class="modal__review-empty">Пока нет отзывов. Будьте первым!</p>';
        return;
    }
    
    reviews.forEach(review => {
        const reviewElement = document.createElement('div');
        reviewElement.className = 'modal__review-item';
        reviewElement.innerHTML = `
            <div class="modal__review-rating">${'⭐'.repeat(review.rating)}</div>
            <p class="modal__review-text">${review.text}</p>
        `;
        reviewsList.appendChild(reviewElement);
    });
}

// Добавление отзыва
function addReview() {
    const productId = parseInt(modalFavBtn.dataset.id);
    const text = reviewInput.value.trim();
    const rating = parseInt(reviewRating.value);
    
    if (!text) {
        showNotification('Пожалуйста, напишите отзыв', 'error');
        return;
    }
    
    if (rating < 1 || rating > 5) {
        showNotification('Пожалуйста, выберите оценку', 'error');
        return;
    }
    
    const reviews = getReviews(productId);
    reviews.push({ text, rating, date: new Date().toISOString() });
    saveReviews(productId, reviews);
    
    // Обновить список отзывов
    loadReviews(productId);
    
    // Очистить форму
    reviewInput.value = '';
    reviewRating.value = '5';
    
    showNotification('Отзыв успешно добавлен!');
}

// Фильтрация товаров
function getFilteredProducts() {
    let filtered = [...PRODUCTS];
    
    const category = filterCategory.value;
    const certificate = filterCertificate.value;
    const country = filterCountry.value;
    const priceRange = filterPrice.value;
    
    if (category) {
        filtered = filtered.filter(product => product.category === category);
    }
    
    if (certificate) {
        filtered = filtered.filter(product => product.certificate === certificate);
    }
    
    if (country) {
        filtered = filtered.filter(product => product.country === country);
    }
    
    if (priceRange) {
        const [min, max] = priceRange.split('-').map(Number);
        filtered = filtered.filter(product => product.price >= min && product.price <= max);
    }
    
    return filtered;
}

// Сброс фильтров
function resetFilters() {
    filterCategory.value = '';
    filterCertificate.value = '';
    filterCountry.value = '';
    filterPrice.value = '';
    renderProducts(PRODUCTS);
    showNotification('Фильтры сброшены');
}

// Показать уведомление
function showNotification(message, type = 'success') {
    // Создание элемента уведомления
    const notification = document.createElement('div');
    notification.className = `notification notification--${type}`;
    notification.textContent = message;
    notification.style.cssText = `
        position: fixed;
        top: 20px;
        right: 20px;
        padding: 1rem 1.5rem;
        background: ${type === 'success' ? 'var(--primary-color)' : '#dc3545'};
        color: white;
        border-radius: var(--border-radius-sm);
        box-shadow: var(--shadow-medium);
        z-index: 3000;
        animation: slideIn 0.3s ease-out;
    `;
    
    document.body.appendChild(notification);
    
    // Удаление уведомления через 3 секунды
    setTimeout(() => {
        notification.style.animation = 'slideOut 0.3s ease-out';
        setTimeout(() => {
            if (notification.parentNode) {
                notification.parentNode.removeChild(notification);
            }
        }, 300);
    }, 3000);
}

// Добавление стилей для анимации уведомлений (защищённо, чтобы избежать дублирования глобальных переменных)
(function(){
    if (document.querySelector('style[data-notifications-products]')) return;
    const ns = document.createElement('style');
    ns.setAttribute('data-notifications-products', 'true');
    ns.textContent = `
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
    document.head.appendChild(ns);
})();

// Инициализация
function init() {
    // Первоначальная отрисовка товаров (только если есть контейнер на странице)
    if (productsContainer) renderProducts(PRODUCTS);

    // Привязка обработчиков событий для фильтров (только если элементы существуют)
    [filterCategory, filterCertificate, filterCountry, filterPrice].forEach(filter => {
        if (filter) {
            filter.addEventListener('change', () => {
                renderProducts(getFilteredProducts());
            });
        }
    });

    // Кнопка сброса фильтров
    if (resetFiltersBtn) resetFiltersBtn.addEventListener('click', resetFilters);
    if (resetEmptyFilters) resetEmptyFilters.addEventListener('click', resetFilters);

    // Закрытие модального окна (если есть)
    if (modalClose && modal) {
        modalClose.addEventListener('click', () => {
            modal.setAttribute('aria-hidden', 'true');
            document.body.style.overflow = '';
        });

        modal.addEventListener('click', (e) => {
            if (e.target === modal) {
                modal.setAttribute('aria-hidden', 'true');
                document.body.style.overflow = '';
            }
        });
    }

    // Закрытие модального окна по Escape
    if (modal) {
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape' && modal.getAttribute('aria-hidden') === 'false') {
                modal.setAttribute('aria-hidden', 'true');
                document.body.style.overflow = '';
            }
        });
    }

    // Добавление товара в избранное из модального окна
    if (modalFavBtn) {
        modalFavBtn.addEventListener('click', () => {
            const productId = parseInt(modalFavBtn.dataset.id);
            toggleFavorite(productId, null);
            
            // Обновить все кнопки избранного на странице
            const favButtons = document.querySelectorAll(`.product-card__btn--fav[data-id="${productId}"]`);
            favButtons.forEach(btn => {
                const favorites = getFavoritesIds();
                const isFavorite = favorites.includes(productId);
                btn.innerHTML = isFavorite 
                    ? '<span class="product-card__btn-icon">❤️</span><span class="product-card__btn-text"> В избранном</span>'
                    : '<span class="product-card__btn-icon">🤍</span><span class="product-card__btn-text"> В избранное</span>';
                btn.classList.toggle('product-card__btn--fav--active', isFavorite);
            });
        });
    }

    // Добавление отзыва
    if (addReviewBtn) addReviewBtn.addEventListener('click', addReview);

    // Кнопка поделиться
    if (modalShareBtn) {
        modalShareBtn.addEventListener('click', () => {
            if (navigator.share) {
                navigator.share({
                    title: modalTitle?.textContent || '',
                    text: 'Посмотрите этот экологичный товар!',
                    url: window.location.href,
                });
            } else {
                navigator.clipboard.writeText(window.location.href).then(() => {
                    showNotification('Ссылка скопирована в буфер обмена!');
                });
            }
        });
    }
}

// Экспортируем PRODUCTS для использования в других модулях
window.PRODUCTS = PRODUCTS;

// Запуск при загрузке страницы
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
} else {
    init();
}