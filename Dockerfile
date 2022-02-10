FROM node:16-stretch-slim as web

WORKDIR /ui
COPY ui/package-lock.json ui/package.json /ui/
RUN npm install

COPY ui /ui
RUN npm run-script build

FROM python:3.10-slim-buster as base

WORKDIR /hsds-viewer
COPY api/requirements.txt /hsds-viewer/
RUN pip install --no-cache-dir --prefer-binary \
        -r /hsds-viewer/requirements.txt \
        gunicorn==20.1.0

COPY api /hsds-viewer
COPY --from=web /ui/build /hsds-viewer/static

CMD  [ "gunicorn", "--worker-class=gthread", "--bind=0.0.0.0:80", "app:app" ]

FROM base as dev
COPY api/requirements-dev.txt /hsds-viewer/
RUN pip install --no-cache-dir --prefer-binary \
        -r /hsds-viewer/requirements-dev.txt

FROM base as final
