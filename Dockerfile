FROM node:16-stretch-slim as web

WORKDIR /ui
COPY ui/package-lock.json ui/package.json /ui/
RUN npm install

COPY ui /ui
RUN npm run-script build

FROM python:3.8-slim-buster

WORKDIR /hsds-viewer
COPY api/requirements.txt /hsds-viewer/
RUN pip install --no-cache-dir --prefer-binary \
        -r /hsds-viewer/requirements.txt \
        eventlet==0.30.2 \
        gunicorn==20.0.4

COPY api /hsds-viewer
COPY --from=web /ui/build /hsds-viewer/static

CMD  [ "gunicorn", "--worker-class=eventlet", "--bind=0.0.0.0:80", "app:app" ]
