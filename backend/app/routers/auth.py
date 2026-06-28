import json
import os
from pathlib import Path
from urllib.error import HTTPError
from urllib.parse import urlencode, urlparse
from urllib.request import Request, urlopen

from fastapi import APIRouter, Request
from fastapi.responses import RedirectResponse
from dotenv import load_dotenv

ROOT_DIR = Path(__file__).resolve().parents[3]
load_dotenv(ROOT_DIR / ".env")

router = APIRouter()

GOOGLE_AUTH_URL = "https://accounts.google.com/o/oauth2/v2/auth"
GOOGLE_TOKEN_URL = "https://oauth2.googleapis.com/token"
GOOGLE_USERINFO_URL = "https://openidconnect.googleapis.com/v1/userinfo"
DEFAULT_REDIRECT_URI = "http://127.0.0.1:8000/api/auth/google/callback"


def resolve_redirect_uri(request: Request) -> str:
    configured = os.getenv("GOOGLE_REDIRECT_URI")
    if configured:
        parsed = urlparse(configured)
        if request.url.hostname not in {"127.0.0.1", "localhost"} and parsed.hostname not in {request.url.hostname, None}:
            return str(request.url_for("google_callback"))
        return configured
    return str(request.url_for("google_callback"))


@router.get("/google/login")
def google_login(request: Request):
    client_id = os.getenv("GOOGLE_CLIENT_ID")
    redirect_uri = resolve_redirect_uri(request)

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

    redirect_uri = resolve_redirect_uri(request)
    token_payload = {
        "code": code,
        "client_id": os.getenv("GOOGLE_CLIENT_ID"),
        "client_secret": os.getenv("GOOGLE_CLIENT_SECRET"),
        "redirect_uri": redirect_uri,
        "grant_type": "authorization_code",
    }

    if not token_payload["client_secret"]:
        return {
            "status": "not_configured",
            "message": "Google OAuth не настроен: добавьте GOOGLE_CLIENT_SECRET в .env.",
        }

    request_data = urlencode(token_payload).encode("utf-8")
    req = Request(GOOGLE_TOKEN_URL, data=request_data, headers={"Content-Type": "application/x-www-form-urlencoded"})

    try:
        with urlopen(req) as resp:
            token_response = json.load(resp)
    except HTTPError as exc:
        try:
            error_body = exc.read().decode("utf-8")
            error_data = json.loads(error_body)
            error_description = error_data.get("error_description") or error_data.get("error")
        except Exception:
            error_description = exc.reason
        return {
            "status": "error",
            "message": "Ошибка обмена code на токены.",
            "details": error_description,
        }

    access_token = token_response.get("access_token")
    if not access_token:
        return {
            "status": "error",
            "message": "Не удалось получить access_token.",
            "details": token_response,
        }

    userinfo_req = Request(
        GOOGLE_USERINFO_URL,
        headers={"Authorization": f"Bearer {access_token}"},
    )

    try:
        with urlopen(userinfo_req) as resp:
            userinfo = json.load(resp)
    except HTTPError as exc:
        return {
            "status": "error",
            "message": "Не удалось получить профиль пользователя Google.",
            "details": exc.reason,
        }

    return {
        "status": "success",
        "user": {
            "id": userinfo.get("sub"),
            "name": userinfo.get("name"),
            "email": userinfo.get("email"),
            "picture": userinfo.get("picture"),
        },
        "tokens": {
            "access_token": access_token,
            "id_token": token_response.get("id_token"),
            "refresh_token": token_response.get("refresh_token"),
        },
    }


@router.get("/me")
def current_user_stub():
    return {
        "id": 1,
        "name": "Тестовый автор",
        "email": "author@example.com",
        "provider": "google",
    }
