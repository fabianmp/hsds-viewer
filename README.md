# hsds-viewer

Simple viewer for contents of an HSDS server.

## Architecture

HSDS-Viewer uses a Python web service to connect to HSDS and a React frontend to display the content.
Currently the backend web service uses the HSDS configuration of the host system (environment variables or .hscfg)
for the HSDS connection. Optionally HSDS-Viewer itself can use authentication against an external OIDC provider.

## Configuration

Set the following environment variables to configure HSDS-Viewer.
OIDC authentication is activated if the corresponding settings are set.

Environment Variable | Default Value | Description
---------------------|---------------|---------------------
`HS_ENDPOINT`        | `None`        | HSDS server endpoint
`HS_USERNAME`        | `None`        | HSDS user
`HS_PASSWORD`        | `None`        | HSDS password
`SECRET_KEY`         | `None`        | Secret key used to sign sessions (*random if not set but OIDC is enabled*)
`OIDC_ENDPOINT`      | `None`        | OIDC provider endpoint (URI to `.well-known` configuration)
`OIDC_CLIENT_ID`     | `None`        | OIDC client name
`OIDC_CLIENT_SECRET` | `None`        | OIDC client secret
