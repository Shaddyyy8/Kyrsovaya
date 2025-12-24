// articles.js - Логика для страницы эко-статей

// ========== ГЛОБАЛЬНЫЕ ПЕРЕМЕННЫЕ ==========
let allArticles = []; // Все статьи
let filteredArticles = []; // Отфильтрованные статьи
let favorites = JSON.parse(localStorage.getItem('articleFavorites')) || []; // Избранные статьи

// ========== DOM ЭЛЕМЕНТЫ ==========
const articlesContainer = document.getElementById('articlesContainer');
const emptyState = document.getElementById('emptyState');
const articlesCount = document.getElementById('articlesCount');

// Фильтры
const filterCategory = document.getElementById('filterCategory');
const filterDate = document.getElementById('filterDate');
const resetFiltersBtn = document.getElementById('resetFilters');
const resetEmptyFiltersBtn = document.getElementById('resetEmptyFilters');

// Поиск
const searchInput = document.getElementById('searchInput');
const searchButton = document.getElementById('searchButton');

// Модальное окно
const articleModal = document.getElementById('articleModal');
const modalClose = document.getElementById('modalClose');
const modalImg = document.getElementById('modalImg');
const modalCategory = document.getElementById('modalCategory');
const modalDate = document.getElementById('modalDate');
const modalTitle = document.getElementById('modalTitle');
const modalText = document.getElementById('modalText');
const modalSaveBtn = document.getElementById('modalSaveBtn');

// Кнопки поделиться
const shareVk = document.getElementById('shareVk');
const shareTelegram = document.getElementById('shareTelegram');
const shareWhatsApp = document.getElementById('shareWhatsApp');

// Текущая открытая статья
let currentArticleId = null;

// ========== ФУНКЦИИ ==========

/**
 * Инициализация приложения
 */
async function init() {
    await loadArticles();
    renderArticles();
    setupEventListeners();
}

/**
 * Загрузка статей из JSON файла
 */
async function loadArticles() {
    try {
        // Загружаем JSON-файл
        const response = await fetch('json/articles.json');
        if (!response.ok) throw new Error('Не удалось загрузить статьи');
        
        const rawData = await response.json();
        
        // Нормализуем данные - добавляем отсутствующие поля
        allArticles = rawData.map(article => {
            const rawImage = article.img || article.image;
            const resolvedImage = resolveArticleImagePath(rawImage);

            const fullText = article.text || article.content || '';

            return {
                id: article.id,
                title: article.title,
                category: article.category,
                image: resolvedImage,
                content: fullText,
                excerpt: fullText.substring(0, 150) + '...',
                date: article.date,
                // Добавляем время чтения
                readTime: calculateReadTime(fullText),
                share: article.share || { vk: true, telegram: true, whatsapp: true }
            };
        });
        
        filteredArticles = [...allArticles]; // ИСПРАВЛЕНО: было [allArticles]
        
        // Обновляем счетчик
        updateArticlesCount();
        
    } catch (error) {
        console.error('Ошибка загрузки статей:', error);
        showErrorMessage('Не удалось загрузить статьи. Пожалуйста, попробуйте позже.');
    }
}

/**
 * Корректное построение пути к изображению статьи
 * JSON хранит пути вроде "images/article/article1.jpg",
 * а HTML-страницы находятся в папке html/, поэтому
 * добавляем ../ при необходимости.
 */
function resolveArticleImagePath(rawPath) {
    if (!rawPath) {
        return 'images/article/default.jpg';
    }

    if (/^https?:\/\//.test(rawPath) || rawPath.startsWith('/')) {
        return rawPath;
    }

    return rawPath.replace(/^\/+/, '');
}

/**
 * Отображение статей в сетке
 */
function renderArticles() {
    if (filteredArticles.length === 0) {
        articlesContainer.innerHTML = '';
        emptyState.hidden = false;
        return;
    }
    
    emptyState.hidden = true;
    
    const articlesHTML = filteredArticles.map(article => {
        return `
            <article class="article-card" data-id="${article.id}">
                <div class="article-card__image">
                    <img src="${article.image}" 
                         alt="${article.title}" 
                         class="article-card__img" 
                         loading="lazy">
                    <div class="article-card__badges">
                        <span class="article-card__badge article-card__badge--category">
                            ${article.category}
                        </span>
                        <span class="article-card__badge article-card__badge--date">
                            ${formatDate(article.date)}
                        </span>
                    </div>
                </div>
                
                <div class="article-card__content">
                    <h3 class="article-card__title">${article.title}</h3>
                    <p class="article-card__excerpt">${article.excerpt}</p>
                    
                    <div class="article-card__meta">
                        <span class="article-card__read-time">
                            ${article.readTime} мин чтения
                        </span>
                        <div class="article-card__actions">
                            <button class="article-card__btn article-card__btn--read" 
                                    data-action="read"
                                    aria-label="Читать статью: ${article.title}">
                                📖 Читать
                            </button>
                            <button class="article-card__btn article-card__btn--share"
                                    data-action="share"
                                    aria-label="Поделиться статьей: ${article.title}">
                                📤 Поделиться
                            </button>
                        </div>
                    </div>
                </div>
            </article>
        `;
    }).join('');
    
    articlesContainer.innerHTML = articlesHTML;
    
    // Добавляем обработчики для кнопок в карточках
    setupCardEventListeners();
}

/**
 * Настройка обработчиков событий для карточек
 */
function setupCardEventListeners() {
    // Читать статью
    articlesContainer.querySelectorAll('[data-action="read"]').forEach(btn => {
        btn.addEventListener('click', function(e) {
            e.stopPropagation();
            const card = this.closest('.article-card');
            const articleId = parseInt(card.dataset.id);
            openArticleModal(articleId);
        });
    });
    
    // Поделиться статьей
    articlesContainer.querySelectorAll('[data-action="share"]').forEach(btn => {
        btn.addEventListener('click', function(e) {
            e.stopPropagation();
            const card = this.closest('.article-card');
            const articleId = parseInt(card.dataset.id);
            const article = allArticles.find(a => a.id === articleId);
            shareArticle(article);
        });
    });
    
    // Открытие по клику на карточку
    articlesContainer.querySelectorAll('.article-card').forEach(card => {
        card.addEventListener('click', function(e) {
            if (!e.target.closest('button')) {
                const articleId = parseInt(this.dataset.id);
                openArticleModal(articleId);
            }
        });
    });
}

/**
 * Открытие модального окна со статьей
 */
function openArticleModal(articleId) {
    const article = allArticles.find(a => a.id === articleId);
    if (!article) return;
    
    currentArticleId = articleId;
    
    // Заполняем модальное окно
    modalImg.src = article.image;
    modalImg.alt = article.title;
    modalCategory.textContent = article.category;
    modalDate.textContent = formatDate(article.date);
    modalTitle.textContent = article.title;
    modalText.innerHTML = formatArticleContent(article.content);
    
    // Настройка кнопки сохранения
    const isFavorite = favorites.includes(articleId);
    modalSaveBtn.innerHTML = isFavorite 
        ? '<span class="modal__save-btn-icon">💚</span><span class="modal__save-btn-text">Убрать из сохраненных</span>'
        : '<span class="modal__save-btn-icon">💾</span><span class="modal__save-btn-text">Сохранить статью</span>';
    
    // Настройка кнопок поделиться
    setupShareButtons(article);
    
    // Показываем модальное окно
    articleModal.setAttribute('aria-hidden', 'false');
    document.body.style.overflow = 'hidden';
}

/**
 * Форматирование содержимого статьи
 */
function formatArticleContent(content) {
    if (!content) return '<p>Содержание статьи отсутствует</p>';
    
    // Разбиваем текст на абзацы по точкам
    const paragraphs = content.split('. ').filter(p => p.trim().length > 0);
    
    if (paragraphs.length > 0) {
        return paragraphs.map(paragraph => {
            // Добавляем точку в конце, если ее нет
            const text = paragraph.endsWith('.') ? paragraph : paragraph + '.';
            return `<p>${text}</p>`;
        }).join('');
    }
    
    return `<p>${content}</p>`;
}

/**
 * Настройка кнопок поделиться
 */
function setupShareButtons(article) {
    const pageUrl = encodeURIComponent(window.location.href);
    const title = encodeURIComponent(article.title);
    const description = encodeURIComponent(article.excerpt);
    
    // ВКонтакте
    shareVk.onclick = () => {
        const url = `https://vk.com/share.php?url=${pageUrl}&title=${title}&description=${description}`;
        openShareWindow(url, 650, 350);
    };
    
    // Telegram
    shareTelegram.onclick = () => {
        const url = `https://t.me/share/url?url=${pageUrl}&text=${title}`;
        openShareWindow(url, 600, 400);
    };
    
    // WhatsApp
    shareWhatsApp.onclick = () => {
        const url = `https://wa.me/?text=${title}%20${pageUrl}`;
        openShareWindow(url, 600, 400);
    };
}

/**
 * Открытие окна для шаринга
 */
function openShareWindow(url, width, height) {
    const left = (screen.width - width) / 2;
    const top = (screen.height - height) / 2;
    
    window.open(url, 'share', `
        width=${width},
        height=${height},
        left=${left},
        top=${top},
        toolbar=no,
        menubar=no,
        scrollbars=no,
        resizable=no,
        location=no,
        status=no
    `);
}

/**
 * Поделиться статьей
 */
function shareArticle(article) {
    if (navigator.share) {
        // Используем Web Share API
        navigator.share({
            title: article.title,
            text: article.excerpt,
            url: window.location.href,
        })
        .catch(error => console.log('Ошибка шаринга:', error));
    } else {
        // Fallback: копирование ссылки
        const shareUrl = `${window.location.origin}/articles.html?article=${article.id}`;
        navigator.clipboard.writeText(shareUrl)
            .then(() => {
                showNotification('Ссылка на статью скопирована!');
            })
            .catch(() => {
                alert(`Поделитесь статьей: ${article.title}\n${shareUrl}`);
            });
    }
}

/**
 * Сохранение статьи в избранное
 */
function toggleSaveArticle() {
    if (!currentArticleId) return;
    
    const index = favorites.indexOf(currentArticleId);
    
    if (index === -1) {
        // Добавляем в избранное
        favorites.push(currentArticleId);
        showNotification('Статья добавлена в избранное!');
    } else {
        // Убираем из избранного
        favorites.splice(index, 1);
        showNotification('Статья убрана из избранного');
    }
    
    // Сохраняем в localStorage
    localStorage.setItem('articleFavorites', JSON.stringify(favorites));
    
    // Обновляем кнопку в модалке
    const isFavorite = favorites.includes(currentArticleId);
    modalSaveBtn.innerHTML = isFavorite 
        ? '<span class="modal__save-btn-icon">💚</span><span class="modal__save-btn-text">Убрать из сохраненных</span>'
        : '<span class="modal__save-btn-icon">💾</span><span class="modal__save-btn-text">Сохранить статью</span>';
    
    // Обновляем отображение статей
    renderArticles();
}

/**
 * Фильтрация статей
 */
function filterArticles() {
    const category = filterCategory.value;
    const dateFilter = filterDate.value;
    const searchTerm = searchInput.value.toLowerCase().trim();
    
    filteredArticles = allArticles.filter(article => {
        // Фильтр по категории
        if (category && article.category !== category) return false;
        
        // Фильтр по дате
        if (dateFilter) {
            const articleDate = new Date(article.date);
            const now = new Date();
            let daysDiff;
            
            switch(dateFilter) {
                case 'week':
                    daysDiff = 7;
                    break;
                case 'month':
                    daysDiff = 30;
                    break;
                case 'quarter':
                    daysDiff = 90;
                    break;
                default:
                    daysDiff = 0;
            }
            
            if (daysDiff > 0) {
                const timeDiff = now - articleDate;
                const daysAgo = timeDiff / (1000 * 3600 * 24);
                if (daysAgo > daysDiff) return false;
            }
        }
        
        // Поиск по тексту
        if (searchTerm) {
            const searchInTitle = article.title.toLowerCase().includes(searchTerm);
            const searchInExcerpt = article.excerpt.toLowerCase().includes(searchTerm);
            const searchInContent = article.content.toLowerCase().includes(searchTerm);
            if (!(searchInTitle || searchInExcerpt || searchInContent)) return false;
        }
        
        return true;
    });
    
    updateArticlesCount();
    renderArticles();
}

/**
 * Сброс фильтров
 */
function resetFilters() {
    filterCategory.value = '';
    filterDate.value = '';
    searchInput.value = '';
    filteredArticles = [...allArticles];
    updateArticlesCount();
    renderArticles();
}

/**
 * Обновление счетчика статей
 */
function updateArticlesCount() {
    articlesCount.textContent = filteredArticles.length;
}

/**
 * Форматирование даты
 */
function formatDate(dateString) {
    try {
        const date = new Date(dateString);
        return date.toLocaleDateString('ru-RU', {
            day: 'numeric',
            month: 'long',
            year: 'numeric'
        });
    } catch (error) {
        return 'Дата не указана';
    }
}

/**
 * Вычисление времени чтения
 */
function calculateReadTime(text) {
    if (!text || text.trim() === '') return 3;
    const wordsPerMinute = 200;
    const wordCount = text.trim().split(/\s+/).length;
    return Math.max(1, Math.ceil(wordCount / wordsPerMinute));
}

/**
 * Показать уведомление
 */
function showNotification(message) {
    // Создаем элемент уведомления
    const notification = document.createElement('div');
    notification.className = 'notification';
    notification.textContent = message;
    notification.style.cssText = `
        position: fixed;
        top: 20px;
        right: 20px;
        background: #2E8B57;
        color: white;
        padding: 1rem 1.5rem;
        border-radius: 8px;
        z-index: 10000;
        animation: slideIn 0.3s ease-out;
    `;
    
    // Добавляем стили для анимации
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
    
    document.body.appendChild(notification);
    
    // Удаляем уведомление через 3 секунды
    setTimeout(() => {
        notification.style.animation = 'slideOut 0.3s ease-out';
        setTimeout(() => {
            if (notification.parentNode) {
                document.body.removeChild(notification);
            }
            if (style.parentNode) {
                document.head.removeChild(style);
            }
        }, 300);
    }, 3000);
}

/**
 * Показать сообщение об ошибке
 */
function showErrorMessage(message) {
    const errorDiv = document.createElement('div');
    errorDiv.className = 'error-message';
    errorDiv.innerHTML = `
        <div style="
            background: #fee;
            border: 2px solid #f66;
            border-radius: 8px;
            padding: 1rem;
            margin: 1rem 0;
            text-align: center;
            color: #c00;
        ">
            <strong>Ошибка:</strong> ${message}
        </div>
    `;
    
    const container = document.querySelector('.container');
    if (container) {
        container.prepend(errorDiv);
    }
}

/**
 * Настройка всех обработчиков событий
 */
function setupEventListeners() {
    // Фильтры
    if (filterCategory) filterCategory.addEventListener('change', filterArticles);
    if (filterDate) filterDate.addEventListener('change', filterArticles);
    
    // Поиск
    if (searchInput) searchInput.addEventListener('input', debounce(filterArticles, 300));
    if (searchButton) searchButton.addEventListener('click', filterArticles);
    if (searchInput) searchInput.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') filterArticles();
    });
    
    // Сброс фильтров
    if (resetFiltersBtn) resetFiltersBtn.addEventListener('click', resetFilters);
    if (resetEmptyFiltersBtn) resetEmptyFiltersBtn.addEventListener('click', resetFilters);
    
    // Модальное окно
    if (modalClose) modalClose.addEventListener('click', closeModal);
    if (articleModal) articleModal.addEventListener('click', (e) => {
        if (e.target === articleModal) closeModal();
    });
    
    // Кнопка сохранения
    if (modalSaveBtn) modalSaveBtn.addEventListener('click', toggleSaveArticle);
    
    // Закрытие по ESC
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape' && articleModal && articleModal.getAttribute('aria-hidden') === 'false') {
            closeModal();
        }
    });
}

/**
 * Закрытие модального окна
 */
function closeModal() {
    if (articleModal) {
        articleModal.setAttribute('aria-hidden', 'true');
    }
    document.body.style.overflow = 'auto';
    currentArticleId = null;
}

/**
 * Дебаунс для поиска
 */
function debounce(func, wait) {
    let timeout;
    return function executedFunction(...args) {
        const later = () => {
            clearTimeout(timeout);
            func(...args);
        };
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
    };
}

// ========== ЗАПУСК ПРИЛОЖЕНИЯ ==========
document.addEventListener('DOMContentLoaded', init);

