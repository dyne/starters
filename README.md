# Dyne.org's project starters

We do like to reinvent the wheel... But sometimes it's easier to start with some previous work done!
This repo takes inspiration from https://github.com/spinspire/recipes but in place of
`degitting` everywhere sometimes more inclined to ease the project creation with
[`cruft`](https://github.com/cruft/cruft).

## Setup

Please make sure to have these installed:

- [Cruft](https://cruft.github.io/cruft/#installation)

---

# The starters

## cliroom

🛠️ CLI builder that runs Zencode smart contracts

```bash
cruft create --directory cliroom https://github.com/dyne/starters
```
[READ MORE](https://github.com/dyne/starters/tree/main/cliroom/%7B%7Bcookiecutter.project_slug%7D%7D)


## saas

This is the starter for saas products. A fullstack app made of:

- `admin` – the backoffice for the site admins (configurations, logs, users)
- `webapp` – the ui and pages of your SAAS service

**Installation**

```
cruft create --directory saas https://github.com/dyne/starters
```

**Update your project with the starter upgrades**

To update an existing project, that was created using cruft, run cruft update 
in the root of the project. If there are any updates, cruft will have you 
review them before applying. If you accept the changes cruft will apply them to
your project and update the .cruft.json file for you.

[More details](https://cruft.github.io/cruft/#updating-a-project)

**Automating updates with GitHub Actions**

```yaml
# /.github/workflows/starter-update.yml
name: Update Dyne's starter
permissions:
  contents: write
  pull-requests: write
on:
  schedule:
    - cron: "0 2 * * 1" # Every Monday at 2am
jobs:
  update:
    runs-on: ubuntu-latest
    strategy:
      fail-fast: true
      matrix:
        include:
          - add-paths: .
            body: Use this to merge the changes to this repository.
            branch: starters/update
            commit-message: "chore: accept new starter update"
            title: New updates detected with Dyne's starters
          - add-paths: .cruft.json
            body: Use this to reject the changes in this repository.
            branch: cruft/reject
            commit-message: "chore: reject new starters update"
            title: Reject new updates detected with Cruft
    steps:
      - uses: actions/checkout@v3

      - uses: actions/setup-python@v4
        with:
          python-version: "3.10"

      - name: Install Cruft
        run: pip3 install cruft

      - name: Check if update is available
        continue-on-error: false
        id: check
        run: |
          CHANGES=0
          if [ -f .cruft.json ]; then
            if ! cruft check; then
              CHANGES=1
            fi
          else
            echo "No .cruft.json file"
          fi

          echo "has_changes=$CHANGES" >> "$GITHUB_OUTPUT"

      - name: Run update if available
        if: steps.check.outputs.has_changes == '1'
        run: |
          git config --global user.email "you@example.com"
          git config --global user.name "GitHub"

          cruft update --skip-apply-ask --refresh-private-variables
          git restore --staged .

      - name: Create pull request
        if: steps.check.outputs.has_changes == '1'
        uses: peter-evans/create-pull-request@v4
        with:
          token: ${{ secrets.GITHUB_TOKEN }}
          add-paths: ${{ matrix.add-paths }}
          commit-message: ${{ matrix.commit-message }}
          branch: ${{ matrix.branch }}
          delete-branch: true
          branch-suffix: timestamp
          title: ${{ matrix.title }}
          body: |
            This is an autogenerated PR. ${{ matrix.body }}

            [Starters] has detected updates from the original repository.
```
[More details](https://cruft.github.io/cruft/#automating-updates-with-github-actions)

**Features**

- `webapp`
  - [x] Sveltekit framework of choice
  - [x] Forms handled by https://superforms.vercel.app
  - [x] Runtime schema validation with zod
  - [ ] Docker deployment
  - [ ] Multi-region, distributed, production-ready SQLite Database with LiteFS
  - [ ] Healthcheck endpoint for uptime.dyne.org
  - [ ] GitHub Actions with testing and deploy on merge for both production and staging environment on baloo
  - [x] Authentication with Keypairoom
  - [x] W3C-DIDs with did.dyne.org
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
  - [x] Data migrations and seeds
- `admin`
  - embedded database (SQLite) with realtime subscriptions
  - built-in auth management
  - convenient dashboard UI
  - simple REST-ish API.
  - [x] Interacts natively with [DID:dyne](https://github.com/dyne/w3c-did)
  - [x] Authentication with [keypairoom](https://github.com/ledgerproject/keypairoom)
  - [x] Allows to create hooks via the backend interface
  - [x] Healthcheck endpoint for uptime.dyne.org

---
