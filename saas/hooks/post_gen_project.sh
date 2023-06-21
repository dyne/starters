#!/bin/env bash

set -euo pipefail

# cd ../{{cookiecutter.project_name}}/admin/pb_data
# VALUE=$(sqlite3 data.db 'select value from _params where key like "settings";' | sed -En 's/Acme/{{cookiecutter.project_name}}/p')
# sqlite3 data.db "update _params set value = '${VALUE}' where key like 'settings'"

if [ ! -d .git ]; then
	git init
	git branch -m main
fi

ZENCODE_CRYPTO=admin/zencode/zenflows-crypto
rmdir --ignore-fail-on-non-empty $ZENCODE_CRYPTO
if [ ! -d $ZENCODE_CRYPTO ]; then
	git submodule add https://github.com/interfacerproject/zenflows-crypto $ZENCODE_CRYPTO
	git submodule update --init
fi

echo 🎉 Everything is done please run

echo

echo make up

echo 
