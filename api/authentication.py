import os

from authlib.integrations.flask_client import OAuth
from flask import redirect, request, session, url_for


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

    @app.before_request
    def require_login():
        if request.path in excluded_urls:
            return
        if "username" not in session:
            return oauth.oidc.authorize_redirect(
                url_for("auth", _external=True, redirect_path=request.full_path)
            )

    @app.route("/auth")
    def auth():
        token = oauth.oidc.authorize_access_token()
        session["username"] = oauth.oidc.parse_id_token(token)["preferred_username"]
        session["token"] = token["access_token"]
        return redirect(request.args.get("redirect_path", "/"))
