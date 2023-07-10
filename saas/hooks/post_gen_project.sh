#!/usr/bin/env bash
set -euo pipefail

# if [[ ! -d .git ]]; then
#	git init
#	git branch -m main
#	git add .
# fi

# ZENCODE_CRYPTO=admin/zencode/zenflows-crypto
# if [[ -z $(ls -A $ZENCODE_CRYPTO) ]]; then
# 	rmdir $ZENCODE_CRYPTO || true
#	git submodule add https://github.com/interfacerproject/zenflows-crypto $ZENCODE_CRYPTO || true
# fi
#
[ ! -f webapp/.env ] && cp webapp/.env.example webapp/.env

echo 🎉 Everything is done please run

echo

echo make up

echo 
