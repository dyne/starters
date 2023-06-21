#!/bin/env bash

set -euo pipefail

# cd ../{{cookiecutter.project_name}}/admin/pb_data
# VALUE=$(sqlite3 data.db 'select value from _params where key like "settings";' | sed -En 's/Acme/{{cookiecutter.project_name}}/p')
# sqlite3 data.db "update _params set value = '${VALUE}' where key like 'settings'"

git init
git branch -m main

ZENCODE_CRYPTO=admin/zencode/zenflows-crypto
[ ! -d $ZENCODE_CRYPTO ] && git submodule add https://github.com/interfacerproject/zenflows-crypto $ZENCODE_CRYPTO

echo 🎉 Everything is done please run

echo

echo make up

echo 
