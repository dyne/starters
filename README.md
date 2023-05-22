# Dyne.org's project starters

We do like to reinvent the wheel... But sometimes it's easier to start with some previous work done!
This repo takes inspiration from https://github.com/spinspire/recipes but in place of
`degitting` everywhere sometimes more inclined to ease the project creation with
[`cookiecutter`](https://github.com/cookiecutter/cookiecutter).

## Setup

Please make sure to have these installed:

- [Python](https://www.python.org/downloads/)
- [Cookiecutter](https://cookiecutter.readthedocs.io/en/stable/installation.html)

---

# The starters

## saas

This is the starter for saas products. A fullstack app made of:

- `admin` – the backoffice for the site admins (configurations, logs, users)
- `webapp` – the ui and pages of your SAAS service

**Installation**

```
cookiecutter https://github.com/dyne/starters.git --directory="saas"
```

**Features**

- `webapp`
  - [x] Sveltekit framework of choice
  - [ ] Forms handled by https://superforms.vercel.app
  - [ ] Runtime schema validation with zod
  - [ ] Docker deployment
  - [ ] Multi-region, distributed, production-ready SQLite Database with LiteFS
  - [ ] Healthcheck endpoint for uptime.dyne.org
  - [ ] GitHub Actions with testing and deploy on merge for both production and staging environment on baloo
  - [ ] Authentication with Keypairoom
  - [ ] W3C-DIDs with did.dyne.org
  - [x] Transaction email with Sendgrid and forgot/reset nature of Keypairoom
  - [x] Backend as a service in one file with [../backendroom](../backendroom)
  - [x] Role-based user permission
  - [x] Feature flags for all optional features directly defined in the back-office by admins
  - [x] Styling with tailwind
  - [x] Flowbite design system customized for dyne/forkbomb purposes
  - [x] End-to-end testing with Playwright
  - [ ] Code formatting with Prettier
  - [ ] Linting with ESLint
  - [ ] Static Types with TypeScript
  - [ ] Error monitoring with Sentry
  - [ ] Data migrations and seeds
- `admin`
  - embedded database (SQLite) with realtime subscriptions
  - built-in auth management
  - convenient dashboard UI
  - simple REST-ish API.
  - [ ] Interacts natively with [DID:dyne](https://github.com/dyne/w3c-did)
  - [ ] Authentication with [keypairoom](https://github.com/ledgerproject/keypairoom)
  - [x] Allows to create hooks via the backend interface

---
