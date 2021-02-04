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

    app.secret_key = os.environ.get("SECRET_KEY")
    if app.secret_key is None:
        import secrets
        app.secret_key = secrets.token_urlsafe()
    app.config.update({
        "OIDC_CLIENT_ID": oidc_client_id,
        "OIDC_CLIENT_SECRET": oidc_client_secret
    })
    if not oidc_endpoint.endswith("/"):
        oidc_endpoint += "/"
    oauth = OAuth(app)
    oauth.register(
        name="oidc",
        server_metadata_url=f"{oidc_endpoint}.well-known/openid-configuration",
        client_kwargs={
            "scope": "openid"
        }
    )

    @app.before_request
    def require_login():
        if "user" not in session and request.path != url_for('auth'):
            return oauth.oidc.authorize_redirect(url_for('auth', _external=True, redirect_path=request.full_path))

    @app.route('/auth')
    def auth():
        token = oauth.oidc.authorize_access_token()
        session['user'] = oauth.oidc.parse_id_token(token)
        return redirect(request.args.get("redirect_path", "/"))
