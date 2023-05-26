#!/bin/env bash

set -exo pipefail

cd ../{{cookiecutter.project_name}}/admin/pb_data

VALUE=$(sqlite3 data.db 'select value from _params where key like "settings";' | sed -En 's/Acme/{{cookiecutter.project_name}}/p')

echo $VALUE

sqlite3 data.db "update _params set value = '${VALUE}' where key like 'settings'"
