from fastapi import APIRouter

router = APIRouter()


@router.get("/summary")
def dashboard_summary():
    return {
        "period": "последние 30 дней",
        "revenue": 128400,
        "ad_spend": 34200,
        "manual_spend": 6500,
        "roi": 215.5,
        "romi": 275.4,
        "books": [
            {
                "title": "Академия теней",
                "platform": "Litnet",
                "views": 18420,
                "libraries": 1260,
                "likes": 540,
                "purchases": 318,
                "revenue": 75600,
            },
            {
                "title": "Город драконов",
                "platform": "Litgorod",
                "views": 9730,
                "libraries": 680,
                "likes": 215,
                "purchases": 142,
                "revenue": 52800,
            },
        ],
        "alerts": [
            "Стоимость покупки по книге «Город драконов» выше среднего за 30 дней.",
            "После рекламы у блогера выросли библиотеки, но продажи пока без сильного роста.",
        ],
    }
