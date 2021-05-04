import json
import os
from base64 import b64decode
from functools import wraps
from time import time

from authlib.integrations.flask_client import OAuth
from flask import abort, redirect, request, session, url_for

oidc_roles_claim = os.environ.get("OIDC_ROLES_CLAIM", "roles")


def require_role(role):
    def require_role_decorator(f):
        @wraps(f)
        def decorated_function(*args, **kwargs):
            if "roles" not in session:
                abort(401)
            if role not in session["roles"]:
                abort(403)
            return f(*args, **kwargs)

        return decorated_function

    return require_role_decorator


def update_session(token):
    session["access_token"] = token["access_token"]
    session["refresh_token"] = token["refresh_token"]
    session["expires_at"] = token["expires_at"]
    access_token_info = token["access_token"].split(".")[1]
    access_token_info_with_padding = (
        f"{access_token_info}{'=' * (len(access_token_info) % 4)}"
    )
    data = json.loads(b64decode(access_token_info_with_padding))
    session["roles"] = data.get(oidc_roles_claim, [])


def configure_authentication(app):
    oidc_endpoint = os.environ.get("OIDC_ENDPOINT")
    oidc_client_id = os.environ.get("OIDC_CLIENT_ID")
    oidc_client_secret = os.environ.get("OIDC_CLIENT_SECRET")
    oidc_settings = (oidc_endpoint, oidc_client_id, oidc_client_secret)

    if not any(oidc_settings):
        return
    if not all(oidc_settings):
        raise Exception("Invalid OIDC configuration")

    app.config.update(
        {"OIDC_CLIENT_ID": oidc_client_id, "OIDC_CLIENT_SECRET": oidc_client_secret}
    )
    if not oidc_endpoint.endswith("/"):
        oidc_endpoint += "/"
    oauth = OAuth(app)
    oauth.register(
        name="oidc",
        server_metadata_url=f"{oidc_endpoint}.well-known/openid-configuration",
        client_kwargs={"scope": "openid"},
    )

    excluded_urls = (
        "/auth",
        "/healthz",
    )

    def refresh_token_if_necessary():
        if session["expires_at"] > int(time()):
            return

        token = oauth.oidc.fetch_access_token(
            refresh_token=session["refresh_token"], grant_type="refresh_token"
        )
        update_session(token)

    @app.before_request
    def require_login():
        if request.path in excluded_urls:
            return None

        if "username" not in session:
            return oauth.oidc.authorize_redirect(
                url_for("auth", _external=True, redirect_path=request.full_path)
            )

        try:
            refresh_token_if_necessary()
        except:
            return oauth.oidc.authorize_redirect(
                url_for("auth", _external=True, redirect_path=request.full_path)
            )

    @app.route("/auth")
    def auth():
        token = oauth.oidc.authorize_access_token()
        session["username"] = oauth.oidc.parse_id_token(token)["preferred_username"]
        update_session(token)
        return redirect(request.args.get("redirect_path", "/"))
