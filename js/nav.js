(function(){
    function initNav() {
        const btns = document.querySelectorAll('.nav__mobile-btn');
        if (!btns.length) return;

        btns.forEach(btn => {
            const nav = btn.closest('.nav');
            if (!nav) return;
            const navList = nav.querySelector('.nav__list');
            if (!navList) return;
            if (btn.dataset.init === 'true') return;

            btn.addEventListener('click', function(e) {
                e.stopPropagation();
                navList.classList.toggle('nav__list--open');
                const expanded = navList.classList.contains('nav__list--open');
                btn.setAttribute('aria-expanded', expanded ? 'true' : 'false');
                btn.textContent = expanded ? '✕' : '☰';
            });

            btn.dataset.init = 'true';
        });

        // Закрыть любое открытое меню при клике вне навигации
        document.addEventListener('click', function(event) {
            btns.forEach(btn => {
                const nav = btn.closest('.nav');
                const navList = nav?.querySelector('.nav__list');
                if (!navList) return;
                if (!navList.classList.contains('nav__list--open')) return;
                if (!nav.contains(event.target)) {
                    navList.classList.remove('nav__list--open');
                    btn.setAttribute('aria-expanded', 'false');
                    btn.textContent = '☰';
                }
            });
        });

        // Закрытие при изменении размера окна (если меню осталось открытым)
        window.addEventListener('resize', function() {
            btns.forEach(btn => {
                const nav = btn.closest('.nav');
                const navList = nav?.querySelector('.nav__list');
                if (!navList) return;
                if (window.innerWidth > 900 && navList.classList.contains('nav__list--open')) {
                    navList.classList.remove('nav__list--open');
                    btn.setAttribute('aria-expanded', 'false');
                    btn.textContent = '☰';
                }
            });
        });
    }

    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', initNav);
    } else {
        initNav();
    }
})();
