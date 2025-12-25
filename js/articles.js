// articles.js - Логика для страницы эко-статей

// ========== ГЛОБАЛЬНЫЕ ПЕРЕМЕННЫЕ ==========
let allArticles = []; // Все статьи
let filteredArticles = []; // Отфильтрованные статьи
let favorites = JSON.parse(localStorage.getItem('articleFavorites')) || []; // Избранные статьи
let currentArticleId = null; // Текущая открытая статья

// ========== DOM ЭЛЕМЕНТЫ ==========
// Инициализируются в init()
let articlesContainer;
let emptyState;
let articlesCount;

// Фильтры
let filterCategory;
let filterDate;
let resetFiltersBtn;
let resetEmptyFiltersBtn;

// Поиск
let searchInput;
let searchButton;

// Модальное окно
let articleModal;
let modalClose;
let modalImg;
let modalCategory;
let modalDate;
let modalTitle;
let modalText;
let modalSaveBtn;

// Кнопки поделиться
let shareVk;
let shareTelegram;
let shareWhatsApp;

// ========== ФУНКЦИИ ==========

/**
 * Инициализация приложения
 */
async function init() {
    // Инициализация DOM элементов
    articlesContainer = document.getElementById('articlesContainer');
    emptyState = document.getElementById('emptyState');
    articlesCount = document.getElementById('articlesCount');

    filterCategory = document.getElementById('filterCategory');
    filterDate = document.getElementById('filterDate');
    resetFiltersBtn = document.getElementById('resetFilters');
    resetEmptyFiltersBtn = document.getElementById('resetEmptyFilters');

    searchInput = document.getElementById('searchInput');
    searchButton = document.getElementById('searchButton');

    articleModal = document.getElementById('articleModal');
    modalClose = document.getElementById('modalClose');
    modalImg = document.getElementById('modalImg');
    modalCategory = document.getElementById('modalCategory');
    modalDate = document.getElementById('modalDate');
    modalTitle = document.getElementById('modalTitle');
    modalText = document.getElementById('modalText');
    modalSaveBtn = document.getElementById('modalSaveBtn');

    shareVk = document.getElementById('shareVk');
    shareTelegram = document.getElementById('shareTelegram');
    shareWhatsApp = document.getElementById('shareWhatsApp');

    // Настройка слушателей событий (до загрузки данных)
    setupEventListeners();

    // Загрузка и рендер
    await loadArticles();
    renderArticles();
}

/**
 * Загрузка статей из JSON файла
 */
async function loadArticles() {
    try {
        const response = await fetch('json/articles.json');
        if (!response.ok) throw new Error('Не удалось загрузить статьи');
        
        const rawData = await response.json();
        
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
                readTime: calculateReadTime(fullText),
                share: article.share || { vk: true, telegram: true, whatsapp: true }
            };
        });
        
        filteredArticles = [...allArticles];
        updateArticlesCount();
        
    } catch (error) {
        console.error('Ошибка загрузки статей:', error);
        showErrorMessage('Не удалось загрузить статьи. Пожалуйста, попробуйте позже.');
    }
}

/**
 * Корректное построение пути к изображению статьи
 */
function resolveArticleImagePath(rawPath) {
    if (!rawPath) return 'images/article/default.jpg';
    if (/^https?:\/\//.test(rawPath) || rawPath.startsWith('/')) return rawPath;
    return rawPath.replace(/^\/+/, '');
}

/**
 * Отображение статей в сетке
 */
function renderArticles() {
    if (!articlesContainer) return;

    if (filteredArticles.length === 0) {
        articlesContainer.innerHTML = '';
        if (emptyState) emptyState.hidden = false;
        return;
    }
    
    if (emptyState) emptyState.hidden = true;
    
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
    
    // Кнопки внутри карточек (для надежности, хотя делегирование тоже работает)
    setupCardEventListeners();
}

/**
 * Настройка обработчиков событий для кнопок внутри карточек
 */
function setupCardEventListeners() {
    if (!articlesContainer) return;

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
            if (article) shareArticle(article);
        });
    });
}

/**
 * Открытие модального окна со статьей
 */
function openArticleModal(articleId) {
    console.log('openArticleModal called for ID:', articleId);
    // Ищем статью по ID (сравнение с приведением типов для надежности)
    const article = allArticles.find(a => a.id == articleId);
    if (!article) {
        console.error('Статья не найдена для ID:', articleId);
        return;
    }
    console.log('Статья найдена:', article.title);
    
    currentArticleId = articleId;
    
    // Безопасное обновление элементов модального окна
    if (modalImg) {
        modalImg.src = article.image;
        modalImg.alt = article.title;
    } else {
        console.warn('modalImg element not found');
    }

    if (modalCategory) modalCategory.textContent = article.category;
    if (modalDate) modalDate.textContent = formatDate(article.date);
    if (modalTitle) modalTitle.textContent = article.title;
    if (modalText) modalText.innerHTML = formatArticleContent(article.content);
    
    // Настройка кнопки сохранения
    if (modalSaveBtn) {
        const isFavorite = favorites.includes(articleId);
        modalSaveBtn.innerHTML = isFavorite 
            ? '<span class="modal__save-btn-icon">💚</span><span class="modal__save-btn-text">Убрать из сохраненных</span>'
            : '<span class="modal__save-btn-icon">💾</span><span class="modal__save-btn-text">Сохранить статью</span>';
    }
    
    // Настройка кнопок поделиться
    setupShareButtons(article);
    
    // Показываем модальное окно
    if (articleModal) {
        console.log('Попытка открыть модальное окно...');
        articleModal.setAttribute('aria-hidden', 'false');
        articleModal.classList.add('modal--open'); 
        // Принудительно показываем, если CSS класс не срабатывает
        articleModal.style.display = 'flex';
        articleModal.style.zIndex = '9999';
        articleModal.style.visibility = 'visible';
        articleModal.style.opacity = '1';
        console.log('Стили модального окна после открытия:', articleModal.style.display, articleModal.classList);
    } else {
        console.error('articleModal element not found');
    }
    document.body.style.overflow = 'hidden';
}

/**
 * Форматирование содержимого статьи
 */
function formatArticleContent(content) {
    if (!content) return '<p>Содержание статьи отсутствует</p>';
    
    const paragraphs = content.split('. ').filter(p => p.trim().length > 0);
    
    if (paragraphs.length > 0) {
        return paragraphs.map(paragraph => {
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
    
    if (shareVk) {
        shareVk.onclick = () => {
            const url = `https://vk.com/share.php?url=${pageUrl}&title=${title}&description=${description}`;
            openShareWindow(url, 650, 350);
        };
    }
    
    if (shareTelegram) {
        shareTelegram.onclick = () => {
            const url = `https://t.me/share/url?url=${pageUrl}&text=${title}`;
            openShareWindow(url, 600, 400);
        };
    }
    
    if (shareWhatsApp) {
        shareWhatsApp.onclick = () => {
            const url = `https://wa.me/?text=${title}%20${pageUrl}`;
            openShareWindow(url, 600, 400);
        };
    }
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
 * Поделиться статьей (Web Share API)
 */
function shareArticle(article) {
    if (navigator.share) {
        navigator.share({
            title: article.title,
            text: article.excerpt,
            url: window.location.href,
        })
        .catch(error => console.log('Ошибка шаринга:', error));
    } else {
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
        favorites.push(currentArticleId);
        showNotification('Статья добавлена в избранное!');
    } else {
        favorites.splice(index, 1);
        showNotification('Статья убрана из избранного');
    }
    
    localStorage.setItem('articleFavorites', JSON.stringify(favorites));
    
    if (modalSaveBtn) {
        const isFavorite = favorites.includes(currentArticleId);
        modalSaveBtn.innerHTML = isFavorite 
            ? '<span class="modal__save-btn-icon">💚</span><span class="modal__save-btn-text">Убрать из сохраненных</span>'
            : '<span class="modal__save-btn-icon">💾</span><span class="modal__save-btn-text">Сохранить статью</span>';
    }
    
    renderArticles();
}

/**
 * Фильтрация статей
 */
function filterArticles() {
    if (!filterCategory || !filterDate || !searchInput) return;

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
                case 'week': daysDiff = 7; break;
                case 'month': daysDiff = 30; break;
                case 'quarter': daysDiff = 90; break;
                default: daysDiff = 0;
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
    if (filterCategory) filterCategory.value = '';
    if (filterDate) filterDate.value = '';
    if (searchInput) searchInput.value = '';
    
    console.log('Filters reset. Articles count:', allArticles.length);
    
    filteredArticles = [...allArticles];
    updateArticlesCount();
    renderArticles();
}

/**
 * Обновление счетчика статей
 */
function updateArticlesCount() {
    if (articlesCount) {
        articlesCount.textContent = filteredArticles.length;
    }
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
    
    const styleId = 'notification-styles';
    if (!document.getElementById(styleId)) {
        const style = document.createElement('style');
        style.id = styleId;
        style.textContent = `
            @keyframes slideIn {
                from { transform: translateX(100%); opacity: 0; }
                to { transform: translateX(0); opacity: 1; }
            }
            @keyframes slideOut {
                from { transform: translateX(0); opacity: 1; }
                to { transform: translateX(100%); opacity: 0; }
            }
        `;
        document.head.appendChild(style);
    }
    
    document.body.appendChild(notification);
    
    setTimeout(() => {
        notification.style.animation = 'slideOut 0.3s ease-out';
        setTimeout(() => {
            if (notification.parentNode) document.body.removeChild(notification);
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
        <div style="background: #fee; border: 2px solid #f66; border-radius: 8px; padding: 1rem; margin: 1rem 0; text-align: center; color: #c00;">
            <strong>Ошибка:</strong> ${message}
        </div>
    `;
    
    const container = document.querySelector('.container');
    if (container) container.prepend(errorDiv);
}

/**
 * Закрытие модального окна
 */
function closeModal() {
    console.log('closeModal called');
    if (articleModal) {
        articleModal.setAttribute('aria-hidden', 'true');
        articleModal.classList.remove('modal--open');
        articleModal.style.display = '';
    }
    document.body.style.overflow = '';
    currentArticleId = null;
}

/**
 * Дебаунс для поиска
 */
function debounce(func, wait) {
    let timeout;
    return function(...args) {
        clearTimeout(timeout);
        timeout = setTimeout(() => func.apply(this, args), wait);
    };
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
    if (resetFiltersBtn) {
        resetFiltersBtn.addEventListener('click', (e) => {
            e.preventDefault();
            console.log('Сброс фильтров активирован');
            resetFilters();
        });
    }
    if (resetEmptyFiltersBtn) {
        resetEmptyFiltersBtn.addEventListener('click', (e) => {
            e.preventDefault();
            resetFilters();
        });
    }
    
    // Модальное окно
    if (modalClose) {
        modalClose.addEventListener('click', (e) => {
            e.preventDefault();
            console.log('Клик по кнопке закрытия');
            closeModal();
        });
    }
    if (articleModal) {
        articleModal.addEventListener('click', (e) => {
            if (e.target === articleModal) {
                console.log('Клик по фону модального окна');
                closeModal();
            }
        });
    }
    
    // Кнопка сохранения
    if (modalSaveBtn) {
        modalSaveBtn.addEventListener('click', (e) => {
            e.preventDefault();
            toggleSaveArticle();
        });
    }
    
    // Делегирование события клика по карточке статьи (используем document для надежности)
    document.addEventListener('click', (e) => {
        // Игнорируем клики по кнопкам внутри карточки
        if (e.target.closest('button')) return;

        const card = e.target.closest('.article-card');
        if (card) {
            console.log('Найдена карточка:', card);
            const articleId = card.dataset.id;
            if (articleId) {
                // Пробуем как число, затем как строку
                const idNum = parseInt(articleId);
                openArticleModal(isNaN(idNum) ? articleId : idNum);
            } else {
                console.error('ID статьи не найден в dataset');
            }
        }
    });
    
    // Закрытие по ESC
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape' && articleModal && articleModal.getAttribute('aria-hidden') === 'false') {
            closeModal();
        }
    });
}

// ========== ЗАПУСК ПРИЛОЖЕНИЯ ==========
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
} else {
    init();
}