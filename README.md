# Lit Analytics SaaS Prototype

Черновой прототип SaaS-платформы для сбора и визуализации статистики с литературных порталов.

Это пока не готовый продукт, а демо-сайт с заглушками: можно открыть главную страницу, нажать кнопку входа через Google, перейти в дашборд, посмотреть тестовые метрики, настройки подключений и форму ручных расходов.

## Что есть сейчас

- FastAPI backend с API-заглушками.
- HTML/CSS/JS frontend с главной страницей, дашбордом и настройками.
- Заглушка входа через Google.
- Заглушки настроек Litnet, Litgorod, Author.Today, Яндекс.Директ и VK Ads.
- Демонстрационные данные по статистике, расходам и ROI/ROMI.

## Самый простой запуск

### Windows

Открой PowerShell или терминал в папке проекта и выполни:

```powershell
.\start.bat
```

### macOS / Linux

Открой терминал в папке проекта и выполни:

```bash
chmod +x ./start.sh
./start.sh
```

После запуска открой в браузере:

```text
http://127.0.0.1:8000
```

## Ручной запуск

Если скрипты не подошли, можно запустить вручную.

### Windows

```powershell
cd backend
python -m venv .venv
.\.venv\Scripts\activate
pip install -r requirements.txt
uvicorn app.main:app --reload
```

### macOS / Linux

```bash
cd backend
python -m venv .venv
source .venv/bin/activate
pip install -r requirements.txt
uvicorn app.main:app --reload
```

После запуска открыть:

```text
http://127.0.0.1:8000
```

## Что смотреть на сайте

- `/` — главная страница и кнопка-заглушка входа через Google.
- `/dashboard` — дашборд с тестовыми доходами, расходами, ROI/ROMI, книгами и настройками.
- `/health` — проверка, что backend работает.
- `/api/dashboard/summary` — тестовые данные для дашборда.

## Частые проблемы

### Команда `python` не найдена

Установи Python 3.11+ и проверь, что он добавлен в PATH.

### Не устанавливаются зависимости

Проверь интернет-соединение и попробуй обновить pip:

```bash
python -m pip install --upgrade pip
```

### Порт 8000 занят

Запусти на другом порту:

```bash
cd backend
uvicorn app.main:app --reload --port 8001
```

И открой:

```text
http://127.0.0.1:8001
```

## Google OAuth

Для входа через Google нужен один локальный файл `.env` в корне проекта. Он не хранится в GitHub, потому что внутри секреты.

Минимальное содержимое файла:

```env
APP_NAME=Lit Analytics
SECRET_KEY=change-me-local
GOOGLE_CLIENT_ID=your-client-id.apps.googleusercontent.com
GOOGLE_CLIENT_SECRET=your-google-client-secret
GOOGLE_REDIRECT_URI=http://127.0.0.1:8000/api/auth/google/callback
YANDEX_DIRECT_TOKEN=
VK_ADS_TOKEN=
```

Если проект запускается в Codespaces/GitHub preview, redirect URI в Google Cloud должен совпадать с публичным preview-адресом, а не только с `127.0.0.1`.
