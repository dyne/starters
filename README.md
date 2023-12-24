<div align="center">

# Starters

### We like to reinvent the wheel... But smarter!

</div>

<p align="center">
  <a href="https://dyne.org">
    <img src="https://files.dyne.org/software_by_dyne.png" width="170">
  </a>
</p>


---
<br><br>

We do like to reinvent the wheel... But sometimes it's easier to start smarter with some previous work done!
`Starters` is a collection of curated templates to help you kickstart your software projects with ease. What sets us apart is our unique capability to seamlessly update instances that are initiated using our starters. While other starter kits are primarily designed for initial project setup, we go a step further by ensures that your project incorporates the latest updates, including any new features added to the starter.

## Starters Features

 - `Quick Setup`: Get your project up and running in minutes with our well-organized and pre-configured starter kits.
 - `Seamless Updates`: Unlike traditional starter kits, our templates come with a built-in update mechanism. Receive the latest enhancements and bug fixes effortlessly.
 - `Customizable`: Adapt the starters to fit your project's specific requirements. They serve as a foundation, not a rigid structure.

<br>

<div id="toc">

### 🚩 Table of Contents

- [🎮 Quick start](#-quick-start)
- [🚑 Community & support](#-community--support)
- [😍 Acknowledgements](#-acknowledgements)
- [👤 Contributing](#-contributing)
- [💼 License](#-license)

</div>

***
## 🎮 Quick start

1. Choose a Starter from the following:

| Starter Kit | Description | Documentation |
|-------------|-------------| ------------- |
| **[cliroom](cliroom/)** | 🐗 Build CLI interfaces for executing Zenroom smart contracts. | [📄 Documentation](cliroom/{{cookiecutter.project_slug}}/README.md) |
| **[saas](saas/)** | 🚀 Full-featured PWA/SaaS webapp, including Slangroom integration. | [📄 Documentation](saas/{{cookiecutter.project_name}}/README.md) |
| **[ts-sea](starters/ts-sea/)** | 🪑 Template to create single executable applications using TypeScript. | [📄 Documentation](ts-sea/{{cookiecutter.project_name}}/README.md) |
| **[typescript](typescript/)** | 🛕 Monorepo generic template for TypeScript projects. 🛠️ | [📄 Documentation](typescript/{{cookiecutter.project_slug}}/README.md) |


1. Create your instance by executing
```
cruft create https://github.com/dyne/starters --directory {your_choosen_starter}
```
1. Benefit from automatic updates by regularly checking for the latest releases and applying them to your project by running inside the rootfolder of your generated app
```sh 
cruft update
```

**[🔝 back to top](#toc)**

***
## 🚑 Community & support

**[📝 Documentation](#toc)** - Getting started and more.

**[🚩 Issues](../../issues)** - Bugs end errors you encounter using Starters.

**[[] Matrix](https://socials.dyne.org/matrix)** - Hanging out with the community.

**[🗣️ Discord](https://socials.dyne.org/discord)** - Hanging out with the community.

**[🪁 Telegram](https://socials.dyne.org/telegram)** - Hanging out with the community.

**[🔝 back to top](#toc)**


***
## 😍 Acknowledgements

<a href="https://dyne.org">
  <img src="https://files.dyne.org/software_by_dyne.png" width="222">
</a>


Copyleft 🄯 2023 by [Dyne.org](https://www.dyne.org) foundation, Amsterdam

This repo takes inspiration from https://github.com/spinspire/recipes but in place of
`degitting` everywhere sometimes more inclined to ease the project creation with
[`cruft`](https://github.com/cruft/cruft).

Designed, written and maintained by Dyne's hackers.

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
    Starters - We like reinvent the wheel... But smarter!
    Copyleft 🄯 2023 Dyne.org foundation, Amsterdam

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
