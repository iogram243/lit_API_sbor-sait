import os
from urllib.parse import urlencode

from fastapi import APIRouter, Request
from fastapi.responses import RedirectResponse

router = APIRouter()

GOOGLE_AUTH_URL = "https://accounts.google.com/o/oauth2/v2/auth"
DEFAULT_REDIRECT_URI = "http://127.0.0.1:8000/api/auth/google/callback"


@router.get("/google/login")
def google_login():
    client_id = os.getenv("GOOGLE_CLIENT_ID")
    redirect_uri = os.getenv("GOOGLE_REDIRECT_URI", DEFAULT_REDIRECT_URI)

    if not client_id:
        return {
            "status": "not_configured",
            "message": "Google-вход пока в режиме заглушки: добавьте GOOGLE_CLIENT_ID в .env.",
        }

    query = urlencode(
        {
            "client_id": client_id,
            "redirect_uri": redirect_uri,
            "response_type": "code",
            "scope": "openid email profile",
            "access_type": "offline",
            "prompt": "consent",
        }
    )
    return RedirectResponse(f"{GOOGLE_AUTH_URL}?{query}")


@router.get("/google/callback")
def google_callback(request: Request):
    code = request.query_params.get("code")
    if not code:
        return {
            "status": "stub",
            "message": "Google вернул callback без code. Для полного входа нужен OAuth token exchange на backend.",
        }

    return {
        "status": "stub",
        "message": "Google code получен. Следующий шаг — обменять code на токены и создать сессию пользователя.",
    }


@router.get("/me")
def current_user_stub():
    return {
        "id": 1,
        "name": "Тестовый автор",
        "email": "author@example.com",
        "provider": "google",
    }
