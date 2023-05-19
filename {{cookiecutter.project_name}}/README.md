# {{cookiecutter.project_name.capitalize()}}

---

## Setup

### Backend

1. Download Pocketbase from https://pocketbase.io/docs/
2. Extract the `.zip` archive
3. Move the Pocketbase executable to `backendroom`
4. Rename it as `pb`

### Frontend

1. `cd {{cookiecutter.project_name}} && pnpm i`

---

## Usage

### Backend

```
cd backendroom
./pb serve
```

### Frontend

```
cd {{cookiecutter.project_name}}
pnpm dev
```
