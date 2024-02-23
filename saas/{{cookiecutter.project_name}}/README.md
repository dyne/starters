# {{cookiecutter.project_name.capitalize()}}

{{cookiecutter.project_description}}

---

## Setup

### Backend

1. `cd admin && go build`

### Frontend

1. `cd webapp && pnpm i`

---

## Usage

### Backend

```
cd admin
./pb serve
```

### Frontend

```
cd webapp
cp .env.example .env
pnpm dev
```

## Usage with docker compose

```
docker compose build
docker compose up
```
