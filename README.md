# Lit Analytics SaaS Prototype

Черновой прототип SaaS-платформы для сбора и визуализации статистики с литературных порталов.

## Что есть сейчас

- FastAPI backend с API-заглушками.
- HTML/CSS/JS frontend с главной страницей, дашбордом и настройками.
- Заглушка входа через Google.
- Заглушки настроек Litnet, Litgorod, Author.Today, Яндекс.Директ и VK Ads.
- Демонстрационные данные по статистике, расходам и ROI/ROMI.

## Локальный запуск

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
