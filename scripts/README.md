Использование скрипта fix-github-pages.ps1

Запуск (в PowerShell, из корня репозитория):

# Просмотр/выполнение без коммита
powershell -ExecutionPolicy Bypass -File .\scripts\fix-github-pages.ps1

# Выполнить и закоммитить изменения
powershell -ExecutionPolicy Bypass -File .\scripts\fix-github-pages.ps1 -Commit

Что делает скрипт:
- Копирует папки `blocks`, `images`, `js`, `json` в папку `docs/` (если они существуют в корне репозитория).
- В HTML-файлах внутри `docs/` заменяет `../blocks/`, `../images/`, `../js/` на `blocks/`, `images/`, `js/`.
- Создаёт пустой файл `.nojekyll` в корне репозитория.
- Если передан флаг `-Commit`, выполняет `git add .`, `git commit` и `git push`.

После выполнения откройте GitHub Pages и проверьте DevTools → Network: теперь `blocks/blocks.css`, `images/...` и `js/...` должны возвращать 200.
