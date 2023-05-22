<div align="center">

# {{cookiecutter.project_name}}

### {{cookiecutter.project_description}}

</div>


---
<br><br>
 

## {{cookiecutter.project_name}} Features

- [ ] Sveltekit
- [ ] Forms handled by https://superforms.vercel.app
- [ ] Runtime schema validation with zod
- [ ] Docker deployment
- [ ] Multi-region, distributed, production-ready SQLite Database with LiteFS
- [ ] Healthcheck endpoint for uptime.dyne.org
- [ ] GitHub Actions with testing and deploy on merge for both production and staging environment on baloo
- [ ] Authentication with Keypairoom
- [ ] W3C-DIDs with did.dyne.org
- [ ] Transaction email with Sendgrid and forgot/reset nature of Keypairoom
- [ ] Backend as a service in one file with [../backendroom](../backendroom)
- [ ] Role-based user permission
- [ ] Feature flags for all optional features directly defined in the back-office by admins
- [ ] Styling with tailwind
- [ ] Flowbite design system customized for dyne/forkbomb purposes
- [ ] End-to-end testing with Playwright
- [ ] Code formatting with Prettier
- [ ] Linting with ESLint
- [ ] Static Types with TypeScript
- [ ] Error monitoring with Sentry
- [ ] Data migrations and seeds

# [LIVE DEMO](https://yourservice/)

<br>

<div id="toc">

### 🚩 Table of Contents

- [💾 Install](#-install)
- [🎮 Quick start](#-quick-start)
- [🚑 Community & support](#-community--support)
- [🐋 Docker](#-docker)
- [🐝 API](#-api)
- [🔧 Configuration](#-configuration)
- [📋 Testing](#-testing)
- [🐛 Troubleshooting & debugging](#-troubleshooting--debugging)
- [😍 Acknowledgements](#-acknowledgements)
- [👤 Contributing](#-contributing)
- [💼 License](#-license)

</div>

***
## 💾 Install
```pip install / yard add {{cookiecutter.project_name}}```


**[🔝 back to top](#toc)**

***
## 🎮 Quick start

To start using {{cookiecutter.project_name}} run the following command in the root folder

```bash
docker compose up
```

**[🔝 back to top](#toc)**

***
## 🚑 Community & support

**[📝 Documentation](#toc)** - Getting started and more.

**[🌱 Ecosystem](https://github.com/dyne/ecosystem)** - Plugins, resources, and more.

**[🚩 Issues](../../issues)** - Bugs end errors you encounter using {{cookiecutter.project_name}}.

**[💬 Discussions](../../discussions)** - Get help, ask questions, request features, and discuss {{cookiecutter.project_name}}.

**[[] Matrix](https://socials.dyne.org/matrix)** - Hanging out with the community.

**[🗣️ Discord](https://socials.dyne.org/discord)** - Hanging out with the community.

**[🪁 Telegram](https://socials.dyne.org/telegram)** - Hanging out with the community.

**[📖 Example](https://github.com/{{cookiecutter.project_name}}/example)** - An example repository that uses {{cookiecutter.project_name}}.

**[🔝 back to top](#toc)**

***
## 🐋 Docker

Please refer to [DOCKER PACKAGES](../../packages)


**[🔝 back to top](#toc)**

***
## 🐝 API

Available endpoints

### POST /token

Execute a transaction with some amount

**Parameters**

|          Name | Required |  Type   | Description       | 
| -------------:|:--------:|:-------:| ------------------|
|       `token` | required | string  | Type of token. Accepted values `idea` or `strength`  |
|       `amount`| required | number  | Transaction's token amount |
|       `owner` | required | ULID    | The ULID of the Agent's owner |
 
### GET /token/${request.token}/${request.owner}

Retrieves the actual value of the token type for the specified owner


**[🔝 back to top](#toc)**

***
## 🔧 Configuration

**[🔝 back to top](#toc)**

***

## 📋 Testing

**[🔝 back to top](#toc)**

***
## 🐛 Troubleshooting & debugging

**[🔝 back to top](#toc)**

***
## 😍 Acknowledgements

<a href="https://dyne.org">
  <img src="https://files.dyne.org/software_by_dyne.png" width="222">
</a>


Copyleft 🄯 2023 by [Dyne.org](https://www.dyne.org) foundation, Amsterdam

Designed, written and maintained by {{cookiecutter.full_name}}

**[🔝 back to top](#toc)**

***
## 👤 Contributing

Please first take a look at the [Dyne.org - Contributor License Agreement](CONTRIBUTING.md) then

1.  🔀 [FORK IT](../../fork)
2.  Create your feature branch `git checkout -b feature/branch`
3.  Commit your changes `git commit -am 'feat: New feature\ncloses #398'`
4.  Push to the branch `git push origin feature/branch`
5.  Create a new Pull Request `gh pr create -f`
6.  🙏 Thank you


**[🔝 back to top](#toc)**

***
## 💼 License
    {{cookiecutter.project_name}} - {{cookiecutter.project_description}}
    Copyleft 🄯 2023 {{cookiecutter.full_name}} <{{cookiecutter.email}}>

    This program is free software: you can redistribute it and/or modify
    it under the terms of the GNU Affero General Public License as
    published by the Free Software Foundation, either version 3 of the
    License, or (at your option) any later version.

    This program is distributed in the hope that it will be useful,
    but WITHOUT ANY WARRANTY; without even the implied warranty of
    MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
    GNU Affero General Public License for more details.

    You should have received a copy of the GNU Affero General Public License
    along with this program.  If not, see <http://www.gnu.org/licenses/>.

**[🔝 back to top](#toc)**
