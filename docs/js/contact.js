// contact.js — enhanced form handling: supports optional endpoint or localStorage fallback
(function(){
    document.addEventListener('DOMContentLoaded', function() {
        const form = document.getElementById('contactForm');
        const status = document.getElementById('contactStatus');
        const submitBtn = form && form.querySelector('button[type="submit"]');

        if (!form) return;

        async function sendToEndpoint(endpoint, payload) {
            try {
                const res = await fetch(endpoint, {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify(payload)
                });
                return res.ok;
            } catch (err) {
                console.error('Contact form submit error:', err);
                return false;
            }
        }

        form.addEventListener('submit', async function(e) {
            e.preventDefault();

            const data = {
                id: Date.now(),
                name: form.name.value.trim(),
                email: form.email.value.trim(),
                subject: form.subject.value.trim(),
                message: form.message.value.trim(),
                date: new Date().toISOString()
            };

            if (!data.name || !data.email || !data.message) {
                status.textContent = 'Пожалуйста, заполните обязательные поля.';
                status.style.color = '#b33';
                return;
            }

            submitBtn.disabled = true;
            const originalText = submitBtn.textContent;
            submitBtn.textContent = 'Отправка...';

            // If an endpoint is provided on the page, try to send there
            const endpoint = window.CONTACT_FORM_ENDPOINT || '';
            let ok = false;
            if (endpoint) {
                ok = await sendToEndpoint(endpoint, data);
            }

            if (!endpoint || !ok) {
                // fallback: save locally
                try {
                    const existing = JSON.parse(localStorage.getItem('contactMessages') || '[]');
                    existing.push(data);
                    localStorage.setItem('contactMessages', JSON.stringify(existing));
                    ok = true;
                } catch (err) {
                    console.error('Local save error:', err);
                    ok = false;
                }
            }

            if (ok) {
                status.textContent = 'Спасибо! Ваше сообщение отправлено.';
                status.style.color = '#1f6b3f';
                form.reset();
            } else {
                status.textContent = 'Ошибка отправки. Попробуйте ещё раз.';
                status.style.color = '#b33';
            }

            submitBtn.disabled = false;
            submitBtn.textContent = originalText;

            setTimeout(() => { status.textContent = ''; }, 5000);
        });
    });
})();