from fastapi import APIRouter

router = APIRouter()


@router.get("/google/login")
def google_login_stub():
    return {
        "status": "stub",
        "message": "Здесь будет вход через Google OAuth.",
        "next_step": "Добавить GOOGLE_CLIENT_ID и GOOGLE_CLIENT_SECRET в .env",
    }


@router.get("/me")
def current_user_stub():
    return {
        "id": 1,
        "name": "Тестовый автор",
        "email": "author@example.com",
        "provider": "google",
    }
