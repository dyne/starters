.DEFAULT_GOAL := help
.PHONY: help

help: # 🛟 Show this help message
	@grep -E '^[a-zA-Z_-]+:.*?## .*$$' $(MAKEFILE_LIST) | sort | awk 'BEGIN {FS = ":.*?## "}; {printf "\033[36m%-7s\033[0m %s\n", $$1, $$2}'

# - Setup - #

setup_git: # Sets up Git only if it's missing
	@echo "📦 Setup Git"
	@(git status > /dev/null 2>&1 && echo "Git already set up") || (echo "git init" && git init)
	@echo " "

setup_submodules: setup_git
	@echo "📦 Setup the submodules"
	rm -rf admin/zencode/zenflows-crypto
	rm -rf webapp/zenflows-crypto
	cd admin && git submodule add -f https://github.com/interfacerproject/zenflows-crypto zencode/zenflows-crypto
	cd webapp && git submodule add -f https://github.com/interfacerproject/zenflows-crypto zenflows-crypto
	@echo " "

setup_backend:
	@echo "📦 Setup the backend"
	if [ ! -d ./admin/pb_data ]; then \
    	mkdir ./admin/pb_data; \
	fi
	cd admin && ./setup
	@echo " "

setup_frontend:
	@echo "📦 Setup the frontend"
	if [ ! -f ./webapp/.env ]; then \
		cp ./webapp/.env.example ./webapp/.env; \
	fi
	cd webapp && pnpm i
	@echo " "

setup: setup_submodules setup_backend setup_frontend # 📦 Setup the project

# - Running - #
# sleep 2 is needed to wait for the admin server to start
# before the webapp tries to connect to it and generate the schema
# check the webapp/package.json for the predev and prebuild scripts

dev: # ⚙️ Run the project in development mode
	./admin/pb serve & (sleep 2 && cd webapp && pnpm dev)

up: setup # ⚙️ Run the project in 'serve' mode
	./admin/pb serve & (sleep 2 && cd webapp && pnpm serve)

doc: ## 📚 Serve documentation on localhost
	npx -p docsify-cli docsify serve ./docs

# - Cleaning - #

clean_git:
	@echo "🧹 Removing git"
	rm -rf .git
	@echo " "

clean_submodules:
	@echo "🧹 Removing submodules"
	rm -rf admin/zencode/zenflows-crypto
	rm -rf webapp/zenflows-crypto
	@echo " "

clean_build:
	@echo "🧹 Cleaning project build"
	rm -f admin/pb
	rm -fr webapp/node_modules
	rm -f webapp/src/lib/pocketbase-types.ts
	rm -f webapp/src/lib/schema/pb_schema.json
	@echo " "

clean: clean_submodules clean_build ## 🧹 Clean the project

purge:
	@echo "⛔ Purge the data"
	rm -fr admin/pb_data/*
	@echo " "