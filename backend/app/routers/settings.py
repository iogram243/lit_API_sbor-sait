from fastapi import APIRouter

router = APIRouter()


@router.get("")
def settings_stub():
    return {
        "literary_platforms": ["Litnet", "Litgorod"],
        "ad_integrations": ["Яндекс.Директ", "VK Ads"],
        "collection_mode": "Selenium для закрытой статистики, публичные страницы для открытой статистики",
    }
