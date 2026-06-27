from fastapi import APIRouter

router = APIRouter()


@router.get("/summary")
def dashboard_summary():
    return {
        "period": "демо-режим",
        "revenue": 0,
        "ad_spend": 0,
        "manual_spend": 0,
        "roi": 0,
        "romi": 0,
        "books": [],
        "alerts": [
            "Подключите аккаунты литературных площадок, чтобы здесь появилась статистика.",
            "Добавьте рекламные кабинеты или ручные расходы, чтобы увидеть аналитику окупаемости.",
        ],
    }
